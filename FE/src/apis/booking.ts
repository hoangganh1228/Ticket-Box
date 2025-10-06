import axiosInstance from '@/src/config/interceptor';

export interface BookingItem {
  ticket_id: number;
  show_id: number;
  quantity: number;
  unit_price: number;
  special_requests?: string | null;
}
export interface CreateBookingDto {
  event_id: number;
  showId: number;
  userId?: number;
  discount_amount?: number;
  items: BookingItem[];
  phone?: string;
  email?: string;
  address?: string;
  note?: string;
}

export interface TTLResponse {
  success: boolean;
  statusCode: number;
  data: {
    orderNumber: string;
    status: 'RESERVED' | 'EXPIRED' | string;
    expiresAt: string;          // ISO
    remainingSeconds: number;
    remainingMinutes: number;
    isExpired: boolean;
  };
}

export const createBookingApi = async (eventId: string | number, payload: CreateBookingDto) => {
  const res = await axiosInstance.post(`/events/${eventId}/booking`, payload);
  return res.data;
};

export const getBookingTTLApi = async (
  eventId: string | number,
  orderNumber: string
): Promise<TTLResponse> => {
  const res = await axiosInstance.get(`/events/${eventId}/booking/${orderNumber}/ttl`);
  return res.data;
};