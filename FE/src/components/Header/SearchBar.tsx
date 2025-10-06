'use client';

import { useState, useRef, useEffect } from 'react';
import { SearchOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useStorageList } from '@/src/hooks/useStorageList';
import Link from 'next/link';
import { Categories } from '@/src/utils/interfaces/category.interface';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchValue } from '@/src/redux/store/headerSlice';

export default function SearchBar({ categories }: Categories) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();
  const seacrhValue = useSelector((state: any) => state.header.searchValue);

  const { list, addItem } = useStorageList('search_history', 3);

  // đóng khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    addItem(query.trim());
    router.push(`/search?q=${encodeURIComponent(query.trim() || seacrhValue)}`);
    setQuery('');
    setOpen(false);
  };

  const renderGrid = (items: { id: number; name: string; slug: string }[]) => (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {items?.map((item) => (
        <div
          key={item.id}
          className="rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition relative group"
        >
          <Link
            href={`/search?cate=${item.slug}`}
            onClick={() => setOpen(false)}
          >
            <img
              src={
                'https://salt.tkbcdn.com/ts/ds/59/eb/f6/11ee276c12b68af613dc1e57df9eb613.png'
              }
              alt={item.name}
              className="w-full h-28 object-cover"
            />

            {/* Overlay mờ */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition"></div>

            {/* Chữ nổi trên overlay */}
            <div className="absolute inset-0 flex items-center justify-center px-2 text-center">
              <p className="text-[13px] font-semibold text-white leading-tight line-clamp-2">
                {item.name}
              </p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );

  return (
    <div
      className="flex flex-grow justify-center mx-8 relative"
      ref={wrapperRef}
    >
      {/* Ô input */}
      <div className="relative flex items-center w-full max-w-2xl">
        <SearchOutlined className="absolute left-4 text-gray-400 z-10" />
        <input
          type="text"
          value={query || seacrhValue}
          placeholder="Bạn tìm gì hôm nay?"
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            return setQuery(e.target.value), setOpen(false), dispatch(setSearchValue(e.target.value));
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="w-full h-10 rounded-l-md bg-white text-gray-800 pl-10 pr-4 focus:outline-none"
        />
        <button
          className="h-10 px-3 w-32 bg-white text-gray-500 rounded-r-md font-medium border-l border-gray-300 hover:bg-gray-100"
          onClick={handleSearch}
        >
          Tìm kiếm
        </button>
      </div>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute top-12 left-0 w-full max-w-2xl bg-gradient-to-b from-gray-900/90 to-gray-800/90 
        text-white rounded-md shadow-lg p-4 overflow-y-auto max-h-[70vh]
         z-50"
        >
          {/* Lịch sử */}
          <div className="space-y-2 mb-4">
            {list.length === 0 ? (
              <div className="text-gray-400">Chưa có lịch sử tìm kiếm</div>
            ) : (
              list?.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-gray-300 cursor-pointer hover:text-white"
                  onClick={() => {
                    setQuery(item);
                    handleSearch();
                  }}
                >
                  <ClockCircleOutlined />
                  <span>{item}</span>
                </div>
              ))
            )}
          </div>

          {/* Tabs khám phá */}
          <div className="flex gap-6 border-b border-gray-600 mb-4">
            <button
              className={`pb-2 font-medium 
                   border-b-2 border-green-400 text-white`}
            >
              Khám phá theo Thể loại
            </button>
          </div>

          {renderGrid(categories)}

          {/* Gợi ý cho bạn */}
          <h3 className="mb-3 font-semibold">Gợi ý dành cho bạn</h3>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3]?.map((i) => (
              <div key={i} className="bg-gray-700 rounded-md overflow-hidden">
                <img
                  src="https://picsum.photos/300/200"
                  alt="event"
                  className="w-full h-32 object-cover"
                />
                <div className="p-2 text-sm">
                  <div className="font-medium">Tên sự kiện {i}</div>
                  <div className="text-green-400">Từ 200.000đ</div>
                  <div className="text-xs text-gray-300">26 tháng 08, 2025</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
