import { motion } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Check, XCircle, Loader2 } from 'lucide-react'
import { TicketData } from '@/app/_types/qr-types'

export default function VerifcationModal(
    { 
        isVerificationPopupOpen, 
        setIsVerificationPopupOpen, 
        isTicketConfirmed, 
        verificationTicket, 
        extractTicketCode, 
        scanError, 
        handleVerifyTicket, 
        loading 
    }: 
    { 
        isVerificationPopupOpen: boolean, 
        setIsVerificationPopupOpen: (open: boolean) => void, 
        isTicketConfirmed: boolean, 
        verificationTicket: TicketData | null, 
        extractTicketCode: (ticketId: string ) => { eventId: string, code: string }, 
        scanError: string | null, 
        handleVerifyTicket: (ticketCode: string) => void, 
        loading: boolean 
    }
) {
  return (
    <> {/* Verification Dialog */}
    <Dialog open={isVerificationPopupOpen} onOpenChange={setIsVerificationPopupOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Verify Ticket</DialogTitle>
                <DialogDescription>Please confirm the ticket details</DialogDescription>
            </DialogHeader>
            
            <AnimatePresence>
                {isTicketConfirmed ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center justify-center space-y-4"
                    >
                        <motion.div
                            initial={{ rotate: 0 }}
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 0.5 }}
                        >
                            <Check className="h-16 w-16 text-green-500" />
                        </motion.div>
                        <p className="text-xl font-bold text-green-600">Ticket Confirmed!</p>
                        <div className="flex flex-row items-center justify-center gap-2 mt-4">
                            <Button onClick={() => setIsVerificationPopupOpen(false)} className="bg-white border-gray-200 text-gray-600 rounded-full font-bold hover:scale-105 hover:shadow-none transition-all duration-300 shadow-2xl" variant="outline">
                                Close 
                            </Button>
                        </div>
                    </motion.div>
                ) : (
                    <>
                        {verificationTicket && (
                            <div className="space-y-4">
                                <div className="bg-gray-100 p-4 rounded-lg">
                                    <p><strong>Ticket Code:</strong> {extractTicketCode(verificationTicket.id).code}</p>
                                </div>
                                
                                {scanError && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center space-x-2 bg-red-50 p-3 rounded-lg"
                                    >
                                        <XCircle className="h-6 w-6 text-pink-500" />
                                        <p className="text-pink-600">{scanError}</p>
                                    </motion.div>
                                )}
                            </div>
                        )}
                        
                        <DialogFooter>
                            <Button 
                                onClick={() => setIsVerificationPopupOpen(false)}
                                className="bg-white border-gray-200 text-gray-600 rounded-full font-bold hover:scale-105 hover:shadow-none transition-all duration-300 shadow-2xl"
                                variant="outline"
                            >
                                Cancel
                            </Button>
                            <Button 
                                className="flex items-center gap-2 bg-primary text-white rounded-full font-bold hover:scale-105 hover:shadow-none transition-all duration-300 shadow-2xl"
                                onClick={() => handleVerifyTicket(extractTicketCode(verificationTicket?.id || "").code)}
                                disabled={loading}
                            >
                                {loading ? 
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 
                                    <Check className="h-4 w-4" />
                                }
                                {loading ? "Confirming Ticket" : "Confirm Ticket"}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </AnimatePresence>
        </DialogContent>
    </Dialog>
    
    </>
  )
}
