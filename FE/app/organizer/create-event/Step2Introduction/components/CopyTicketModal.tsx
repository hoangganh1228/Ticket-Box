import React, { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import type { Performance } from "../types";

interface CopyTicketModalProps {
  open: boolean;
  onClose: () => void;
  onCopy: (ticketIds: number[]) => void; // Thay đổi để hỗ trợ copy nhiều vé
  performances: Performance[];
  currentPerformanceId: number;
}

export default function CopyTicketModal({
  open,
  onClose,
  onCopy,
  performances,
  currentPerformanceId
}: CopyTicketModalProps) {
  const [selectedPerformanceId, setSelectedPerformanceId] = useState<number | null>(null);
  const [selectedTicketIds, setSelectedTicketIds] = useState<number[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  if (!open) return null;

  // Lấy các suất diễn trước đó (chỉ những suất diễn được tạo trước suất hiện tại)
  const currentPerformanceIndex = performances.findIndex(p => p.id === currentPerformanceId);
  const availablePerformances = performances.filter((_, index) => index < currentPerformanceIndex && performances[index].ticketTypes.length > 0);

  // Lấy suất diễn đã chọn
  const selectedPerformance = availablePerformances.find(p => p.id === selectedPerformanceId);

  const handlePerformanceSelect = (performanceId: number) => {
    setSelectedPerformanceId(performanceId);
    setSelectedTicketIds([]); // Reset ticket selection
    setShowDropdown(false);
  };

  const handleTicketToggle = (ticketId: number) => {
    setSelectedTicketIds(prev => 
      prev.includes(ticketId) 
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const handleCopy = () => {
    if (selectedTicketIds.length > 0) {
      onCopy(selectedTicketIds);
      setSelectedPerformanceId(null);
      setSelectedTicketIds([]);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-white text-lg font-semibold">Copy loại vé từ</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {availablePerformances.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">
              Không có suất diễn nào trước đó để copy vé
            </p>
          ) : (
            <>
              {/* Dropdown chọn suất diễn */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Chọn suất diễn
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
                  >
                    <span>
                      {selectedPerformance 
                        ? `${new Date(selectedPerformance.start_time).toLocaleDateString('vi-VN')} ${new Date(selectedPerformance.start_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })}`
                        : "--- Chọn suất diễn ---"
                      }
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {showDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-48 overflow-y-auto">
                      {availablePerformances.map((perf) => {
                        const startDate = new Date(perf.start_time);
                        return (
                          <button
                            key={perf.id}
                            onClick={() => handlePerformanceSelect(perf.id!)}
                            className="w-full text-left px-3 py-2 text-white hover:bg-gray-600"
                          >
                            {startDate.toLocaleDateString('vi-VN')} {startDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })}
                            <span className="text-gray-400 text-sm ml-2">({perf.ticketTypes.length} vé)</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Danh sách vé của suất diễn đã chọn */}
              {selectedPerformance && (
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Chọn vé muốn copy
                  </label>
                  <div className="space-y-2">
                    {selectedPerformance.ticketTypes.map((ticket) => (
                      <label
                        key={ticket.id}
                        className="flex items-center gap-3 p-3 bg-gray-700 rounded-md cursor-pointer hover:bg-gray-600"
                      >
                        <input
                          type="checkbox"
                          checked={selectedTicketIds.includes(ticket.id!)}
                          onChange={() => handleTicketToggle(ticket.id!)}
                          className="w-4 h-4 text-green-500 bg-gray-700 border-gray-600 focus:ring-green-500"
                        />
                        <div className="flex-1">
                          <div className="text-white font-medium">{ticket.name}</div>
                          <div className="text-gray-300 text-sm">
                            {ticket.is_free ? 'Miễn phí' : `${ticket.price.toLocaleString()} VNĐ`} - {ticket.total_ticket} vé
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500"
          >
            Hủy
          </button>
          <button
            onClick={handleCopy}
            disabled={selectedTicketIds.length === 0}
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            Copy ({selectedTicketIds.length})
          </button>
        </div>
      </div>
    </div>
  );
}
