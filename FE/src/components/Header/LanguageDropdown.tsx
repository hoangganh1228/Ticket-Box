// components/Header/LanguageDropdown.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { DownOutlined } from "@ant-design/icons";

export default function LanguageDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex items-center space-x-2 p-2 rounded-md hover:bg-green-700 transition-colors duration-200">
        <img
          src="https://flagicons.lipis.dev/flags/4x3/vn.svg"
          alt="Vietnamese Flag"
          className="w-6 h-4"
        />
        <DownOutlined
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      <div className="absolute top-full left-0 right-0 h-2"></div>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50 text-gray-800">
          <Link
            href="#"
            className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100"
          >
            <img
              src="https://flagicons.lipis.dev/flags/4x3/vn.svg"
              alt="Vietnamese Flag"
              className="w-6 h-4"
            />
            <span className="font-bold">Tiếng Việt</span>
          </Link>
          <Link
            href="#"
            className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100"
          >
            <img
              src="https://flagicons.lipis.dev/flags/4x3/gb.svg"
              alt="English Flag"
              className="w-6 h-4"
            />
            <span>English</span>
          </Link>
        </div>
      )}
    </div>
  );
}
