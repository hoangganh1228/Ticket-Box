/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  CalendarOutlined,
  EnvironmentOutlined,
  RightOutlined,
  CaretRightOutlined,
} from '@ant-design/icons';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';
import { Collapse, Button } from 'antd';
import EventCategorySection from '@/src/components/Home/EventCategorySection';
import { fetchEventDetailApi, fetchEventSuggestionsApi } from '@/src/apis/events';
import { formatDate, formatPrice } from '@/src/helpers/format.helper';
import dayjs from 'dayjs';
import ShowDescription from '@/src/components/ShowDescription';
import { redirect, useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { EventDetail, EventItem } from '@/src/utils/interfaces/event.interface';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/redux/store/store';
import { openLogin } from '@/src/redux/store/headerSlice';

const ShowTime = ({ show } : any) => {
  const start = dayjs(show.time_start).format('HH:mm');
  const end = dayjs(show.time_end).format('HH:mm');
  const date = dayjs(show.time_start).format('DD [tháng] MM, YYYY');

  return (
    <span>
      {start} - {end}, {date}
    </span>
  );
};

export default function EventDetailPage() {
  const { EventSlugAndId } = useParams<{ EventSlugAndId: string }>();
  const parts = EventSlugAndId.split('-');
  const id = parts[parts.length - 1];
  
  const [expanded, setExpanded] = useState(false);
  const [eventDetail, setEventDetail] = useState<EventDetail | null>(null);
  const [eventSuggestions, setEventSuggestions] = useState<EventItem[] | null >(null);
  const introRef = useRef<HTMLHeadingElement>(null);
  const ticketSectionRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const user = useSelector((state : RootState) => state.auth.user);
  const dispatch = useDispatch();

  const handleCollapse = () => {
    setExpanded(false);
    introRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handleScrollToTickets = () => {
    ticketSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handleBuyTicket = (EventId : number , ShowId : number ) => {
    if(!user) {
      dispatch(openLogin());
      return;
    }
    router.push(`events/${EventId}/bookings/${ShowId}/select-ticket`);
  }

  useEffect(() => {
    async function fetchEventDetail() {
      try {
        const res = await fetchEventDetailApi(id);
        setEventDetail(res?.data);
      } catch (error) {
        console.log('Lỗi ở function fetchEventDetail', error);
        redirect('/');
      }
    }

    fetchEventDetail();
  }, [id]);

  useEffect(() => {
    async function fetchEventSuggestions() {
      try {
        const res = await fetchEventSuggestionsApi(id);
        setEventSuggestions(res?.data[0]?.events);
      } catch (error) {
        console.log('Lỗi ở function fetchEventSuggestions', error);
      }
    }

    fetchEventSuggestions();
  }, [id]);

  return (
    <>
      <div className="text-white pt-5 pb-8 bg-[linear-gradient(rgb(39,39,42)_48.04%,rgb(0,0,0)_100%)]">
        <div className="container mx-auto px-4 max-w-7xl h-max">
          {/* Card chính */}
          <div className="relative bg-[rgb(56,56,61)] rounded-2xl flex overflow-hidden w-full mt-5">
            {/* Cột trái - Thông tin */}
            <div className="relative w-[35%] p-6 flex flex-col justify-between z-10">
              {/* 2 vòng tròn cắt trên & dưới */}
              <div className="absolute -right-5 top-[-20] w-12 h-12 bg-[rgb(39,39,42)] rounded-full"></div>
              <div className="absolute -right-6 bottom-[-20] w-12 h-12 bg-[rgb(2,2,3)] rounded-full"></div>

              <div className="space-y-2">
                {/* Tiêu đề */}
                <h1 className="text-lg font-bold leading-snug">
                  {eventDetail?.name}
                </h1>

                {/* Thời gian */}
                <div className="flex items-center space-x-2 text-sm ">
                  <CalendarOutlined className="text-white" />
                  <span className="text-primary">
                    { eventDetail && formatDate(eventDetail?.endTime)}
                  </span>
                </div>

                {/* Ngày khác */}
                <button className="px-3 py-1 bg-zinc-800 rounded-md text-xs">
                  + { eventDetail &&  eventDetail.shows.length - 1} ngày khác
                </button>

                {/* Địa điểm */}
                <div className="space-y-1">
                  <p className="font-semibold text-primary">
                    Trung tâm Hội nghị và Triển lãm Sài Gòn (SECC)
                  </p>
                  <div className="flex items-start space-x-2 text-sm text-gray-300">
                    <EnvironmentOutlined className="mt-1" />
                    <span className="text-[12px]">
                      {eventDetail?.name_address}
                    </span>
                  </div>
                </div>
              </div>

              {/* Giá + Button */}
              <div className="mt-6 border-t border-gray-300 pt-0.5">
                <p className="text-base">
                  <span className="text-primary font-semibold">
                    { eventDetail?.isFree ? 'Miễn Phí' : `Giá từ ${formatPrice(eventDetail?.minTicketPrice)}` }
                    <RightOutlined className="text-[12px]" />
                  </span>
                </p>
                <button className="mt-3 w-full bg-primary text-white text-sm font-semibold py-1 rounded-md hover:bg-white hover:text-black transition">
                  { eventDetail && eventDetail?.shows?.length > 1 ? <div
                    onClick={ () => handleScrollToTickets() }
                  >Chọn lịch diễn</div> : <div onClick={ () => handleBuyTicket(eventDetail?.id as number ,eventDetail?.shows[0]?.id as number ) } >
                    { eventDetail?.isFree ? 'Đăng ký ngay' : 'Mua vé ngay' }
                  </div> }
                </button>
              </div>
            </div>

            {/* Cột phải - Hình ảnh */}
            <div className="w-[65%]">
              <img
                src={eventDetail?.banner}
                alt="Event Image"
                className="w-full h-[400px] object-cover rounded-r-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* introduce */}
      <div className="bg-[rgba(245,247,252,1)] py-6">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-wrap">
            <div className="w-3/4 pr-3">
              <div className="bg-white rounded-xl px-4">
                <h4
                  className="pt-4 pb-4 border-b border-[rgb(235,235,240)]"
                  ref={introRef}
                >
                  Giới thiệu
                </h4>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    expanded ? 'max-h-max' : 'max-h-[160px]'
                  }`}
                >
                  <div className="text-sm space-y-1 pt-4 pb-4 whitespace-pre-line">
                    <ShowDescription description={eventDetail?.description ?? ''} />
                  </div>
                </div>

                {/* Optional: thêm nút dưới cùng nếu muốn */}
                {!expanded && (
                  <div className="flex justify-center pb-3">
                    <button
                      onClick={() => setExpanded(true)}
                      className="text-sm rounded-full text-[rgb(39,39,42)] border-[rgb(50,50,50)]"
                    >
                      <DownOutlined />
                    </button>
                  </div>
                )}
                {expanded && (
                  <div className="flex justify-center pb-3">
                    <button
                      onClick={handleCollapse}
                      className="text-sm rounded-full"
                    >
                      <UpOutlined />
                    </button>
                  </div>
                )}
              </div>

              {/* ticket-infomation */}
              <div className="mt-[25px] bg-[rgb(39,39,42)] rounded-xl overflow-hidden text-white"
                ref={ticketSectionRef}
              >
                <h4 className="px-3 py-2 border-b border-[rgb(238,233,233)]">
                  Thông tin vé
                </h4>

                { eventDetail &&
                <Collapse
                  bordered={false}
                  expandIcon={({ isActive }) => (
                    <div
                      style={{ height: 30, width: 30 }}
                      className="flex items-center justify-center"
                    >
                      <CaretRightOutlined
                        rotate={isActive ? 90 : 0}
                        className="text-white text-lg"
                      />
                    </div>
                  )}
                  className="bg-[rgb(39,39,42)]"
                  items={eventDetail?.shows.map((show, idx) => ({
                    key: show.id.toString(),
                    label: (
                      <div className="flex justify-between items-center w-full text-white">
                        <span className="text-xs">
                          <ShowTime show={show} />
                        </span>
                        <Button
                          type="primary"
                          className="bg-primary hover:bg-primaryHover"
                          onClick={() => handleBuyTicket( Number(id) ,show.id as number)}
                        >
                          { eventDetail?.isFree ? 'Đăng ký ngay' : 'Mua vé ngay' }
                        </Button>
                      </div>
                    ),
                    children: (
                      <div className="divide-y divide-[rgb(64,64,70)]">
                        {show.tickets.map((ticket) => (
                          <div
                            key={ticket.id}
                            className="flex justify-between py-2 px-3 hover:bg-[rgb(50,50,55)] transition"
                          >
                            <span className="text-white">{ticket.name}</span>
                            <span className="text-primary font-medium">
                              {Number(ticket.price).toLocaleString('vi-VN')}₫
                            </span>
                          </div>
                        ))}
                      </div>
                    ),
                    className: '!bg-[rgb(39,39,42)] !text-white',
                  }))}
                />
                }

              </div>

              {/* orgnaizer-info */}
              <div className="rounded-xl mt-[25px] pr-4 pl-4 bg-[rgb(255,255,255)] overflow-hidden]">
                <h4 className="pt-3 pb-3 border-b border-[rgb(235,235,240)]">
                  Ban Tổ Chức
                </h4>
                <div className="pt-3 pb-3 mt-[24px]">
                  <div className="flex gap-6">
                    <div className="w-[150px] flex-shrink-0">
                      <img
                        src={eventDetail?.org_thumbnail}
                        alt="image"
                        className="w-full h-auto rounded-xl object-cover"
                      />
                    </div>
                    <div className="">
                      <p className="font-bold text-base leading-[150%]">
                        {eventDetail?.org_name}
                      </p>
                      <div className="font-normal text-sm leading-6 break-normal whitespace-pre-line">
                        {eventDetail?.org_description}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-[250px] flex-shrink-0">
              <img
                src="https://ticketbox.vn/_next/image?url=https%3A%2F%2Fsalt.tkbcdn.com%2Fts%2Fds%2F59%2F9a%2F74%2F057793486f215613068de3385bedba2f.png&w=2048&q=75"
                alt="image"
                className="w-full h-auto rounded-xl object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* recommend event */}
      <div className="bg-[rgb(39,39,42)] pl-4 pr-4 max-w-full">
        <div className="max-w-[1280px] pl-4 pr-4 mx-auto">
          <div className="-ml-4 -mr-4 flex flex-wrap">
            <div className="w-full pl-3 pr-3 box-border min-h-[1px]">
              <h5 className="text-white text-base font-semibold text-center pt-7 pb-7 border-t border-t-[rgb(255,255,255)]">
                Có thể bạn cũng thích
              </h5>
            </div>
            <div className="w-full max-w-full pl-3 pr-3 ml-16">
              <EventCategorySection
                title=""
                events={eventSuggestions ?? []}
                variant="recommend"
              />
            </div>
          </div>
          <div className="flex justify-center items-center mt-6 pb-4">
            <button className="text-white bg-primary px-6 py-1 rounded-[20px]">
              Xem thêm sự kiện
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
