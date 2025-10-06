"use client";

import { useState, useEffect } from "react";
import { Alert, Pagination } from "antd";
import '@/src/styles/customTab.css';
import { Events } from "@/src/utils/interfaces/event.interface";
import {
  getMyEvents
} from "@/src/apis/events";
import EventTabs from "./components/EventTabs";
import SearchBar from "./components/SearchBar";
import EventList from "./components/EventList";
import { PaginationInterface } from "@/src/utils/interfaces/pagination.interface";

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState("pending");
  const [searchValue, setSearchValue] = useState("");
  const [events, setEvents] = useState<Events[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0,
  });

  const fetchEvents = async (tabKey: string, currentPage = pagination.currentPage, limit = pagination.limit, searchValue = '') => {
    setLoading(true);
    try {
      let response: { data: Events[], pagination: PaginationInterface } = { data: [], pagination: { page: 1, limit: 1, totalItems: 0, totalPages: 0 } };

      switch (tabKey) {
        case "draft":
          response = await getMyEvents("draft", currentPage, limit, searchValue);
          break;
        case "pending":
          response = await getMyEvents("pending", currentPage, limit, searchValue);
          break;
        case "upcoming":
          response = await getMyEvents("upcoming", currentPage, limit, searchValue);
          break;
        case "past":
          response = await getMyEvents("past", currentPage, limit, searchValue);
          break;
        default:
          response = await getMyEvents("pending", currentPage, limit, searchValue);
      }
      setEvents(response.data);
      setTotalEvents(response.data.length);
      setPagination((prev) => ({
        ...prev,
        totalItems: response.pagination.totalItems,
      }));
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(activeTab, 1, pagination.limit);
  }, [activeTab]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setSearchValue("");
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));
    fetchEvents(key, 1, pagination.limit);
  };

  const handleSearch = () => {
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));
    fetchEvents(activeTab, 1, pagination.limit, searchValue);
  };
  const handlePaginationChange = (page: number, pageSize?: number) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
      limit: pageSize || prev.limit,
    }));
    fetchEvents(activeTab, page, pageSize || pagination.limit);
  };

  const getEmptyMessage = () => {
    switch (activeTab) {
      case "draft":
        return "Không có sự kiện nháp nào";
      case "pending":
        return "Không có sự kiện chờ duyệt nào";
      case "upcoming":
        return "Không có sự kiện sắp tới nào";
      case "past":
        return "Không có sự kiện đã qua nào";
      default:
        return "Không có sự kiện nào";
    }
  };

  return (
    <div className="p-4 text-white">
      <div className="flex flex-wrap gap-2 items-center mb-3 justify-between">
        <SearchBar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onSearch={handleSearch}
        />

        <EventTabs
          activeKey={activeTab}
          onTabChange={handleTabChange}

        />
      </div>

      {activeTab === "pending" && (
        <Alert
          message={
            <span>
              <b>Lưu ý:</b> Sự kiện đang chờ duyệt. Để đảm bảo tính bảo mật cho sự kiện của bạn, quyền truy cập vào trang chỉ dành cho chủ sở hữu và quản trị viên được ủy quyền
            </span>
          }
          type="warning"
          showIcon={false}
          className="my-2 bg-yellow-400 text-black font-medium border-none py-3"
        />
      )}

      <div className=" lg:min-h-[700px]">
        <EventList
          events={events}
          loading={loading}
          emptyMessage={getEmptyMessage()}
        />
      </div>

      {totalEvents > 0 && (
        <Pagination
          showSizeChanger
          current={pagination.currentPage}
          total={pagination.totalItems}
          pageSize={pagination.limit}
          onChange={handlePaginationChange}
          pageSizeOptions={['5', '10', '20', '50']}
          align="end"
          className="my-6 flex justify-end"
        />
      )}
    </div>
  );
}