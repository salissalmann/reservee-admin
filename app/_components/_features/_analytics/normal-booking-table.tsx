import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Polygon, Grid } from '@/app/(pages)/(reservation-seat)/seatmap/types';

interface SectionPercentage {
    id: string
    name: string
    totalSeats: number
    bookedSeats: number
    percentage: number
}

const NormalBookingPercentageTable = ({ DataFormattingForRegularEvents, orders, event }: { DataFormattingForRegularEvents: any, orders: any, event: any }) => {

    const SeatBookedPercentageBySection = (): SectionPercentage[] => {
        const formattedOrders = DataFormattingForRegularEvents(orders);
        const sections: SectionPercentage[] = [];
        
        // Create a Set to track processed ticket IDs
        const processedTickets = new Set();

        const GetTicketName = (ticket_id: string) => {
            const ticket = event?.tickets?.find((ticket: any) => ticket.id === ticket_id);
            return ticket ? ticket.name : "Unknown Ticket";
        }

        formattedOrders.forEach((order: any) => {
            if (processedTickets.has(order.ticket_id)) return;
            
            processedTickets.add(order.ticket_id);
            const section_name = GetTicketName(order.ticket_id);

            const totalSeatsForSection = event?.tickets?.find((ticket: any) => ticket.id === order.ticket_id)?.quantity || 0;
            let bookedSeatsForSection = 0
            formattedOrders.forEach((o: any) => {
                if (o.ticket_id === order.ticket_id) {
                    bookedSeatsForSection += 1;
                }
            });

            const percentage = (bookedSeatsForSection / totalSeatsForSection) * 100;

            sections.push({
                id: order.ticket_id,
                name: section_name,
                totalSeats: totalSeatsForSection,
                bookedSeats: bookedSeatsForSection,
                percentage: percentage
            });
        });

        return sections;
    }

    const sectionData = SeatBookedPercentageBySection();
    return (
        <div className='flex flex-col w-full items-start justify-start mt-4'>
            <div className='text-gray-700 dark:text-white text-md font-bold text-left mb-2'>Seat Booking Percentage by Section</div>
            <ScrollArea className='w-full h-[300px] overflow-y-auto'>
                <div className="border border-gray-200 dark:border-borderDark rounded-lg overflow-hidden bg-white dark:bg-tertiary">
                    <Table>
                        <TableHeader>
                            <TableRow className='dark:border-borderDark'>
                                <TableHead className="bg-gray-50 dark:bg-tertiary">Section</TableHead>
                                <TableHead className="bg-gray-50 dark:bg-tertiary">Total Seats</TableHead>
                                <TableHead className="bg-gray-50 dark:bg-tertiary">Booked Seats</TableHead>
                                <TableHead className="bg-gray-50 dark:bg-tertiary">Booking Percentage</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className='dark:border-borderDark'>
                            {sectionData.map((section) => (
                                <TableRow key={section.name} className='dark:border-borderDark'>
                                    <TableCell className="font-medium">{section.name}</TableCell>
                                    <TableCell>{section.totalSeats.toLocaleString()}</TableCell>
                                    <TableCell>{section.bookedSeats.toLocaleString()}</TableCell>
                                    <TableCell>{section.percentage.toFixed(1)}%</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </ScrollArea>
        </div>
    );
};

export default NormalBookingPercentageTable;