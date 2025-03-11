import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import Button from '@/app/_components/_layout-components/button'
import { EyeIcon } from 'lucide-react'
import { GetCurrencyIcon } from '@/app/_components/_layout-components/currency-icons';
import { useRouter } from 'next/navigation';


export default function RevenueSection({ analytics, loading }: { analytics: any, loading: boolean }) {

    const CalculateTotalRevenue = (analytics: any) => {
        if (!analytics || analytics.length === 0) return "No data";

        // Group revenues by currency
        const revenueByCurrency = analytics.reduce((acc: { [key: string]: number }, item: any) => {
            const currency = item.currency;
            const revenue = item.total_revenue || 0;
            acc[currency] = (acc[currency] || 0) + revenue;
            return acc;
        }, {});

        // Return JSX elements array instead of string
        return (
            <>
                {Object.entries(revenueByCurrency).map(([currency, amount], index) => (
                    <span key={currency} className="flex items-center">
                        {index > 0 && ", "}
                        {GetCurrencyIcon(currency, 5)}
                        {Number(amount)?.toFixed(2)?.toString()}
                    </span>
                ))}
            </>
        );
    };

    const CalculatePendingPayments = (analytics: any) => {
        if (!analytics || analytics.length === 0) return "No data";

        const pendingRevenueByCurrency = analytics.reduce((acc: { [key: string]: number }, item: any) => {
            const currency = item.currency;
            const pendingRevenue = item.total_pending_revenue || 0;
            acc[currency] = (acc[currency] || 0) + pendingRevenue;
            return acc;
        }, {});

        return (
            <>
                {Object.entries(pendingRevenueByCurrency).map(([currency, amount], index) => (
                    <span key={currency} className="flex items-center">
                        {index > 0 && ", "}
                        {GetCurrencyIcon(currency, 5)}
                        {Number(amount)?.toFixed(2)?.toString()}
                    </span>
                ))}
            </>
        );
    };

    const calculateRefundOrders = (analytics: any) => {
        if (!analytics || analytics.length === 0) return "No data";
        return analytics.reduce((acc: number, item: any) => acc + (item.total_refunded_orders || 0), 0);
    };

    const router = useRouter();

    return (
        <>
            <Card className="dark:bg-tertiary border dark:border-borderDark border-gray-100 bg-[#F6F6F6]">
                <CardContent className="p-6 space-y-6">
                    <h2 className="text-xl font-bold">Finances</h2>
                    <div className="grid justify-between grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-tertiary rounded-xl p-5 shadow-sm border border-gray-100 dark:border-borderDark">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2.5 rounded-lg bg-green-50 dark:bg-green-900/20">
                                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="font-medium text-gray-800 dark:text-gray-200">Total Revenue</h3>
                            </div>
                            <div className="ml-1">
                                {loading ? (
                                    <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                ) : (
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{CalculateTotalRevenue(analytics)}</span>
                                )}
                            </div>
                        </div>
                        <div className="bg-white dark:bg-tertiary rounded-xl p-5 shadow-sm border border-gray-100 dark:border-borderDark">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="font-medium text-gray-800 dark:text-gray-200">Pending Payments</h3>
                            </div>
                            <div className="ml-1">
                                {loading ? (
                                    <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                ) : (
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{CalculatePendingPayments(analytics)}</span>
                                )}
                            </div>
                        </div>
                        <div className="bg-white dark:bg-tertiary rounded-xl p-5 shadow-sm border border-gray-100 dark:border-borderDark">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-900/20">
                                    <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="font-medium text-gray-800 dark:text-gray-200">Refund Orders</h3>
                            </div>
                            <div className="ml-1">
                                {loading ? (
                                    <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                ) : (
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{calculateRefundOrders(analytics)}</span>
                                )}
                            </div>
                        </div>
                    </div>
                 
                    <div className="flex gap-4 flex-wrap  mt-4">
                        <Button
                            className="w-full md:w-fit bg-tertiary dark:bg-tertiary dark:border-borderDark dark:border-tertiary hover:bg-white hover:text-tertiary hover:dark:text-gray-300 hover:border-tertiary items-center justify-center"
                            btnStyle="rounded-fill"
                            btnCover="primary-button"
                            icon={<EyeIcon className="h-4 w-4" />}
                            onClick={() => { router.push("/events/all") }}
                        >
                            View All Events
                        </Button>
                        {/* <Button
                            btnStyle="rounded-fill"
                            btnCover="primary-button"
                            // icon={<Eye className="w-4 h-4 mr-2" />}
                            className=" w-full md:w-fit text-sm bg-[#E5F2FC]   text-[#4476C8] hover:text-[#4476C8] hover:bg-white hover:border-[#4476C8] border border-[#E5F2FC]"
                            onClick={
                                () => { }
                                // router.push(`/analytics?org_id=${organization.id}`)
                            }
                        >
                            Generate Invoice
                        </Button> */}
                    </div>
                </CardContent>
            </Card>
        </>
    )
}