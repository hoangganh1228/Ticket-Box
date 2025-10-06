/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/src/config/interceptor";

export const updateProfile = async (payload : any) => {
    const res = await axiosInstance.patch(`users/update-profile`,payload, {
    });
    return res.data;
}