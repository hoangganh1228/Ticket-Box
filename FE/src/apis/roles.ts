import axiosInstance from "@/src/config/interceptor";

export const getAllRoles = async (page: number, limit: number) => {
    const response = await axiosInstance.get('/roles', {params: {page, limit}});
    return response.data;
}
export const updateRole = async (data: { display_name: string }, id: number) => {
    const response = await axiosInstance.put(`/roles/${id}`, data);
    return response.data;
}
export const createRole = async (data: { display_name: string }) => {
    const response = await axiosInstance.post('/roles', data);
    return response.data;
}
export const deleteRole = async (id: number) => {
    const response = await axiosInstance.delete(`roles/${id}`);
    return response.data;
}
export const getRoleById = async (id: string) => {
    const response = await axiosInstance.get(`/roles/${id}`);
    return response.data;
}
export const assignPermissionsToRole = async (roleId: number, permissionIds: number[]) => {
    const response = await axiosInstance.post(`/roles/${roleId}/permissions`, {permissionIds});
    return response.data;
}