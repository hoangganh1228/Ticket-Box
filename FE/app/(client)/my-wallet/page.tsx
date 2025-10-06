"use client";
import React, { useEffect, useState } from "react";
import { Row, Col, Divider, Spin, Button, Pagination } from "antd";
import Link from "next/link";
import { FaLocationDot } from "react-icons/fa6";
import { IoTime } from "react-icons/io5";
import { BsCalendar3EventFill } from "react-icons/bs";
import { getOrderByUser } from "@/src/apis/order";
import { toast } from "react-toastify";
import moment from "moment";
import Image from "next/image";
import AccountSidebar from "@/src/components/Profile/AccountSidebar";
import Breadcrumb from "@/src/components/Profile/Breadcrumb";
import { usePathname } from "next/navigation";
import { getTextOrderStatus } from "@/src/helpers/orderFormat";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { openLogin } from "@/src/redux/store/headerSlice";

export default function MyWalletPage() {
    const user = useSelector((state) => state.auth.user);
    const router = useRouter();
    const [dataOrder, setDataOrder] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionsTime, setActionsTime] = useState<'upcoming' | 'past'>('upcoming');
    const [activeTab, setActiveTab] = useState<'all' | 'success' | 'processing' | 'cancelled'>('all');
    const pathname = usePathname();
    const dispatch = useDispatch();
    const [page, setPage] = useState<'myUser' | 'myTickets'>('myUser');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 0,
    });

    const TabItem = ({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) => (
        <div className="flex flex-col items-center cursor-pointer" onClick={onClick}>
            <span
                className={`${isActive ? 'text-white' : 'text-[#828ba0]'} font-bold text-[14px] select-none`}>{label}</span>
            {isActive && <Divider className="bg-primaryHover h-0.5 rounded mt-1 w-1/2 min-w-0" />}
        </div>
    );
    const handleChangeActiveTab = async (activeTab: string) => {
        setActiveTab(activeTab);
        setPagination((prev) => ({
            ...prev,
            currentPage: 1,
        }))
        if (activeTab === 'success' || activeTab === 'all') {
            setActionsTime('upcoming')
            await fetchData(activeTab, 'upcoming', 1, pagination.limit);
        } else {
            await fetchData(activeTab, '', 1, pagination.limit);
        }

    }
    const handleChangeActionsTime = async (time: 'upcoming' | 'past') => {
        setActionsTime(time);
        setPagination((prev) => ({
            ...prev,
            currentPage: 1,
        }))
        await fetchData(activeTab, time, 1, pagination.limit);
    }
    const fetchData = async (status: string, time: string, currentPage = pagination.currentPage, limit = pagination.limit) => {
        try {
            setLoading(true);

            const payload = {
                status,
                ...(time && { time }),
                page: currentPage,
                limit,
            };


            const response = await getOrderByUser(payload);
            const { data } = response;
            setDataOrder(data.data);
            setPagination((prev) => ({
                ...prev,
                totalItems: data.pagination.totalItems,
                totalPages: data.pagination.totalPages,
            }))
            setLoading(false);
        } catch (e) {
            setLoading(false);
            toast.error('Đã có lỗi xảy ra, vui lòng thử lại sau!');
            console.log(e)
        }

    }
    useEffect(() => {
        fetchData(activeTab, actionsTime, 1, pagination.limit);
    }, [])
    const handlePaginationChange = (page: number, pageSize?: number) => {
        setPagination((prev) => ({
            ...prev,
            currentPage: page,
            limit: pageSize || prev.limit,
        }));
        fetchData(activeTab, actionsTime, page, pageSize || pagination.limit);
    };

    useEffect(() => {
        if (pathname.includes('my-wallet')) setPage('myTickets');
        else setPage('myUser');
    }, [pathname]);
    useEffect(() => {
        const prev = document.body.style.backgroundColor;
        document.body.style.backgroundColor = 'rgb(39,39,42)';
        return () => {
            document.body.style.backgroundColor = prev;
        };
    }, []);
    if (!user) {
        dispatch(openLogin());
        router.push('/');
        toast.info('Vui lòng đăng nhập để tiếp tục!');
        return null;
    }
    return (
        <div className=" bg-[#27272a] text-white xl:max-w-[1280px] xl:pl-4 sm:max-w-[100vw] sm:px-2 md:px-3 mx-auto relative box-border">
            <Breadcrumb
                title={page === 'myTickets' ? 'Vé của tôi' : 'Cài đặt tài khoản'}
                page={page}
            />
            <div className="flex">
                <AccountSidebar page="myTickets" setPage={() => { }} />


                <div className="w-full">
                    <h2 className="text-xl font-semibold mb-4">Vé của tôi</h2>

                    <div className="flex flex-wrap gap-3 mb-6">
                        <button
                            className={`px-5 py-1.5 rounded-full text-sm font-medium ${activeTab === 'all' ? 'bg-green-600 text-white' : 'bg-[#2a2a2d] text-gray-300 hover:bg-[#3a3a3d]'
                                }`}
                            onClick={() => handleChangeActiveTab('all')}
                        >
                            Tất cả
                        </button>
                        <button
                            className={`px-5 py-1.5 rounded-full text-sm ${activeTab === 'success' ? 'bg-green-600 text-white' : 'bg-[#2a2a2d] text-gray-300 hover:bg-[#3a3a3d]'
                                }`}
                            onClick={() => handleChangeActiveTab('success')}
                        >
                            Thành công
                        </button>
                        <button
                            className={`px-5 py-1.5 rounded-full text-sm ${activeTab === 'processing' ? 'bg-green-600 text-white' : 'bg-[#2a2a2d] text-gray-300 hover:bg-[#3a3a3d]'
                                }`}
                            onClick={() => handleChangeActiveTab('processing')}
                        >
                            Đang xử lý
                        </button>
                        <button
                            className={`px-5 py-1.5 rounded-full text-sm ${activeTab === 'cancelled' ? 'bg-green-600 text-white' : 'bg-[#2a2a2d] text-gray-300 hover:bg-[#3a3a3d]'
                                }`}
                            onClick={() => handleChangeActiveTab('cancelled')}
                        >
                            Đã hủy
                        </button>
                    </div>

                    {
                        (activeTab === 'success' || activeTab === 'all') && <div className="flex justify-center gap-6">
                            <TabItem
                                label="Sắp diễn ra"
                                isActive={actionsTime === 'upcoming'}
                                onClick={() => handleChangeActionsTime('upcoming')}
                            />
                            <TabItem
                                label="Đã kết thúc"
                                isActive={actionsTime === 'past'}
                                onClick={() => handleChangeActionsTime('past')}
                            />
                        </div>

                    }


                    <Spin spinning={loading}>
                        <Row gutter={[16, 16]}>
                            {
                                dataOrder.length ? dataOrder.map((item: any, index: number) => {
                                    const date = moment(item?.event?.show?.[0]?.time_start);
                                    return (
                                        <>
                                            <Col xs={24} sm={6} md={6} lg={5}>
                                                <div
                                                    className="flex flex-col items-center justify-center h-full bg-[#515158] rounded-md p-3">
                                                    <span className="text-3xl font-bold">{date.format("DD")}</span>
                                                    <span className="text-sm">Tháng {date.format("MM")}</span>
                                                    <span className="text-xs">{date.format("YYYY")}</span>
                                                </div>
                                            </Col>
                                            <Col xs={24} sm={18} md={18} lg={19}
                                                className="bg-[#515158] p-4 rounded-md">
                                                <h3 className="text-lg font-semibold">
                                                    {item?.event_name}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-2 mt-3">
                                                    <span
                                                        className={`px-3 py-0.5 rounded-full text-base ${getTextOrderStatus(item?.status).className}`}>
                                                        {getTextOrderStatus(item?.status).text}
                                                    </span>
                                                    <span
                                                        className="px-3 py-0.5 bg-[#38383d] rounded-full text-base border-[#2dc275] border text-[#2dc275]">
                                                        <Link href={`/my-wallet/${item?.order_number}`}>
                                                            Vé điện tử
                                                        </Link>
                                                    </span>
                                                </div>

                                                <div className="h-px bg-gray-700 my-4"></div>

                                                <div className="space-y-2 text-sm text-gray-200">
                                                    <p className='flex items-center gap-2 mt-3'>
                                                        <span className="font-medium"><BsCalendar3EventFill /></span>
                                                        <span>{item?.order_number}</span>
                                                    </p>
                                                    <p className='flex items-center gap-2 mt-3'>
                                                        <span className="font-medium"><IoTime /></span>
                                                        <span>{moment(item?.event?.shows?.[0]?.time_start).format("HH:mm, DD [tháng] MM, YYYY")} - {moment(item?.event?.shows?.[0]?.time_end).format("HH:mm, DD [tháng] MM, YYYY")}</span>
                                                    </p>
                                                    <p className='flex items-center gap-2 mt-3'>
                                                        <span className="font-medium"><FaLocationDot /></span>
                                                        <span>
                                                            {item?.event?.street} - {item?.event?.ward} - {item?.event?.district} - {item?.event?.province}
                                                        </span>
                                                    </p>
                                                </div>
                                            </Col>
                                        </>
                                    )
                                }
                                ) : <div className="w-full flex flex-col items-center justify-center py-10">
                                    <Image src="/svgviewer-output.svg" alt="no data" width={200} height={200} />
                                    <div className="text-lg mt-4 mb-6 text-[#afb8c9]">
                                        Bạn chưa có vé nào
                                    </div>
                                    <Link href='/'>
                                        <Button type="primary" size="large"
                                            className="bg-primary font-medium text-xl border-green-600 hover:bg-primaryHover">
                                            Mua vé ngay
                                        </Button>
                                    </Link>

                                </div>
                            }

                        </Row>
                    </Spin>
                </div>
            </div>
            <Pagination
                showSizeChanger
                current={pagination.currentPage}
                total={pagination.totalItems}
                pageSize={pagination.limit}
                onChange={handlePaginationChange}
                pageSizeOptions={['5', '10', '20', '50']}
                align="end"
                className="my-6 flex justify-end"

            />

            <Divider className="bg-white" />
        </div>
    );
}
