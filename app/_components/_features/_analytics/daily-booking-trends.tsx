import { Order } from '@/app/_types/orders';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const DailyBookingTrends = ({ orders }: { orders: any }) => {
    // Process orders to get daily counts
    const dailyBookings = new Map<string, number>();

    // Sort orders by date and group them
    orders.forEach((order: Order) => {
        const date = new Date(order.created_at).toISOString().split('T')[0];
        dailyBookings.set(date, (dailyBookings.get(date) || 0) + 1);
    });

    // Convert to array and sort by date
    const chartData = Array.from(dailyBookings.entries())
        .map(([date, count]) => ({
            date: new Date(date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            }),
            count
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <div className='w-full h-[300px]'>
            <div className='text-gray-700 dark:text-white text-md font-bold'>Daily Ticket Sales</div>
            <ResponsiveContainer width="100%" height="100%" className='bg-white dark:bg-tertiary rounded-lg p-4 border border-gray-200 dark:border-borderDark'>
                <RechartsBarChart data={chartData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#4476C8" radius={[5, 5, 0, 0]} />
                </RechartsBarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DailyBookingTrends;