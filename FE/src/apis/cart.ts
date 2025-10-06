/* eslint-disable @typescript-eslint/no-explicit-any */
// import axiosInstance from "@/src/config/interceptor";
import axiosInstance from "@/src/config/interceptor";


export const createCartApi = async (payload: any) => {
    const response = await axiosInstance.post('/carts/add', payload);
    return response.data;
}

export const fetchCartByBookingCodeApi = async (booking_code: string | null, showId: string) => {
    const response = await axiosInstance.get(`/carts/quote/?booking_code=${booking_code}&show_id=${showId}`);
    return response.data;
}

export const cancelCartApi = async (booking_code: string) => {
    const response = await axiosInstance.delete(`/carts/delete/${booking_code}`);
    return response.data;
}

export const updateCartStepApi = async (booking_code: string | null, showId: string, step: string) => {
    const res = await axiosInstance.patch(`/carts/update-step/?booking_code=${booking_code}&show_id=${showId}`, { step })
    return res.data;
}