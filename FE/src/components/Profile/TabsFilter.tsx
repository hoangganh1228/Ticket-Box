'use client';
import { TagStatus } from '@/src/ui/myTicket';

interface TabsFilterProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  setActiveTab: (id: string) => void;
}

export default function TabsFilter({ tabs, activeTab, setActiveTab }: TabsFilterProps) {
  return (
    <div className="flex gap-4 w-full justify-center md:mt-4">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={TagStatus({ active: activeTab === tab.id })}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
}
