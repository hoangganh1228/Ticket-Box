import axiosInstance from '@/src/config/interceptor';

export const getTicketByIdApi = async (ticketId: number | string) => {
  const res = await axiosInstance.get(`/tickets/${ticketId}`);
  return res.data;
};
