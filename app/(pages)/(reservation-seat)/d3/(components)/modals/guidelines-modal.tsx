'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ArrowDown, ArrowRight, ArrowUp, ArrowLeft, MousePointer2 } from "lucide-react"



const GuidelinesPopup = ({ active, setModal }: { active: boolean, setModal: (active: boolean) => void }) => {
    return (
        <Dialog
            open={active}
            onOpenChange={setModal}
        >
            <DialogContent className="dark:bg-tertiary bg-white border border-gray-50 dark:border-borderDark">
                <DialogHeader>
                    <DialogTitle>Guidelines</DialogTitle>
                    <DialogDescription>
                        <div className="flex flex-col gap-4 mt-4">
                            {/* <h3 className="text-lg font-semibold text-gray-900">Grid Guidelines</h3> */}
                            <p className="text-gray-500">
                                <div className="flex flex-row gap-2 items-center justify-start">
                                    <div className="bg-[#FAFAFA] rounded-full p-2 flex flex-row gap-2 items-center justify-center">
                                        <ArrowDown className="w-5 h-5 text-primary" />
                                        <span className="text-gray-500 text-sm">OR</span>
                                        <ArrowRight className="w-5 h-5 text-primary" />
                                    </div>
                                    <span className="text-gray-500 text-sm">Increase Seat Count</span>
                                </div>
                                <div className="flex flex-row gap-2 items-center justify-start mt-4">
                                    <div className="bg-[#FAFAFA] rounded-full p-2 flex flex-row gap-2 items-center justify-center">
                                        <ArrowUp className="w-5 h-5 text-primary" />
                                        <span className="text-gray-500 text-sm">OR</span>
                                        <ArrowLeft className="w-5 h-5 text-primary" />
                                    </div>
                                    <span className="text-gray-500 text-sm">Decrease Seat Count</span>
                                </div>
                                <div className="flex flex-row gap-2 items-center justify-start mt-4">
                                    <div className="bg-[#FAFAFA] rounded-full p-2 flex flex-row gap-2 items-center justify-center">
                                        <span className="text-gray-500 text-sm">Ctrl+C</span>
                                    </div>
                                    <span className="text-gray-500 text-sm">Copy Grid</span>
                                </div>
                                <div className="flex flex-row gap-2 items-center justify-start mt-4">
                                    <div className="bg-[#FAFAFA] rounded-full p-2 flex flex-row gap-2 items-center justify-center">
                                        <span className="text-gray-500 text-sm">Ctrl+V</span>
                                    </div>
                                    <span className="text-gray-500 text-sm">Paste Grid</span>
                                </div>
                                <div className="flex flex-row gap-2 items-center justify-start mt-4">
                                    <div className="bg-[#FAFAFA] rounded-full p-2 flex flex-row gap-2 items-center justify-center">
                                        <MousePointer2 className="w-5 h-5 text-primary" />
                                    </div>
                                    <span className="text-gray-500 text-sm">Double Click on Shape to Resize</span>
                                </div>
                                <div className="flex flex-row gap-2 items-center justify-start mt-4">
                                    <div className="bg-[#FAFAFA] rounded-full p-2 flex flex-row gap-2 items-center justify-center">
                                        <MousePointer2 className="w-5 h-5 text-primary" />
                                    </div>
                                    <span className="text-gray-500 text-sm">Click on Shape to Exit Resize</span>
                                </div>
                            </p>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}


export default GuidelinesPopup