import { Events } from "./event.interface";
import { OrderItem } from "./orderItem.interface";
import { Payment } from "./payment.interface";
import { UserDetail } from "./user.interface";

export interface Order {
    id: number;
    created_at: string;
    updated_at: string;

    order_number?: string | null;
    user_id: number;
    event_id: number;
    phone?: string | null;

    status: "pending" | "paid" | "confirmed" | "cancelled";
    total_amount: number;
    discount_amount: number;
    final_amount: number;

    email?: string | null;
    province?: string | null;
    district?: string | null;
    ward?: string | null;
    street?: string | null;
    address?: string | null;
    note?: string | null;

    idempotency_key?: string | null;
    expires_at?: string | null;
    event: Events;
    orderItems: OrderItem[];
    user: UserDetail,
    payments: Payment[];
}