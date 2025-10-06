import { searchWorkshops } from '@/src/apis/events';
import RecommendationEmpty from '@/src/components/Header/RecommendationEmpty';
import {
  formatDate,
  formatPrice,
  isEventPast,
} from '@/src/helpers/format.helper';
import { SERVER_URL } from '@/src/utils/const/config.const';
import {
  CalendarOutlined,
  DownOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Search({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cate?: string; from?: string; to?: string }>;
}) {
  const { q, cate, from, to } = await searchParams;

  if (!q && !cate && !from && !to) {
    redirect('/');
  }

  const res = await searchWorkshops({ q, cate, from, to });
  console.log('res', res);
  
  return (
    <main className="bg-black min-h-screen ">
      {/* filters */}
      <div className="pt-16 pb-6 px-6 container mx-auto max-w-7xl">
        {/* search and filter */}
        <div className="flex items-center px-[6px] justify-between">
          <div className="text-primary font-normal text-sm flex-1">
            Kết quả tìm kiếm:
          </div>
          <div className="flex flex-shrink-0 w-max justify-end gap-2">
            <button
              className="flex items-center justify-center rounded-2xl h-8 font-bold text-sm leading-5
                            bg-[rgb(81,81,88)] border-none text-[rgb(255,255,255)] w-auto px-3
                        "
            >
              <CalendarOutlined className="leading-[1px] mr-2" />
              Tất cả các ngày
              <DownOutlined className="leading-[1px] ml-2" />
            </button>
            <button
              className="flex items-center justify-around rounded-[21px] h-8 font-bold text-sm leading-5
                            bg-[rgb(81,81,88)] border-none text-[rgb(255,255,255)] w-auto px-3
                        "
            >
              <FilterOutlined className="leading-[1px] mr-2" />
              Bộ lọc
              <DownOutlined className="leading-[1px] ml-2" />
            </button>
          </div>
        </div>
      </div>

      { res?.data?.length === 0 && 
        <div className='flex flex-col bg-[rgb(0,0,0)] mt-2'>
          <div className="flex flex-col justify-center items-center w-full text-white relative gap-4 my-8">
            <span className="box-border inline-block overflow-hidden w-[132px] h-[132px] opacity-[1] m-0 p-0 relative">
              <img src="https://ticketbox.vn/_next/image?url=%2F_next%2Fstatic%2Fimages%2Fempty.png&w=256&q=75" alt="" />
            </span>
            <div className="text-sm text-center font-bold leading-[21px]">Rất tiếc! Không tìm thấy kết quả nào</div>
            <div className="text-xs text-center font-normal leading-[18px]">Bạn hãy thử điều chỉnh lại bộ lọc, sử dụng các từ khóa phổ biến hơn hoặc khám phá các sự kiện nổi bật bên dưới</div>
          </div>
          <div className="box-border m-0 max-w-full p-0 bg-transparent">
            <div className="max-w-[1280px] px-4 mx-auto">
              <div className="-mx-4 flex flex-wrap">
                <div className="max-w-full px-3 flex-[0_0_100%] box-border min-h-[1px] w-full">
                  <h5 className="text-white text-base font-semibold text-center py-7 border-t border-[rgb(255,255,255)]">Gợi ý dành cho bạn</h5>
                </div>
                {/* items */}
                <RecommendationEmpty />
              </div>
            </div>
          </div>
        </div>
      }
        
      {/* workshops */}
      <div className="flex flex-col bg-[rgb(0,0,0)] mt-2">
        <div className="flex flex-wrap w-full mx-auto min-h-[70vh] max-w-[1280px] px-7">
          <div className="w-full">
            <div className="flex flex-wrap h-auto overflow-auto">
              {/* items */}
              {res?.data?.map((item: any, index: number) => {
                const isPast = isEventPast(item.day);
                return (
                  <div className="w-1/4 p-[5px] cursor-pointer" key={index}>
                    <div className="w-full h-auto flex flex-col relative gap-4 min-h-[297px]">
                      {/* img */}
                      <div className="relative rounded-lg w-full h-auto box-border">
                        <Link
                          href={
                            item.deeplink ||
                            `${SERVER_URL}/nguyen-manh-sam-2`
                          }
                          rel="noopener noreferrer" // bảo mật
                        >
                          <img
                            src={item.event_thumbnail}
                            alt="fake"
                            className="w-full h-auto aspect-[16/9] rounded-xl object-cover border-none "
                          />
                        </Link>

                        {isPast && (
                          <span
                            className="absolute rounded-bl-xl rounded-tr-xl   w-max z-[2] py-[4px] px-[6px] top-0 right-0 text-white text-[10px] leading-[15px] 
                        font-bold bg-[rgb(255,130,10)]
                      "
                          >
                            Đã diễn ra
                          </span>
                        )}
                      </div>
                      {/* content */}
                      <div className="flex flex-col gap-2 w-full h-max">
                        <span className="text-white text-sm w-full overflow-hidden line-clamp-2 leading-[21px] h-[42px] font-semibold break-words">
                          {item.event_name}
                        </span>
                        <span className="text-primary font-semibold w-full text-sm">
                          Từ {formatPrice(item.ticket_price)}
                        </span>
                        <span className="text-white text-xs font-normal flex items-center justify-start gap-2">
                          <CalendarOutlined className="w-[16px] h-[17px] fill-none" />
                          <span>{formatDate(item.day)}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
