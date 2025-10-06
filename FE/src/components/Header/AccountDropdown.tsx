// components/Header/AccountDropdown.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DownOutlined,
  UserOutlined,
  WalletOutlined,
  LogoutOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { logout } from "@/src/redux/store/authSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/src/apis/auth";

export default function AccountDropdown(props: any) {

  const { user } = props;

  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handlelogout = async () => {
    await logoutUser();
    dispatch(logout());
    toast.success('Đăng Xuất thành công');
    router.push('/');
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex items-center space-x-2 p-2 rounded-md hover:bg-green-700 transition-colors duration-200">
        <UserOutlined className="text-xl" />
        <span className="whitespace-nowrap">{user?.email}</span>
        <DownOutlined
          className={`transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"
            }`}
        />
      </button>

      {/* Invisible bridge to fix hover gap */}
      <div className="absolute top-full left-0 right-0 h-2"></div>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-md shadow-lg py-1 z-50 text-gray-800">
          <Link
            href="/my-wallet"
            className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100"
          >
            <WalletOutlined className="text-lg" />
            <span>Vé của tôi</span>
          </Link>
          <Link
            href="/organizer/events"
            className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100"
          >
            <CalendarOutlined className="text-lg" />
            <span>Sự kiện của tôi</span>
          </Link>
          <Link
            href="/my-account/my-profile"
            className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100"
          >
            <UserOutlined className="text-lg" />
            <span>Tài khoản của tôi</span>
          </Link>
          <button className="w-full text-left flex items-center space-x-2 px-4 py-2 hover:bg-gray-100">
            <LogoutOutlined className="text-lg" />
            <span
              onClick={handlelogout}
            >Đăng xuất</span>
          </button>
        </div>
      )}
    </div>
  );
}
