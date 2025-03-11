import { Grid, Point } from "@/app/(pages)/(reservation-seat)/seatmap/types"
import { LayoutPanelLeft, RotateCcw, RotateCw, Maximize2, Copy, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import * as d3 from 'd3'

const getNextGridId = (grids: Grid[]) => Math.max(0, ...grids.map(g => g.id)) + 1

const calculateStartIndex = (grids: Grid[]) => {
    if (grids.length === 0) return 1

    let maxIndex = 1
    grids.forEach(grid => {
        const lastIndex = (grid.seatStartIndex || 1) + (grid.size.rows * grid.size.cols) - 1
        maxIndex = Math.max(maxIndex, lastIndex + 1)
    })
    return maxIndex
}

const ControlBar: React.FC<{
    grids: Grid[]
    setGrids: React.Dispatch<React.SetStateAction<Grid[]>>
    setSelectedGrid: React.Dispatch<React.SetStateAction<number | null>>
    selectedGrid: Grid | undefined
    onRotationChange: (rotation: number) => void
    onScaleChange: (scale: number) => void
    isUserMode: boolean
}> = ({
    grids,
    setGrids,
    setSelectedGrid,
    selectedGrid,
    onRotationChange,
    onScaleChange,
    isUserMode
}) => {
        if (!selectedGrid) return null

        const [localScale, setLocalScale] = useState(selectedGrid.scale || 1)
        useEffect(() => {
            setLocalScale(selectedGrid.scale || 1)
        }, [selectedGrid])

        const handleDeleteGrid = (id: number) => {
            setGrids(prev => {
                const newGrids = prev.filter(g => g.id !== id)
                let currentIndex = 1
                return newGrids.map(grid => {
                    const updatedGrid = {
                        ...grid,
                        seatStartIndex: currentIndex
                    }
                    currentIndex += grid.size.rows * grid.size.cols
                    return updatedGrid
                })
            })
            setSelectedGrid(null)
        }

        const handleCopyGrid = (gridId: number) => {
            if (isUserMode) {
                return
            }
            const gridToCopy = grids.find(g => g.id === gridId)
            if (gridToCopy) {
                const startIndex = calculateStartIndex(grids)
                const newGrid: Grid = {
                    ...gridToCopy,
                    id: getNextGridId(grids),
                    position: {
                        x: gridToCopy.position.x + 50,
                        y: gridToCopy.position.y + 50
                    },
                    seatStartIndex: startIndex
                }
                setGrids(prev => [...prev, newGrid])
            }
        }

        return (
            <div className="fixed top-0 md:top-1/2 left-2 md:-translate-y-1/2 bg-white p-4 rounded-lg shadow-lg polygon-bottom-bar border border-gray-300 z-10">
                <div className="text-sm text-gray-500">
                    <div className="control-toolbar">
                        <div className="space-y-3">
                            <div className="w-full">
                                <div className="hidden md:flex items-center justify-between">
                                    {/*seats*/}
                                    <div className="px-4 py-2 text-black rounded-lg cursor-pointer hover:scale-105 transition-all duration-300 border border-gray-200 shadow-2xl w-full flex justify-center items-center gap-2 mb-4">
                                        <LayoutPanelLeft className="w-4 h-4" />
                                        <div className="text-sm font-normal">{selectedGrid.size.rows * selectedGrid.size.cols} Seats</div>
                                    </div>
                                </div>
                                <span className="text-xs text-muted-foreground">Rotation</span>
                                <div className="flex flex-row items-center gap-2 mt-2">
                                    <input
                                        type="range"
                                        min="-180"
                                        max="180"
                                        value={selectedGrid.rotation || 0}
                                        onChange={(e) => {
                                            onRotationChange(Number(e.target.value))
                                        }}
                                        className="w-full h-2 bg-red-500 rounded-lg cursor-pointer custom-range"
                                    />
                                </div>
                                <div className="flex flex-row items-center gap-2 mt-4 justify-center dark:!bg-white rounded-full">
                                    <div className="px-4 p-1 text-xs border border-gray-100 rounded-full w-full">
                                        {selectedGrid.rotation || 0}°
                                    </div>
                                    <div
                                        className="text-xs text-gray-500 cursor-pointer"
                                        onClick={() => onRotationChange(0)}
                                    >
                                        Reset
                                    </div>
                                </div>

                                <div className="flex flex-row items-center gap-2 mt-2 justify-center dark:!bg-white rounded-full">
                                    <button
                                        className="p-2 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 cursor-pointer"
                                        onClick={() => {
                                            const newRotation = ((selectedGrid.rotation || 0) - 90 + 360) % 360
                                            onRotationChange(newRotation)
                                        }}
                                    >
                                        <RotateCcw className="w-5 h-5 dark:text-tertiary text-tertiary" />
                                    </button>
                                    <button
                                        className="p-2 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 cursor-pointer"
                                        onClick={() => {
                                            const newRotation = ((selectedGrid.rotation || 0) + 90) % 360
                                            onRotationChange(newRotation)
                                        }}
                                    >
                                        <RotateCw className="w-5 h-5 dark:text-tertiary text-tertiary" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Maximize2 className="w-4 h-4" />
                                    <span className="text-sm font-medium">Scale</span>
                                </div>
                                <span className="text-sm text-gray-500">{localScale.toFixed(2)}x</span>
                            </div>
                            <CustomRangeSlider
                                value={localScale * 100}
                                onChange={(value) => {
                                    const newScale = value / 100
                                    setLocalScale(newScale)
                                }}
                                onChangeEnd={(value) => {
                                    const newScale = value / 100
                                    onScaleChange(newScale)
                                }}
                                min={25}
                                max={300}
                                step={1}
                                className="w-full"
                            />
                        </div>

                        <button
                            onClick={() => handleCopyGrid(selectedGrid.id)}
                            className="px-4 py-2 text-black rounded-lg cursor-pointer hover:scale-105 transition-all duration-300 border border-gray-200 shadow-2xl w-full flex justify-center items-center gap-2 mt-4"
                        >
                            <Copy className="w-4 h-4" />
                            <span className="hidden md:block">Duplicate</span>
                        </button>

                        <button
                            onClick={() => handleDeleteGrid(selectedGrid.id)}
                            className="px-4 py-2 text-primary rounded-lg cursor-pointer hover:scale-105 transition-all duration-300 border border-gray-200 shadow-2xl w-full flex justify-center items-center gap-2 mt-4"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden md:block">Delete</span>
                        </button>

                    </div>
                </div>
            </div>

        )
    }

const CustomRangeSlider: React.FC<{
    value: number
    onChange: (value: number) => void
    onChangeEnd?: (value: number) => void
    min: number
    max: number
    step: number
    className?: string
}> = ({
    value,
    onChange,
    onChangeEnd,
    min,
    max,
    step,
    className
}) => {
        const [isDragging, setIsDragging] = useState(false)

        return (
            <input
                type="range"
                value={value}
                onChange={(e) => {
                    const newValue = parseFloat(e.target.value)
                    onChange(newValue)
                }}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => {
                    setIsDragging(false)
                    onChangeEnd?.(value)
                }}
                onTouchStart={() => setIsDragging(true)}
                onTouchEnd={() => {
                    setIsDragging(false)
                    onChangeEnd?.(value)
                }}
                min={min}
                max={max}
                step={step}
                className={cn(
                    "w-full appearance-none bg-transparent cursor-pointer [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-slate-200",
                    "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:mt-[-4px] [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-grab",
                    "[&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-slate-200",
                    "[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:cursor-grab",
                    className
                )}
            />
        )
    }

const AddGridDialog: React.FC<{
    open: boolean
    onOpenChange: (open: boolean) => void
    onAdd: (rows: number, cols: number) => void
}> = ({ open, onOpenChange, onAdd }) => {
    const [rows, setRows] = useState(5)
    const [cols, setCols] = useState(5)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Grid</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="rows" className="text-right">Rows</Label>
                        <Input
                            id="rows"
                            type="number"
                            value={rows}
                            onChange={e => setRows(parseInt(e.target.value))}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="cols" className="text-right">Columns</Label>
                        <Input
                            id="cols"
                            type="number"
                            value={cols}
                            onChange={e => setCols(parseInt(e.target.value))}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <Button onClick={() => onAdd(rows, cols)}>Add Grid</Button>
            </DialogContent>
        </Dialog>
    )
}


export { ControlBar, AddGridDialog, CustomRangeSlider, getNextGridId, calculateStartIndex }