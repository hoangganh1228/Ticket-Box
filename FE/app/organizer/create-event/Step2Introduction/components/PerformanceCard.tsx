import React from "react";
import { ChevronUp, ChevronDown, Plus, X, Edit, Trash2 } from "lucide-react";
import type { Performance } from "../types";

type Props = {
  perf: Performance;
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
  onUpdate: (id: number, updates: Partial<Performance>) => void;
  onCreateTicket: (performanceId: number) => void;
  onRemoveTicket: (performanceId: number, ticketId: number) => void;
  onEditTicket?: (performanceId: number, ticketId: number) => void;
  onCopyTicket?: (performanceId: number) => void;
};

function PerformanceCardBase({ 
  perf, 
  onToggle, 
  onRemove, 
  onUpdate, 
  onCreateTicket, 
  onRemoveTicket,
  onEditTicket,
  onCopyTicket
}: Props) {
  const handleStartTimeChange = (value: string) => {
    onUpdate(perf.id!, { start_time: value });
  };

  const handleEndTimeChange = (value: string) => {
    onUpdate(perf.id!, { end_time: value });
  };

  return (
    <div className="bg-gray-800 rounded-lg">
      {/* Header */}
      <div
        onClick={() => onToggle(perf.id!)}
        className="w-full flex items-center justify-between p-4 cursor-pointer"
        role="button"
        aria-expanded={perf.isOpen}
      >
        <div className="flex items-center">
          {perf.isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-600 mr-3" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600 mr-3" />
          )}
          <span className="text-white font-medium">
            {perf.start_time ? new Date(perf.start_time).toLocaleDateString('vi-VN') : 'Ngày sự kiện'}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(perf.id!);
          }}
          className="text-gray-400 hover:text-white"
          aria-label="Xoá suất diễn"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {perf.isOpen && (
        <div className="px-4 pb-4 border-t border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                <span className="text-red-500">*</span> Thời gian bắt đầu
              </label>
              <input
                type="datetime-local"
                value={perf.start_time ? perf.start_time.slice(0, 16) : ""}
                onChange={(e) => handleStartTimeChange(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                <span className="text-red-500">*</span> Thời gian kết thúc
              </label>
              <input
                type="datetime-local"
                value={perf.end_time ? perf.end_time.slice(0, 16) : ""}
                onChange={(e) => handleEndTimeChange(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-medium">
                <span className="text-red-500">*</span> Loại vé ({perf.ticketTypes.length})
              </h4>
            </div>

            {/* Display existing tickets */}
            {perf.ticketTypes.length > 0 && (
              <div className="space-y-3 mb-4">
                {perf.ticketTypes.map((ticket) => (
                  <div key={ticket.id} className="bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{ticket.name}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEditTicket?.(perf.id!, ticket.id!)}
                          className="p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded"
                          aria-label="Chỉnh sửa vé"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onRemoveTicket(perf.id!, ticket.id!)}
                          className="p-1 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded"
                          aria-label="Xoá vé"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Hiển thị nút Copy ở tất cả suất diễn */}
            <button 
              onClick={() => onCopyTicket?.(perf.id!)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mb-4 text-sm"
            >
              Copy loại vé từ
            </button>

            <button 
              onClick={() => onCreateTicket(perf.id!)} 
              className="flex items-center text-green-500 hover:text-green-400"
            >
              <Plus className="w-5 h-5 mr-2" />
              Tạo loại vé mới
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(PerformanceCardBase);