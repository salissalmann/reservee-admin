import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Polygon, Grid } from '@/app/(pages)/(reservation-seat)/seatmap/types';

interface SectionPercentage {
    name: string
    totalSeats: number
    bookedSeats: number
    percentage: number
}

const SeatBookingPercentageTable = ({ DataFormattingForSeatMapEvents, orders, seatmap }: { DataFormattingForSeatMapEvents: any, orders: any, seatmap: any }) => {

    const SeatBookedPercentageBySection = (): SectionPercentage[] => {
        const formattedOrders = DataFormattingForSeatMapEvents(orders);
        const sections: SectionPercentage[] = [];

        seatmap?.polygons.forEach((polygon: Polygon) => {
            if (!polygon.isLayout && polygon.name) {
                const totalSeats = polygon.grids?.reduce((total: number, grid: Grid) =>
                    total + grid.size.cols * grid.size.rows, 0) || 0;

                const bookedSeats = formattedOrders.filter((order: any) =>
                    order.area_name === polygon.name
                ).length;

                sections.push({
                    name: polygon.name,
                    totalSeats,
                    bookedSeats,
                    percentage: totalSeats > 0 ? (bookedSeats / totalSeats) * 100 : 0
                });
            }
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
                            <TableRow className='dark:bg-tertiary dark:border-borderDark'>
                                <TableHead className="bg-gray-50 dark:bg-tertiary dark:text-white">Section</TableHead>
                                <TableHead className="bg-gray-50 dark:bg-tertiary dark:text-white">Total Seats</TableHead>
                                <TableHead className="bg-gray-50 dark:bg-tertiary dark:text-white">Booked Seats</TableHead>
                                <TableHead className="bg-gray-50 dark:bg-tertiary dark:text-white">Booking Percentage</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
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

export default SeatBookingPercentageTable;