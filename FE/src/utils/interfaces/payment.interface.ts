export interface Payment {
    id: number;
    created_at: string;
    updated_at: string;
    user_id: number;
    order_id: number;
    amount: number;
    currency: string;
    provider: string;
    method: "card" | "ewallet" | "bank_app" | "qr";
    status: "pending" | "succeeded" | "failed" | "cancelled";
    transaction_id?: string | null;
    failure_msg?: string | null;
}