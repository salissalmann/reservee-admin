import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { GetCurrencyIcon } from '@/app/_components/_layout-components/currency-icons';
import { IEvent } from '@/app/_types/event-types';



const RevenuePieChartNormal = ({ DataFormattingForRegularEvents, TopStatistics, event, orders, COLORS }: { DataFormattingForRegularEvents: any, TopStatistics: any, event: IEvent, orders: any, COLORS: any }) => {


    const Revenue_Percentage_By_Section = () => {
        const revenue_by_section: { [key: string]: { total_revenue: number; percentage: number } } = {};
        const formattedOrders = DataFormattingForRegularEvents(orders);

        const GetTicketName = (ticket_id: string) => {
            const ticket = event.tickets?.find((ticket: any) => ticket.id === ticket_id);
            return ticket ? ticket.name : "Unknown Ticket";
        }

        formattedOrders.forEach((order: any) => {
            const section_name = GetTicketName(order.ticket_id);
            if (!revenue_by_section[section_name]) {
                revenue_by_section[section_name] = {
                    total_revenue: 0,
                    percentage: 0
                };
            }
            revenue_by_section[section_name].total_revenue += parseFloat(order.price);
        });

        // Calculate percentages after summing all revenues
        const total_revenue = TopStatistics().TotalRevenue;
        Object.keys(revenue_by_section).forEach(section => {
            revenue_by_section[section].percentage =
                (revenue_by_section[section].total_revenue / total_revenue) * 100;
        });

        return revenue_by_section;
    }

    const revenueData = Revenue_Percentage_By_Section();

    const chartData = Object.entries(revenueData).map(([name, data]: [string, any]) => ({
        name,
        value: data.total_revenue
    }));

    return (
        <div className='w-full h-[300px]'>
            <div className='text-gray-700 dark:text-white text-md font-bold'>Revenue by Section</div>
            <ResponsiveContainer width="100%" height="100%" className='bg-white dark:bg-tertiary rounded-lg p-4 border border-gray-200 dark:border-borderDark'>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: number) => [
                            `${GetCurrencyIcon(event?.currency || "EUR")} ${value.toLocaleString()}`,
                            "Revenue"
                        ]}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RevenuePieChartNormal; 