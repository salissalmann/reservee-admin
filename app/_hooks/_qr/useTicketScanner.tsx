import { useState } from "react"
import { TicketData } from "@/app/_types/qr-types"
import { toast } from "react-hot-toast"
import { ValidateQRCode } from "@/app/_apis/tickets-apis"
import { axiosErrorHandler } from "@/app/_utils/utility-functions"

const useTicketScanner = () => {
    const [isScanning, setIsScanning] = useState(false)
    const [manualTicketId, setManualTicketId] = useState("")
    const [verificationTicket, setVerificationTicket] = useState<TicketData | null>(null)
    const [isVerificationPopupOpen, setIsVerificationPopupOpen] = useState(false)
    const [isTicketConfirmed, setIsTicketConfirmed] = useState(false)
    const [loading, setLoading] = useState(false)
    const [scanError, setScanError] = useState<string | null>(null)

    const extractTicketCode = (ticketId: string) => {
        // /qr-identity/x/code
        //skip the first part /qr-identity/eventid/code
        const eventId = ticketId.split("/qr-identity/")[1]?.split("/")[0]
        const code = ticketId.split("/qr-identity/")[1]?.split("/")[1]
        return { eventId, code }
    }

    const handleVerifyTicket = async (ticket_code: string) => {
        try {
            setLoading(true)
            if (!ticket_code) {
                throw new Error("Invalid ticket code")
            }
            
            const response = await ValidateQRCode(ticket_code)
            if (response.statusCode === 200) {
                toast.success("Ticket is valid")
                setIsTicketConfirmed(true)

                setTimeout(() => {
                    setIsVerificationPopupOpen(false)
                }, 4000)
            } else {
                toast.error(response.message)
                setIsTicketConfirmed(false)
            }
        } catch (error) {
            console.error("Error verifying ticket:", error)
            axiosErrorHandler(error, "Error occurred while verifying ticket")
            setIsTicketConfirmed(false)
        } finally {
            setLoading(false)
        }
    }

    const handleTicketValidation = (ticketId: string) => {
        setScanError(null)
        setIsTicketConfirmed(false)
        setVerificationTicket({ id: ticketId })
        setIsVerificationPopupOpen(true)
    }

    return {
        isScanning,
        setIsScanning,
        manualTicketId,
        setManualTicketId,
        verificationTicket,
        isVerificationPopupOpen,
        setIsVerificationPopupOpen,
        isTicketConfirmed,
        loading,
        scanError,
        setScanError,
        extractTicketCode,
        handleVerifyTicket,
        handleTicketValidation
    }
}

export default useTicketScanner