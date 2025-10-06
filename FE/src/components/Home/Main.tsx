/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/Home/Main.tsx
'use client';

import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import styles from '@/src/styles/Main.module.css';
import EventCategorySection from './EventCategorySection';
import EventCategoryTab from './EventCategoryTab';
import { useEffect, useState } from 'react';
import TrendingEventsSection from './EventTrendding';
import Image from 'next/image';
import {
  fetchEventsApi,
  fetchEventsBannersApi,
  fetchThisWeekendOrThisMonthEventsApi,
} from '@/src/apis/events';
import { getEventParams } from '@/src/helpers/takeTime.helper';
import { useDispatch } from 'react-redux';
import { setSuggestions } from '@/src/redux/store/eventSlice';
import EventSkeleton from '../Commom/EventSkeleton';
import { useQuery } from '@tanstack/react-query';
import { Empty } from 'antd';

const eventsKeys = {
  all: ['events'] as const,
  special: () => [...eventsKeys.all, 'special'] as const,
  trending: () => [...eventsKeys.all, 'trending'] as const,
  bigCate: () => [...eventsKeys.all, 'bigCate'] as const,
  forYou: () => [...eventsKeys.all, 'forYou'] as const,
};

export default function Main() {
  const [atBeginning, setAtBeginning] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [weekendEvent, setWeekendEvent] = useState({});
  const [thisMonthEvent, setThisMonthEvent] = useState({});
  const dispatch = useDispatch();

  const eventsQuery = useQuery({
    queryKey: eventsKeys.all,
    queryFn: fetchEventsApi,
    staleTime: 60_000, // 1 phút
    cacheTime: 10 * 60_000, // 10 phút
    onSuccess: (data) => {
      dispatch(setSuggestions(data?.result?.onlyOnTicketbox));
    },
  });

  const specialEvents = eventsQuery.data?.data?.result?.specialEvents ?? [];
  const trendingEvents = eventsQuery.data?.data?.result?.trenddingEvents ?? [];
  const bigCateQuery = eventsQuery.data?.data?.result?.bigCates ?? [];
  const forYouEventsQuery =
    eventsQuery.data?.data?.result?.onlyOnTicketbox ?? [];

  //event time
  useEffect(() => {
    async function fetchThisWeekendOrThisMonthEvents(
      type: 'this-weekend' | 'this-month'
    ) {
      const params = await getEventParams(type);

      console.log('params',params);
      

      const { at, from, to } = params;

      try {
        const res = await fetchThisWeekendOrThisMonthEventsApi(at, from, to);
        if (type === 'this-weekend') {
          setWeekendEvent(res);
        } else if (type === 'this-month') {
          setThisMonthEvent(res);
        }
      } catch (error) {
        console.log('Lỗi fetchThisWeekendOrThisMonthEvents', error);
      }
    }

    fetchThisWeekendOrThisMonthEvents('this-weekend');
    fetchThisWeekendOrThisMonthEvents('this-month');
  }, []);

  //banner
  const {
    data: bannerQuery,
    isLoading: bannerLoading,
  } = useQuery({
    queryKey: ['events', 'banner'],
    queryFn: fetchEventsBannersApi,
    staleTime: 60_000,
    cacheTime: 10 * 60_000,
  });

  const bannerEvents = bannerQuery?.data?.data?.result?.heroBanner;

  return (
    <main className="text-white pt-5 pb-8 bg-secondary">
      <div className="container mx-auto px-4 max-w-7xl h-max">
        <section className="mb-10 relative">
          {bannerLoading ? (
            <EventSkeleton count={2} type="banner" />
          ) : (
            <Swiper
              cssMode={true}
              slidesPerView={2}
              spaceBetween={16}
              loop={false}
              navigation={{
                nextEl: `.${styles.nextBtnBanner}`,
                prevEl: `.${styles.prevBtnBanner}`,
              }}
              pagination={{ clickable: true }}
              keyboard={true}
              modules={[Navigation, Pagination, Mousewheel, Keyboard]}
              className={styles.bannerSwiper}
            >
              {bannerEvents?.length > 0 ? (
                bannerEvents.map((item, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative rounded-xl overflow-hidden h-[320px] shadow-lg group">
                      {/* Thumbnail hiển thị mặc định */}
                      <img
                        src={item?.imageUrl || '/default-thumbnail.jpg'}
                        alt="Thumbnail"
                        className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                      />

                      {/* Video hiển thị khi hover */}
                      <video
                        muted
                        loop
                        playsInline
                        className="absolute top-0 left-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        onMouseEnter={(e) => e.currentTarget.play()}
                        onMouseLeave={(e) => {
                          e.currentTarget.pause();
                          e.currentTarget.currentTime = 0; // quay lại đầu
                        }}
                      >
                        <source src={item?.videoUrl} type="video/mp4" />
                      </video>

                      {/* Nút xem chi tiết */}
                      <div className="absolute bottom-4 left-4">
                        <Link
                          href={item?.deeplink ?? '/'}
                          className="bg-white text-gray-700 px-3 py-2 font-medium rounded-sm hover:bg-[rgb(45,194,117)] hover:text-white transition-colors text-sm"
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                <Empty />
              )}

              {/* Slide ở đây */}
              <div className={styles.prevBtnBanner}>
                <LeftOutlined />
              </div>
              <div className={styles.nextBtnBanner}>
                <RightOutlined />
              </div>
            </Swiper>
          )}
        </section>

        {/* Special Events Section */}
        <section className="relative">
          <h2 className="text-base font-bold mb-4">Sự kiện đặc biệt</h2>
          {eventsQuery.isLoading ? (
            <EventSkeleton count={5} type="card" />
          ) : specialEvents?.events?.length > 0 ? (
            <Swiper
              cssMode={true}
              spaceBetween={12}
              slidesPerGroup={4}
              breakpoints={{
                640: { slidesPerView: 2.7, spaceBetween: 12 },
                1024: { slidesPerView: 3.7, spaceBetween: 8 },
                1280: { slidesPerView: 4.7, spaceBetween: 12 },
              }}
              loop={false}
              onSlideChange={(swiper) => {
                setAtBeginning(swiper.isBeginning);
                setAtEnd(swiper.isEnd);
              }}
              navigation={{
                nextEl: `.${styles.nextBtnSpecialEvent}`,
                prevEl: `.${styles.prevBtnSpecialEvent}`,
              }}
              keyboard={true}
              modules={[Navigation, Mousewheel, Keyboard]}
              className={styles.SpecialEvent}
            >
              {specialEvents?.events?.map((event, index) => (
                <SwiperSlide key={index}>
                  <div className="rounded-lg overflow-hidden shadow-lg h-[240px] md:h-[300px] lg:h-[320px] lg:w-[250px]">
                    <Link
                      href={event?.deeplink}
                      target="_blank"
                      rel="noopener noreferrer" // bảo mật
                    >
                      <img
                        src={event.imageUrl}
                        alt={event.imageUrl}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                  </div>
                </SwiperSlide>
              ))}

              {/* Custom Navigation buttons */}
              <div
                className={`${styles.prevBtnSpecialEvent} transition-opacity ${atBeginning ? 'opacity-0 pointer-events-none' : 'opacity-100'
                  }`}
              >
                <LeftOutlined />
              </div>
              <div
                className={`${styles.nextBtnSpecialEvent} transition-opacity ${atEnd ? 'opacity-0 pointer-events-none' : 'opacity-100'
                  }`}
              >
                <RightOutlined />
              </div>
            </Swiper>
          ) : (
            <Empty />
          )}
        </section>

        <TrendingEventsSection
          isLoading={eventsQuery.isLoading}
          title={
            trendingEvents?.title ?? {
              en: 'Trending events',
              vi: 'Sự kiện xu hướng',
            }
          }
          events={trendingEvents?.events ?? []}
        />

        <EventCategorySection
          isLoading={eventsQuery.isLoading}
          title={forYouEventsQuery?.title?.en || 'Top picks for you'}
          events={forYouEventsQuery?.events}
          isSlider={true}
        />

        <EventCategoryTab
          isLoading={eventsQuery.isLoading}
          weekendEvent={weekendEvent}
          thisMonthEvent={thisMonthEvent}
        />

        <Image
          className="mt-8"
          src="/banner1.webp"
          alt="User avatar"
          width={1280}
          height={1280}
          priority
        />

        {bigCateQuery?.map((bigCate, index) => (
          <EventCategorySection
            isLoading={eventsQuery.isLoading}
            key={index}
            title={bigCate?.code}
            events={bigCate.events}
          />
        ))}
      </div>
    </main>
  );
}
