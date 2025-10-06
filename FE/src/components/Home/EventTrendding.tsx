'use client';

import Link from 'next/link';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { TrendingEventType } from '@/src/utils/interfaces/event.interface';
import EventSkeleton from '../Commom/EventSkeleton';
import { Empty } from 'antd';

export default function TrendingEventsSection({
  title,
  events,
  isLoading,
}: TrendingEventType) {
  return (
    <section className="mt-8 relative">
      <style jsx global>{`
        .swiper-button-prev,
        .swiper-button-next {
          top: 50% !important;
          transform: translateY(10%);
          color: white;
          width: 32px;
          height: 32px;
          z-index: 10;
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 0px 4px 4px 0px;
        }

        .swiper-button-prev {
          left: 2px;
        }

        .swiper-button-next {
          right: 2px;
        }

        .swiper-button-prev::after,
        .swiper-button-next::after {
          font-size: 18px;
        }

        .swiper-slide {
          height: auto;
        }
      `}</style>

      <div className="flex items-center mb-4">
        <h2 className="text-base font-bold text-white">🔥 {title?.vi}</h2>
      </div>

      {isLoading ? (
        <EventSkeleton count={5} type="card" />
      ) : (
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={16}
          slidesPerView={1.2}
          navigation
          slidesPerGroup={4} //next 4 items
          breakpoints={{
            480: {
              slidesPerView: 2.2,
            },
            640: {
              slidesPerView: 2.8,
            },
            768: {
              slidesPerView: 3.2,
            },
            1024: {
              slidesPerView: 3.8,
            },
            1280: {
              slidesPerView: 3.7,
            },
          }}
          className=""
        >
          {events?.length > 0 ? (
            events?.map((event, index) => (
              <SwiperSlide key={index}>
                <div className="h-full transition-transform duration-300 cursor-pointer hover:scale-105">
                  <Link
                    className="relative aspect-[16/9] overflow-hidden rounded-xl"
                    href={event?.deeplink}
                  >
                    <div className="absolute top-4 left-4 z-10">
                      <span
                        className="text-6xl font-black text-green-400 opacity-90"
                        style={{
                          fontFamily: 'system-ui, -apple-system, sans-serif',
                          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                          WebkitTextStroke: '1px rgba(255,255,255,0.1)',
                        }}
                      >
                        {event?.rank || index + 1}
                      </span>
                    </div>

                    {/* Gradient overlay cho text dễ đọc */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-[1]"></div>

                    <img
                      src={event.imageUrl}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                </div>
              </SwiperSlide>
            ))
          ) : (
            <Empty />
          )}
        </Swiper>
      )}
    </section>
  );
}
