
import { useState, useEffect } from 'react'
import { Order } from '@/app/_types/orders'
import { getEventOrdersAndItemsAPI } from '@/app/_apis/order-apis'

const useOrders = (eventId: string) => {
    const [orders, setOrders] = useState<Order[]>([])
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
    const [filteredOrdersRegular, setFilteredOrdersRegular] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)

    const DataFormattingForSeatMapEvents = (orders_seatmap: Order[]) => {
        let formatted_orders: any[] = []
        orders_seatmap.flatMap((order: any) =>
            order.seatMapDetails?.map((seat: any) => {
                const isSeatScanned = order.qrCodes.some(
                    (qrCode: any) => (qrCode.seat_number === seat.seat_number && 
                                    qrCode.area_id === seat.area_id && 
                                    qrCode.is_scanned === true)
                )
                formatted_orders.push({
                    id: order.id,
                    user_email: order.user_email,
                    user_phone: order.user_phone,
                    age: order.age,
                    gender: order.gender,
                    city: order.city,
                    created_at: order.created_at,
                    area_name: seat.area_name,
                    area_id: seat.area_id,
                    seat_number: seat.seat_number,
                    checked_in: isSeatScanned,
                    price: seat.price,
                })
            }),
        )
        return formatted_orders
    }


    const DataFormattingForRegularEvents = (orders_regular: Order[]) => {
        let formatted_orders: any[] = []
        orders_regular.flatMap((order: any) =>
            order.orderItems?.flatMap((item: any) =>
              Array(item.quantity).fill(null).map((_, idx) => {
                const isSeatScanned = order.qrCodes?.some(
                  (qrCode: any) => (qrCode.ticket_qty_index === idx + 1 && qrCode.order_id === order.id && qrCode.is_scanned === true && qrCode.ticket_id === item.ticket_id)
                )
                formatted_orders.push({
                  id: order.id,
                  item_id: item.id,
                  idx: idx,
                  ticket_id: item.ticket_id,
                  order_id: `${order.id}-${idx + 1}`,
                  user_email: order.user_email || "",
                  user_phone: order.user_phone || "",
                  age: order.age || "",
                  gender: order.gender || "",
                  city: order.city || "",
                  created_at: order.created_at,
                  type: item.type,
                  price: item.price,
                  is_scanned: isSeatScanned
                })
              })
            )
        )
        console.log(formatted_orders, "formatted_orders")
        return formatted_orders
    }


    const fetchData = async () => {
        setLoading(true)
        try {
            const response = await getEventOrdersAndItemsAPI(eventId)
            if (response.status === true) {
                setOrders(response.data)
                setFilteredOrders(DataFormattingForSeatMapEvents(response.data))
                setFilteredOrdersRegular(DataFormattingForRegularEvents(response.data))
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [eventId])

        return { orders, filteredOrders, filteredOrdersRegular, loading, DataFormattingForSeatMapEvents, DataFormattingForRegularEvents }
}

export default useOrders