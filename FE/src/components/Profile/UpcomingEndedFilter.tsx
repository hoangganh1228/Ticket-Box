'use client';

interface FilterProps {
  activeDiv: 'upcoming' | 'ended';
  setActiveDiv: (v: 'upcoming' | 'ended') => void;
}

export default function UpcomingEndedFilter({ activeDiv, setActiveDiv }: FilterProps) {
  return (
    <div className="flex gap-4 w-full justify-center md:mt-4">
      <div
        onClick={() => setActiveDiv('upcoming')}
        className={`relative flex items-center justify-center p-3 font-bold text-sm leading-5 mb-[1rem] cursor-pointer 
          ${
            activeDiv === 'upcoming'
              ? "text-white after:content-[''] after:absolute after:bottom-[3px] after:w-[25px] after:border-b-2 after:border-[rgb(45,194,117)]"
              : 'text-gray-400'
          }`}
      >
        Sắp diễn ra
      </div>

      <div
        onClick={() => setActiveDiv('ended')}
        className={`relative flex items-center justify-center p-3 font-bold text-sm leading-5 mb-[1rem] cursor-pointer 
          ${
            activeDiv === 'ended'
              ? "text-white after:content-[''] after:absolute after:bottom-[3px] after:w-[25px] after:border-b-2 after:border-[rgb(45,194,117)]"
              : 'text-gray-400'
          }`}
      >
        Đã kết thúc
      </div>
    </div>
  );
}
