'use client';
import { Skeleton } from 'antd';

interface EventSkeletonProps {
  count?: number;
  type?: 'card' | 'banner' | 'full';
}

export default function EventSkeleton({
  count = 4,
  type = 'card',
}: EventSkeletonProps) {
  const items = Array.from({ length: count });

  if (type === 'full') {
    return (

      <div
        className="w-full"
      >
        <Skeleton.Image
          active
          className='rounded-xl p-3 w-full min-h-[300px]'
        />
      </div>
    );
  }


  if (type === 'banner') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((_, i) => (
          <div
            key={i}
            className="w-full"
          >
            <Skeleton.Image
              active
              className='rounded-xl w-full min-h-[300px] bg-[#ffffff1f]'
              // style={{
              //   width: '100%',
              //   height: '100%',
              //   backgroundColor: 'rgba(255,255,255,0.1)',
              // }}
            />
          </div>
        ))}
      </div>
    );
  }

  // default: card skeleton
  return (
    <div className="flex gap-4 flex-wrap">
      {items.map((_, i) => (
        <div
          key={i}
          className="rounded-lg overflow-hidden shadow-lg h-[300px] w-[230px] bg-gray-300/10 p-2"
        >
          {/* Thumbnail skeleton */}
          <Skeleton.Image
            active
            style={{
              width: '210px',
              height: '180px',
              borderRadius: '0.5rem',
              backgroundColor: 'rgba(255,255,255,0.12)',
            }}
          />

          {/* Text skeleton */}
          <div className="mt-3">
            <Skeleton
              active
              title={{ width: '80%' }}
              paragraph={{ rows: 2, width: ['100%', '60%'] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
