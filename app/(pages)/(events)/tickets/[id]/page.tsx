"use client"

import { useEffect, useState } from "react"
import { getEventOrdersAndItemsAPI } from "@/app/_apis/order-apis"
  
import EventLayout from "@/app/_components/_features/_events/event-layout"
import { Input } from "@/components/ui/input"
import { BarChart, Search, Ticket, Tickets } from "lucide-react"
import { Order } from "@/app/_types/qr-types"
import SeatMapTable from "@/app/_components/_features/tickets/seatmap-table"
import RegularTable from "@/app/_components/_features/tickets/regular-table"
import Loader from "@/app/_components/_layout-components/loader"

export const runtime = 'edge'

export default function TicketManagementPage({ params }: { params: { id: string } }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getEventOrdersAndItemsAPI(params.id)
      if (response.status === true) {
        setOrders(response.data)
        setFilteredOrders(response.data)
      } else {
        setError("Failed to fetch orders")
      }
    } catch (error) {
      console.error(error)
      setError("An error occurred while fetching data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [params.id]) // Added fetchData to dependencies

  useEffect(() => {
    let result = [...orders]

    if (searchQuery) {
      result = result.filter(order => {
        if (order.type === 'seatmap') {
          return order.seatMapDetails?.some(seat =>
            seat.area_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            seat.seat_number.toString().toLowerCase().includes(searchQuery.toLowerCase())
          );
        } else {
          return order.orderItems?.some(item =>
            item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.price.toString().includes(searchQuery)
          );
        }
      });
    }

    // Sort seats if it's a seatmap order
    result = result.map(order => {
      if (order.type === 'seatmap' && order.seatMapDetails) {
        return {
          ...order,
          seatMapDetails: [...order.seatMapDetails].sort((a, b) => {
            const areaCompare = a.area_name.localeCompare(b.area_name);
            return areaCompare !== 0 ? areaCompare : Number(a.seat_number) - Number(b.seat_number);
          })
        };
      }
      return order;
    });

    setFilteredOrders(result);
  }, [orders, searchQuery])

  if (loading) {
    return <Loader />
  }

  if (error) {
    return <div className="flex flex-col justify-center">
       
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold">Error</h1>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    </div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
       
      <EventLayout eventId={params.id} isActive="tickets">
        <div className={`min-h-screen bg-white text-black dark:bg-tertiary dark:text-white`}>
          {/* Header */}
          <header>
            <div className="flex flex-wrap items-center justify-between w-[90%] mx-auto border-b border-gray-200 pb-4">
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Tickets className="h-8 w-8" />   Tickets
              </h1>
            </div>
          </header>

          <div className="w-[90%] mx-auto">
            {orders.length > 0 && 'type' in orders[0] && orders[0].type === "seatmap" ? (
              <SeatMapTable filteredOrders={filteredOrders} params={params} />
            ) : (
              <RegularTable filteredOrders={filteredOrders} params={params} />
            )}
          </div>


        </div>

      </EventLayout>
    </div>
  )
}


