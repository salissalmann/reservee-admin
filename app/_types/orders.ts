export interface Order {
    gender: string
    id: string
    status: string
    created_at: string
    total_amount: string
    items: number,
    event_id: number,
    event_name: string
    event_date: string, 
    type: string,
    seatMapDetails: {
        seat_number: string,
        area_name: string,
        order_item_id: string,
        id: string,
        area_id: string,
        price: string,
    }[]
    orderItems: {
        id: string,
        quantity: number,
        ticket_id: string,
    }[]
    user_id: string,
    event_location: string,
    event_desc: string,
    currency: string
}