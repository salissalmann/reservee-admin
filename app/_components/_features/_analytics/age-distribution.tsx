import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const AgeDistributionBarChart = ({ DataFormattingForSeatMapEvents, orders }: { DataFormattingForSeatMapEvents: any, orders: any }) => {


    const Age_Distribution = () => {
        const age_groups = {
            '0-17': 0,
            '18-24': 0,
            '25-34': 0,
            '35-44': 0,
            '45-54': 0,
            '55+': 0
        };

        DataFormattingForSeatMapEvents(orders).forEach((order: any) => {
            const age = parseInt(order.age);
            if (isNaN(age)) return;

            if (age < 18) age_groups['0-17']++;
            else if (age <= 24) age_groups['18-24']++;
            else if (age <= 34) age_groups['25-34']++;
            else if (age <= 44) age_groups['35-44']++;
            else if (age <= 54) age_groups['45-54']++;
            else age_groups['55+']++;
        });

        return Object.entries(age_groups).map(([range, count]) => ({
            range,
            count
        }));
    };

    const ageData = Age_Distribution();

    return (
        <div className='w-full h-[300px]'>
            <div className='text-gray-700 dark:text-white text-md font-bold'>Age Distribution</div>
            <ResponsiveContainer width="100%" height="100%" className='bg-white dark:bg-tertiary rounded-lg p-4 border border-gray-200 dark:border-borderDark'>
                <RechartsBarChart data={ageData}>
                    {/* <CartesianGrid strokeDasharray="3 3" /> */}
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#EF404A" radius={[5, 5, 0, 0]} />
                </RechartsBarChart>
            </ResponsiveContainer>
        </div>
    );
};


export default AgeDistributionBarChart;