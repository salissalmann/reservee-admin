interface RefundRequest {
    refund_id: string,
    order_id: string,
    created_by: string,
    created_at: string,
    event_name: string,
    reason: string,
    refund_amount: number,
    status: string,
    last_updated: string,
    currency: string,
    order_date: string,
    payment_id: string,
    order_type: string,
    order_amount: number,
    user_email: string,
    user_phone: string,
    gender: string,
}

export type { RefundRequest }