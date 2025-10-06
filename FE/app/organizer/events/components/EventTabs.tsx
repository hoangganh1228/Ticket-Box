import { Tabs } from "antd";

interface EventTabsProps {
  activeKey: string;
  onTabChange: (key: string) => void;
}

export default function EventTabs({ activeKey, onTabChange }: EventTabsProps) {
  const tabItems = [
    {key: "upcoming", label: "Sắp tới"},
    {key: "past", label: "Đã qua"},
    {key: "pending", label: "Chờ duyệt"},
    {key: "draft", label: "Nháp"},
  ];

  return (
    <Tabs
      activeKey={activeKey}
      onChange={onTabChange}
      items={tabItems}
      className="custom-tabs"
    />
  );
}
