import axiosInstance from "@/src/config/interceptor";
import {RegisterUser} from "@/src/utils/interfaces/auth.interface";
import {UpdateUser} from "@/src/utils/interfaces/user.interface";

export const getUsers = async () => {
    const response = await axiosInstance.get('/users');
    return response.data;
}
export const createUser = async (data: RegisterUser) => {
    const response = await axiosInstance.post('/users', data);
    return response.data;
}
export const deleteUser = async (id: number) => {
    const response = await axiosInstance.delete(`/users/${id}`);
    return response.data;
}
export const getDetailUser = async (id: number) => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
}
export const updateUser = async (id: number, data: UpdateUser) => {
    const response = await axiosInstance.patch(`/users/${id}`, data);
    return response.data;
}