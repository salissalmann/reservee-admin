import { Pie, PieChart, ResponsiveContainer } from 'recharts';

const GenderDistributionPieChartNormal = ({ DataFormattingForRegularEvents, orders }: { DataFormattingForRegularEvents: any, orders: any }) => {
    
    const Gender_Distribution = () => {
        const gender_distribution = { male: 0, female: 0, other: 0 }
        DataFormattingForRegularEvents(orders).forEach((order: any) => {
            const gender = order.gender?.toLowerCase() || 'other'
            if (gender === 'male') gender_distribution.male++
            else if (gender === 'female') gender_distribution.female++
            else gender_distribution.other++
        })
        return gender_distribution
    }


    const gender_distribution = Gender_Distribution()
    const chartData = Object.entries(gender_distribution).map(([name, data]) => ({
        name,
        value: data
    }))
    return (
        <div className='w-full h-[300px]'>
            <div className='text-gray-700 dark:text-white text-md font-bold'>Gender Distribution</div>
            <ResponsiveContainer width="100%" height="100%" className='bg-white dark:bg-tertiary rounded-lg p-4 border border-gray-200 dark:border-borderDark'>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={100}
                        fill="#4476C8"
                        dataKey="value"
                    />

                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

export default GenderDistributionPieChartNormal;