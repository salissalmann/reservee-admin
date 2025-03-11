import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import React from 'react'
import { Ticket } from 'lucide-react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import QRScanner from '@/app/_components/_features/_qr/qr-scanner'
import FileUpload from '@/app/_components/_features/_qr/file-upload'
import ManualEntry from '@/app/_components/_features/_qr/manual-entry'

export default function ScanningScreen(
    {
        handleTicketValidation,
        loading,
        isScanning,
        setIsScanning,
        handleVerifyTicket,
        setScanError,
        pageVariants,
        cardVariants
    }:
    {
        handleTicketValidation: (ticketId: string) => void,
        loading: boolean,
        isScanning: boolean,
        setIsScanning: (isScanning: boolean) => void,
        handleVerifyTicket: (ticketCode: string) => void,
        setScanError: (scanError: string | null) => void,
        pageVariants: any,
        cardVariants: any
    }
) {

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            className="w-full mx-auto md:p-4 bg-white dark:bg-tertiary"
        >
            {/* Header Section */}
            <header>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap items-center justify-between mx-auto pb-4"
                >
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Ticket className="h-5 w-5" /> Tickets
                    </h1>
                    <div className="flex flex-col md:flex-row items-center gap-4 md:mt-0 mt-4">
                        <div className="hidden md:block">
                            <Select defaultValue="vienna-2025">
                                <SelectTrigger className="w-[200px] bg-white dark:bg-tertiary dark:border-borderDark border-gray-200">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="vienna-2025">Vienna Jazz Nights 2025</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </motion.div>
            </header>

            {/* Main Content */}
            <motion.div variants={cardVariants} initial="initial" animate="animate">
                <Card className="mb-8 pt-4 md:pt-0 md:p-4 bg-gray-100 dark:bg-tertiary dark:border-borderDark">
                    <CardContent>
                        <div className="grid md:grid-cols-[40%_10%_40%] gap-8">
                            {/* QR Scanner Section */}
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="space-y-2"
                            >
                                <h2 className="text-lg font-semibold">Scan QR Code</h2>
                                <p className="text-gray-600 dark:text-white">Scan the QR code on your ticket to verify its validity.</p>
                                <QRScanner
                                    onScanSuccess={handleTicketValidation}
                                    isLoading={loading}
                                    isScanning={isScanning}
                                    setIsScanning={setIsScanning}
                                />
                            </motion.div>

                            {/* Divider */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className='flex md:flex-col gap-4 items-center justify-center'
                            >
                                <div className="text-sm text-gray-500">OR</div>
                            </motion.div>

                            {/* Upload and Manual Entry Section */}
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <h2 className="text-lg font-semibold">Upload QR Code</h2>
                                    <p className="text-gray-600 dark:text-white">Upload the QR code on your ticket to verify its validity.</p>
                                    <FileUpload
                                        onUploadSuccess={handleTicketValidation}
                                        isLoading={loading}
                                        setScanError={setScanError}
                                    />
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium">Having trouble with the QR Code?</p>
                                        <ManualEntry
                                            onSubmit={handleVerifyTicket}
                                            isLoading={loading}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    )
}