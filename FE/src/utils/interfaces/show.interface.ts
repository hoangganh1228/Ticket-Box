import { Ticket } from "./ticket.interface";

export interface Show {
  id: string | number;
  event_id ?: number;
  time_start: string;  
  time_end?: string;    
  tickets: Ticket[];
}
