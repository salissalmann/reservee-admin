import { Order } from '@/app/_types/orders'
import { Polygon, Grid } from '../(pages)/(reservation-seat)/seatmap/types'
import { IEvent, TicketType } from '../_types/event-types'

interface Seatmap {
    polygons: Polygon[]
    grids: Grid[]
}

interface Statistics {
    TotalCombinedSeats: number
    TotalSold: number
    TotalCheckedIn: number
    Revenue: number
    AverageTicketPrice: number
}

const calculateStatistics = (seatmap: Seatmap | null, orders: Order[], formattedOrders: any[]): Statistics => {
    const TotalCombinedSeats = seatmap?.polygons?.reduce((total: number, polygon: Polygon) =>
        total + (polygon.grids?.reduce((sum: number, grid: Grid) =>
            sum + grid.size.cols * grid.size.rows, 0) ?? 0), 0) ?? 0

    const TotalSold = formattedOrders.length
    const TotalCheckedIn = formattedOrders.filter((order: any) => order.checked_in === true).length
    const Revenue = orders.reduce((total: number, order: Order) =>
        total + parseFloat(order.total_amount), 0)
    const AverageTicketPrice = Revenue / TotalSold

    return {
        TotalCombinedSeats,
        TotalSold,
        TotalCheckedIn,
        Revenue,
        AverageTicketPrice
    }
}

const TopStatistics = (event: IEvent, filteredOrdersRegular: Order[]) => {

    if (filteredOrdersRegular && filteredOrdersRegular.length === 0) return {
        TotalCombinedTickets: 0,
        TotalSoldTickets: 0,
        TotalCheckedInTickets: 0,
        TotalRevenue: 0,
        AverageTicketPrice: 0
    }
    
    const TotalCombinedTickets = event?.tickets?.reduce((total: number, ticket: TicketType) => total + ticket.quantity, 0) || 0

    const TotalSoldTickets = filteredOrdersRegular && filteredOrdersRegular.length > 0 ? filteredOrdersRegular.length : 0

    const TotalCheckedInTickets = filteredOrdersRegular && filteredOrdersRegular.length > 0 ? filteredOrdersRegular.filter((order: any) => order.is_scanned === true).length : 0

    const TotalRevenue = filteredOrdersRegular && filteredOrdersRegular.length > 0 ? filteredOrdersRegular.reduce((total: number, order: any) => total + parseFloat(order.price), 0) : 0

    const AverageTicketPrice = TotalRevenue / TotalSoldTickets

    return {
        TotalCombinedTickets,
        TotalSoldTickets,
        TotalCheckedInTickets,
        TotalRevenue,
        AverageTicketPrice
    }
}

const COLORS = [
    '#EF404A',
    '#F26369',
    '#F58788',
    '#F8AAA7',
    '#FBCCC6'
];

export { calculateStatistics, TopStatistics, COLORS }