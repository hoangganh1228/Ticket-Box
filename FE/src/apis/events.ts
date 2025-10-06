import { PaginationInterface } from './../utils/interfaces/pagination.interface';
import axiosPublic from "../config/axiosPublic";
import { SERVER_URL } from '../utils/const/config.const';
import axiosInstance from "@/src/config/interceptor";
import { createEventFormData, createUpdateEventFormData, type EventFormDataWithFiles } from "@/src/utils/formData.utils";
import { CreateEventPayload, Events } from '../utils/interfaces/event.interface';


export type UpdateEventPayload = Partial<CreateEventPayload>;
export const fetchEventsApi = async () => {
  const response = await axiosPublic.get('/events/discovery/categories');
  return response.data;
};

export const fetchThisWeekendOrThisMonthEventsApi = async (
  at: string,
  from: string,
  to: string
) => {
  const response = await axiosPublic.get(
    `/events/recommended-events?at=${at}&from=${from}&to=${to}`
  );
  return response.data;
};

export const fetchEventsBannersApi = async () => {
  const response = await axiosPublic.get('/events/discovery/banners');
  return response.data;
};

export const fetchEventDetailApi = async (id: string) => {
  const response = await axiosPublic.get(`/events/detail/${id}`);
  return response.data;
};

export const fetchEventSuggestionsApi = async (id: string) => {
  const response = await axiosPublic.get(`/events/event-suggestions/${id}`);
  return response.data;
};

//server component fetch

export async function searchWorkshops(params: { q?: string; cate?: string, from?: string, to?: string }) {
  try {
    const queryString = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== undefined && v !== '')
      )
    ).toString();

    const res = await fetch(`${SERVER_URL}/events/search?${queryString}`, {
      cache: 'no-cache', // luôn fetch mới, không cache (phù hợp cho search)
    });

    if (!res) {
      throw new Error(`Failed to fetch workshops`);
    }
    

    return res.json();
  } catch (error) {
    console.error('searchWorkshops error:', error);
    return { data: [] }; // fallback tránh crash
  }
}

export const createEvent = async (
  payload: CreateEventPayload
): Promise<{ id: string | number } & Record<string, unknown>> => {
  const response = await axiosInstance.post('/events', payload);
  // Unwrap { success, statusCode, data } if present
  return response.data.data;
};

export const createEventWithFiles = async (
  data: EventFormDataWithFiles
): Promise<{ id: string | number } & Record<string, unknown>> => {
  const formData = createEventFormData(data);
  const response = await axiosInstance.post('/events', formData);
  // Unwrap { success, statusCode, data } if present
  return response.data.data;
};

export const updateEvent = async (
  eventId: string | number,
  payload: UpdateEventPayload
): Promise<Record<string, unknown>> => {
  const response = await axiosInstance.patch(`/events/${eventId}`, payload);
  return response.data.data;
};

export const updateEventWithFiles = async (
  eventId: string | number,
  data: Partial<EventFormDataWithFiles>
): Promise<Record<string, unknown>> => {
  const formData = createUpdateEventFormData(data);
  const response = await axiosInstance.patch(`/events/${eventId}`, formData);
  return response.data.data;
};

export const getEventById = async (
  eventId: string | number
): Promise<Record<string, unknown>> => {
  const response = await axiosInstance.get(`/events/${eventId}`);
  return response.data.data;
};

export const getEventShowings = async (
  eventId: string | number
): Promise<Record<string, unknown>> => {
  const response = await axiosInstance.get(`/events/${eventId}/showings`);
  return response.data.data;
};

export const getMyEvents = async (type: string, page = 1, limit = 10, searchValue = ''): Promise<{ data: Events[], pagination: PaginationInterface }> => {
  const response = await axiosInstance.get(`/events/my-events`, {
    params: {
      page,
      limit,
      type,
      search: searchValue
    },
  });
  return response.data.data;
}

export const getDraftEvents = async (): Promise<Events[]> => {
  const response = await axiosInstance.get(`/events/draft`);
  return response.data.data;
};

export const getPendingEvents = async (): Promise<Events[]> => {
  const response = await axiosInstance.get(`/events/pending`);
  return response.data.data;
};

export const getPublishedEvents = async (): Promise<Events[]> => {
  const response = await axiosInstance.get(`/events/published`);
  return response.data.data;
};

export const getPastEvents = async (): Promise<Events[]> => {
  const response = await axiosInstance.get(`/events/past`);
  return response.data.data;
};

// Stubs for step-specific saving – adapt endpoints as backend becomes available
export const saveShowings = async (
  eventId: string | number,
  payload: Record<string, unknown>
): Promise<Record<string, unknown>> => {
  const response = await axiosInstance.put(
    `/events/${eventId}/showings`,
    payload
  );
  return response.data;
};

export const saveSettings = async (
  eventId: string | number,
  payload: Record<string, unknown>
): Promise<Record<string, unknown>> => {
  const response = await axiosInstance.put(
    `/events/${eventId}/settings`,
    payload
  );
  return response.data;
};

export const getSettings = async (
  eventId: string | number
): Promise<Record<string, unknown>> => {
  const response = await axiosInstance.get(`/events/${eventId}/settings`);
  return response.data.data;
};

export const getPaymentInfo = async (
  eventId: string | number
): Promise<Record<string, unknown>> => {
  const response = await axiosInstance.get(`/events/${eventId}/payment-info`);
  return response.data.data;
};

export const savePayment = async (
  eventId: string | number,
  payload: Record<string, unknown>
): Promise<Record<string, unknown>> => {
  const response = await axiosInstance.put(
    `/events/${eventId}/payment-info`,
    payload
  );
  return response.data;
};

export const publishEvent = async (
  eventId: string | number
): Promise<Record<string, unknown>> => {
  const response = await axiosInstance.patch(`/events/${eventId}/publish`);
  return response.data.data;
};




