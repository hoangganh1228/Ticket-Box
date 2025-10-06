import React from 'react';
import Link from 'next/link';
import { UserOutlined, CalendarOutlined, LogoutOutlined } from '@ant-design/icons';
import { toast } from "react-toastify";
import { setUser } from "@/src/redux/store/userSlice";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from '@/src/redux/store/authSlice';
import { logoutUser } from '@/src/apis/auth';

const PopoverMenuUser = () => {
    const router = useRouter();
    const dispatch = useDispatch()
    const menuItems = [
        { key: 'dashboard', label: 'dashboard', icon: <UserOutlined />, href: '/dashboard' },
        { key: 'tickets', label: 'Vé của tôi', icon: <UserOutlined />, href: '/my-wallet' },
        { key: 'my-events', label: 'Sự kiện của tôi', icon: <CalendarOutlined />, href: '/organizer/events' },
        { key: 'my-account', label: 'Tài khoản của tôi', icon: <UserOutlined />, href: '/account' },
        { key: 'logout', label: 'Đăng xuất', icon: <LogoutOutlined />, href: '#' },
    ];
    const handleLogout = async (e: React.MouseEvent) => {
        try {
            await logoutUser();
            dispatch(logout());
            toast.success('Đăng Xuất thành công');
            router.push('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }

    }
    return (
        <div className="bg-white rounded-md overflow-hidden min-w-[180px]">
            {menuItems.map((item, index) => (
                <Link
                    key={item.key}
                    onClick={(e) => {
                        if (item.key === 'logout') {
                            handleLogout(e);
                        }
                    }}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 hover:bg-gray-400 transition ${index !== menuItems.length - 1 ? 'border-b border-gray-200' : ''
                        }`}
                >
                    <span className="text-gray-700">{item.icon}</span>
                    <span className="text-gray-700">{item.label}</span>
                </Link>
            ))}
        </div>
    );
};

export default PopoverMenuUser;