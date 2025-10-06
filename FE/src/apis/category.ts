import axiosPublic from "../config/axiosPublic";

export const fetchAllCategoryApi = async () => {
    const response = await axiosPublic.get('/categories');
    return response.data;
}