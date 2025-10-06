'use client';

import { loginSuccess } from '@/src/redux/store/authSlice';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Spin } from 'antd';

export default function AuthGoogle() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get('token');
    const userStr = searchParams.get('user');

    if (accessToken && userStr) {
      const user = JSON.parse(decodeURIComponent(userStr));
      dispatch(loginSuccess({ user }));
      localStorage.setItem('accessToken', accessToken);
      toast.success('Đăng nhập thành công!');
      router.push('/');
    }
  }, [searchParams, router, dispatch]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      <Spin size="large" tip="Đang đăng nhập..." className="text-white" />
    </div>
  );
}
