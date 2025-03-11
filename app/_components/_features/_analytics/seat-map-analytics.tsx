import { IEvent } from "@/app/_types/event-types"
import { Order } from "@/app/_types/orders"
import { calculateStatistics } from "@/app/_utils/analytics-utils"
import useSeatmap from "@/app/_hooks/_analytics/useGetSeatmap"
import { Ticket, Tickets, CheckCircle, DollarSign, Receipt } from "lucide-react"
import { GetCurrencyIcon } from "@/app/_components/_layout-components/currency-icons"
import AgeDistributionBarChart from "./age-distribution"
import DailyBookingTrends from "./daily-booking-trends"
import RevenuePieChart from "./revenue-pie-chart"
import SeatBookingPercentageTable from "./seat-booking-table"
import GenderDistributionPieChart from "./gender-distribution"
import SeatmapSeatsTable from "./seatmap-seats-table"
import { COLORS } from "@/app/_utils/analytics-utils"

const OverviewBox = ({ icon, title, value }: { icon: React.ReactNode, title: string, value: React.ReactNode }) => {
    return (
        <div className='flex flex-col items-center justify-center border-2 border-primary p-4 md:p-6 gap-2 rounded-lg bg-white dark:bg-tertiary text-gray-700'>
            {icon}
            <p className='text-xl font-bold dark:text-white'>{title}</p>
            <p className='text-xl font-bold text-primary'>{value}</p>
        </div>
    )
}

const SeatMapAnalytics = ({ event, orders, filteredOrders, DataFormattingForSeatMapEvents }: { event: IEvent, orders: Order[], filteredOrders: Order[], DataFormattingForSeatMapEvents: any }) => {

    const { seatmap } = useSeatmap(event as IEvent);

    const SeatMapTopStatistics = () => {

        const statistics = calculateStatistics(seatmap, orders, filteredOrders);
        return statistics;
    }


    return <>
        <div className='flex flex-col gap-4 w-[90%] mx-auto items-start justify-start mt-8 bg-gray-100 dark:bg-tertiary p-4 rounded-lg'>
            <h1 className='text-3xl font-bold'>Overview</h1>
            <div className='grid grid-cols-1 md:grid-cols-5 gap-4 w-full mx-auto'>
                <OverviewBox icon={<Ticket className='md:h-10 md:w-10 h-8 w-8 dark:text-white' />} title='Total Seats' value={SeatMapTopStatistics().TotalCombinedSeats.toLocaleString()} />
                <OverviewBox icon={<Tickets className='md:h-10 md:w-10 h-8 w-8 dark:text-white' />} title='Total Sold' value={SeatMapTopStatistics().TotalSold.toLocaleString()} />
                <OverviewBox icon={<CheckCircle className='md:h-10 md:w-10 h-8 w-8 dark:text-white' />} title='Total Checked In' value={SeatMapTopStatistics().TotalCheckedIn.toLocaleString()} />
                <OverviewBox icon={<DollarSign className='md:h-10 md:w-10 h-8 w-8 dark:text-white' />} title='Revenue' value={<span className='text-primary flex items-center'>{GetCurrencyIcon(event?.currency || "EUR", 5)} {SeatMapTopStatistics().Revenue.toLocaleString()}</span>} />
                <OverviewBox icon={<Receipt className='md:h-10 md:w-10 h-8 w-8 dark:text-white' />} title='Average Ticket Price' value={<span className='text-primary flex items-center'>{GetCurrencyIcon(event?.currency || "EUR", 5)} {SeatMapTopStatistics().AverageTicketPrice.toLocaleString()}</span>} />
            </div>
        </div>

        <div className={`flex flex-col gap-4 w-[90%] mx-auto items-start justify-start mt-8 bg-gray-100 dark:bg-tertiary p-4 rounded-lg h-full dark:border dark:border-borderDark`}>
            <h1 className='text-2xl font-bold text-gray-700 dark:text-white'>Sales Trends</h1>
            <div className='grid grid-cols-1 md:grid-cols-[55%_42%] md:gap-4 gap-6 w-full mx-auto'>
                <div className='flex flex-col md:flex-row justify-center items-center md:gap-4 gap-12'>
                    <AgeDistributionBarChart
                        DataFormattingForSeatMapEvents={DataFormattingForSeatMapEvents}
                        orders={orders}
                    />
                    <RevenuePieChart
                        DataFormattingForSeatMapEvents={DataFormattingForSeatMapEvents}
                        TopStatistics={SeatMapTopStatistics}
                        event={event as IEvent}
                        orders={orders}
                        COLORS={COLORS}
                    />
                </div>
                <div className='flex flex-col gap-4 items-center justify-center'>
                    <SeatBookingPercentageTable
                        DataFormattingForSeatMapEvents={DataFormattingForSeatMapEvents}
                        orders={orders}
                        seatmap={seatmap}
                    />
                </div>

            </div>
        </div>

        <div className={`flex flex-col gap-4 w-[90%] mx-auto items-start justify-start mt-8 bg-gray-100 dark:bg-tertiary p-4 rounded-lg md:h-[450px] h-full pb-12 md:pb-0 border border-gray-200 dark:border-borderDark`}>
            <h1 className='text-2xl font-bold text-gray-700 dark:text-white'>Sales Trends</h1>  
            <div className='grid grid-cols-1 md:grid-cols-[55%_42%] md:gap-4 gap-6 w-full mx-auto'>
                <DailyBookingTrends
                    orders={orders}
                />
                <GenderDistributionPieChart
                    DataFormattingForSeatMapEvents={DataFormattingForSeatMapEvents}
                    orders={orders}
                />
            </div>
        </div>

        <SeatmapSeatsTable
            seatmap={seatmap}
            filteredOrders={filteredOrders}
            event={event as IEvent}
        />

    </>
}

export default SeatMapAnalytics