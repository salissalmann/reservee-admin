import { memo, useMemo, useRef, useCallback, useEffect } from "react"
import { Grid } from '@/app/(pages)/(reservation-seat)/seatmap/types'
import { Polygon } from "@/app/(pages)/(reservation-seat)/seatmap/types";

type SelectionMode = 'transform' | 'move' | null;

interface GridComponentProps {
    grid: Grid
    isSelected: boolean
    selectionMode: SelectionMode
    polygonId: string
    polygons: Polygon[]
    onSeatSelection: (polygonId: string, seatNumber: number, areaName: string, price: number) => void
    seatSelections: { polygonId: string, seatNumber: number, areaName: string, price: number }[]
    onRemoveSeatSelection: (polygonId: string, seatNumber: number) => void
    isUserMode: boolean
    setGrids: React.Dispatch<React.SetStateAction<Grid[]>>
    setSelectedGrid: React.Dispatch<React.SetStateAction<number | null>>
    zoom: number
    setSelectionMode: React.Dispatch<React.SetStateAction<SelectionMode | null>>
    setSelectedText: React.Dispatch<React.SetStateAction<number | null>>
    setTextMode: React.Dispatch<React.SetStateAction<"move" | "transform" | null>>
}

const renderSeat = (scale = 1) => {
    const baseSize = 30 * scale
    return {
        path: `M ${3.74618 * scale} ${10.4537 * scale} 
             C ${2.08167 * scale} ${5.28849 * scale} ${5.93375 * scale} 0 ${11.3606 * scale} 0 
             H ${26.1672 * scale} 
             C ${31.2913 * scale} 0 ${35.0944 * scale} ${4.74998 * scale} ${33.9735 * scale} ${9.74997 * scale} 
             L ${31.8352 * scale} ${19.2884 * scale} 
             C ${31.0162 * scale} ${22.9417 * scale} ${27.773 * scale} ${25.5384 * scale} ${24.0289 * scale} ${25.5384 * scale} 
             H ${14.4344 * scale} 
             C ${10.9614 * scale} ${25.5384 * scale} ${7.88517 * scale} ${23.2977 * scale} ${6.81995 * scale} ${19.9922 * scale} 
             L ${3.74618 * scale} ${10.4537 * scale}`,
        rect: {
            x: 11.4697 * scale,
            y: 27.389 * scale,
            width: 16.8174 * scale,
            height: 2.96098 * scale,
            rx: 1.48049 * scale
        }
    }
}

