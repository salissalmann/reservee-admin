import React from 'react'
import { Card } from '@/components/ui/card'
import { formatDate } from '@/app/_utils/utility-functions'
import { Order } from '@/app/_types/orders'
import { GetCurrencyIcon } from '../../_layout-components/currency-icons'

function EventSidebar({ order, currency }: { order: Order, currency: string }) {
    return (
        <Card className="bg-white dark:bg-tertiary border border-zinc-200 dark:border-borderDark">
            <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-700 dark:text-gray-300">Order #</div>
                    <div className="text-gray-500 dark:text-white">{order?.id}</div>
                    <div className="text-gray-700 dark:text-gray-300">Order Date:</div>
                    <div className="text-gray-500 dark:text-white">{formatDate(order?.created_at)}</div>
                    <div className="text-gray-700 dark:text-gray-300">Event Name:</div>
                    <div className="text-gray-500 dark:text-white">{order?.event_name}</div>
                    <div className="text-gray-700 dark:text-gray-300">Event Date and Time:</div>
                    <div className="text-gray-500 dark:text-white">{formatDate(order?.event_date)}</div>
                    <div className="text-gray-700 dark:text-gray-300">Event Location:</div>
                    <div className="text-gray-500 dark:text-white">{order?.event_location}</div>
                    <div className="text-gray-700 dark:text-gray-300">Total Amount:</div>
                    <div className="text-gray-500 dark:text-white flex items-center">{GetCurrencyIcon(currency)} {parseFloat(order?.total_amount).toFixed(2)}</div>
                    <div className="text-gray-700 dark:text-gray-300">Order Status:</div>
                    <div className={`text-gray-500 dark:text-white ${order?.status === "canceled" ?
                        "bg-red-300 text-red-800"
                        : order?.status === "completed"
                            ? "bg-green-300 text-green-800"
                            : "bg-yellow-300 text-yellow-800"
                        } px-2 py-1 rounded-md text-xs w-fit`}> {order?.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : ''}</div>
                </div>
                <div className="text-sm">
                    Need Help? Contact Us:{" "}
                    <a href="#" className="text-primary hover:underline">
                        Contact Support
                    </a>
                </div>
            </div>
        </Card>

    )

}


function EventSidebarBottom({ order }: { order: Order }) {
    return (
        <Card className="bg-white dark:bg-tertiary border border-zinc-200 dark:border-borderDark rounded-lg shadow-md">
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-tertiary dark:text-white">Event Details</h2>
                <div className="space-y-4">
                    <div>
                        <div className="text-gray-700 dark:text-gray-300">Name:</div>
                        <div className="text-gray-500 dark:text-white">{order?.event_name}</div>
                    </div>
                    <div>
                        <div className="text-gray-700 dark:text-gray-300">Description:</div>
                        <p className="text-sm text-gray-500 dark:text-white">
                            {order?.event_desc}
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export { EventSidebar, EventSidebarBottom }