'use client';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import AccountSidebar from '@/src/components/Profile/AccountSidebar';
import Breadcrumb from '@/src/components/Profile/Breadcrumb';
import ReactQueryProvider from '@/src/providers/ReactQueryProvider';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [page, setPage] = useState<'myUser' | 'myTickets'>('myUser');

  // Cập nhật tab theo URL
  useEffect(() => {
    if (pathname.includes('my-wallet')) setPage('myTickets');
    else setPage('myUser');
  }, [pathname]);

  // Nền chung
  useEffect(() => {
    const prev = document.body.style.backgroundColor;
    document.body.style.backgroundColor = 'rgb(39,39,42)';
    return () => {
      document.body.style.backgroundColor = prev;
    };
  }, []);

  return (
    <main className="ml-0 bg-[rgb(39,39,42)]">
      <div className="xl:max-w-[1280px] xl:pl-4 sm:max-w-[100vw] sm:px-2 md:px-3 mx-auto relative box-border">
        <Breadcrumb
          title={page === 'myTickets' ? 'Vé của tôi' : 'Cài đặt tài khoản'}
          page={page}
        />
        <div className="flex">
          <AccountSidebar page={page} setPage={setPage} />

          {/* right-col */}
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </div>
      </div>
    </main>
  );
}
