// components/Header.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// Ant Design Icons
import {
  // DownOutlined,
  // UserOutlined,
  WalletOutlined,
  // LogoutOutlined,
  // CalendarOutlined,
} from '@ant-design/icons';
import { fetchAllCategoryApi } from '@/src/apis/category';
import BottomNav from '../Home/BottomNav';
import Logo from '../Header/Logo';
import SearchBar from '../Header/SearchBar';
import AccountDropdown from '../Header/AccountDropdown';
import LanguageDropdown from '../Header/LanguageDropdown';
import { usePathname } from 'next/navigation';
import Login from '../Header/Login';
import Register from '../Header/Register';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/redux/store/store';
import {
  closeLogin,
  closeRegister,
  openLogin,
  openRegister,
} from '@/src/redux/store/headerSlice';

export default function Header() {
  const [categories, setCategories] = useState([]);
  const pathname = usePathname();
  const { showLogin, showRegister } = useSelector(
    (state: RootState) => state.header
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch();

  const hiddenPaths = [
    '/search',
    '/events',
    '/my-wallet',
    '/my-account',
    '/auth',
  ];
  const hideBottomNav = hiddenPaths.some((path) => pathname.startsWith(path));

  const hiddenTopNavPaths = ['/events', '/auth'];
  const hideTopNav = hiddenTopNavPaths.includes(pathname);

  useEffect(() => {
    async function fetchAllCategory() {
      try {
        const res = await fetchAllCategoryApi();
        setCategories(res?.data);
      } catch (error) {
        console.error('Lỗi khi fetchAllCategory', error);
      }
    }
    fetchAllCategory();
  }, []);

  function handlecloseLogin() {
    dispatch(closeLogin());
  }

  function handlecloseRegister() {
    dispatch(closeRegister());
  }

  return (
    <header>
      {!hideTopNav && (
        <div className="bg-primary text-white shadow-md h-[76px]">
          <div className="container mx-auto px-4 py-4 max-w-7xl">
            {/* Desktop Layout (lg+) */}
            <div className="hidden lg:flex items-center justify-between">
              {/* Left: Logo */}
              <Logo size="lg" />

              {/* Center: Search Bar with Button */}
              <SearchBar categories={categories} />

              {/* Right: User and Language Actions */}
              <div className="flex items-center space-x-2">
                <Link href="/organizer/create-event">
                  <button className="px-2 py-1 rounded-full border-2 border-white text-white font-medium hover:bg-white hover:text-green-600 transition-colors duration-200 whitespace-nowrap">
                    Tạo sự kiện
                  </button>
                </Link>

                {user && (
                  <Link
                    href="/my-wallet"
                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-green-700 transition-colors duration-200"
                  >
                    <WalletOutlined className="text-sm" />
                    <span className="whitespace-nowrap">Vé của tôi</span>
                  </Link>
                )}

                {!user && (
                  <div className="inline whitespace-nowrap text-sm cursor-pointer text-white">
                    <span onClick={() => dispatch(openLogin())}>
                      Đăng nhập |
                    </span>
                    <span
                      className="pl-1"
                      onClick={() => dispatch(openRegister())}
                    >
                      Đăng Ký
                    </span>
                  </div>
                )}

                {user && <AccountDropdown user={user} />}

                {/* Language Dropdown - Fixed hover issue */}
                <LanguageDropdown />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Top Header Section */}

      {/* Bottom Navigation Section */}
      {!hideBottomNav && <BottomNav categories={categories} />}

      {showLogin && (
        <Login
          onClose={handlecloseLogin}
          onOpen={() => dispatch(openRegister())}
        />
      )}
      {showRegister && (
        <Register
          onClose={handlecloseRegister}
          onOpen={() => dispatch(openLogin())}
        />
      )}
    </header>
  );
}
