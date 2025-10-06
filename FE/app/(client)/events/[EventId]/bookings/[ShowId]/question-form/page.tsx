'use client';
import { formatDate, formatPrice } from '@/src/helpers/format.helper';
import {
  fetchEventByShowId,
  useFetch,
} from '@/src/hooks/useFetch';
import { useOrderValidation } from '@/src/hooks/useOrderValidation';
import {
  CalendarOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { Divider } from 'antd';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { getTicketByIdApi } from '@/src/apis/tickets';
import CancelOrderModal from '@/src/components/modal/CancelOrderModal';
import { cancelOrderApi } from '@/src/apis/order';

export default function QuestionForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const params = useParams<{ EventId: string; ShowId: string }>();
  const ShowId = params?.ShowId;
  const EventId = params?.EventId;
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') as string;

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

  const {
    data: showData,
    error,
    isLoading,
  } = useFetch(
    ShowId ? ['event-by-showId', ShowId] : null,
    () => fetchEventByShowId(ShowId),
    {}
  );

  const [items, setItems] = useState<Array<{ name: string; quantity: number; unit_price: number }>>([]);

  // Countdown display
  const mm = Math.floor(Math.max(0, remainingSeconds) / 60);
  const ss = Math.max(0, remainingSeconds % 60);

  const totalQuantity = items.reduce((s, it) => s + Number(it.quantity || 0), 0);
  const totalAmount = items.reduce((s, it) => s + Number(it.quantity) * Number(it.unit_price), 0);

  // Load order items khi order hợp lệ
  useEffect(() => {
    if (!isValid || !order?.items) return;

    const loadItems = async () => {
      try {
        const enriched = await Promise.all(
          (order.items || []).map(async (it) => {
            try {
              const t = await getTicketByIdApi(it.ticket_id);
              return {
                name: t?.data?.name ?? `Vé #${it.ticket_id}`,
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

  // Chặn nút Back và hiển thị modal xác nhận
  useEffect(() => {
    history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      setIsModalOpen(true);
      history.pushState(null, '', window.location.href);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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

  

  if (isLoading) return <p>Đang tải...</p>;
  if (error) return <p>Có lỗi xảy ra</p>;

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
              {/* count-info */}
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
      {/* question */}
      <div className="bg-[rgb(0,0,0)] pt-0 h-[661px]">
        <div className="w-full">
          <div className="max-w-[1168px] mx-auto bg-transparent">
            <div className="flex justify-between gap-x-4 items-start ">
              <div className="flex-grow">
                <div className="relative h-full overflow-auto">
                  <p className="text-primary uppercase my-8 text-xl font-bold">
                    Bảng câu hỏi
                  </p>
                  <div className="bg-[rgb(56,56,61)] rounded-lg p-6 mb-8">
                    <div className="mb-6">
                      <h3 className="text-white text-lg font-semibold mb-4">
                        Thông tin khác
                      </h3>

                      {/* Checkbox */}
                      <div className="mb-6">
                        <div className="flex gap-1 mb-3">
                          <span className="text-red-400">*</span>
                          <span className="text-white text-sm">
                            Tôi đồng ý Ticketbox & BTC sử dụng thông tin đặt vé
                            nhằm mục đích vận hành sự kiện
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="agree"
                            name="agreement"
                            className="w-4 h-4 "
                          />
                          <label
                            htmlFor="agree"
                            className="text-gray-300 text-sm"
                          >
                            Có
                          </label>
                        </div>
                      </div>

                      {/* Email field */}
                      <div className="mb-6">
                        <div className="flex gap-1">
                          <span className="text-red-400">*</span>
                          <label className="mb-2 text-white text-sm">
                            Email của bạn?
                          </label>
                        </div>
                        <input
                          type="email"
                          placeholder="Điền câu trả lời của bạn"
                          className="w-full bg-[rgb(39,39,42)] text-white border border-none rounded px-3 py-2 placeholder-gray-400"
                        />
                      </div>

                      {/* Phone field */}
                      <div className="mb-6">
                        <div className="flex gap-1">
                          <span className="text-red-400">*</span>
                          <label className="text-white mb-2 text-sm">
                            Số điện thoại của bạn
                          </label>
                        </div>
                        <input
                          type="tel"
                          placeholder="Điền câu trả lời của bạn"
                          className="w-full bg-[rgb(39,39,42)] text-white border border-none rounded px-3 py-2 placeholder-gray-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* thông tin đặt vé */}
              <div className="flex-[0_0_30%] max-w-[25rem] mt-[93px] self-start">
                <div className="bg-white rounded-lg p-4 sticky top-4">
                  {/* Header */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-800 font-bold text-sm">Thông tin đặt vé</span>
                    <button
                      className="text-blue-500 text-sm"
                      onClick={() => setIsModalOpen(true)}
                    >
                      Chọn lại vé
                    </button>
                  </div>

                  {/* Ticket info */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center font-semibold">
                      <span className="text-gray-800 font-bold text-sm">Tạm tính {totalQuantity} vé</span>
                      <span className="text-primary text-base">{formatPrice(totalAmount)}</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-2">Vui lòng trả lời tất cả câu hỏi để tiếp tục</p>
                  </div>
                  {items.map((it, idx) => (
                    <React.Fragment key={idx}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600 text-sm">{it.name}</span>
                        <span className="text-gray-600 text-sm">{String(it.quantity).padStart(2, '0')}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{formatPrice(it.unit_price)}</span>
                        <span>{formatPrice(it.unit_price)}</span>
                      </div>
                      <Divider variant="dashed" className="border border-[rgb(187,185,185)] my-1" />
                    </React.Fragment>
                  ))}
                  <button
                    className="w-full bg-primary hover:bg-primaryHover text-white font-medium py-2 px-2 rounded-lg flex items-center justify-center gap-2"
                    onClick={() => router.push(`/events/${EventId}/bookings/${ShowId}/payment-info?orderNumber=${orderNumber}`)}
                  >
                    Tiếp tục
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CancelOrderModal
        open={isModalOpen}
        onOk={() => {
          // Ở lại trang
          setIsModalOpen(false);
        }}
        onCancel={async () => {
          try {
            await cancelOrderApi(orderNumber);
          } catch (e) {
            console.error('Cancel order failed', e);
          } finally {
            router.replace(`/events/${EventId}/bookings/${ShowId}/select-ticket`);
          }
        }}
        onCloseIcon={() => setIsModalOpen(false)}
      />
      
    </main>
  );
}
