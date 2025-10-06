'use client';
import Breadcrumb from "@/src/components/Profile/Breadcrumb";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Table, Skeleton } from 'antd';
import Image from "next/image";
import { formatPrice } from "@/src/helpers/format.helper";
import { getOrderElectronicTicket } from "@/src/apis/order";
import moment from "moment";
import { getTextOrderStatus } from "@/src/helpers/orderFormat";
import Link from "next/link";
import EventSkeleton from "@/src/components/Commom/EventSkeleton";
import { Order } from "@/src/utils/interfaces/order.interface";
import { toast } from "react-toastify";
import { openLogin } from "@/src/redux/store/headerSlice";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

const columns = [
    {
        title: 'Ngày tạo đơn',
        dataIndex: 'createdDate',
        key: 'createdDate',
    },
    {
        title: 'Phương thức thanh toán',
        dataIndex: 'paymentMethod',
        key: 'paymentMethod',
    },
    {
        title: 'Tình trạng đơn hàng',
        dataIndex: 'orderStatus',
        key: 'orderStatus',
    },
];

const columnsUser = [
    {
        title: "Thông tin",
        dataIndex: "label",
        key: "label",
        width: "30%",
    },
    {
        title: "Chi tiết",
        dataIndex: "value",
        key: "value",
    },
];
const columnsTicket = [
    {
        title: "Loại vé",
        dataIndex: "type",
        key: "type",
        render: (type) => (
            <div>
                <span className="text-gray-40 fw-500">{type.name}</span>
                <br />
                <span className="text-gray-50 fw-400">{type.price}</span>
            </div>
        ),
    },
    {
        title: "Số lượng",
        dataIndex: "quantity",
        key: "quantity",
    },
    {
        title: "Thành tiền",
        dataIndex: "total",
        key: "total",
    },
];
export default function Page() {
    const userLogined = useSelector((state) => state.auth.user);
    const pathname = usePathname();
    const [dataOrder, setDataOrder] = useState<Order>();
    const [loading, setLoading] = useState(false);
    const { orderCode } = useParams() as { orderCode: string };
    const { event, orderItems, user, payments } = dataOrder || {};
    const router = useRouter();
    const dispatch = useDispatch();
    const getDataOrder = async () => {
        try {
            setLoading(true);
            const { data } = await getOrderElectronicTicket(orderCode);
            setDataOrder(data);
        }
        catch (error) {
            toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau");
            console.error("Error fetching order data:", error);
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        getDataOrder();
    }, [orderCode]);

    const [page, setPage] = useState<'myUser' | 'myTickets'>('myUser');

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
    const dataSourceUser = [
        {
            key: "1",
            label: "Tên",
            value: user?.username,
        },
        {
            key: "2",
            label: "Email",
            value: user?.email,
        },
    ];
    const data = [
        {
            key: '1',
            createdDate: moment(dataOrder?.createdAt).format('DD [tháng] MM, YYYY'),
            paymentMethod: payments?.[0]?.provider,
            orderStatus: getTextOrderStatus(dataOrder?.status)?.text,
        },
    ];
    const dataSourceTicket = orderItems?.map((item, index) => ({
        key: index,
        type: {
            name: item?.ticket?.name,
            price: item?.unit_price ? formatPrice(item?.unit_price) : '0 đ',
        },
        quantity: item?.quantity,
        total: item?.total_price ? formatPrice(item?.total_price) : '0 đ',
    }));
    if (!userLogined) {
        dispatch(openLogin());
        router.push('/');
        toast.info('Vui lòng đăng nhập để tiếp tục!');
        return null;
    }

    return <div className="bg-[#27272a] text-white xl:max-w-[1280px] xl:pl-4 sm:max-w-[100vw] sm:px-2 md:px-3 mx-auto relative box-border">
        <Breadcrumb
            title={page === 'myTickets' ? 'Vé của tôi' : 'Cài đặt tài khoản'}
            page={page}
            ticketDetail={true}
        />
        <div>
            <div className="rounded-[12px] p-5 relative bg-[#515158] my-4 mx-auto lg-max-w-[60%] sm:max-w-[70%] box-border">
                <div className="text-sm not-italic font-bold mb-4 whitespace-nowrap overflow-hidden text-ellipsis text-white">
                    <Link href={`/${event?.settings?.[0]?.link}-${event?.id}`}>
                        {event?.name}
                    </Link>
                </div>
                <Link href={`/${event?.settings?.[0]?.link}-${event?.id}`}>
                    {
                        loading ? <EventSkeleton count={1} type="full" /> :
                            <img src={event?.banner} width="100%" className="cursor-pointer max-h-[500px] object-cover object-center rounded-md"></img>
                    }
                </Link>
                <div>
                    <div className="relative block box-border select-none touch-pan-y [ -webkit-tap-highlight-color:transparent ]">
                        <div className="relative overflow-hidden block m-0 p-0 [transform:translate3d(0,0,0)]">
                            <div className=" opacity-100 [transform:translate3d(0,0,0)] relative left-0 top-0 block mx-auto">
                                <div className="outline-none  float-left h-full min-h-[1px] block px-1 w-full">
                                    <div>
                                        <div className="flex flex-row justify-between items-center mt-4 w-full">
                                            <div className="w-3/5 flex flex-col gap-4">
                                                <div className="flex flex-col gap-[0.4rem]">
                                                    <span className="text-[12px] text-white font-normal">Loại vé</span>
                                                    {
                                                        loading ? <Skeleton
                                                            active
                                                            title={{ width: '80%' }}
                                                            paragraph={{ rows: 2, width: ['100%', '60%'] }}
                                                        /> : <>
                                                            {orderItems?.map((item, index) => (
                                                                <div key={index} className="flex gap-2">
                                                                    <span className="text-[14px] text-[#2dc275] font-semibold">{item?.ticket?.name}</span>
                                                                    <span className="text-[12px]">x{item?.quantity}</span>
                                                                </div>
                                                            ))}
                                                        </>
                                                    }
                                                </div>
                                                <div className="gap-2 flex">
                                                </div>
                                                <div className="flex flex-col gap-[0.4rem]">
                                                    <span className="text-[12px] text-white font-normal">Thời gian</span>
                                                    {
                                                        loading ? <Skeleton
                                                            active
                                                            title={{ width: '80%' }}
                                                            paragraph={{ rows: 2, width: ['100%', '60%'] }}
                                                        /> : <>
                                                            {
                                                                orderItems?.map((item, index) => (
                                                                    <div key={index} className="flex gap-2">
                                                                        <span className="text-[14px] text-[#2dc275] font-semibold">
                                                                            <div>{moment(item?.ticket?.start_time).format('HH:mm  DD [tháng] MM, YYYY')} -
                                                                                <br />
                                                                                {moment(item?.ticket?.end_time).format('HH:mm  DD [tháng] MM, YYYY')}</div>
                                                                        </span>
                                                                    </div>

                                                                ))
                                                            }
                                                        </>
                                                    }


                                                </div>
                                            </div>
                                            <div className="w-auto">
                                                <div className="sc-768734fb-0 eFuELz">
                                                    <div className="flex items-center justify-center basis-[40%] p-1 my-2">
                                                        <div className="w-[120px] flex flex-col rounded-lg">
                                                            <Image src="/qr-content.svg" alt="" width={110} height={110} />
                                                            <div className="flex justify-center text-xs">
                                                                <span className="text-[rgb(45,194,117)] break-words leading-[21px] text-xs font-normal text-center">
                                                                    Vui lòng tải app Ticketbox để xem mã QR vé
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
                <div className="bg-[rgb(39,39,42)] w-[calc(100%+2.4rem)] h-[2px] relative -ml-[1.2rem] mt-16">
                    <div className="h-6 w-6 rounded-full bg-[rgb(39,39,42)] absolute -translate-y-1/2 left-[-14px]"></div>
                    <div className="h-6 w-6 rounded-full bg-[rgb(39,39,42)] absolute -translate-y-1/2 right-[-14px]"></div>
                </div>
                <div className="flex flex-col items-start w-full py-[1.2rem]">
                    <div className="flex flex-row text-white gap-2 items-center mb-2">
                        <svg width="16" height="17" viewBox="0 0 16 17" fillRule="inherit" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#ticket-order_svg__clip0_9730_14019)"><path fillRule="evenodd" d="M14.667 10.625v2c0 .736-.597 1.333-1.333 1.333H2.667a1.333 1.333 0 01-1.333-1.333v-2l.585-.586a2 2 0 000-2.828l-.586-.586v-2c0-.737.597-1.333 1.334-1.333h10.666c.737 0 1.334.596 1.334 1.333v2l-.586.586a2 2 0 000 2.828l.586.586zM5.333 7.292c0-.369.299-.667.667-.667h4a.667.667 0 110 1.333H6a.667.667 0 01-.667-.667zm.667 2a.667.667 0 000 1.333h4a.667.667 0 100-1.334H6z" fill="#fff"></path></g><defs><clipPath id="ticket-order_svg__clip0_9730_14019"><path fill="#fff" transform="translate(1.333 1.958)" d="M0 0h13.333v13.333H0z"></path></clipPath></defs></svg>
                        <span className="text-xs font-medium leading-[21px]">Đơn hàng: 246114163</span>
                    </div>
                    <div className="w-full">
                        <Table
                            loading={loading}
                            className='custom-table-ticket'
                            columns={columns}
                            dataSource={data}
                            pagination={false}
                            scroll={{ x: "max-content" }}
                        />
                    </div>

                </div>
                <div className="flex flex-col items-start w-full py-[1.2rem]">
                    <div className="flex flex-row text-white gap-2 items-center mb-2">
                        <svg width="21" height="20" viewBox="0 0 21 20" fillRule="inherit" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#person-circle_svg__clip0_8593_183736)"><path fillRule="evenodd" d="M10.5 0C4.977 0 .5 4.477.5 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm-8 10a8 8 0 1113.81 5.499 6.013 6.013 0 00-2.904-3.75 4 4 0 10-5.811 0 6.013 6.013 0 00-2.906 3.75A7.973 7.973 0 012.5 10zm4 6.93a7.963 7.963 0 004 1.07c1.457 0 2.823-.39 4-1.07a4 4 0 00-8 0zm4-9.93a2 2 0 100 4 2 2 0 000-4z" fill="#fff"></path></g><defs><clipPath id="person-circle_svg__clip0_8593_183736"><path fill="#fff" transform="translate(.5)" d="M0 0h20v20H0z"></path></clipPath></defs></svg>
                        <span className="text-xs font-medium leading-[21px]">Thông tin người mua</span>
                    </div>
                    <div className="w-full">
                        <Table
                            loading={loading}
                            className='custom-table-ticket'
                            dataSource={dataSourceUser}
                            columns={columnsUser}
                            pagination={false}
                            scroll={{ x: "max-content" }}
                        />
                    </div>

                </div>
                <div className="flex flex-col items-start w-full py-[1.2rem]">
                    <div className="flex flex-row text-white gap-2 items-center mb-2">
                        <svg width="16" height="17" viewBox="0 0 16 17" fillRule="inherit" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#receipt-list_svg__clip0_9730_14205)"><path fillRule="evenodd" d="M4 1.958c-.736 0-1.333.597-1.333 1.334v11.333a.667.667 0 001.083.52l1.2-.96.912.911c.24.24.623.262.888.05l1.25-1 1.25 1a.667.667 0 00.888-.05l.912-.911 1.2.96a.667.667 0 001.084-.52V3.292c0-.737-.597-1.334-1.334-1.334H4zm3.334 3.334c0-.369.298-.667.666-.667h2a.667.667 0 110 1.333H8a.667.667 0 01-.666-.666zm.666 2a.667.667 0 100 1.333h2a.667.667 0 100-1.333H8zm-.666 3.333c0-.368.298-.667.666-.667h2a.667.667 0 110 1.334H8a.667.667 0 01-.666-.667zM6 5.958a.667.667 0 100-1.333.667.667 0 000 1.333zm.667 2a.667.667 0 11-1.333 0 .667.667 0 011.333 0zM6 11.292a.667.667 0 100-1.334.667.667 0 000 1.334z" fill="#fff"></path></g><defs><clipPath id="receipt-list_svg__clip0_9730_14205"><path fill="#fff" transform="translate(1.333 1.958)" d="M0 0h13.333v13.333H0z"></path></clipPath></defs></svg>
                        <span className="text-xs font-medium leading-[21px]">Thông tin đơn hàng</span>
                    </div>
                    <div className="w-full">
                        <Table
                            loading={loading}
                            className="custom-table-ticket-order"
                            dataSource={dataSourceTicket}
                            columns={columnsTicket}
                            pagination={false}
                            scroll={{ x: "max-content" }}
                            summary={() => (
                                <>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={2}>Tổng tạm tính</Table.Summary.Cell>
                                        <Table.Summary.Cell index={1} className="text-subtotal">
                                            {formatPrice(dataOrder?.total_amount || 0)}
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={2}>Giảm giá</Table.Summary.Cell>
                                        <Table.Summary.Cell index={1} className="text-subtotal">
                                            {formatPrice(dataOrder?.discount_amount || 0)}
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={2} className="text-bold">
                                            Tổng tiền
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell
                                            index={1}
                                            className="text-green text-bold"
                                        >
                                            {formatPrice(dataOrder?.final_amount || 0)}
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                </>
                            )}
                        />
                    </div>

                </div>
            </div>

        </div>
    </div>;
}