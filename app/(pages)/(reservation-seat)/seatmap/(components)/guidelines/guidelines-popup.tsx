import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Info, Pen, ShapesIcon, Text } from 'lucide-react'

const GuidelinesDialog: React.FC<{
    open: boolean
    onOpenChange: (open: boolean) => void
}> = ({ open, onOpenChange }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col p-0 overflow-y-auto">
                <DialogTitle className="p-6 pb-2">Drawing Canvas Guidelines</DialogTitle>
                <ScrollArea className="flex-grow overflow-y-auto">
                    <div className="space-y-6 p-6 pt-2">
                        {/* Drawing Areas Section */}
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Pen className="w-5 h-5" />
                                Drawing Areas
                            </h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Click the pen icon to start drawing mode</li>
                                <li>Click points on the canvas to create area vertices</li>
                                <li>Close the shape by clicking near the starting point</li>
                                <li>Name your area when prompted</li>
                                <li>Click any area to select it and access the toolbar options:
                                    <ul className="list-disc pl-5 mt-1">
                                        <li>Add seats: Configure seating layout</li>
                                        <li>Mark as layout: Toggle area as structural element</li>
                                        <li>Change color: Customize area appearance</li>
                                        <li>Delete area: Remove the selected area</li>
                                    </ul>
                                </li>
                            </ul>
                        </div>

                        {/* Text Elements Section */}
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Text className="w-5 h-5" />
                                Text Elements
                            </h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Click the text icon to add new text</li>
                                <li>Drag text to reposition</li>
                                <li>Click text to access the toolbar options:
                                    <ul className="list-disc pl-5 mt-1">
                                        <li>Edit text content and style</li>
                                        <li>Delete text element</li>
                                    </ul>
                                </li>
                            </ul>
                        </div>

                        {/* Icons Section */}
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <ShapesIcon className="w-5 h-5" />
                                Icons (Stairs & Gates)
                            </h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Click either icon button to add to canvas</li>
                                <li>Drag icons to reposition</li>
                                <li>Click an icon to access the toolbar options:
                                    <ul className="list-disc pl-5 mt-1">
                                        <li>Scale up/down: Adjust icon size</li>
                                        <li>Delete icon</li>
                                    </ul>
                                </li>
                            </ul>
                        </div>

                        {/* Tips Section */}
                        <div className="bg-yellow-50 p-4 rounded-lg">
                            <h3 className="text-sm font-semibold flex items-center gap-2">
                                <Info className="w-4 h-4" />
                                Tips
                            </h3>
                            <ul className="text-sm mt-1 list-disc pl-5 space-y-1">
                                <li>Click empty canvas areas to deselect any selected items</li>
                                <li>Use layout areas to mark non-seating structural elements</li>
                                <li>Plan your layout before adding detailed seating configurations</li>
                            </ul>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}

export default GuidelinesDialog