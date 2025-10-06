/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { getOrderApi } from '@/src/apis/order';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import image1 from '@/src/image/image.svg';
import image2 from '@/src/image/image1.svg';
import Image from 'next/image';
import { formatPrice } from '@/src/helpers/format.helper';

export default function PaymentResultPage() {
  const { EventId, ShowId, orderCode } = useParams<{
    EventId: string;
    ShowId: string;
    orderCode: string;
  }>();
  const orderCodeId = orderCode.substring(orderCode.indexOf('ORD-'));
  const [orderData, setOrderData] = useState<any | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const isSuccess = status === 'success';

  useEffect(() => {
    async function getOrder() {
      const res = await getOrderApi(orderCodeId);
      setOrderData(res.data);
    }

    getOrder();
  }, [EventId, ShowId, orderCodeId]);

  return (
    <>
      <main>
        <div className="bg-[rgb(0,0,0)] w-full h-screen">
          <div className="bg-[rgb(0,0,0)] pt-0">
            <div className="w-full">
              <div className="mx-auto bg-[rgb(39,39,42)] md:max-w-[720px] lg:max-w-[1168px] bg-transparent">
                <div className="w-full">
                  <div className="mx-auto bg-[rgb(255,255,255)] md:max-w-[45rem] lg:max-w-[64rem] bg-transparent">
                    <div className="flex flex-wrap sm:-mx-2 md:-mx-3 lg:-mx-3 xl:-mx-4">
                      <div
                        className="box-border min-h-[1px] w-full px-[12px] md:flex-none          
                                    md:basis-[8.33333%]    
                                    md:max-w-[8.33333%]    
                                    lg:flex-none          
                                    lg:basis-[16.6667%]    
                                    lg:max-w-[16.6667%]"
                      >
                      </div>
                      {/* div chính */}
                      <div
                        className="
                            box-border             
                            min-h-[1px]             
                            w-full                  
                            px-[12px]               
                            md:flex-none            
                            md:basis-[83.3333%]     
                            md:max-w-[83.3333%]    
                            lg:flex-none           
                            lg:basis-[66.6667%]    
                            lg:max-w-[66.6667%]     
                        ">
                        <div className="w-full bg-[rgb(245,245,250)] md:mt-6 rounded-3xl p-8">
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-full flex gap-4 flex-col items-center">
                              <div className="flex flex-col items-center">
                                <Image src={image1} alt='image1' />
                                <div className="flex items-center gap-2">
                                  <Image src={image2} alt='image2' />
                                  <h1 className={`${isSuccess ? 'text-[rgb(45,194,117)]' : 'text-[rgb(239,68,68)]'} text-[20px] font-bold`}>
                                    {isSuccess ? 'Đặt vé thành công' : 'Thanh toán thất bại'}
                                  </h1>
                                </div>
                              </div>
                              <div className="flex flex-col border-transparent rounded-xl p-6 bg-[rgb(255,255,255)] lg:w-full shadow-sm">
                                <div className="space-y-4">
                                  <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                                    Thông tin đơn hàng
                                  </h2>

                                  {/* Thông tin sự kiện */}
                                  <div className="space-y-3">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                      <span className="text-gray-600 font-medium min-w-[120px]">Sự kiện:</span>
                                      <span className="text-gray-900 font-medium text-right sm:flex-1">{orderData?.event?.name}</span>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                      <span className="text-gray-600 font-medium">Mã đơn hàng:</span>
                                      <span className="text-gray-900 font-bold text-lg">{orderData?.order_number}</span>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pt-2 border-t border-gray-100">
                                      <span className="text-gray-600 font-medium">Tổng tiền:</span>
                                      <span className={`${isSuccess ? 'text-[rgb(45,194,117)]' : 'text-[rgb(239,68,68)]'} font-bold text-xl`}>{formatPrice(orderData?.total_amount)}</span>
                                    </div>
                                  </div>

                                  {!isSuccess && (
                                    <div className="mt-2 text-sm text-gray-600">
                                      Thanh toán không thành công. Vui lòng thử lại hoặc chọn phương thức khác.
                                    </div>
                                  )}
                                </div>
                              </div>
                              {/* action */}
                              <div className="flex gap-2 w-full">
                                <button className={`flex items-center justify-center w-full outline-none cursor-pointer h-[40px]
                                            leading-6 min-w-[88px] px-6 pt-0 bg-transparent border
                                            font-medium text-base rounded-[4px] ${isSuccess ? 'text-[rgb(45,194,117)] border-[rgb(45,194,117)]' : 'text-[rgb(239,68,68)] border-[rgb(239,68,68)]'}`}
                                  onClick={() => router.push('/')}>Trang chủ</button>
                                {isSuccess ? (
                                  <button className="flex items-center justify-center border-none w-full outline-none
                                              cursor-pointer leading-6 min-w-[88px] px-6 pt-0 font-medium text-base text-[rgb(255,255,255)] bg-[rgb(45,194,117)]"
                                    onClick={() => router.push('/my-wallet')}
                                  >Vé của tôi</button>
                                ) : (
                                  <button className="flex items-center justify-center border-none w-full outline-none
                                              cursor-pointer leading-6 min-w-[88px] px-6 pt-0 font-medium text-base text-[rgb(255,255,255)] bg-[rgb(239,68,68)]"
                                    onClick={() => router.push(`/events/${EventId}/bookings/${ShowId}/select-ticket`)}
                                  >Thử lại thanh toán</button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="box-border min-h-[1px] w-full px-[12px] md:flex-none          
                                    md:basis-[8.33333%]    
                                    md:max-w-[8.33333%]    
                                    lg:flex-none          
                                    lg:basis-[16.6667%]    
                                    lg:max-w-[16.6667%]"
                  >
                  </div>
                </div>
              </div>
              {/* recommend */}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}