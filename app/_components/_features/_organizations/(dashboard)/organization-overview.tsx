import React from 'react'
import Button from "@/app/_components/_layout-components/button";
import { OrganizationData } from "@/app/_types/organization-types";
import { Card, CardContent } from "@/components/ui/card";
import {
    Eye,
    PenSquare,
    VerifiedIcon,
} from "lucide-react";
import Image from "next/image";
import { useCheckRouteAccess } from "@/app/_utils/check-route-access";
import { useRouter } from "next/navigation";
import { GetCurrencyIcon } from '@/app/_components/_layout-components/currency-icons';
interface OrganizationOverviewProps {
    organization: OrganizationData;
    analytics: any;
    loading: boolean;
}

export default function OrganizationOverview({ organization, analytics, loading }: OrganizationOverviewProps) {
    const router = useRouter();
    const checkRouteAccess = useCheckRouteAccess();


    const AverageOrderValue = (analytics: any) => {
        if (!analytics || analytics.length === 0) return "No Data Available";

        // Group by currency
        const averagesByCurrency = analytics.reduce((acc: { [key: string]: { total: number, orders: number } }, item: any) => {
            const currency = item.currency;
            if (!acc[currency]) {
                acc[currency] = { total: 0, orders: 0 };
            }
            acc[currency].total += item.average_order_value * item.total_paid_orders;
            acc[currency].orders += item.total_paid_orders;
            return acc;
        }, {});

        // Return JSX elements array
        return (
            <>
                {Object.entries(averagesByCurrency).map(([currency, data], index) => {
                    const { total, orders } = data as { total: number, orders: number };
                    const average = orders > 0 ? total / orders : 0;
                    return (
                        <span key={currency} className="flex items-center gap-1">
                            {index > 0 && ", "}
                            {GetCurrencyIcon(currency, 5)}
                            {average.toFixed(2)}
                        </span>
                    );
                })}
            </>
        );
    }


    const LastOrderDate = (analytics: any) => {
        //from all items pick the last_updated_at
        if (!analytics || analytics.length === 0) return "No Data Available";

        const lastUpdatedAt = analytics.reduce((latest: any, item: any) => {
            return new Date(item.last_updated_at) > new Date(latest.last_updated_at) ? item : latest;
        }, analytics[0]);

        //format the date to DD/MM/YYYY and time to HH:MM AM/PM
        const formattedDate = new Date(lastUpdatedAt.last_updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const formattedTime = new Date(lastUpdatedAt.last_updated_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        return `${formattedDate} ${formattedTime}`;
    }

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


    return (
        <Card className="bg-[#F6F6F6] dark:bg-tertiary border dark:border-borderDark border-gray-100 rounded-lg shadow-sm ">
            <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                    <svg
                        viewBox="0 0 24 24"
                        className="w-6 h-6 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M3 21h18M3 7v14M21 7v14M6 7V3h12v4M6 11h12M6 15h12M6 19h12" />
                    </svg>
                    <h2 className="text-xl font-bold">Organization Overview</h2>
                </div>

                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                        <Image
                            src={
                                organization.logo || "/placeholder.svg?height=40&width=40"
                            }
                            alt={organization.name}
                            width={48}
                            height={48}
                            className="object-contain"
                        />
                    </div>
                    <div className="w-full">
                        <div className="flex flex-wrap items-center gap-2 justify-between w-full">
                            <h3 className="text-lg font-bold">{organization.name}</h3>
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-[#53D2581F] text-xs rounded-xl text-tertiary dark:text-green-500">
                                <VerifiedIcon className="w-4 h-4 text-green-600 dark:text-green-500" />
                                Verified Organization
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {/* Active Events Card */}
                    <div className="bg-white dark:bg-tertiary rounded-xl p-5 shadow-sm border border-gray-100 dark:border-borderDark">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                                <svg
                                    className="w-5 h-5 text-blue-600 dark:text-blue-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="font-medium text-gray-800 dark:text-gray-200">Active Events</h3>
                        </div>
                        <div className="ml-1">
                            {loading ? (
                                <div className="h-9 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                            ) : (
                                analytics?.length ? (
                                    <span className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.length}</span>
                                ) : (
                                    <span className="text-gray-500 dark:text-gray-400">No Data Available</span>
                                )
                            )}
                        </div>
                    </div>

                    {/* Total Revenue Card */}
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

                    {/* Last Order Date Card */}
                    <div className="bg-white dark:bg-tertiary rounded-xl p-5 shadow-sm border border-gray-100 dark:border-borderDark">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="font-medium text-gray-800 dark:text-gray-200">Last Order</h3>
                        </div>
                        <div className="ml-1">
                            {loading ? (
                                <div className="h-7 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                            ) : (
                                <span className="text-xl font-bold text-gray-900 dark:text-white">{LastOrderDate(analytics)}</span>
                            )}
                        </div>
                    </div>

                    {/* Average Order Value Card */}
                    <div className="bg-white dark:bg-tertiary rounded-xl p-5 shadow-sm border border-gray-100 dark:border-borderDark">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2.5 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                                <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="font-medium text-gray-800 dark:text-gray-200">Average Order</h3>
                        </div>
                        <div className="ml-1">
                            {loading ? (
                                <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                            ) : (
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">{AverageOrderValue(analytics)}</span>
                            )}
                        </div>
                    </div>
                </div>


                <div className="space-y-2">
                    <h4 className="font-medium">Description:</h4>
                    <p
                        className="text-gray-600 text-sm leading-relaxed dark:text-gray-300"
                        dangerouslySetInnerHTML={{ __html: organization?.description }}
                    ></p>
                </div>

                <div className="flex flex-wrap  gap-3 mt-6">
                    <Button
                        btnStyle="rounded-fill"
                        btnCover="primary-button"
                        icon={<PenSquare className="w-4 h-4 mr-2" />}
                        className="text-sm w-full md:w-fit flex items-center justify-center"
                        onClick={() => {
                            if (checkRouteAccess("/edit-organization")) {
                                router.push(`/edit-organization/${organization.id}`);
                            }
                        }}
                    >
                        Edit Organization Details
                    </Button>
                    {/* <Button
                        btnStyle="rounded-fill"
                        btnCover="primary-button"
                        icon={<Eye className="w-4 h-4 mr-2" />}
                        className=" w-full md:w-fit text-sm bg-[#E5F2FC] text-[#4476C8]  border border-[#E5F2FC] flex items-center justify-center"
                        onClick={() => {
                            if (checkRouteAccess("/analytics")) {
                                router.push(`/analytics?org_id=${organization.id}`);
                            }
                        }}
                    >
                        View Analytics
                    </Button> */}
                </div>
            </CardContent>
        </Card>

    )
}