"use client"
import EventLayout from '@/app/_components/_features/_events/event-layout'
import { useEffect, useState } from "react"
import { Info, Loader2, Search } from "lucide-react"
import { RefundFilters } from '../../../../_components/_features/_refunds/refund-filters'
import { RefundTable } from "../../../../_components/_features/_refunds/refunds-table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GetRefunds } from '@/app/_apis/refunds-apis'
import { axiosErrorHandler } from '@/app/_utils/utility-functions'
import { RefundRequest } from '@/app/_types/refunds-types'

export const runtime = 'edge';

export default function Page({ params }: { params: { id: string } }) {
    return (
        <EventLayout eventId={params.id} isActive="refund-requests">
            <div className='min-h-screen bg-gray-50/50'>
                <RefundRequests params={params} />
            </div>
        </EventLayout>
    )
}

interface RefundRequestsProps {
    params: { id: string }
}

function RefundRequests({ params }: RefundRequestsProps) {

    const [retrievedRefundRequests, setRetrievedRefundRequests] = useState<RefundRequest[]>([])
    const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")

    const get_refund_requests = async () => {
        try {
            setLoading(true)
            const response = await GetRefunds(params.id)
            if (response.status === true) {
                //Sort refund requests by created_at date
                response.data.sort((a: RefundRequest, b: RefundRequest) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                setRetrievedRefundRequests(response.data)
                setRefundRequests(response.data)
            }
            else {
                setError("Something went wrong, please try again later.")
            }
        } catch (error) {
            axiosErrorHandler(error, "Something went wrong, please try again later.")
            setError("Something went wrong, please try again later.")
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (query: string) => {
        setSearchQuery(query)
        const lowercaseQuery = query.toLowerCase().trim()
        
        if (!lowercaseQuery) {
            setRefundRequests(retrievedRefundRequests)
            return
        }

        const filtered = retrievedRefundRequests.filter(request => 
            request.created_by?.toLowerCase().includes(lowercaseQuery) ||
            request.payment_id?.toLowerCase().includes(lowercaseQuery) ||
            request.user_phone?.toLowerCase().includes(lowercaseQuery)
        )
        setRefundRequests(filtered)
    }

    useEffect(() => {
        get_refund_requests()
    }, [])
    
    if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="h-6 w-6 animate-spin" /></div>
    if (error) return <div className="flex justify-center items-center h-screen">{error}</div>

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                    <Info className="h-9 w-9" />
                    <span>Refund Requests</span>
                </h1>
                <Select value={refundRequests[0]?.event_name || 'Event'}>
                    <SelectTrigger className="w-[300px] bg-white">
                        <SelectValue>{refundRequests[0]?.event_name || 'Event'}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={refundRequests[0]?.event_name || 'Event'}>{refundRequests[0]?.event_name || 'Event'}</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <p className="text-sm text-gray-500">Filters:</p>
                    <RefundFilters setRefundRequests={setRefundRequests} retrievedRefundRequests={retrievedRefundRequests} />
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                        className="pl-10 w-full bg-white" 
                        placeholder="Search by customer name, transaction ID, phone..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
            </div>

            <RefundTable refundRequests={refundRequests} getRefundRequests={get_refund_requests} />
        </div>
    )
}

