import React, { useEffect } from "react";
import { Users, User, Mail } from 'lucide-react';
import { CLIENT_URL } from "@/src/utils/const/config.const";

interface Step3OrganizerProps {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  type: string;
  setType: React.Dispatch<React.SetStateAction<string>>;
  link: string;
  setLink: React.Dispatch<React.SetStateAction<string>>;
  eventName: string;
  eventId: string | number;
  initialUrl?: string;
}

// New: slugify tên sự kiện
const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[\s\W-]+/g, '-').replace(/^-+|-+$/g, '');

export default function Step3Organizer({
  message,
  setMessage,
  type,
  setType,
  link,
  setLink,
  eventName,
  eventId,
  initialUrl
}: Step3OrganizerProps) {
  
  
  useEffect(() => {
    if (!link && eventName) {
      const newSlug = slugify(eventName);
      setLink(newSlug);
    }
  }, [eventName, link, setLink]);


  const computedUrl = `${CLIENT_URL}/${link ? `${link}-${eventId}` : ''}`;
  const fullUrl = (initialUrl) ? initialUrl : computedUrl;

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-6">
      <div>
        <h3 className="text-white text-lg font-semibold mb-4">Cấu hình đường dẫn sự kiện</h3>

        {/* Slug editable */}
        <label className="block text-gray-300 text-sm font-medium mb-2">
          <span className="text-red-500">*</span> Link sự kiện (slug)
        </label>
        <input
          type="text"
          value={link}
          onChange={(e) => { setLink(slugify(e.target.value)); }}
          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="vi-du-su-kien"
        />
        <p className="text-gray-400 text-xs mt-1">Chỉ gồm chữ thường, số và dấu -</p>
        <label className="block text-gray-300 text-sm font-medium mt-4 mb-2">Đường dẫn đầy đủ</label>
        <input
          type="text"
          readOnly
          value={fullUrl}
          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none"
        />
      </div>

      <div>
        <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
          <div className="w-5 h-5 border border-gray-400 rounded mr-3"></div>
          Quyền riêng tư sự kiện
        </h3>

        <div className="space-y-3">
          <label className="flex items-start cursor-pointer">
            <input
              type="radio"
              name="privacy"
              value="public"
              checked={type === 'public'}
              onChange={(e) => setType(e.target.value)}
              className="w-4 h-4 text-green-500 bg-gray-700 border-gray-600 focus:ring-green-500 mt-1"
            />
            <div className="ml-3">
              <div className="flex items-center mb-1">
                <Users className="w-5 h-5 text-white mr-2" />
                <span className="text-white font-medium">Sự kiện mở cho mọi người</span>
              </div>
              <p className="text-gray-300 text-sm">Tất cả mọi người đều có thể đặt vé</p>
            </div>
          </label>

          <label className="flex items-start cursor-pointer">
            <input
              type="radio"
              name="privacy"
              value="private_link"
              checked={type === 'private_link'}
              onChange={(e) => setType(e.target.value)}
              className="w-4 h-4 text-green-500 bg-gray-700 border-gray-600 focus:ring-green-500 mt-1"
            />
            <div className="ml-3">
              <div className="flex items-center mb-1">
                <User className="w-5 h-5 text-white mr-2" />
                <span className="text-white font-medium">Sự kiện dành riêng cho 1 nhóm</span>
              </div>
              <p className="text-gray-300 text-sm">Chỉ người có link mới đặt được vé</p>
            </div>
          </label>
        </div>
      </div>

      {/* New: Tin nhắn xác nhận (message) */}
      <div>
        <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
          <Mail className="w-5 h-5 text-white mr-3" />
          Tin nhắn xác nhận cho người tham gia
        </h3>

        <p className="text-gray-300 text-sm mb-4">
          Tin nhắn xác nhận này sẽ được gửi đến cho người tham gia sau khi đặt vé thành công
        </p>

        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={8}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Nhập tin nhắn xác nhận..."
          />
          <div className="text-right text-xs text-gray-400 mt-1">{message.length} / 500</div>
        </div>
      </div>
    </div>
  );
}
