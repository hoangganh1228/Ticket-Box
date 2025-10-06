'use client';
import {
  UserOutlined,
  WalletOutlined,
  RedEnvelopeOutlined,
} from '@ant-design/icons';
import { ticketTitle } from '@/src/ui/myTicket';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { SERVER_URL } from '@/src/utils/const/config.const';

interface SidebarProps {
  page: 'myUser' | 'myTickets';
  setPage: (value: 'myUser' | 'myTickets') => void;
}

export default function AccountSidebar({ page, setPage }: SidebarProps) {
  const user = useSelector((state) => state.auth.user);
  return (
    <nav className="hidden w-[270px] md:block">
      <div className="flex gap-[18px] items-center justify-center">
        <div>
          {
            user.avatar ? <>
              <img
                src={`${SERVER_URL}${user.avatar}`}
                alt="User Avatar"
                className="border-none rounded-[50%] w-[34px] h-[34px] object-cover "
              />
            </> : <div>
              <img
                src="https://static.ticketbox.vn/avatar.png"
                alt="image"
                className="border-none rounded-[50%] w-[34px] h-[34px] object-cover"
              />
            </div>
          }
        </div>

        <div className="flex flex-col gap-[5px] text-white">
          <span className={ticketTitle()}>Tài khoản của</span>
          <span className={ticketTitle()}>{user?.username}</span>
        </div>
      </div>
      <ul className="m-0 py-4 list-none">
        <Link href={`/my-account/my-profile`} >
          <li
            className={`w-full flex items-start pl-4 font-normal text-sm leading-5 ${page === 'myUser' ? 'text-primary' : 'text-white'
              } `}
          >
            <div className="cursor-pointer flex items-center py-2 px-4 ">
              <UserOutlined className="fill-none w-6 h-6 mr-1" />
              <span className={ticketTitle()}>Cài đặt tài khoản</span>
            </div>
          </li>
          <ul className="list-none pl-8">
            <li
              className={`w-full flex items-start pl-4 font-normal text-sm leading-5 ${page === 'myUser' ? 'text-primary' : 'text-white'
                } `}
            >
              <div className="cursor-pointer py-2 px-4 ">
                <span className={ticketTitle()}>Thông tin tài khoản</span>
              </div>
            </li>
          </ul>
        </Link>
        <Link href={`/my-wallet`} >
          <li
            className={` w-full flex pl-4 text-sm leading-5 ${page === 'myTickets' ? 'text-primary' : 'text-white'
              } `}
          >
            <div className="cursor-pointer flex items-center py-2 px-4">
              <WalletOutlined className="w-6 h-6 fill-none mr-1" />
              <span className={ticketTitle()}>Vé của tôi</span>
            </div>
          </li>
        </Link>
        <div>
          <Link href='/organizer/events'>
            <li className="w-full flex pl-4 text-sm leading-5 text-white">
              <div className="cursor-pointer flex items-center py-2 px-4">
                <RedEnvelopeOutlined className="w-6 h-6 fill-none" />
                <span className={ticketTitle()}>Sự kiện của tôi</span>
              </div>
            </li>
          </Link>
        </div>
      </ul>
    </nav>
  );
}
