'use client';
import { useSelector } from 'react-redux';
import EventCategorySection from '../Home/EventCategorySection';

export default function RecommendationEmpty() {
  const forYouEvents = useSelector((state) => state.event.suggestions);
  return (
    <div className="flex-[0_0_100%] max-w-full px-3 box-border min-h-[1px] w-full">
      <EventCategorySection events={forYouEvents?.events} variant="recommend" />
    </div>
  );
}
