
import { Spin, Empty } from "antd";
import EventCard from "./EventCard";
import { Events } from "@/src/utils/interfaces/event.interface";

interface EventListProps {
  events: Events[];
  loading?: boolean;
  emptyMessage?: string;
}

export default function EventList({ events, loading, emptyMessage = "Không có sự kiện nào" }: EventListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spin size="large" />
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <Empty
        description={emptyMessage}
        className="text-white"
      />
    );
  }

  return (
    <div>
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}