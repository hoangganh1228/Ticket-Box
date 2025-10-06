/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { formatDate, getDay, getMonth, getYear } from '@/src/helpers/format.helper';
import {
  BorderOuterOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';

export default function TicketItem({ orders }: { orders: any[] }) {

  return (
    <>
      {orders.map((item, index) => (
        <div className="flex mb-4 gap-[2px] w-full cursor-pointer" key={index}>
          <div className="bg-[rgb(81,81,88)] p-4 relative w-32 rounded-tl-[4px] rounded-bl-[4px] items-stretch">
            <div className="flex flex-col justify-center items-stretch gap-2 h-full text-white text-center">
              <div className="text-[2.6rem]">{getDay(item.show_time_start)}</div>
              <div className="text-[1.2rem]">Tháng {getMonth(item.show_time_start)}</div>
              <div className="text-[1.2rem]">{getYear(item.show_time_start)}</div>
            </div>
          </div>
          <div
            className="bg-[rgb(81,81,88)] p-4 relative w-auto rounded-tr-[4px] rounded-br-[4px] items-stretch 
                flex flex-col text-white gap-4 flex-[1_1_0] before:box-border"
          >
            <div className="font-bold text-[1.2rem] leading-[1.8rem] break-words overflow-hidden text-ellipsis line-clamp-2">
              {item.event_name}
            </div>
            <div className="flex flex-wrap gap-[0.4rem]">
              <div
                className="bg-[rgb(45,194,117)] text-black border border-[rgb(45,194,117)]
                    text-[1rem] rounded-[3rem] py-[0.2rem] px-[0.6rem] font-normal"
              >
                Thành công
              </div>
              <div
                className="bg-[rgb(56,56,61)] text-primary border border-primary
                    text-[1rem] rounded-[3rem] py-[0.2rem] px-[0.6rem] font-normal"
              >
                Vé điện tử
              </div>
            </div>

            <div className="flex flex-col w-full gap-4">
              <div className="flex gap-2 items-center">
                <BorderOuterOutlined className="w-4 h-4 fill-none flex-[0_0_22px]" />
                <div className="text-[1rem] font-medium text-[rgb(196,196,207)]">
                  Order code: {item.order_order_number}
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <ClockCircleOutlined className="w-4 h-4 fill-none flex-[0_0_22px]" />
                <div className="text-[1rem] font-medium text-[rgb(196,196,207)]">
                  {formatDate(item.show_time_start)}
                </div>
              </div>
              <div className="flex gap-2 items-stretch">
                <EnvironmentOutlined className="w-6 h-6 fill-none flex-[0_0_22px]" />
                <div className="flex flex-col gap-2 text-[1rem] font-medium text-[rgb(196,196,207)]">
                  <span className="">{item.event_province}</span>
                  <span>
                    {item.event_name_address}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
