
export interface Ticket {
  id: string | number;
  name: string;
  price: number | string; 
  total_ticket ?: number;
  min_ticket ?: number;
  max_ticket ?: number;
  show_id  ?: number;
  remaining_ticket  ?: number;
  description ?: string;
  thumbnail ?: string;
  slug ?: string;
  is_free ?: boolean;
  start_time ?: string;
  end_time ?: string;
  created_at ?: string;
  updated_at ?: string;
}