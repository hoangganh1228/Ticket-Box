'use client';
import { getOrderStatus } from '@/src/apis/order';
import TabsFilter from '@/src/components/Profile/TabsFilter';
import TicketItem from '@/src/components/Profile/TicketItem';
import UpcomingEndedFilter from '@/src/components/Profile/UpcomingEndedFilter';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Divider } from 'antd';
import { useEffect, useState } from 'react';

export default function MyticketsPage() {
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState('all');
  const tabs = [
    { id: 'all', label: 'Tất cả' },
    { id: 'CONFIRMED', label: 'Thành công' },
    { id: 'PENDING', label: 'Đang xử lý' },
    { id: 'CANCELLED', label: 'Đã hủy' },
  ];

  const [activeDiv, setActiveDiv] = useState<'upcoming' | 'ended'>('upcoming');

  // fetch tab hiện tại
  const {
    data: orders = [],
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['order-status', activeTab, activeDiv], 
    queryFn: () => getOrderStatus(activeTab, activeDiv), 
    staleTime: 60 * 1000, // ⏳ 1 phút không refetch lại
    retry: 1, // 🔄 Thử lại 1 lần nếu lỗi
    refetchOnWindowFocus: false, // 🚫 Không tự refetch khi đổi tab trình duyệt
    placeholderData: [], // ⏱ Dữ liệu placeholder khi đang fetch
  });

  // Prefetch 1-2 tab khi acticeTab thay đổi
  useEffect(() => {
    const tabsToPrefetch = ['CONFIRMED', 'PENDING', 'CANCELLED']
      .filter((tab) => tab !== activeTab); // bỏ tab hiện tại

    // Chỉ prefetch 1–2 tab gần nhất, ở đây ví dụ prefetch tất cả trừ tab hiện tại
    tabsToPrefetch.slice(0, 2).forEach((tab) => {
      queryClient.prefetchQuery({
        queryKey: ['order-status', tab, activeDiv],
        queryFn: () => getOrderStatus(tab, activeDiv),
        staleTime: 60_000,
      });
    });
  }, [activeTab, activeDiv, queryClient]);

  return (
    <>
      {/* right col */}
      <div className="md:bg-transparent m-auto w-[calc(100%-276px)] lg:pb-8 min-h-[50vh]">
        <div className="text-left text-2xl font-bold leading-6 pb-[1rem] bg-transparent text-white">
          Vé của tôi
        </div>
        <Divider
          style={{ borderColor: '#ffffff80' }}
          className="mt-0"
        ></Divider>
        <div className="relative pt-0 overflow-auto">
          <TabsFilter
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {/* filter bar */}
          <UpcomingEndedFilter
            activeDiv={activeDiv}
            setActiveDiv={setActiveDiv}
          />
        </div>

        {/* Trạng thái tải */}
        {isLoading && <p className="text-white mt-4">Đang tải dữ liệu...</p>}
        {isError && <p className="text-red-500 mt-4">Lỗi: {(error as Error).message}</p>}
        {isFetching && !isLoading && (
          <p className="text-gray-400 mt-2 text-sm">Đang cập nhật dữ liệu…</p>
        )}

        {/* item */}
        {!isLoading && !isError && orders?.data?.length && (
          <TicketItem orders={orders.data} />
        )}
      </div>
    </>
  );
}
