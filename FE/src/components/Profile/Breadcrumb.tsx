'use client';
import { RightOutlined } from '@ant-design/icons';
import Link from 'next/link';

type BreadcrumbProps = {
  title: 'Vé của tôi' | 'Cài đặt tài khoản';
  page: string;
  ticketDetail?: boolean;
};

export default function Breadcrumb({ title, page, ticketDetail = false }: BreadcrumbProps) {
  const isUser = page === 'myUser';

  const inactive = 'text-[rgb(166,166,176)]';
  const active = 'text-[rgb(235,235,240)]';

  const link = isUser ? '/my-account/my-profile' : '/my-wallet';

  return (
    <div className="hidden md:flex md:flex-row md:items-center md:justify-start pt-4 pb-4 md:gap-2">
      <Link href='/' className="cursor-pointer text-[rgb(166,166,176)] font-normal text-xs leading-[21px]">
        Trang chủ
      </Link>

      <RightOutlined className={`w-3 h-2 ${isUser ? inactive : active}`} />
      <Link href={link} className={`${isUser ? inactive : active} font-normal text-xs leading-[21px]`}>
        {title}
      </Link>
      {
        ticketDetail && (
          <>
            <RightOutlined className={`w-3 h-2 ${isUser ? inactive : active}`} />
            <span className={`${isUser ? inactive : active} font-normal text-xs leading-[21px]`}>
              Chi tiết vé
            </span>
          </>
        )
      }

      {isUser && (
        <>
          <RightOutlined className="w-3 h-2 text-white" />
          <span className={`${active} font-normal text-xs leading-[21px]`}>
            Thông tin tài khoản
          </span>
        </>
      )}
    </div>
  );
}
