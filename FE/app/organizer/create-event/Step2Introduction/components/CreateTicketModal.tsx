import { X, Upload } from "lucide-react";
import React from "react";
import type { TicketType } from "../types";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: TicketType) => void;
  editTicket?: TicketType | null; // Vé đang chỉnh sửa (null = tạo mới)
  isEditMode?: boolean;
};

export default function CreateTicketModal({ open, onClose, onSubmit, editTicket, isEditMode }: Props) {
  const [name, setName] = React.useState("");
  const [price, setPrice] = React.useState("0");
  const [is_free, setIsFree] = React.useState(false);
  const [total_ticket, setTotalTicket] = React.useState("10");
  const [min_ticket, setMinTicket] = React.useState("1");
  const [max_ticket, setMaxTicket] = React.useState("10");
  const [start_time, setStartTime] = React.useState("");
  const [end_time, setEndTime] = React.useState("");
  const [description, setDescription] = React.useState("");

  // Cập nhật form khi mở modal edit
  React.useEffect(() => {
    if (open) {
      if (isEditMode && editTicket) {
        // Chế độ chỉnh sửa - điền dữ liệu từ vé hiện tại
        setName(editTicket.name || "");
        setPrice(editTicket.price?.toString() || "0");
        setIsFree(editTicket.is_free || false);
        setTotalTicket(editTicket.total_ticket?.toString() || "10");
        setMinTicket(editTicket.min_ticket?.toString() || "1");
        setMaxTicket(editTicket.max_ticket?.toString() || "10");
        setStartTime(editTicket.start_time || "");
        setEndTime(editTicket.end_time || "");
        setDescription(editTicket.description || "");
      } else {
        // Chế độ tạo mới - form trống
        setName("");
        setPrice("0");
        setIsFree(false);
        setTotalTicket("10");
        setMinTicket("1");
        setMaxTicket("10");
        setStartTime("");
        setEndTime("");
        setDescription("");
      }
    }
  }, [open, isEditMode, editTicket]);

  if (!open) return null;

  const handleSubmit = () => {
    const payload: TicketType = {
      name,
      price: Number(price || 0),
      is_free,
      total_ticket: Number(total_ticket || 0),
      min_ticket: Number(min_ticket || 0),
      max_ticket: Number(max_ticket || 0),
      start_time,
      end_time,
      description,
    };

    // Nếu đang edit thì giữ nguyên ID
    if (isEditMode && editTicket?.id) {
      payload.id = editTicket.id;
    }

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-xl font-semibold">
            {isEditMode ? "Chỉnh sửa vé" : "Tạo loại vé mới"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Đóng">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Tên vé */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              <span className="text-red-500">*</span> Tên vé
            </label>
            <input
              type="text"
              placeholder="Tên vé"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="text-right text-xs text-gray-400 mt-1">{name.length} / 50</div>
          </div>

          {/* Hàng 1 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                <span className="text-red-500">*</span> Giá vé
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <label className="flex items-center text-gray-300 text-sm">
                  <input
                    type="checkbox"
                    checked={is_free}
                    onChange={(e) => setIsFree(e.target.checked)}
                    className="mr-2"
                  />
                  Miễn phí
                </label>
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                <span className="text-red-500">*</span> Tổng số lượng vé
              </label>
              <input
                type="number"
                value={total_ticket}
                onChange={(e) => setTotalTicket(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                <span className="text-red-500">*</span> Số vé tối thiểu/đơn
              </label>
              <input
                type="number"
                value={min_ticket}
                onChange={(e) => setMinTicket(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                <span className="text-red-500">*</span> Số vé tối đa/đơn
              </label>
              <input
                type="number"
                value={max_ticket}
                onChange={(e) => setMaxTicket(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Hàng 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                <span className="text-red-500">*</span> Bắt đầu bán vé
              </label>
              <input
                type="datetime-local"
                value={start_time}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                <span className="text-red-500">*</span> Kết thúc bán vé
              </label>
              <input
                type="datetime-local"
                value={end_time}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Mô tả & Ảnh */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Thông tin vé</label>
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={8}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <div className="text-right text-xs text-gray-400 mt-1">{description.length} / 1000</div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Hình ảnh vé</label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-green-500 transition-colors cursor-pointer h-48 flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-primary rounded-lg mb-4 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <p className="text-gray-300 text-sm mb-1">Thêm</p>
                <p className="text-gray-400 text-xs">1MB</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={handleSubmit} className="bg-green-500 hover:bg-green-600 text-white px-8 py-2 rounded-md font-medium">
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}