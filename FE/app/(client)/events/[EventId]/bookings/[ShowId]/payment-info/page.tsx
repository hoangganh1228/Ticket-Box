/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { fetchPaymentMethodApi } from '@/src/apis/paymentmethod';
import { createPaymentApi } from '@/src/apis/order';
import { formatDate, formatPrice } from '@/src/helpers/format.helper';
import {
  fetchEventByShowId,
  useFetch,
} from '@/src/hooks/useFetch';
import { useOrderValidation } from '@/src/hooks/useOrderValidation';
import { CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Divider } from 'antd';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
interface PaymentOption {
  key: string;
  label: string;
  provider: 'vnpay' | 'vietqr' | 'shopeepay' | 'zalopay' | 'card' | 'momo';
  method: 'bank_app' | 'qr' | 'ewallet' | 'card';
  currency: 'VND';
  logo: string;
  subLogos?: string[]; // cho thẻ Visa/Master/JCB
}

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    key: 'vnpay',
    label: 'VNPAY/Ứng dụng ngân hàng',
    provider: 'vnpay',
    method: 'bank_app',
    currency: 'VND',
    logo: 'https://salt.tkbcdn.com/ts/ds/e5/6d/9a/a5262401410b7057b04114ad15b93d85.png',
  },
  {
    key: 'momo',
    label: 'Momo',
    provider: 'momo',
    method: 'bank_app',
    currency: 'VND',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZcQPC-zWVyFOu9J2OGl0j2D220D49D0Z7BQ&s',
  },
  {
    key: 'vietqr',
    label: 'VietQR',
    provider: 'vietqr',
    method: 'qr',
    currency: 'VND',
    logo: 'https://salt.tkbcdn.com/ts/ds/0c/ae/fb/6bdb675e0df2f9f13a47726f432934e6.png',
  },
  {
    key: 'shopeepay',
    label: 'ShopeePay',
    provider: 'shopeepay',
    method: 'ewallet',
    currency: 'VND',
    logo: 'https://salt.tkbcdn.com/ts/ds/4b/d5/12/084658724105b22e6d4e1f9c7645b293.png',
  },
  {
    key: 'zalopay',
    label: 'Zalopay',
    provider: 'zalopay',
    method: 'ewallet',
    currency: 'VND',
    logo: 'https://salt.tkbcdn.com/ts/ds/ac/2c/68/ee062970f97385ed9e28757b0270e249.png',
  },
  {
    key: 'card',
    label: 'Thẻ ghi nợ/Thẻ tín dụng',
    provider: 'card',
    method: 'card',
    currency: 'VND',
    logo: 'https://salt.tkbcdn.com/ts/ds/e5/6d/9a/a5262401410b7057b04114ad15b93d85.png',
    subLogos: [
      'https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg',
      'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg',
      'https://upload.wikimedia.org/wikipedia/commons/0/0e/JCB_logo.svg',
    ],
  },
];

