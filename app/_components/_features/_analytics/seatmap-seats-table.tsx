import React from 'react'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { GetCurrencyIcon } from '@/app/_components/_layout-components/currency-icons'
import { Order } from '@/app/_types/orders'
import { Grid, Polygon } from '@/app/(pages)/(reservation-seat)/seatmap/types'
import { IEvent } from '@/app/_types/event-types'

export default function SeatmapSeatsTable({
    seatmap,
    filteredOrders,
    event
}: {
    seatmap: any,
    filteredOrders: Order[],
    event: IEvent
}) {
    return (
        <>
            {seatmap &&
                <div className="w-[90%] mx-auto mt-8 bg-gray-100 dark:bg-tertiary p-4 rounded-lg border border-gray-200 dark:border-borderDark">
                    <div className="border border-gray-200 dark:border-borderDark rounded-lg overflow-hidden bg-white dark:bg-tertiary  ">
                        <Table>
                            <TableHeader>
                                <TableRow className='dark:border-borderDark'>
                                    <TableHead className="bg-gray-50 whitespace-nowrap dark:bg-tertiary dark:text-white">Section</TableHead>
                                    <TableHead className="bg-gray-50 whitespace-nowrap dark:bg-tertiary dark:text-white">Total</TableHead>
                                    <TableHead className="bg-gray-50 whitespace-nowrap dark:bg-tertiary dark:text-white">Price/Seat</TableHead>
                                    <TableHead className="bg-gray-50 whitespace-nowrap dark:bg-tertiary dark:text-white">Total Price</TableHead>
                                    <TableHead className="bg-gray-50 whitespace-nowrap dark:bg-tertiary dark:text-white">Checked</TableHead>
                                    <TableHead className="bg-gray-50 whitespace-nowrap dark:bg-tertiary dark:text-white">Booked</TableHead>
                                    <TableHead className="bg-gray-50 whitespace-nowrap dark:bg-tertiary dark:text-white">Revenue</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {seatmap.polygons.map((polygon: Polygon) => {
                                    if (polygon.isLayout) return null

                                    const totalSeats =
                                        polygon.grids?.reduce((total: number, grid: Grid) => total + grid.size.cols * grid.size.rows, 0) || 0

                                    const costPerSeat = polygon.price
                                    const totalCost = totalSeats * costPerSeat

                                    const checkedIn = filteredOrders.filter(
                                        (order: any) => order.area_id === polygon.id && order.checked_in === true,
                                    ).length

                                    const booked = filteredOrders.filter((order: any) => order.area_id === polygon.id).length

                                    const earnings = booked * costPerSeat

                                    return (
                                        <TableRow key={polygon.id} className='dark:border-borderDark'>
                                            <TableCell className="text-gray-700 dark:text-white font-medium text-left">{polygon.name}</TableCell>
                                            <TableCell className="text-gray-700 dark:text-white text-left">{totalSeats.toLocaleString()}</TableCell>
                                            <TableCell className="text-gray-700 dark:text-white text-left">
                                                <div className="flex items-center justify-start text-gray-700 dark:text-white">
                                                    {GetCurrencyIcon(event?.currency || "EUR")}
                                                    <span className="ml-1">{costPerSeat.toFixed(2)}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-gray-700 dark:text-white text-left">
                                                <div className="flex items-center justify-start text-gray-700 dark:text-white">
                                                    {GetCurrencyIcon(event?.currency || "EUR")}
                                                    <span className="ml-1">
                                                        {totalCost.toLocaleString(undefined, {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-gray-700 dark:text-white text-left">{checkedIn.toLocaleString()}</TableCell>
                                            <TableCell className="text-gray-700 dark:text-white text-left">{booked.toLocaleString()}</TableCell>
                                            <TableCell className="text-gray-700 dark:text-white text-left">
                                                <div className="flex items-center text-gray-700 dark:text-white">
                                                    {GetCurrencyIcon(event?.currency || "EUR")}
                                                    <span className="ml-1">{earnings.toLocaleString()}</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </div>}
        </>
    )
}
