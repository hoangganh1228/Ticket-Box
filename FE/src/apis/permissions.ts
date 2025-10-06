import axiosInstance from "@/src/config/interceptor";

export const getAllPermissions = async () => {
    const response = await axiosInstance.get('/permissions');
    return response.data;
}