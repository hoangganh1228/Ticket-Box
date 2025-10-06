import { Ticket } from "./ticket.interface";

export interface OrderItem {
    id: number;
    order_id: number;
    ticket_id: number;
    show_id: number;
    quantity: number;
    created_at: string;
    updated_at: string;
    unit_price: number;
    total_price: number;
    discount_amount: number;
    final_price: number;
    special_requests?: string | null;
    seat_id?: number | null;
    ticket: Ticket;
}