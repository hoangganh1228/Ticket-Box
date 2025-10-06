import axiosInstance from '@/src/config/interceptor';
import axios from '@/src/config/axios.config'
import { Ticket } from '../utils/interfaces/ticket.interface';
import { OrderItem } from '../utils/interfaces/orderItem.interface';


export interface OrderData {
    bookingId: string;
    orderNumber: string;
    userId: number;
    items: OrderItem[];
    totalAmount: number;
    discountAmount: number;
    finalAmount: number;
    eventId: number;
    status: string; // 'RESERVED' | 'EXPIRED' | ...
    email: string;
    reservedAt: string; // ISO
    expiresAt: string;  // ISO
}

export interface GetOrderResponse {
    success: boolean;
    statusCode: number;
    data: OrderData;
}

export interface ProcessPaymentDto {
    // Tùy backend, giữ mở rộng để không chặt chẽ quá
    method?: string;
    amount?: number;

    [key: string]: unknown;
}

export const getOrderApi = async (orderNumber: string): Promise<GetOrderResponse> => {
    const res = await axiosInstance.get(`/orders/${orderNumber}`);
    return res.data;
};

export const getOrderFromCacheApi = async (orderNumber: string): Promise<GetOrderResponse> => {
    const res = await axiosInstance.get(`/orders/${orderNumber}/cache`);
    return res.data;
};

export const createPaymentApi = async (
    orderNumber: string,
    payload: ProcessPaymentDto
) => {
    const res = await axiosInstance.post(`/orders/${orderNumber}/payment`, payload);
    return res.data?.data;
};

export const cancelOrderApi = async (orderNumber: string) => {
    const res = await axiosInstance.patch(`/orders/${orderNumber}/cancel`);
    return res.data.data;
};
export const getOrderByUser = async (payload: { status: string, time?: string }) => {
    const res = await axiosInstance.get(`/orders/user-orders`, {
        params: payload
    });
    return res.data;
}


export const createOrderApi = async (payload: any) => {
    const res = await axios.post('/orders/create', payload);
    return res.data;
}



//get order success
export async function getOrderStatus(status: string, timeline: 'upcoming' | 'ended') {
    const res = await axiosInstance.get(`/orders?status=${status}&timeline=${timeline}`);
    return res.data;
}
export const getOrderElectronicTicket = async (orderNumber: string) => {
    const res = await axiosInstance.get(`/orders/${orderNumber}/electronic-ticket`);
    return res.data;
}