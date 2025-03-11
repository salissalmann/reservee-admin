import { memo } from "react"
import { IText } from "@/app/(pages)/(reservation-seat)/seatmap/types"
import { useRef, useState, useEffect, useCallback } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Trash2 } from "lucide-react"

// Add TextComponent
const TextComponent: React.FC<{
    text: IText
    isSelected: boolean
    mode: 'move' | 'transform' | null
    onSelect: (mode: 'move' | 'transform') => void
    onDrag: (dx: number, dy: number) => void
    onDoubleClick: () => void
    onTextEdit: (content: string) => void
    isUserMode: boolean
}> = memo(({
    text,
    isSelected,
    mode,
    onSelect,
    onDrag,
    onDoubleClick,
    onTextEdit,
    isUserMode
}) => {
    const dragRef = useRef<{ x: number, y: number } | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (mode === 'move') {
            dragRef.current = { x: e.clientX, y: e.clientY }
        }
    }

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (dragRef.current) {
            const dx = e.clientX - dragRef.current.x
            const dy = e.clientY - dragRef.current.y
            onDrag(dx, dy)
            dragRef.current = { x: e.clientX, y: e.clientY }
        }
    }, [onDrag])

    const handleMouseUp = useCallback(() => {
        dragRef.current = null
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
    }, [handleMouseMove])


    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        setIsEditing(true)
        onDoubleClick()
    }

    const handleTextEditComplete = () => {
        setIsEditing(false)
    }

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isEditing])

    useEffect(() => {
        if (isSelected) {
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', handleMouseUp)
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isSelected, handleMouseMove, handleMouseUp])

    return (
        <>
            <g
                transform={`translate(${text.position.x},${text.position.y}) rotate(${text.rotation})`}
                style={{ cursor: mode === 'move' ? 'grab' : 'pointer' }}
            >
                {isSelected && (
                    <rect
                        x={-5}
                        y={-text.fontSize}
                        width={text.content.length * text.fontSize * 0.6 + 10}
                        height={text.fontSize * 1.2}
                        fill="none"
                        stroke={mode === 'move' ? '#000000' : '#2196F3'}
                        strokeWidth={mode === 'move' ? 5 : 0}
                        strokeDasharray="5,5"
                    />
                )}
                {isEditing ? (
                    <foreignObject
                        x={-5}
                        y={-text.fontSize}
                        width={text.content.length * text.fontSize * 0.6 + 10}
                        height={text.fontSize * 1.2}
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            value={text.content}
                            onChange={(e) => onTextEdit(e.target.value)}
                            onBlur={handleTextEditComplete}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleTextEditComplete()
                                }
                            }}
                            disabled={isUserMode}
                            className="bg-transparent border-none outline-none w-full h-full"
                            style={{
                                fontSize: `${text.fontSize}px`,
                                fontFamily: text.fontFamily,
                                color: text.color,
                            }}
                        />
                    </foreignObject>
                ) : (
                    <text
                        style={{
                            fontSize: `${text.fontSize}px`,
                            fontFamily: text.fontFamily,
                            fill: text.color,
                            userSelect: 'none'
                        }}
                        onMouseDown={!isUserMode ? handleMouseDown : undefined}
                        onDoubleClick={!isUserMode ? handleDoubleClick : undefined}
                        onClick={!isUserMode ? () => { onSelect('move') } : undefined}
                    >
                        {text.content}
                    </text>
                )}
            </g>
        </>
    )
})

// Add TextControlBar
const TextControlBar: React.FC<{
    texts: IText[]
    setTexts: React.Dispatch<React.SetStateAction<IText[]>>
    selectedText: IText | undefined
    // onUpdate: (updates: Partial<IText>) => void
    onDelete: () => void
}> = ({
    selectedText,
    texts,
    setTexts,
    onDelete
}) => {
        if (!selectedText) return null

        const fontFamilies = [
            'Arial',
            'Times New Roman',
            'Helvetica',
            'Georgia',
            'Verdana'
        ]

        const handleUpdate = (updates: Partial<IText>) => {
            setTexts(prev => prev.map(t =>
                t.id === selectedText?.id ? { ...t, ...updates } : t
            ))
        }

        return (
            <div className="control-toolbar fixed top-1/2 left-2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg polygon-bottom-bar border border-gray-300 z-10">
                <div className="space-y-3">
                    <div className="w-full">
                        <Label>Text Content</Label>
                        <Input
                            value={selectedText.content}
                            onChange={(e) => handleUpdate({ content: e.target.value })}
                            className="w-full"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="w-full">
                        <span className="text-xs text-muted-foreground">Rotation</span>
                        <div className="flex flex-row items-center gap-2">
                            <input
                                type="range"
                                min="-180"
                                max="180"
                                value={selectedText.rotation}
                                onChange={(e) => handleUpdate({ rotation: Number(e.target.value) })}
                                className="w-full"
                            />
                            <div className="px-4 p-1 text-xs border border-gray-100 rounded-full">
                                {selectedText.rotation}°
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="w-full">
                        <span className="text-xs text-muted-foreground">Font Size</span>
                        <input
                            type="range"
                            min="12"
                            max="72"
                            value={selectedText.fontSize}
                            onChange={(e) => handleUpdate({ fontSize: Number(e.target.value) })}
                            className="w-full"
                        />
                    </div>
                </div>


                <div className="space-y-2">
                    <span className="text-xs text-muted-foreground">Font Family</span>
                    <Select
                        value={selectedText.fontFamily}
                        onValueChange={(value) => handleUpdate({ fontFamily: value })}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Font Family" />
                        </SelectTrigger>
                        <SelectContent>
                            {fontFamilies.map(font => (
                                <SelectItem key={font} value={font}>{font}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <span className="text-xs text-muted-foreground">Color</span>
                    <input
                        type="color"
                        value={selectedText.color}
                        onChange={(e) => handleUpdate({ color: e.target.value })}
                        className="w-full h-8 border-none"
                    />
                </div>

                <div className="flex justify-between items-center gap-2 w-full mt-4">
                    <button
                        onClick={() => onDelete()}
                        className="px-4 py-2 text-black rounded-lg cursor-pointer hover:scale-105 transition-all duration-300 border border-gray-200 shadow-2xl w-full flex justify-center items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                        <div className="hidden md:block text-sm">Delete Text</div>
                    </button>
                </div>


            </div>
        )
    }

export { TextComponent, TextControlBar }