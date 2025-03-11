"use client"
import React, { useState } from "react"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RefundRequest } from "@/app/_types/refunds-types"
import { axiosErrorHandler, formatDate } from "@/app/_utils/utility-functions"
import { ChangeRefundStatus } from "@/app/_apis/refunds-apis"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"


export function RefundDetails({ request, getRefundRequests }: { request: RefundRequest, getRefundRequests: () => void }) {
    // Helper function to safely capitalize strings
    const capitalizeString = (str: string | null | undefined) => {
        if (!str) return 'N/A';
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const [isLoading, setIsLoading] = useState(false);

    //API to change refund status
    const handleChangeRefundStatus = async (refundId: string, status: string) => {
        setIsLoading(true);
        const loadingToast = toast.loading('Processing refund status change...');
        try {
            const response = await ChangeRefundStatus(refundId, status);
            if (response.status === true) {
                toast.dismiss(loadingToast);
                toast.success("Refund status changed successfully");
                getRefundRequests();
            } else {
                toast.dismiss(loadingToast);
                toast.error("Failed to change refund status");
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            console.error("Error changing refund status:", error);
            axiosErrorHandler(error, "Error changing refund status");
        } finally {
            setIsLoading(false);
        }
    }

    const router = useRouter();

    return (
        <div className="p-6 bg-gray-50 space-y-6">
            <div className="grid grid-cols-2 gap-x-16 gap-y-4 max-w-2xl">
                <div>
                    <p className="text-sm text-gray-500">Customer Name:</p>
                    <p className="font-medium">{request.created_by || 'N/A'}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Customer Email:</p>
                    <p className="font-medium">{request.user_email || 'N/A'}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Customer Phone:</p>
                    <p className="font-medium">{request.user_phone || 'N/A'}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Order ID:</p>
                    <p className="font-medium">{request.order_id || 'N/A'}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Order Type:</p>
                    <p className="font-medium">{capitalizeString(request.order_type)}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Transaction ID:</p>
                    <p className="font-medium">{request.payment_id || 'N/A'}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Refund Requested On:</p>
                    <p className="font-medium">{request.created_at ? formatDate(request.created_at) : 'N/A'}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Date Purchased:</p>
                    <p className="font-medium">{request.order_date ? formatDate(request.order_date) : 'N/A'}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Refund Reason:</p>
                    <p className="font-medium">{request.reason || 'N/A'}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Event Name:</p>
                    <p className="font-medium">{request.event_name || 'N/A'}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Refund Status:</p>
                    <span className={`px-2 py-1 rounded-full text-xs ${request.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : request.status === "Approved"
                                ? "bg-green-100 text-green-800"
                                : request.status === "Declined"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-blue-100 text-blue-800"
                        }`}>{capitalizeString(request.status)}</span>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Total Paid:</p>
                    <p className="font-medium">
                        {request.refund_amount ? `${request.refund_amount} ${request.currency || ''}` : 'N/A'}
                    </p>
                </div>
            </div>

            <div className="flex gap-4">
                <Button 
                    className="bg-green-500 hover:bg-green-600 text-white" 
                    onClick={() => handleChangeRefundStatus(request.refund_id, "approved")}
                    disabled={isLoading}
                >
                    <Check className="mr-2 h-4 w-4" />
                    {isLoading ? 'Processing...' : 'Approve Refund'}
                </Button>
                <Button 
                    variant="outline" 
                    className="border-red-200 text-red-500 hover:bg-red-50" 
                    onClick={() => handleChangeRefundStatus(request.refund_id, "declined")}
                    disabled={isLoading}
                >
                    <X className="mr-2 h-4 w-4" />
                    {isLoading ? 'Processing...' : 'Decline Refund'}
                </Button>
                <Button 
                    className="bg-black text-white hover:bg-gray-800"
                    onClick={() => router.push(`/order-details/${request.order_id}`)}
                    disabled={isLoading}
                >
                    View Order Details
                </Button>
            </div>
        </div>
    )
}

