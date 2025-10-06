'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { RightOutlined } from '@ant-design/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {
  formatDate,
  formatName,
  formatPrice,
} from '@/src/helpers/format.helper';
import EventSkeleton from '../Commom/EventSkeleton';
import { EventCategorySectionProps } from '@/src/utils/interfaces/event.interface';
import { Empty } from 'antd';
import { getEventParams } from '@/src/helpers/takeTime.helper';

export default function EventCategorySection(props: EventCategorySectionProps) {
  const {
    title,
    events,
    isSlider = false,
    variant = 'default',
    isLoading,
    time,
  } = props;

  const [queryParams, setQueryParams] = useState<{
    at: string;
    from: string;
    to: string;
  } | null>(null);

  useEffect(() => {
    if (time === 'weekend') {
      setQueryParams(getEventParams('this-weekend'));
    } else if (time === 'this-month') {
      setQueryParams(getEventParams('this-month'));
    } else {
      setQueryParams(null);
    }
  }, [time]);

    const buildSeeMoreHref = () => {
    let href = `/search?cate=${title}`;
    if (queryParams) {
      href = `/search?from=${queryParams.from}&to=${queryParams.to}`;
    }
    return href;
  };

  console.log('queryParams',queryParams);
  

  return (
    <section className={`${title ? 'mt-8' : ''} relative eventcategorysection`}>
      <style jsx global>
        {`
          .eventcategorysection .swiper-button-prev,
          .eventcategorysection .swiper-button-next {
            top: 50% !important;
            transform: translateY(-120%);
            color: white;
            width: 32px;
            height: 32px;
          }

          .eventcategorysection .swiper-button-prev {
            left: 2px; /* chỉnh vị trí bên trái */
          }
          .eventcategorysection .swiper-button-next {
            right: 2px; /* chỉnh vị trí bên phải */
          }

          .eventcategorysection .swiper-button-prev::after,
          .eventcategorysection .swiper-button-next::after {
            font-size: 18px; /* chỉnh icon size */
          }
        `}
      </style>

      {variant === 'default' && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-bold text-white">
            {formatName(title)}
          </h2>
          {title !== 'Top picks for you' && (
            <Link
              href={buildSeeMoreHref()}
              className="text-sm text-gray-400 hover:text-primary transition-colors"
            >
              Xem thêm <RightOutlined />
            </Link>
          )}
        </div>
      )}

      {isLoading ? (
        <EventSkeleton count={5} type="card" />
      ) : isSlider ? (
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={16}
          slidesPerView={2}
          navigation
          slidesPerGroup={4} //next 4 items
          breakpoints={{
            640: {
              slidesPerView: 3,
            },
            768: {
              slidesPerView: 4,
            },
            1024: {
              slidesPerView: 5,
            },
          }}
          className="mySwiper"
        >
          {events?.length > 0 ? (
            events?.map((event, index) => (
              <SwiperSlide key={index}>
                <div className="h-full transition-transform duration-300 cursor-pointer">
                  <Link
                    href={`${event?.deeplink}`}
                    className="block"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="relative aspect-[4/2] overflow-hidden rounded-xl">
                      <img
                        src={event.imageUrl}
                        alt={event.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="pt-2 flex flex-col h-[100px]">
                      <h3 className="text-sm font-semibold line-clamp-2 text-ellipsis text-white">
                        {event?.name}
                      </h3>
                      <div className="mt-auto">
                        <p className="text-sm text-primary font-bold leading-tight">
                          Từ {formatPrice(event.price)}
                        </p>
                        <div className="flex items-center text-xs text-white mt-1 leading-tight">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-3 h-3 mr-1"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5"
                            />
                          </svg>
                          <span>{formatDate(event.day)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </SwiperSlide>
            ))
          ) : (
            <Empty />
          )}
        </Swiper>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-6">
          {events?.length > 0 ? (
            events?.map((event, index) => (
              <div
                key={index}
                className="h-full transition-transform duration-300 cursor-pointer"
              >
                <Link
                  href={`/${event?.deeplink}`}
                  className="block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="relative aspect-[4/2] overflow-hidden rounded-xl">
                    <img
                      src={event.imageUrl}
                      alt={event.title ?? ''}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="pt-2 flex flex-col h-[100px]">
                    <h3 className="text-sm font-semibold line-clamp-2 text-ellipsis text-white">
                      {event.name}
                    </h3>
                    <div className="mt-auto">
                      <p className="text-sm text-primary font-bold leading-tight">
                        Từ {formatPrice(event.price)}
                      </p>
                      <div className="flex items-center text-xs text-white mt-1 leading-tight">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-3 h-3 mr-1"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5"
                          />
                        </svg>
                        <span>{formatDate(event.day)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <Empty />
          )}
        </div>
      )}
    </section>
  );
}
