export type Performance = {
  id?: number;
  start_time: string;
  end_time: string;
  isOpen: boolean;
  ticketTypes: TicketType[];
};

export type TicketType = {
  id?: number;
  name: string;
  price: number;
  total_ticket: number;
  description: string;
  is_free: boolean;
  max_ticket: number;
  min_ticket: number;
  start_time: string;
  end_time: string;
};