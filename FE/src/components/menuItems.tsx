import { FileText, PieChart, List, CheckCircle, Users, Edit, Map, Gift } from "lucide-react";
import Link from "next/link";
import { useEventId } from "@/src/hooks/useEventId";

export const MenuItemsEventDetail = () => {
    const eventId = useEventId();
    return [
        {
            type: "group",
            label: "Báo cáo",
            children: [
                {
                    key: "summary",
                    icon: <PieChart size={18} />,
                    label: "Tổng kết",
                    href: `/organizer/events/${eventId}/summary`,
                },
                {
                    key: "analysis",
                    icon: <FileText size={18} />,
                    label: "Phân tích",
                    href: `/organizer/events/${eventId}/analysis`,
                },
                {
                    key: "orders",
                    icon: <List size={18} />,
                    label: "Danh sách đơn hàng",
                    href: `/organizer/events/${eventId}/orders`,
                },
                {
                    key: "checkin",
                    icon: <CheckCircle size={18} />,
                    label: "Check-in",
                    href: `/organizer/events/${eventId}/checkin`,
                },
            ],
        },
        {
            type: "group",
            label: "Cài đặt sự kiện",
            children: [
                {
                    key: "members",
                    icon: <Users size={18} />,
                    label: "Thành viên",
                    href: `/organizer/events/${eventId}/member`,
                },
                {
                    key: "edit",
                    icon: <Edit size={18} />,
                    label: "Chỉnh sửa",
                    href: `/organizer/events/${eventId}/edit-event?step=info`,
                },
                {
                    key: "seatmap",
                    icon: <Map size={18} />,
                    label: "Sơ đồ ghế",
                    href: `/organizer/events/${eventId}/seatmap`,
                },
            ],
        },
        {
            type: "group",
            label: "Marketing",
            children: [
                {
                    key: "voucher",
                    icon: <Gift size={18} />,
                    label: "Voucher",
                    href: `/organizer/events/${eventId}/voucher`,
                },
            ],
        },
    ];
}


export const menuItems = [
    {
        key: '1',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
            className="ant-menu-item-icon">
            <g clipPath="url(#Calendar-star_svg__a)">
                <path fill="#fff" fillRule="evenodd"
                    d="M8 2a1 1 0 0 1 1 1v1h6V3a1 1 0 1 1 2 0v1h1a4 4 0 0 1 4 4v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a4 4 0 0 1 4-4h1V3a1 1 0 0 1 1-1m4.514 8.32a.573.573 0 0 0-1.028 0l-.792 1.604a.57.57 0 0 1-.432.314l-1.77.257a.573.573 0 0 0-.318.978l1.281 1.25a.57.57 0 0 1 .165.506l-.302 1.764a.573.573 0 0 0 .831.605l1.584-.833a.57.57 0 0 1 .534 0l1.584.832a.573.573 0 0 0 .831-.604l-.302-1.763a.57.57 0 0 1 .165-.508l1.281-1.249a.573.573 0 0 0-.318-.978l-1.77-.257a.57.57 0 0 1-.432-.314z"
                    clipRule="evenodd"></path>
            </g>
            <defs>
                <clipPath id="Calendar-star_svg__a">
                    <path fill="#fff" d="M2 2h20v20H2z"></path>
                </clipPath>
            </defs>
        </svg>,
        label: <Link href='/organizer/events' className="font-medium text-sm">Sự kiện của tôi</Link>,
        className: 'hover:bg-green-500/10 transition-colors duration-200 py-6 ',
    },
    {
        key: '2',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
            className="ant-menu-item-icon">
            <g clipPath="url(#folder_svg__a)">
                <path fill="#fff"
                    d="M20 6.375a2 2 0 0 1 2 2V19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.36a1 1 0 0 1 .711.297l2.747 2.78a1 1 0 0 0 .711.298z"></path>
            </g>
            <defs>
                <clipPath id="folder_svg__a">
                    <path fill="#fff" d="M2 2h20v20H2z"></path>
                </clipPath>
            </defs>
        </svg>,
        label: <Link href='/organizer/export-file' className="font-medium text-sm">Quản lý báo cáo</Link>,
        className: 'hover:bg-green-500/10 transition-colors duration-200 py-6',
    },
    {
        key: '3',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
            className="ant-menu-item-icon">
            <g clipPath="url(#book-icon_svg__a)">
                <path
                    fill="#fff"
                    fillRule="evenodd"
                    d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm2 9a1 1 0 1 0 0 2h8a1 1 0 0 0 0-2zm-1 5a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1m1-9a1 1 0 0 0 0 2h8a1 1 0 1 0 0-2z"
                    clipRule="evenodd"
                />
            </g>
            <defs>
                <clipPath id="book-icon_svg__a">
                    <path fill="#fff" d="M2 2h20v20H2z"></path>
                </clipPath>
            </defs>
        </svg>,
        label: <Link href='/organizer/legal-document' className="font-medium text-sm">Điều khoản cho Ban tổ
            chức</Link>,
        className: 'hover:bg-green-500/10 transition-colors duration-200 py-6',
    },
];
export const menuItemsDashboard = [
    {
        key: '1',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
            className="ant-menu-item-icon">
            <g clipPath="url(#Calendar-star_svg__a)">
                <path fill="#fff" fillRule="evenodd"
                    d="M8 2a1 1 0 0 1 1 1v1h6V3a1 1 0 1 1 2 0v1h1a4 4 0 0 1 4 4v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a4 4 0 0 1 4-4h1V3a1 1 0 0 1 1-1m4.514 8.32a.573.573 0 0 0-1.028 0l-.792 1.604a.57.57 0 0 1-.432.314l-1.77.257a.573.573 0 0 0-.318.978l1.281 1.25a.57.57 0 0 1 .165.506l-.302 1.764a.573.573 0 0 0 .831.605l1.584-.833a.57.57 0 0 1 .534 0l1.584.832a.573.573 0 0 0 .831-.604l-.302-1.763a.57.57 0 0 1 .165-.508l1.281-1.249a.573.573 0 0 0-.318-.978l-1.77-.257a.57.57 0 0 1-.432-.314z"
                    clipRule="evenodd"></path>
            </g>
            <defs>
                <clipPath id="Calendar-star_svg__a">
                    <path fill="#fff" d="M2 2h20v20H2z"></path>
                </clipPath>
            </defs>
        </svg>,
        label: <Link href='/dashboard/event/permission' className="font-medium text-sm">Phân quyền sự kiện</Link>,
        className: 'hover:bg-green-500/10 transition-colors duration-200 py-6 ',
    },
    {
        key: '2',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
            className="ant-menu-item-icon">
            <g clipPath="url(#folder_svg__a)">
                <path fill="#fff"
                    d="M20 6.375a2 2 0 0 1 2 2V19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.36a1 1 0 0 1 .711.297l2.747 2.78a1 1 0 0 0 .711.298z"></path>
            </g>
            <defs>
                <clipPath id="folder_svg__a">
                    <path fill="#fff" d="M2 2h20v20H2z"></path>
                </clipPath>
            </defs>
        </svg>,
        label: <Link href='/dashboard/system/permission' className="font-medium text-sm">Phân quyền hệ thống</Link>,
        className: 'hover:bg-green-500/10 transition-colors duration-200 py-6',
    }
];