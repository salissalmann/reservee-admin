import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Check } from "lucide-react"
import { ManualEntryProps } from "@/app/_types/qr-types"

const ManualEntry: React.FC<ManualEntryProps> = ({ onSubmit, isLoading }) => {
    const [ticketId, setTicketId] = useState("")

    const handleSubmit = () => {
        if (ticketId.trim()) {
            onSubmit(ticketId)
            setTicketId("")
        }
    }

    return (
        <div className="flex gap-2 md:flex-row flex-col">
            <Input
                placeholder="Enter Ticket ID manually"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                className="bg-gray-50 border-gray-200 rounded-full shadow-2xl hover:shadow-none transition-all duration-300"
            />
            <Button 
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center gap-2 bg-tertiary text-white rounded-full font-bold hover:scale-105 hover:shadow-none transition-all duration-300 shadow-2xl"
            >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                {isLoading ? "Verifying Ticket" : "Verify Ticket"}
            </Button>
        </div>
    )
}

export default ManualEntry