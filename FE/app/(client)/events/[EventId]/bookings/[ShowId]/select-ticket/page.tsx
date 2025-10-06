/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { createBookingApi } from '@/src/apis/booking';
import { getTicketsByShowApi } from '@/src/apis/shows';
import { formatDate, formatPrice } from '@/src/helpers/format.helper';
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { Divider } from 'antd';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';

import CartPendingModal from '@/src/components/modal/CartPendingModal';
import { cancelOrderApi, getOrderApi, getOrderFromCacheApi } from '@/src/apis/order';
import useCountDown from '@/src/hooks/useCountDown';
import { CLIENT_URL } from '@/src/utils/const/config.const';

export default function SelectTicket() {
  const params = useParams<{ EventId: string; ShowId: string }>();
  const ShowId = params?.ShowId;
  const EventId = params?.EventId;
  const router = useRouter();

  interface Ticket {
    id: string;
    name: string;
    price: number;
  }

  interface EventData {
    event?: {
      name?: string;
      province?: string;
      slug?: string;
      id?: number;
    };
    time_start?: string | undefined;
    tickets?: Ticket[];
  }

  const [data, setData] = useState<EventData>({});
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [existingOrder, setExistingOrder] = useState<any | null>(null);

  const expiresAt = existingOrder?.expiresAt ?? null;
  const { minutes, seconds, isExpired } = useCountDown(expiresAt || null, () => {
  });

  const increase = (id: string) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      if (current >= 10) return prev; 
      return { ...prev, [id]: current + 1 };
    });
  };

  const decrease = (id: string) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] > 0 ? prev[id] - 1 : 0,
    }));
  };

  useEffect(() => {
    if (!ShowId) return;
    const localStorageKey = `bookingCode_${ShowId}`;
    const orderNumber = typeof window !== 'undefined' ? localStorage.getItem(localStorageKey) : null;
    if (!orderNumber) return;

    let isMounted = true;
    (async () => {
      try {
        const res = await getOrderFromCacheApi(orderNumber);
        if (isMounted && res?.success) {
          setExistingOrder(res.data);
          setIsCartModalOpen(true);
        } else {
          // success: false -> hết TTL hoặc không hợp lệ -> không mở popup
        }
      } catch (e) {
        // lỗi gọi API -> bỏ qua popup
        console.error('Lỗi lấy đơn hàng cũ', e);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [ShowId]);

  // NEW: dữ liệu hiển thị cho CartPendingModal (gắn tên vé từ list tickets hiện tại)
  const cartForModal = useMemo(() => {
    if (!existingOrder) return null;
    const ticketMap = new Map((data?.tickets || []).map((t) => [String(t.id), t]));
    const items = (existingOrder.items || []).map((it: any) => {
      const t = ticketMap.get(String(it.ticket_id));
      return {
        quantity: it.quantity,
        ticket: {
          name: t?.name || `Vé #${it.ticket_id}`,
        },
      };
    });
    return { items };
  }, [existingOrder, data?.tickets]);
  
  useEffect(() => {
    async function getTicketsByShow() {
      try {
        const res = await getTicketsByShowApi(ShowId);
        setData(res?.data);
      } catch (error) {
        console.log('Lỗi ở function getTicketsByShow', error);
      }
    }
    getTicketsByShow();
  }, [ShowId]);

  const redirecPayment = async (eventId: number, showId: number) => {
    try {
      const items = Object.entries(quantities)
        .filter(([_, q]) => Number(q) > 0)
        .map(([ticketId, quantity]) => {
          const ticket = (data?.tickets || []).find(t => String(t.id) === String(ticketId));
          return {
            ticket_id: Number(ticketId),
            show_id: Number(showId),
            quantity: Number(quantity),
            unit_price: Number(ticket?.price || 0),
            special_requests: null,
          };
        });

      const payload = {
        event_id: Number(eventId),
        userId: 1,
        discount_amount: 0,
        items,
        phone: '0123456789',
        email: 'test@example.com',
        address: '123 Main St',
        note: '',
      } as any;
      const res = await createBookingApi(eventId, payload);
      
      // Lưu thông tin booking vào localStorage
      if (res?.data?.orderNumber) {
        const localStorageKey = `bookingCode_${showId}`;
        localStorage.setItem(localStorageKey, res.data.orderNumber);
      }
      
      router.push(`/events/${eventId}/bookings/${showId}/question-form?orderNumber=${res?.data?.orderNumber}`);
    } catch (err) {
      console.error('Lỗi khi tạo booking', err);
    }
  };

  const totalQuantity = useMemo(() => {
    return Object.values(quantities).reduce(
      (sum, v) => sum + (Number(v) || 0),
      0
    );
  }, [quantities]);

  const totalPrice = useMemo(() => {
    const tickets = data?.tickets || [];
    return tickets.reduce((sum: number, t: any) => {
      const id = String(t.id);
      const q = Number(quantities[id] || 0);
      const price = Number(t?.price || 0);
      return sum + q * price;
    }, 0);
  }, [quantities, data?.tickets]);
  
  const handleContinueOldOrder = () => {
    if (!existingOrder) return;
    router.push(`/events/${EventId}/bookings/${ShowId}/question-form?orderNumber=${existingOrder.orderNumber}`);
  };
  const handleCancelOldOrder = async () => {
    const localStorageKey = `bookingCode_${ShowId}`;
    try {
      if(existingOrder?.orderNumber) {
        await cancelOrderApi(existingOrder.orderNumber);
      }
    } catch (error) {
      console.error('Lỗi khi hủy đơn hàng cũ', error);
    } finally {
      localStorage.removeItem(localStorageKey);
      setIsCartModalOpen(false);
      setExistingOrder(null);
    }
  };

  return (
    <main>
      <CartPendingModal
        open={Boolean(isCartModalOpen && existingOrder && cartForModal)}
        cart={cartForModal}
        minutes={minutes}
        seconds={seconds}
        isExpired={isExpired}
        onContinue={handleContinueOldOrder}
        onCancel={handleCancelOldOrder}
      />
      <div className="bg-[rgb(0,0,0)]">
        <div className="mx-auto bg-[rgb(39,39,42)] w-full max-w-full bg-transparent">
          <div className="flex justify-between gap-x-4">
            {/* items1 */}
            <div className="flex-grow">
              <div>
                {/* titlepage */}
                <div className="not-italic mb-8 pt-4 relative text-primary cursor-pointer text-left font-bold text-[18px] leading-6 pl-8">
                  <div className="not-italic mb-8 pt-4 relative text-primary cursor-pointer text-left font-bold text-base leading-6 pl-[1.2rem]">
                    {/* icons */}
                    <Link
                      className="cursor-pointer absolute left-3 flex gap-2 justify-center items-center"
                      href={`${CLIENT_URL}/${data?.event?.slug}-${data?.event?.id}`}
                    >
                      <ArrowLeftOutlined className="w-[20px] h-[21px] fill-none left-0 top-7 text-[rgb(255,255,255)]" />
                      Trở về
                    </Link>
                    <div className="flex items-center justify-center cursor-default">
                      Chọn vé
                    </div>
                  </div>
                </div>

                {/* box-container */}
                <div className="box-border relative mx-auto max-w-[1280px] px-4">
                  <div className="flex flex-wrap -mx-4">
                    {/* Khối div trống bên trái */}
                    <div className="flex-none basis-1/6 max-w-[16.6667%] px-3 box-border min-h-[1px] w-full"></div>

                    {/* khối div chính */}
                    <div className="box-border min-h-[1px] w-full flex-none basis-4/6 max-w-[66.6667%] px-3">
                      <div className="relative mx-auto px-4 max-w-[1280px] ">
                        {/* title */}
                        <div className="flex flex-wrap py-[10px] -mx-4">
                          <div className="flex-none basis-4/6 px-3">
                            <article className="break-keep leading-relaxed text-base text-white font-bold">
                              Loại vé
                            </article>
                          </div>
                          <div className="flex-none basis-2/6 px-3 text-right">
                            <article className="break-keep leading-relaxed text-base text-white font-bold">
                              Số lượng
                            </article>
                          </div>
                        </div>

                        {data?.tickets?.map((ticket, index) => (
                          <React.Fragment key={index}>
                            <div className="flex flex-wrap py-5 -mx-4">
                              <div className="flex-none basis-3/4 px-3">
                                <article className="text-primary font-bold leading-relaxed break-keep text-sm">
                                  {ticket?.name}
                                </article>
                                <article className="text-white text-sm leading-relaxed">
                                  {formatPrice(ticket?.price)}
                                </article>
                              </div>
                              <div className="flex-none basis-1/4 px-3 flex justify-end">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => decrease(ticket.id)}
                                    disabled={!quantities[ticket.id]}
                                    className={`h-8 w-8 flex items-center justify-center rounded 
                                        text-sm font-bold transition 
                                        ${
                                          !quantities[ticket.id]
                                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                            : 'bg-white text-black hover:bg-gray-100'
                                        }`}
                                  >
                                    –
                                  </button>

                                  <input
                                    type="text"
                                    value={quantities[ticket.id] || 0}
                                    readOnly
                                    className="w-12 h-8 text-center rounded bg-transparent text-white border border-gray-600"
                                  />

                                  <button
                                    onClick={() => increase(ticket.id)}
                                    className={`h-8 w-8 flex items-center justify-center rounded 
                                      bg-white text-black text-sm font-bold hover:bg-gray-100 transition
                                      ${
                                        quantities[ticket.id] >= 10
                                          ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                          : 'bg-white text-black hover:bg-gray-100'
                                      } 
                                      `}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="mb-3">
                              <div className="bg-[rgb(235,235,240)] rounded-lg p-4 text-[rgb(0,0,0,0.88)]">
                                <article className=" font-bold mb-2 text-xs">
                                  * Thời Gian: 18:00 – 20:30 * Hoạt Động:
                                </article>

                                <ul className="list-disc list-inside text-xs leading-relaxed space-y-1">
                                  <li>
                                    Tham Quan và tìm hiểu cách hoạt động của
                                    Kính Thiên Văn Lớn
                                  </li>
                                  <li>
                                    Xem mô phỏng bầu trời trong Nhà Chiếu Hình
                                    Vũ Trụ
                                  </li>
                                </ul>

                                <p className="mt-3 text-xs leading-relaxed">
                                  <span className="font-bold text-red-400 ">
                                    Chú ý:
                                  </span>{' '}
                                  NẾU THỜI TIẾT THUẬN LỢI ĐÀI SẼ MỞ THÊM HOẠT
                                  ĐỘNG QUAN SÁT BẦU TRỜI BẰNG KÍNH THIÊN VĂN
                                  NGHIỆP DƯ (4–6 KÍNH) VỚI GIÁ LÀ 50,000 VND.
                                  <br />
                                  KHÔNG NHẬN KHÁCH SAU 18:35
                                </p>

                                <div className="mt-4 border-t border-gray-600 pt-3">
                                  <p className=" font-bold text-xs">NOTICE:</p>
                                  <p className="text-xs leading-relaxed">
                                    IF THE WEATHER IS FAVORABLE, THE OBSERVATORY
                                    WILL ORGANIZE ADDITIONAL SKY OBSERVATION
                                    ACTIVITIES WITH 4–6 AMATEUR TELESCOPES, AT A
                                    FEE OF 50,000 VND.
                                    <br />
                                    This price applies to Vietnamese visitors.
                                    <br />
                                    Foreign visitors are required to pay an
                                    additional 31,000 VND per person when
                                    visiting Nha Trang Observatory.
                                  </p>
                                </div>
                              </div>
                            </div>

                            <Divider
                              variant="dashed"
                              style={{ borderColor: '#515158' }}
                            />
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    {/* khối div trống bên phải */}
                    <div className="flex-none basis-1/6 max-w-[16.6667%] px-3 box-border min-h-[1px] w-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* đặt vé */}
            <div className="flex-none basis-[30%] max-w-[25rem]">
              <div className="bg-[rgb(56,56,61)] transition-all duration-500 min-h-[calc(100vh-76px)] h-full flex flex-col">
                {/* Nội dung trên */}
                <div className="flex-1">
                  <div className="bg-[rgb(39,39,42)] h-[48px] px-4 py-7 flex items-center overflow-hidden">
                    <p className="text-base font-medium h-[42px] text-white">
                      {data?.event?.name}
                    </p>
                  </div>
                  <div className="w-full px-3 text-white">
                    <div className="py-3 flex gap-2 text-white font-medium text-sm items-center">
                      <CalendarOutlined className="text-white text-xl" />
                      {/* <span>{formatDate(data?.time_start)}</span> */}
                    </div>
                    <div className="py-3 flex gap-2 text-white font-medium text-sm items-center">
                      <EnvironmentOutlined className="text-primary text-xl" />
                      <span>{data?.event?.province}</span>
                    </div>
                  </div>
                  <Divider style={{ borderColor: '#515158' }} />

                  <div className="text-[rgb(255,255,255)] px-3 w-full">
                    <p className="text-sm font-medium py-3">Giá vé</p>

                    {data?.tickets?.map((ticket, index) => (
                      <div
                        className="text-sm font-medium py-3 flex justify-between items-center gap-2"
                        key={index}
                      >
                        <div className="line-clamp-2 flex-1">
                          {ticket?.name}
                        </div>
                        <span className="text-primary text-xs font-semibold shrink-0">
                          {formatPrice(ticket?.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nút đặt vé luôn dính dưới */}
                <div className="bg-[rgb(39,39,42)] w-full py-3 px-3">
                  {totalQuantity > 0 ? (
                    <div className=" mb-3 flex items-center gap-2 text-primary font-semibold">
                      <ShoppingCartOutlined />
                      <span>x{totalQuantity}</span>
                    </div>
                  ) : (
                    <div className="p-4"></div>
                  )}

                  {totalQuantity === 0 ? (
                    <button className="w-full bg-[rgb(221,221,227)] text-white py-2 px-3 rounded-lg font-semibold cursor-not-allowed">
                      Vui lòng chọn vé
                    </button>
                  ) : (
                    <button
                      className="w-full bg-primary text-white py-2 px-3 rounded-lg font-semibold hover:bg-primaryHover"
                      onClick={() => redirecPayment(Number(EventId), Number(ShowId))}
                    >
                      Tiếp tục - {formatPrice(totalPrice)}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>
  );
}
