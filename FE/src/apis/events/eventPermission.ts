import axiosInstance from "@/src/config/interceptor";
const END_POINT_ROLE_EVENT = '/event-role/roles';

export const getEventRoles = async () => {
    const response = await axiosInstance.get(END_POINT_ROLE_EVENT);
    return response.data;
}
export const createEventRole = async (data: { display_name: string }) => {
    const response = await axiosInstance.post(END_POINT_ROLE_EVENT, data);
    return response.data;
}
export const updateEventRole = async (data: { display_name: string }, id: number) => {
    const response = await axiosInstance.put(`${END_POINT_ROLE_EVENT}/${id}`, data);
    return response.data;
}
export const deleteEventRole = async (id: number) => {
    const response = await axiosInstance.delete(`${END_POINT_ROLE_EVENT}/${id}`);
    return response.data;
}
export const getEventRoleById = async (id: number) => {
    const response = await axiosInstance.get(`${END_POINT_ROLE_EVENT}/${id}`);
    return response.data;
}
/// permission
export const getEventRolePermissionsByEventRoleId = async (eventRoleId: number) => {
    const response = await axiosInstance.get(`${END_POINT_ROLE_EVENT}/${eventRoleId}/permissions`);
    return response.data;
}
export const getEventPermissions = async () => {
    const response = await axiosInstance.get('/permissions/event');
    return response.data;
}
export const createEventRolePermission = async (eventRoleId: number, permissionIds: number[]) => {
    const response = await axiosInstance.post(`${END_POINT_ROLE_EVENT}/${eventRoleId}/permissions`, { permissionIds });
    return response.data;
}