export default function PaymentInfo() {
  const params = useParams<{ EventId: string; ShowId: string }>();
  const ShowId = params?.ShowId;
  const EventId = params?.EventId;

  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') as string;
  const router = useRouter();

  // Sử dụng hook validation
  const {
    isValid,
    isLoading: isValidating,
    error: validationError,
    ttl,
    order,
    remainingSeconds,
    isExpired
  } = useOrderValidation({
    eventId: EventId!,
    orderNumber,
    redirectPath: `/events/${EventId}/bookings/${ShowId}/select-ticket`
  });

  // Sự kiện (header)
  const { data: showData } = useFetch(
    ShowId ? ['event-by-showId', ShowId] : null,
    () => fetchEventByShowId(ShowId),
    {}
  );

  // Order + items (enriched với tên vé)
  const [items, setItems] = useState<Array<{ name: string; quantity: number; unit_price: number }>>([]);

  // Payment methods
  const [paymentMethodData, setPaymentMethodData] = useState<any[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<{ provider: string; method: string; currency: string }>({
    provider: '',
    method: 'card',
    currency: 'VND',
  });

  // Countdown display
  const mm = Math.floor(Math.max(0, remainingSeconds) / 60);
  const ss = Math.max(0, remainingSeconds % 60);

  // Load order items khi order hợp lệ
  useEffect(() => {
    if (!isValid || !order?.items) return;

    const loadItems = async () => {
      try {
        const enriched = await Promise.all(
          (order.items || []).map(async (it: any) => {
            try {
              // Sử dụng tên từ order data nếu có, fallback về ticket_id
              return {
                name: it.ticket_name || `Vé #${it.ticket_id}`,
                quantity: Number(it.quantity || 0),
                unit_price: Number(it.unit_price || 0),
              };
            } catch {
              return {
                name: `Vé #${it.ticket_id}`,
                quantity: Number(it.quantity || 0),
                unit_price: Number(it.unit_price || 0),
              };
            }
          })
        );
        setItems(enriched);
      } catch (e) {
        console.error('Load order items error', e);
      }
    };

    loadItems();
  }, [isValid, order?.items]);

  // Payment methods
  useEffect(() => {
    async function fetchPaymentMethod() {
      try {
        const res = await fetchPaymentMethodApi();
        setPaymentMethodData(res?.data || []);
        if (res?.data?.[0]) {
          // ưu tiên code nếu có, fallback name
          const first = res.data[0];
          setSelectedPayment((p) => ({ ...p, provider: first.code ?? first.name ?? 'vietcombank' }));
        }
      } catch (error) {
        console.log('Có lỗi ở fetchPaymentMethod', error);
      }
    }
    fetchPaymentMethod();
  }, []);

  // Tính tổng
  const totalQuantity = useMemo(
    () => items.reduce((sum, it) => sum + Number(it.quantity || 0), 0),
    [items]
  );
  const totalAmount = useMemo(
    () => items.reduce((sum, it) => sum + Number(it.quantity) * Number(it.unit_price), 0),
    [items]
  );


  // Thanh toán
  const handlePay = async () => {
    if (!orderNumber) return;
    try {
      const payload = {
        provider: selectedPayment.provider || 'momo',
        method: selectedPayment.method || 'card',
        currency: selectedPayment.currency || 'VND',
        ShowId,
        EventId,
        orderNumber
      };
      console.log('Payment payload', payload);
      
      const res = await createPaymentApi(orderNumber, payload);
      console.log('Payment success', res.data);

      if (selectedPayment.provider === 'momo' && res?.redirectUrl) {
        window.location.href = res.redirectUrl; // chuyển sang trang thanh toán MoMo
        return;
      }
      // TODO: Hiển thị success/toast hoặc điều hướng tới trang kết quả
    } catch (e) {
      console.error('Payment error', e);
    }
  };

  // Hiển thị loading hoặc error
  if (isValidating) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Đang kiểm tra đơn hàng...</div>
      </div>
    );
  }

  if (!isValid || isExpired) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-lg mb-4">Đơn hàng không hợp lệ hoặc đã hết hạn</div>
          <div className="text-sm text-gray-400 mb-4">{validationError}</div>
          <button
            onClick={() => router.push(`/events/${EventId}/bookings/${ShowId}/select-ticket`)}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primaryHover"
          >
            Chọn lại vé
          </button>
        </div>
      </div>
    );
  }

  return (
    <main>
      <div className="w-full h-full bg-[rgb(0,0,0)] box-border">
        <div
          className="w-full text-[rgb(255,255,255)] overflow-hidden 
                      bg-[url('https://images.tkbcdn.com/2/1560/600/Upload/eventcover/2024/03/18/437B6C.jpg')] bg-center bg-cover bg-no-repeat"
        >
          <div className="w-full bg-[rgb(0,0,0,0.5)] backdrop-blur-[15px] px-6">
            <div className="max-w-[1168px] flex gap-6 h-[13.5rem] mx-auto p-3 justify-center">
              {/* text-info */}
              <div className="flex-[1_1_0%]">
                <p className="font-semibold text-[1.5rem] overflow-hidden break-keep line-clamp-3 m-0">
                  {showData?.event?.name}
                </p>
                <Divider style={{ borderColor: '#ffffff80' }}></Divider>
                <div className="flex items-center mt-3 gap-2">
                  <CalendarOutlined className="w-6" />
                  <span className="font-bold text-lg text-">
                    {formatDate(showData?.time_start)}
                  </span>
                </div>
                <div className="flex items-center mt-3 gap-2">
                  <EnvironmentOutlined className="w-6" />
                  <span className="font-bold text-lg text-">
                    {showData?.event?.province}
                  </span>
                </div>
              </div>
              {/* countdown */}
              <div className="w-[11.875rem] h-full">
                <div
                  className="w-full border border-[rgb(255,255,255,0.376)] overflow-hidden h-full rounded-xl
                                      bg-[rgb(255,255,255,0.25)] flex backdrop-blur-[1rem] flex-col justify-center gap-5 py-4"
                >
                  <p className="text-center w-full px-4">
                    Hoàn tất đặt vé trong
                  </p>
                  <div className="flex justify-center items-center w-full">
                    <span className="flex justify-center items-center">
                      <span
                        className="text-white bg-[rgb(255,66,78)] font-bold w-16 h-16 flex items-center justify-center rounded-[1.25rem]
                                                  text-2xl"
                      >
                        {String(mm).padStart(2, '0')}
                      </span>
                      <span className="mx-2 font-bold">:</span>
                    </span>
                    <span className="flex justify-center items-center">
                      <span
                        className="text-white bg-[rgb(255,66,78)] font-bold w-16 h-16 flex items-center justify-center rounded-[1.25rem]
                                                  text-2xl"
                      >
                        {String(ss).padStart(2, '0')}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* payment-info */}
      <div className="bg-[rgb(0,0,0)] pt-0 h-[661px]">
        <div className="w-full">
          <div className="max-w-[1168px] mx-auto bg-transparent px-6">
            <div className="flex justify-between gap-x-6">
              {/* left */}
              <div className="flex-grow">
                <div>
                  <div className="text-[#4ade80] uppercase my-8 text-xl font-bold">
                    Thanh toán
                  </div>

                  {/* Thông tin nhận vé */}
                  <div className="cursor-default mb-3">
                    <div className="bg-[rgb(56,56,61)] rounded-xl w-full py-3 px-4">
                      <div className="text-[#4ade80] text-sm font-medium">
                        Thông tin nhận vé
                      </div>
                      <div className="text-[rgb(255,255,255)] text-sm mt-2">
                        Vé điện tử sẽ được hiển thị trong mục {'Vé của tôi'} của
                        tài khoản <br />
                        {order?.email || 'your-email@example.com'}
                      </div>
                    </div>
                  </div>

                  {/* Mã khuyến mãi */}
                  <div className="mb-3 bg-[rgb(56,56,61)] rounded-xl w-full py-3 px-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[#4ade80] text-sm font-medium">
                        Mã khuyến mãi
                      </span>
                      <span className="text-[#4ade80] text-sm cursor-pointer">
                        Chọn voucher
                      </span>
                    </div>
                    <button className="border border-gray-500 rounded-full px-2 py-1 text-gray-400 text-sm flex items-center gap-2">
                      <span className="text-lg">+</span>
                      <span>Thêm khuyến mãi</span>
                    </button>
                  </div>

                  {/* Phương thức thanh toán */}
                  <div className="mb-3 bg-[rgb(56,56,61)] rounded-xl w-full py-3 px-4">
                    <div className="text-[#4ade80] text-sm font-medium mb-4">Phương thức thanh toán</div>
                    <div className="space-y-3">
                      {PAYMENT_OPTIONS.map((opt) => (
                        <label key={opt.key} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="payment"
                            className="w-4 h-4 accent-[#4ade80]"
                            checked={
                              selectedPayment.provider === opt.provider &&
                              selectedPayment.method === opt.method &&
                              selectedPayment.currency === opt.currency
                            }
                            onChange={() =>
                              setSelectedPayment({ provider: opt.provider, method: opt.method, currency: opt.currency })
                            }
                          />
                          <img src={opt.logo} alt={opt.label} className="w-6 h-6" />
                          <span className="text-white text-sm">{opt.label}</span>
                          {opt.subLogos && (
                            <span className="ml-2 flex items-center gap-2">
                              {opt.subLogos.map((u, i) => (
                                <img key={i} src={u} alt="card-brand" className="h-4" />
                              ))}
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* right */}
              <div className="flex-[0_0_30%] max-w-[25rem] mt-[93px]">
                {/* Thông tin đặt vé */}
                <div className="bg-white rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-800 font-bold text-sm">
                      Thông tin đặt vé
                    </span>
                    <span
                      className="text-blue-500 text-sm cursor-pointer"
                    >
                      Chọn lại vé
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-700 font-bold text-sm">
                        Loại vé
                      </span>
                      <span className="text-gray-700 font-bold text-sm">
                        Số lượng
                      </span>
                    </div>

                    {items.map((it, index) => (
                      <React.Fragment key={index}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600 text-sm">
                            {it?.name}
                          </span>
                          <span className="text-gray-600 text-sm">
                            {String(it?.quantity).padStart(2, '0')}
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>{formatPrice(it?.unit_price)}</span>
                          <span>{formatPrice(it?.unit_price)}</span>
                        </div>

                        <Divider
                          variant="dashed"
                          className="border border-[rgb(187,185,185)] my-1"
                        />
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Thông tin đơn hàng */}
                <div className="bg-white rounded-lg p-4 mb-4">
                  <div className="text-gray-800 font-bold text-sm mb-4">
                    Thông tin đơn hàng
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 font-bold text-sm">
                      Tạm tính {totalQuantity} vé
                    </span>
                    <span className="text-gray-600 text-sm">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                  <hr className="my-3" />
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-800 font-bold text-sm">
                      Tổng tiền
                    </span>
                    <span className="text-[#4ade80] font-bold text-base">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                  <div className="text-gray-500 text-xs mb-4">
                    Bằng việc tiến hành đặt mua, bạn đã đồng ý với{' '}
                    <span className="text-blue-500 mr-1">
                      Điều Kiện Giao Dịch Chung
                    </span>
                  </div>
                  <button
                    className="w-full bg-[#4ade80] text-white py-2 px-2 hover:bg-primaryHover rounded-lg font-medium"
                    onClick={handlePay}
                    disabled={!orderNumber}
                  >
                    Thanh toán
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
