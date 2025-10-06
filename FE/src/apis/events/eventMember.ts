import axiosInstance from "@/src/config/interceptor";

export const getEventMembers = async (eventId: number, role = 'all', limit: number, page: number) => {
    const response = await axiosInstance.get(`/events/${eventId}/memberships?role=${role}&limit=${limit}&page=${page}`);
    return response.data;
}
export const addEventMember = async (eventId, data) => {
    const response = await axiosInstance.post(`/events/${eventId}/memberships`, data);
    return response.data;
}
export const updateEventMember = async (eventId: number, data: any) => {
    const response = await axiosInstance.put(`/events/${eventId}/memberships`, data);
    return response.data;
}
export const removeEventMember = async (eventId: number, userId: number) => {
    const response = await axiosInstance.delete(`/events/${eventId}/memberships/${userId}`);
    return response.data;
}