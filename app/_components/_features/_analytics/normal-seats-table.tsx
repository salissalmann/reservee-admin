import React from 'react'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { GetCurrencyIcon } from '@/app/_components/_layout-components/currency-icons'
import { Order } from '@/app/_types/orders'
import { IEvent } from '@/app/_types/event-types'

export default function NormalSeatsTable({
    event,
    orders,
    filteredOrdersRegular
}: {
    event: IEvent,
    orders: Order[],
    filteredOrdersRegular: Order[]
}) {
    return (
        <>
            <div className="w-[90%] mx-auto mt-8 bg-gray-100 dark:bg-tertiary p-4 rounded-lg border border-gray-200 dark:border-borderDark">
                <div className="border border-gray-200 dark:border-borderDark rounded-lg overflow-hidden bg-white dark:bg-tertiary">
                    <Table>
                        <TableHeader>
                            <TableRow className='dark:border-borderDark'>
                                <TableHead className="bg-gray-50 whitespace-nowrap dark:bg-tertiary">Section</TableHead>
                                <TableHead className="bg-gray-50 whitespace-nowrap dark:bg-tertiary">Price/Seat</TableHead>
                                <TableHead className="bg-gray-50 whitespace-nowrap dark:bg-tertiary">Available</TableHead>
                                <TableHead className="bg-gray-50 whitespace-nowrap dark:bg-tertiary">Total Price</TableHead>
                                <TableHead className="bg-gray-50 whitespace-nowrap dark:bg-tertiary">Checked</TableHead>
                                <TableHead className="bg-gray-50 whitespace-nowrap dark:bg-tertiary">Booked</TableHead>
                                <TableHead className="bg-gray-50 whitespace-nowrap dark:bg-tertiary">Revenue</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {event?.tickets?.map((ticket: any) => {

                                const Total_qty_booked = filteredOrdersRegular.filter((order: any) => order.ticket_id === ticket.id).length
                                const Total_qty_checked = filteredOrdersRegular.filter((order: any) => order.ticket_id === ticket.id && order.is_scanned === true).length

                                const earnings = filteredOrdersRegular.filter((order: any) => order.ticket_id === ticket.id).reduce((total: number, order: any) => total + parseFloat(order.price), 0)
                                const qty_available = ticket.quantity

                                return (
                                    <TableRow key={ticket.id} className='dark:border-borderDark'>
                                        {/* <TableCell className="py-4">{ticket.id}</TableCell> */}
                                        <TableCell className="py-4">{ticket.name}</TableCell>
                                        <TableCell className="text-gray-700 dark:text-white text-left">
                                            <div className="flex items-center justify-start text-gray-700 dark:text-white">
                                                {GetCurrencyIcon(event?.currency || "EUR")}
                                                <span className="ml-1">{ticket.price}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">{qty_available.toLocaleString()}</TableCell>
                                        <TableCell className="text-gray-700 dark:text-white text-left">
                                            <div className="flex items-center justify-start text-gray-700 dark:text-white">
                                                {GetCurrencyIcon(event?.currency || "EUR")}
                                                <span className="ml-1">{ticket.price * ticket.quantity}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">{Total_qty_checked.toLocaleString()}</TableCell>
                                        <TableCell className="py-4">{Total_qty_booked.toLocaleString()}</TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex items-center justify-start text-gray-700 dark:text-white">
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
            </div>

        </>
    )
}
