/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosPublic from "../config/axiosPublic";


export const getTicketsByShowApi = async (showId: any) => {
    const res = await axiosPublic.get(`/events/showings/${showId}`);
    return res.data;
}