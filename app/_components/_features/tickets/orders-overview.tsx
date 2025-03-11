import { useState, useEffect } from "react";
import { ArrowRight, Search, Ticket, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { format } from "date-fns";
import { EventDetails } from "@/app/_types/qr-types";
import { GetCurrencyIcon } from "@/app/_components/_layout-components/currency-icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, ShoppingCart, QrCode } from "lucide-react";
import { useRouter } from "next/navigation";


export default function OrdersOverview({ event_details, orders, eventId }: { event_details: EventDetails, orders: any, eventId: string }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [filteredOrders, setFilteredOrders] = useState(
        [...orders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    );

    useEffect(() => {
        filterOrders();
    }, [searchQuery, startDate, endDate, orders]);

    const filterOrders = () => {
        let filtered = [...orders];

        // Sort by date first (latest first)
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        // Apply other filters
        if (searchQuery) {
            filtered = filtered.filter((order: any) =>
                order.id.toString().includes(searchQuery.toLowerCase()) ||
                `${order.first_name} ${order.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.type?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Date filters
        if (startDate) {
            filtered = filtered.filter((order: any) =>
                new Date(order.created_at) >= new Date(startDate)
            );
        }
        if (endDate) {
            filtered = filtered.filter((order: any) =>
                new Date(order.created_at) <= new Date(endDate)
            );
        }

        setFilteredOrders(filtered);
    };

    const CalculateTotalRevenue = (orders: any) => {
        return orders.reduce((total: number, order: any) => total + parseFloat(order.total_amount), 0);
    }

    const router = useRouter();

    const downloadCSV = () => {
        const headers = ["Order ID", "Order Date", "Customer Name", "Ticket Type", "Status", "Total Price"];
        const rows = filteredOrders.map((order: any) => [
            order.id,
            format(new Date(order.created_at), 'dd/MM/yyyy'),
            `${order?.first_name} ${order?.last_name}`,
            order?.type?.charAt(0).toUpperCase() + order?.type?.slice(1),
            order?.status?.charAt(0).toUpperCase() + order?.status?.slice(1),
            `${event_details?.currency} ${parseFloat(order?.total_amount).toFixed(2)}`,
        ]);

        const csvContent = [headers, ...rows]
            .map(row => row.join(","))
            .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "orders.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-white text-black dark:bg-tertiary dark:text-white">
            {/* Header */}
            <header>
                <div className="flex flex-wrap items-center justify-between w-[90%] mx-auto border-b border-gray-200 pb-4">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Ticket className="h-5 w-5" />   Tickets
                    </h1>
                    <div className="flex flex-col md:flex-row items-center gap-4 md:mt-0 mt-4">
                        <div className="relative">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 h-6 w-6 p-1 bg-primary text-white rounded-full" />
                            <Input
                                className="pl-9 w-[300px] bg-gray-100 dark:bg-tertiary dark:border-borderDark border-gray-200 rounded-full"
                                placeholder="Search ticket types or codes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="hidden md:block">
                            <Select defaultValue="vienna-2025">
                                <SelectTrigger className="w-[200px] bg-white dark:bg-tertiary dark:border-borderDark border-gray-200">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="vienna-2025">{event_details?.event_title || "Event Title"}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8  w-[90%] mx-auto mt-4">
                <div className="p-4 rounded-lg border-4 border-blue-400 text-center bg-tertiary text-white font-bold flex flex-col items-center justify-center">
                    <div className="text-red-500 mb-4"><ShoppingCart className="h-6 w-6" /></div>
                    <h3 className="font-semibold mb-2">Number of Orders:</h3>
                    <p className="text-2xl">{orders.length}</p>
                </div>
                <div className="p-4 rounded-lg border-4 border-yellow-300 text-center bg-tertiary text-white font-bold flex flex-col items-center justify-center    ">
                    <div className="text-red-500 mb-4">{GetCurrencyIcon(event_details.currency, 6)}</div>
                    <h3 className="font-semibold mb-2">Revenue Generated:</h3>
                    <p className="text-2xl flex items-center">{GetCurrencyIcon(event_details.currency, 6)}{CalculateTotalRevenue(orders).toFixed(2)}</p>
                </div>
                <div className="p-4 rounded-lg border-4 border-green-400 text-center bg-tertiary text-white font-bold flex flex-col items-center justify-center">
                    <div className="text-red-500 mb-4"><Ticket className="h-6 w-6" /></div>
                    <h3 className="font-semibold mb-2">Tickets Sold Today:</h3>
                    <p className="text-2xl">{orders.filter((order: any) => format(new Date(order.created_at), 'dd/MM/yyyy') === format(new Date(), 'dd/MM/yyyy')).length}</p>
                </div>
            </div>


            {/* Updated Filters */}
            <div>
                <div className="flex flex-col md:flex-row gap-4 w-[90%] mx-auto p-4 border-b border-gray-200">
                    <Input
                        type="date"
                        className="w-[150px] bg-white border-gray-200 dark:bg-tertiary dark:border-borderDark"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <Input
                        type="date"
                        className="w-[150px] bg-white border-gray-200 dark:bg-tertiary dark:border-borderDark"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                    <Button
                        variant="outline"
                        className="bg-primary text-white font-bold rounded-full hover:scale-105 transition-all duration-300 dark:bg-tertiary dark:border-borderDark"
                        onClick={filterOrders}
                    >
                        <Search className="h-4 w-4 mr-2" />
                        Search
                    </Button>
                </div>
            </div>

            <div className="w-[90%] mx-auto">
                <div className=" bg-gray-100 p-4 rounded-lg mt-4 mb-4 dark:bg-tertiary dark:border-borderDark">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Overview</h2>
                        <Button variant="outline" className="bg-tertiary text-white font-bold rounded-full hover:scale-105 transition-all duration-300 dark:bg-tertiary dark:border-borderDark"
                            onClick={() => router.push(`/ticket-scanning/${eventId}`)}
                        >
                            <QrCode className="h-4 w-4 mr-2" /> Scan Tickets
                        </Button>
                    </div>

                    {/* Tickets Table */}
                    <div className="rounded-lg border border-gray-200 mb-8 bg-white dark:bg-tertiary dark:border-borderDark">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-gray-200">
                                    <TableHead className="whitespace-nowrap">Order ID</TableHead>
                                    <TableHead className="whitespace-nowrap">Order Date</TableHead>
                                    <TableHead className="whitespace-nowrap">Customer Name</TableHead>
                                    <TableHead className="whitespace-nowrap">Ticket Type</TableHead>
                                    <TableHead className="whitespace-nowrap">Total Price</TableHead>
                                    <TableHead className="whitespace-nowrap">Status</TableHead>
                                    <TableHead className="whitespace-nowrap">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredOrders.map((order: any) => (
                                    <TableRow className="border-gray-200">
                                        <TableCell>{order.id}</TableCell>
                                        <TableCell>{format(new Date(order.created_at), 'dd/MM/yyyy')}</TableCell>
                                        <TableCell>{order?.first_name} {order?.last_name}</TableCell>
                                        <TableCell>{order?.type?.charAt(0).toUpperCase() + order?.type?.slice(1)}</TableCell>
                                        <TableCell>{order?.status?.charAt(0).toUpperCase() + order?.status?.slice(1)}</TableCell>
                                        <TableCell>{event_details?.currency} {parseFloat(order?.total_amount).toFixed(2)}</TableCell>
                                        <TableCell className="space-x-2">
                                            <Button variant="ghost" size="sm" className="flex items-center gap-2 bg-tertiary text-white font-bold rounded-full hover:scale-105 transition-all duration-300"
                                                onClick={() => router.push(`/order-details/${order.id}`)}
                                            >
                                                <Eye className="h-4 w-4" />
                                                View Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex justify-end w-[95%] mx-auto">
                        <Button variant="outline" className="bg-primary text-white font-bold rounded-full hover:scale-105 transition-all duration-300 dark:bg-tertiary dark:border-borderDark mr-4"
                            onClick={downloadCSV}
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Download CSV
                        </Button>
                    </div>
                </div>



            </div>
        </div>
    )
}