const GridComponent: React.FC<GridComponentProps> = memo(({
    polygons,
    grid,
    isSelected,
    selectionMode,
    polygonId,
    onSeatSelection,
    seatSelections,
    onRemoveSeatSelection,
    isUserMode,
    setGrids,
    setSelectedGrid,
    zoom,
    setSelectionMode,
    setSelectedText,
    setTextMode
}) => {
    const seatElements = useMemo(() => {
        const cellSize = 50
        const seats = []

        // Define seat template once
        const seatTemplate = {
            id: `seat-template-${grid.id}`,
            path: renderSeat(1.35).path,
            rect: renderSeat(1.35).rect
        }

        // Create template elements
        seats.push(
            <defs key={`template-${grid.id}`}>
                <g id={seatTemplate.id}>
                    <path
                        d={seatTemplate.path}
                        fill={isSelected ? '#EF404A' : 'rgba(239, 64, 74, 0.43)'}
                        stroke={grid.category?.color === '#ffffff' ? '#777777FF' : grid.category?.color || '#000'}
                        strokeWidth={1}
                    />
                    <rect
                        {...seatTemplate.rect}
                        fill={isSelected ? '#EF404A' : 'rgba(239, 64, 74, 0.43)'}
                        stroke={grid.category?.color === '#ffffff' ? '#777777FF' : grid.category?.color || '#000'}
                        strokeWidth={1}
                    />
                </g>
            </defs>
        )

        // Render seats using <use> elements
        for (let row = 0; row < grid.size.rows; row++) {
            for (let col = 0; col < grid.size.cols; col++) {
                const index = row * grid.size.cols + col
                const isSeatSelected = seatSelections.some((selection: { polygonId: any; seatNumber: number }) =>
                    selection.polygonId === polygonId && selection.seatNumber === (grid.seatStartIndex || 0) + index + 1
                )
                seats.push(
                    <g
                        key={`${row}-${col}`}
                        transform={`translate(${col * cellSize},${row * cellSize})`}
                        style={{
                            cursor: 'pointer',
                            userSelect: 'none',
                            WebkitUserSelect: 'none'
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (isSeatSelected && isUserMode) {
                                onRemoveSeatSelection(polygonId, (grid.seatStartIndex || 0) + index + 1);
                            } else if (isUserMode) {
                                const polygonName = polygons.find(p => p.id === polygonId)?.name || ''
                                const polygonPrice = polygons.find(p => p.id === polygonId)?.price || 0
                                onSeatSelection(polygonId, (grid.seatStartIndex || 0) + index + 1, polygonName, polygonPrice);
                            }
                        }}
                    >
                        <path
                            d={seatTemplate.path}
                            fill={isSeatSelected ? '#000000' : 'rgba(239, 64, 74, 0.43)'}
                            stroke={isSeatSelected ? '#000000' : (grid.category?.color === '#ffffff' ? '#777777FF' : grid.category?.color || '#000')}
                            strokeWidth={1}
                        />
                        <rect
                            {...seatTemplate.rect}
                            fill={isSeatSelected ? '#000000' : 'rgba(239, 64, 74, 0.43)'}
                            stroke={isSeatSelected ? '#000000' : (grid.category?.color === '#ffffff' ? '#777777FF' : grid.category?.color || '#000')}
                            strokeWidth={1}
                        />                       
                        {/* <text
                            x={cellSize / 2}
                            y={cellSize / 3}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize={`${zoom >= 1 ? 8 : 12 + zoom}px`}
                            fontWeight="bold"
                            fill={isSeatSelected ? '#FFFFFF' : '#000000'}
                            style={{
                                userSelect: 'none',
                                WebkitUserSelect: 'none',
                                pointerEvents: 'none',
                                paintOrder: 'stroke',
                                stroke: isSeatSelected ? '#000000' : '#FFFFFF',
                                strokeWidth: '0.1px',
                                // strokeLinecap: 'round',
                                // strokeLinejoin: 'round'
                            }}
                        >
                            {`${grid.category?.acronym || ''}${(grid.seatStartIndex || 0) + index}`}
                        </text> */}
                    </g>
                )
            }
        }
        return seats
    }, [grid, isSelected, polygonId, seatSelections, onSeatSelection, onRemoveSeatSelection, isUserMode, zoom])

    const dragRef = useRef<{ x: number, y: number } | null>(null)
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        // Only initiate drag if in move mode
        if (selectionMode === 'move') {
            dragRef.current = { x: e.clientX, y: e.clientY }
        }
    }

    const handleGridDrag = useCallback((id: number, dx: number, dy: number) => {
        if (isUserMode) {
            return
        }

        setGrids(prev => prev.map(g =>
            g.id === id
                ? { ...g, position: { x: g.position.x + dx / zoom, y: g.position.y + dy / zoom } }
                : g
        ))
    }, [zoom, isUserMode])


    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (dragRef.current) {
            const dx = e.clientX - dragRef.current.x
            const dy = e.clientY - dragRef.current.y
            handleGridDrag(grid.id, dx, dy)
            dragRef.current = { x: e.clientX, y: e.clientY }
        }
    }, [handleGridDrag])

    const handleMouseUp = useCallback(() => {
        dragRef.current = null
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
    }, [handleMouseMove])

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


    const handleGridDoubleClick = useCallback((gridId: number) => {
        setSelectedText(null)
        setTextMode(null)
        setSelectedGrid(gridId)
        setSelectionMode('move')
    }, [])


    return (
        <>
            <g
                transform={`translate(${grid.position.x},${grid.position.y}) 
                    rotate(${grid.rotation || 0}, ${(grid.size.cols * 50) / 2}, ${(grid.size.rows * 50) / 2}) 
                    scale(${grid.scale || 1})`}
                style={{
                    cursor: selectionMode === 'move' ? 'grab' : 'pointer',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    msUserSelect: 'none'
                }}
                onMouseDown={handleMouseDown}
                onClick={() => handleGridDoubleClick(grid.id)}
                onDoubleClick={(e) => {
                    e.stopPropagation()
                    handleGridDoubleClick(grid.id)
                }}
            >
                {isSelected && !isUserMode && (
                    <rect
                        x={-5}
                        y={-5}
                        width={grid.size.cols * 50 + 10}
                        height={grid.size.rows * 50 + 10}
                        fill="none"
                        stroke={selectionMode === 'move' ? '#000000' : '#2196F3'}
                        strokeWidth={selectionMode === 'move' ? 8 : 0}
                        strokeDasharray={selectionMode === 'move' ? '5,5' : '0'}
                    />
                )}
                {seatElements}
            </g>
        </>
    )
})

export default GridComponent