'use client'
import React from 'react'
import { CheckCircle, DollarSign, Receipt, Ticket, Tickets } from 'lucide-react'
import { GetCurrencyIcon } from '@/app/_components/_layout-components/currency-icons'
import { IEvent } from '@/app/_types/event-types'
import AgeDistributionBarChart from './age-distribution'
import DailyBookingTrends from './daily-booking-trends'
import { TopStatistics, COLORS } from '@/app/_utils/analytics-utils'
import { Order } from '@/app/_types/orders'
import RevenuePieChartNormal from './revenue-pie-chart-normal'
import NormalBookingPercentageTable from './normal-booking-table'
import GenderDistributionPieChartNormal from './gender-distribution-normal'
import NormalSeatsTable from './normal-seats-table'


const OverviewBox = ({ icon, title, value }: { icon: React.ReactNode, title: string, value: React.ReactNode }) => {
    return (
        <div className='flex flex-col items-center justify-center border-2 border-primary p-4 md:p-6 gap-2 rounded-lg bg-white dark:bg-tertiary text-gray-700 dark:text-white'>
            {icon}
            <p className='text-xl font-bold'>{title}</p>
            <p className='text-xl font-bold text-primary'>{value}</p>
        </div>
    )
}

export default function NormalAnalytics({
    event,
    orders,
    filteredOrdersRegular,
    DataFormattingForRegularEvents
}: {
    event: IEvent,
    orders: Order[],
    filteredOrdersRegular: Order[],
    DataFormattingForRegularEvents: any
}) {

    const NormalTopStatistics: {
        TotalCombinedTickets: number,
        TotalSoldTickets: number,
        TotalCheckedInTickets: number,
        TotalRevenue: number,
        AverageTicketPrice: number
    } = TopStatistics(event as IEvent, filteredOrdersRegular)
    return <>
        <>
            <div className='flex flex-col gap-4 w-[90%] mx-auto items-start justify-start mt-8 bg-gray-100 dark:bg-tertiary p-4 rounded-lg border border-gray-200 dark:border-borderDark'>
                <h1 className='text-3xl font-bold'>Overview</h1>
                <div className='grid grid-cols-1 md:grid-cols-5 gap-4 w-full mx-auto'>
                    <OverviewBox icon={<Ticket className='md:h-10 md:w-10 h-8 w-8' />} title='Total Seats' value={NormalTopStatistics.TotalCombinedTickets.toLocaleString()} />
                    <OverviewBox icon={<Tickets className='md:h-10 md:w-10 h-8 w-8' />} title='Total Sold' value={NormalTopStatistics.TotalSoldTickets.toLocaleString()} />
                    <OverviewBox icon={<CheckCircle className='md:h-10 md:w-10 h-8 w-8' />} title='Total Checked In' value={NormalTopStatistics.TotalCheckedInTickets.toLocaleString()} />
                    <OverviewBox icon={<DollarSign className='md:h-10 md:w-10 h-8 w-8' />} title='Revenue' value={<span className='text-primary flex items-center'>{GetCurrencyIcon(event?.currency || "EUR", 5)} {NormalTopStatistics.TotalRevenue.toLocaleString()}</span>} />
                    <OverviewBox icon={<Receipt className='md:h-10 md:w-10 h-8 w-8' />} title='Average Ticket Price' value={<span className='text-primary flex items-center'>{GetCurrencyIcon(event?.currency || "EUR", 5)} {NormalTopStatistics.AverageTicketPrice.toLocaleString()}</span>} />
                </div>
            </div>

            <div className={`flex flex-col gap-4 w-[90%] mx-auto items-start justify-start mt-8 bg-gray-100 dark:bg-tertiary p-4 rounded-lg border border-gray-200 dark:border-borderDark h-full`}>
                <h1 className='text-2xl font-bold text-gray-700 dark:text-white'>Sales Trends</h1>
                <div className='grid grid-cols-1 md:grid-cols-[55%_42%] md:gap-4 gap-6 w-full mx-auto'>
                    <div className='flex flex-col md:flex-row justify-center items-center md:gap-4 gap-12'>
                        <AgeDistributionBarChart
                            DataFormattingForSeatMapEvents={DataFormattingForRegularEvents}
                            orders={orders}
                        />
                        <RevenuePieChartNormal
                            DataFormattingForRegularEvents={DataFormattingForRegularEvents}
                            TopStatistics={TopStatistics}
                            event={event as IEvent}
                            orders={orders}
                            COLORS={COLORS}
                        />
                    </div>
                    <div className='flex flex-col gap-4 items-center justify-center'>
                        <NormalBookingPercentageTable
                            DataFormattingForRegularEvents={DataFormattingForRegularEvents}
                            orders={orders}
                            event={event as IEvent}
                        />
                    </div>

                </div>
            </div>

            <div className={`flex flex-col gap-4 w-[90%] mx-auto items-start justify-start mt-8 bg-gray-100 dark:bg-tertiary p-4 rounded-lg border border-gray-200 dark:border-borderDark md:h-[450px] h-full pb-12 md:pb-0`}>
                <h1 className='text-2xl font-bold text-gray-700 dark:text-white'>Sales Trends</h1>
                <div className='grid grid-cols-1 md:grid-cols-[55%_42%] md:gap-4 gap-6 w-full mx-auto'>
                    <DailyBookingTrends
                        orders={orders}
                    />
                    <GenderDistributionPieChartNormal
                        DataFormattingForRegularEvents={DataFormattingForRegularEvents}
                        orders={orders}
                    />
                </div>
            </div>

            <NormalSeatsTable
                event={event as IEvent}
                orders={orders}
                filteredOrdersRegular={filteredOrdersRegular}
            />

        </>
    </>
}


