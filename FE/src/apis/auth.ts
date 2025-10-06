import { LoginUser, RegisterUser } from "@/src/utils/interfaces/auth.interface";

import axiosPublic from "../config/axiosPublic";

export const registerUser = async (userData: RegisterUser) => {
    const response = await axiosPublic.post('/auth/register', userData);
    return response.data;
}
export const loginUser = async (userData: LoginUser) => {
    const response = await axiosPublic.post('/auth/login', userData);
    return response.data;
}
export const logoutUser = async () => {
    const response = await axiosPublic.post('/auth/logout');
    return response.data;
}
