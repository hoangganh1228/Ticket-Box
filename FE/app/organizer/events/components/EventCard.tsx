import { Card } from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  EditOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { formatDate } from "@/src/helpers/format.helper";
import { Events } from "@/src/utils/interfaces/event.interface";

interface EventCardProps {
  event: Events;
}

export default function EventCard({ event }: EventCardProps) {
  const formatAddress = () => {
    const parts = [event.street, event.ward, event.district, event.province].filter(Boolean);
    return parts.join(", ");
  };

  return (
    <Card className="bg-gray-800 text-white border-none rounded-xl overflow-hidden mb-4">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/4">
          <img
            src={event.banner}
            alt={event.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="md:w-3/4 p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold">{event.name}</h3>
            <p className="flex items-center gap-2 text-green-400">
              <CalendarOutlined/> {formatDate(event.created_at)}
            </p>
            <p className="flex items-center gap-2 text-gray-300">
              <EnvironmentOutlined/> {formatAddress()}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Trạng thái: <span className={`font-medium ${
                event.status === 'published' ? 'text-green-400' : 
                event.status === 'pending' ? 'text-yellow-400' : 
                event.status === 'draft' ? 'text-blue-400' : 'text-gray-400'
              }`}>
                {event.status === 'published' ? 'Đã xuất bản' :
                 event.status === 'pending' ? 'Chờ duyệt' :
                 event.status === 'draft' ? 'Nháp' : 'Đã qua'}
              </span>
            </p>
          </div>

          <div className="flex justify-around mt-4 border-t border-gray-700 pt-3 text-center">
            {[
              {icon: <AppstoreOutlined/>, label: "Tổng quan", link: `/organizer/events/${event.id}`},
              {icon: <TeamOutlined/>, label: "Thành viên", link: `/organizer/events/${event.id}/member`},
              {icon: <ShoppingCartOutlined/>, label: "Đơn hàng", link: `#`},
              {icon: <AppstoreOutlined/>, label: "Sơ đồ ghế", link: `#`},
              {icon: <EditOutlined/>, label: "Chỉnh sửa", link: `/organizer/events/${event.id}/edit-event`},
            ].map((item, index) => (
              <Link
                href={item.link}
                key={index}
                className="hover:text-green-400 cursor-pointer transition-colors"
              >
                <div className="text-2xl">{item.icon}</div>
                <p className="mt-1 text-sm">{item.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}


