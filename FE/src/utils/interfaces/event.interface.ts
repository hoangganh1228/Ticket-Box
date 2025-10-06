import { Setting } from "./setting.interface";
import { Show } from "./show.interface";

export type SpecialEventType = {
  events: Array<{
    deeplink: string;
    imageUrl: string;
    id: number;
  }>;
  title: { en: string, vi: string }
};

export interface TrendingEventType {
  events: Array<{
    deeplink: string;
    imageUrl: string;
    id: number;
  }>;
  title: { en: string, vi: string }
  isLoading : boolean;
}

export interface CreateEventPayload {
  name: string;
  description?: string;
  thumbnail?: string | null;
  banner?: string | null;
  slug?: string;
  type: string;
  status: string;
  name_address: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  category_id: number;
  org_name: string;
  org_description: string;
  org_thumbnail?: string | null;
}

export interface CreateTicketTypeDto {
  id?: number;
  price: number;
  is_free?: boolean;
  max_ticket?: number;
  min_ticket?: number;
  total_ticket: number;
  name: string;
  start_time: string;
  end_time: string;
  description?: string;
  thumbnail?: string;
}

export interface CreateShowWithTicketsDto {
  id?: number;
  start_time: string;
  end_time: string;
  ticketTypes: CreateTicketTypeDto[];
}

export interface settingsEventDto {
  id?: number;
  event_id: number;
  type: string;
  message: string;
  slug?: string;
}

export interface Events {
  id: number;
  name: string;
  description: string;
  thumbnail: string;
  banner: string;
  slug: string;
  type: 'offline' | 'online' | 'hybrid';
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  name_address: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  category_id: number;
  created_by: number;
  org_name: string;
  org_description: string;
  org_thumbnail: string;
  is_special: boolean;
  is_trending: boolean;
  videoUrl: string | null;
  settings: Setting[]
  created_at: string;
  updated_at: string;
}

export interface EventCardProps {
  event: Event;
}

export interface EventListProps {
  events: Event[];
  loading?: boolean;
}

export interface EventTabProps {
  activeKey: string;
  onTabChange: (key: string) => void;
}


export interface EventItem {
  id: string | number;
  name: string;
  deeplink: string;
  imageUrl: string;
  day: string;
  price: number;
}
export interface EventCategorySectionProps {
  title?: string | undefined;
  events: EventItem[];
  isSlider?: boolean;
  variant?: 'default' | 'recommend';
  isLoading : boolean;
  time?: string;
}

export interface EventDetail {
  id: string | number;
  name: string;
  endTime: string;
  shows: Show[];
  name_address: string;
  minTicketPrice: number;
  banner: string;
  description: string;
  org_thumbnail: string;
  org_name: string;
  org_description: string;
}

