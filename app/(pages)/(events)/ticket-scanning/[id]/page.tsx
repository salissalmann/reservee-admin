"use client"

import type React from "react"
  
import { Toaster } from "react-hot-toast"
import EventLayout from "@/app/_components/_features/_events/event-layout"
import useTicketScanner from "@/app/_hooks/_qr/useTicketScanner"
import VerifcationModal from "@/app/_components/_features/_qr/verifcation-modal"
import ScanningScreen from "@/app/_components/_features/_qr/scanning-screen"

export const runtime = 'edge';

export default function TicketScanner({ params }: { params: { id: string } }) {
    const {
        isScanning,
        setIsScanning,
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
    } = useTicketScanner()

    // Animation variants
    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    }

    const cardVariants = {
        initial: { opacity: 0, scale: 0.95 },
        animate: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    }

        
    return (
        <>
             
            <Toaster />
            <EventLayout eventId={params.id} isActive="ticket-scanning">
                <ScanningScreen
                    handleTicketValidation={handleTicketValidation}
                    loading={loading}
                    isScanning={isScanning}
                    setIsScanning={setIsScanning}
                    handleVerifyTicket={handleVerifyTicket}
                    setScanError={setScanError}
                    pageVariants={pageVariants}
                    cardVariants={cardVariants}
                />
            </EventLayout>
             

            <VerifcationModal
                isVerificationPopupOpen={isVerificationPopupOpen}
                setIsVerificationPopupOpen={setIsVerificationPopupOpen}
                isTicketConfirmed={isTicketConfirmed}
                verificationTicket={verificationTicket}
                extractTicketCode={extractTicketCode}
                scanError={scanError}
                handleVerifyTicket={handleVerifyTicket}
                loading={loading}
            />


        </>
    )
}


