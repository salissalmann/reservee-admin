import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { LayoutPanelLeft, Info, Move } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'


const GuidelinesDialog: React.FC<{
    open: boolean
    onOpenChange: (open: boolean) => void
}> = ({ open, onOpenChange }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col p-0 overflow-y-auto">
                <DialogTitle className="p-6 pb-2">Editor Guidelines</DialogTitle>
                <ScrollArea className="flex-grow overflow-y-auto">
                    <div className="space-y-6 p-6 pt-2">
                        {/* Grid Section */}
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <LayoutPanelLeft className="w-5 h-5" />
                                Grid Management
                            </h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Click the grid icon to add a new seat grid (default 5x5)</li>
                                <li>Right-click any grid to access the context menu for move, transform, copy, or delete options</li>
                                <li>When a grid is selected in move mode (green outline), drag to reposition</li>
                                <li>When a grid is selected in transform mode (blue outline), use the control panel to:
                                    <ul className="list-disc pl-5 mt-1">
                                        <li>Adjust rotation using the slider or quick-rotate buttons</li>
                                        <li>Scale the grid size using the scale slider</li>
                                    </ul>
                                </li>
                                <li>Use arrow keys to adjust grid dimensions:
                                    <ul className="list-disc pl-5 mt-1">
                                        <li>↑/↓: Increase/decrease rows</li>
                                        <li>←/→: Increase/decrease columns</li>
                                    </ul>
                                </li>
                                <li>Keyboard shortcuts:
                                    <ul className="list-disc pl-5 mt-1">
                                        <li>Ctrl/⌘ + C: Copy selected grid</li>
                                        <li>Ctrl/⌘ + V: Paste copied grid</li>
                                    </ul>
                                </li>
                            </ul>
                        </div>

                        {/* Text Section */}
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                                    <path d="M8 4V20M17 12V20M6 20H10M15 20H19M13 7V4H3V7M21 14V12H13V14"
                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Text Management
                            </h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Click the text icon to add new text</li>
                                <li>Double-click text to edit content directly</li>
                                <li>Right-click text for move, transform, or delete options</li>
                                <li>In transform mode, use the control panel to:
                                    <ul className="list-disc pl-5 mt-1">
                                        <li>Change font size, family, and color</li>
                                        <li>Adjust rotation</li>
                                        <li>Edit text content</li>
                                    </ul>
                                </li>
                            </ul>
                        </div>

                        {/* Canvas Navigation */}
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Move className="w-5 h-5" />
                                Canvas Navigation
                            </h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Zoom: Use Ctrl/⌘ + Mouse wheel or pinch gesture</li>
                                <li>Pan: Click and drag on empty canvas areas</li>
                                <li>Click empty canvas areas to deselect any selected items</li>
                            </ul>
                        </div>

                        {/* Performance Note */}
                        <div className="bg-yellow-50 p-4 rounded-lg">
                            <h3 className="text-sm font-semibold flex items-center gap-2">
                                <Info className="w-4 h-4" />
                                Performance Note
                            </h3>
                            <p className="text-sm mt-1">
                                For optimal performance, we recommend keeping the total number of seats between 2000-3000 per area.
                            </p>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}

export default GuidelinesDialog