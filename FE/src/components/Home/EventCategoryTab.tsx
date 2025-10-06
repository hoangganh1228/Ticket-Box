/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import EventCategorySection from './EventCategorySection';

export default function EventCategoryTab(props : any) {

  const { weekendEvent, thisMonthEvent, isLoading } = props

  const [activeTab, setActiveTab] = useState<'weekend' | 'this-month'>('weekend');

  const eventsToShow = activeTab === 'weekend' ? weekendEvent.data : thisMonthEvent.data;

  return (
    <div className="mt-8">
      <div className="flex items-center gap-x-6 ">
        <h2
          onClick={() => setActiveTab('weekend')} 
          className={`text-sm font-bold cursor-pointer transition-colors ${activeTab === 'weekend' ? 'border-b-4 border-primary rounded-sm' : ''}`}
        >
          Cuối tuần
        </h2>
        <h2 
          onClick={() => setActiveTab('this-month')} 
          className={`text-sm font-bold cursor-pointer transition-colors ${activeTab === 'this-month' ? 'border-b-4 border-primary rounded-sm' : ''}`}
        >
          Tháng này
        </h2>
      </div>

      <EventCategorySection
        isLoading={isLoading}
        title=""
        events={eventsToShow}
        isSlider={true}
        time={activeTab}
      />
    </div>
  );
}