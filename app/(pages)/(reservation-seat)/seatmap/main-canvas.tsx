'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { ShapesIcon, MousePointer2, Hand, Download, Upload, Save, Loader2 } from 'lucide-react'
import SubCanvas from './sub-canvas'
import { Grid, IText } from '../d3/interface'
import SelectSidebar from './(components)/select-sidebar'
import TextToolBar from './(components)/text-components/edit-text-toolbar'
import IconToolBar from './(components)/icon-components/edit-icon'
import PolygonToolBar from './(components)/area-components/polygon-toolbar'
import GuidelinesDialog from './(components)/guidelines/guidelines-popup'
import { ICON_PATHS } from './constants'
import NameAreaDialog from './(components)/area-components/name-area'
import { Polygon, TextElement, IconElement, Point, SeatSelections, Position, Shape } from './types'
import useLayoutHooks from './(hooks)/layout-hooks'
import { AnimatePresence, motion } from 'framer-motion'
import { useFileUpload } from '@/app/_hooks/_file-upload/useFileUpload'
import { AddSeatmapToEvent } from '@/app/_apis/event-apis'
import { useRouter } from 'next/navigation'

import toast from 'react-hot-toast'
import axios from 'axios'
import { axiosErrorHandler } from '@/app/_utils/utility-functions'
import GridContainer from '../d3/GridContainer'

export default function DrawingCanvas({
    adjustHeight,
    calledFromEventPage,
    seatSelections,
    setSeatSelections,
    eventId,
    venueConfig
}: {
    adjustHeight?: boolean,
    calledFromEventPage?: boolean,
    seatSelections: SeatSelections[],
    setSeatSelections: React.Dispatch<React.SetStateAction<SeatSelections[]>>,
    eventId: string,
    venueConfig: string
}) {
    // ============= Refs =============
    const svgRef = useRef<SVGSVGElement>(null)
    const [isUserMode, setIsUserMode] = useState(false)

    useEffect(() => {
        setIsUserMode(calledFromEventPage || false)
    }, [calledFromEventPage])

    // ============= State Management =============
    // Polygon States
    const [polygons, setPolygons] = useState<Polygon[]>([])
    const [currentPolygon, setCurrentPolygon] = useState<Polygon | null>(null)
    const [selectedPolygon, setSelectedPolygon] = useState<string | null>(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [subCanvasPolygon, setSubCanvasPolygon] = useState<Polygon | null>(null)

    // Text States
    const [texts, setTexts] = useState<TextElement[]>([])
    const [isDraggingText, setIsDraggingText] = useState<string | null>(null)
    const [editingText, setEditingText] = useState<TextElement | null>(null)

    // Icon States
    const [icons, setIcons] = useState<IconElement[]>([])
    const [selectedIcon, setSelectedIcon] = useState<string | null>(null)

    // Dialog States
    const [isNamingDialogOpen, setIsNamingDialogOpen] = useState(false)
    const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false)

    // ============= Canvas Drawing Logic =============
    const drawCanvas = () => {
        if (!svgRef.current) return

        const svg = d3.select(svgRef.current)
        svg.selectAll('*').remove()

        // Draw existing polygons
        polygons.forEach(polygon => {
            const group = svg.append('g')
                .attr('class', 'polygon-group')
                .attr('data-id', polygon.id)
                .style('cursor', 'pointer')

            group.append('path')
                .attr('d', d3.line()(polygon.points) + 'Z')
                .attr('fill', polygon.isLayout ? 'rgba(100, 100, 100, 0.3)' : polygon.color || 'rgba(0, 0, 0, 0)')
                .attr('stroke', polygon.isLayout ? 'rgba(50, 50, 50, 0.8)' : (polygon.id === selectedPolygon ? 'blue' : 'black'))
                .attr('stroke-width', polygon.isLayout ? 3 : 1)

            if (polygon.name) {
                const centroid = d3.polygonCentroid(polygon.points)
                group.append('text')
                    .attr('x', centroid[0])
                    .attr('y', centroid[1])
                    .attr('text-anchor', 'middle')
                    .attr('dominant-baseline', 'middle')
                    .attr('fill', polygon.isLayout ? 'transparent' : 'black')
                    .attr('font-size', polygon.isLayout ? '0px' : '14px')
                    .attr('font-weight', polygon.isLayout ? 'normal' : 'normal')
                    .text(polygon.name)
            }
        })

        // Draw current polygon being created
        if (currentPolygon) {
            svg.append('path')
                .attr('d', d3.line()(currentPolygon.points))
                .attr('fill', 'none')
                .attr('stroke', 'black')
        }

        // Draw text elements
        texts.forEach(text => {
            svg.append('text')
                .attr('class', 'draggable-text')
                .attr('data-id', text.id)
                .attr('x', text.position[0])
                .attr('y', text.position[1])
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'middle')
                .attr('fill', 'black')
                .attr('font-size', text.fontSize || '16px')
                .attr('font-weight', text.fontWeight || 'normal')
                .style('cursor', 'move')
                .text(text.content)
            // .on('contextmenu', (event) => handleTextContextMenu(event, text))
        })

        // Add drag behavior to texts
        if (!isUserMode) {
            svg.selectAll<SVGTextElement, unknown>('.draggable-text')
                .call(d3.drag<SVGTextElement, unknown>()
                    .on('start', function () {
                        const id = this.getAttribute('data-id')
                        if (id) setIsDraggingText(id)
                    })
                    .on('drag', function (event) {
                        const id = this.getAttribute('data-id')
                        if (id) {
                            setTexts(prev => prev.map(t =>
                                t.id === id
                                    ? { ...t, position: [event.x, event.y] }
                                    : t
                            ))
                        }
                    })
                    .on('end', () => setIsDraggingText(null))
                )
        }

        // Draw icons
        icons.forEach(icon => {
            const group = svg.append('g')
                .attr('class', 'icon-group')
                .attr('data-id', icon.id)
                .attr('transform', `translate(${icon.position[0]}, ${icon.position[1]}) scale(${icon.scale})`)
                .style('cursor', 'move')

            group.append('path')
                .attr('d', ICON_PATHS[icon.type])
                .attr('fill', icon.color)
                .attr('stroke', 'none')
                .attr('stroke-width', icon.id === selectedIcon ? '10' : '0')


            if (!isUserMode) {
                group.call(d3.drag<SVGGElement, unknown>()
                    .on('drag', function (event) {
                        const id = this.getAttribute('data-id')
                        if (id) {
                            setIcons(prev => prev.map(i =>
                                i.id === id ? { ...i, position: [event.x, event.y] } : i
                            ))
                        }
                    })
                )
            }
        })

    }

    // ============= Event Handlers =============
    const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!isDrawing) return

        const point: Point = [e.nativeEvent.offsetX, e.nativeEvent.offsetY]

        if (currentPolygon) {
            const distanceToStart = Math.hypot(
                point[0] - currentPolygon.points[0][0],
                point[1] - currentPolygon.points[0][1]
            )

            if (distanceToStart < 10 && currentPolygon.points.length > 2) {
                setSelectedPolygon(currentPolygon.id)
                setIsNamingDialogOpen(true)
                setCurrentPolygon({
                    ...currentPolygon,
                    points: [...currentPolygon.points, currentPolygon.points[0]]
                })
                setIsDrawing(false)
            } else {
                setCurrentPolygon({
                    ...currentPolygon,
                    points: [...currentPolygon.points, point]
                })
            }
        } else {
            setCurrentPolygon({
                id: Date.now().toString(),
                points: [point, point],
                color: 'rgba(0, 0, 0, 0.1)',
                price: 0
            })
        }
    }

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!isDrawing || !currentPolygon) return

        const point: Point = [e.nativeEvent.offsetX, e.nativeEvent.offsetY]
        setCurrentPolygon({
            ...currentPolygon,
            points: [...currentPolygon.points.slice(0, -1), point]
        })
    }

    const handleSaveSeats = (polygonId: string, grids: Grid[], texts: IText[], shapes?: Shape[]) => {
        setPolygons(prevPolygons => {
            const newPolygons = prevPolygons.map(p =>
                p.id === polygonId ? { ...p, grids: [...grids], text: [...texts], shapes: [...shapes || []] } : p
            )
            return newPolygons
        })
        setSubCanvasPolygon(null)
    }

    const handleSeatSelection = (polygonId: string, seatNumber: number, areaName: string, price: number) => {
        setSeatSelections(prev => [...prev, { polygonId, seatNumber, areaName, price }])
    }

    const removeSeatSelection = (polygonId: string, seatNumber: number) => {
        setSeatSelections(prev => prev.filter(selection => selection.polygonId !== polygonId || selection.seatNumber !== seatNumber))
    }

    const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
        const target = e.target as Element
        const isIconClick = target.closest('.icon-group')
        const isScaleControlClick = target.closest('.scale-control')
        const isBottomBarClick = target.closest('.polygon-bottom-bar')
        const isPolygonClick = target.closest('.polygon-group')
        const isTextClick = target.closest('.draggable-text')

        if (isUserMode && !isPolygonClick) {
            return
        }

        if (isIconClick) {
            const iconId = isIconClick.getAttribute('data-id')
            setSelectedIcon(iconId)
            setSelectedPolygon(null)
            setEditingText(null)
            return
        }

        if (isTextClick) {
            const textId = isTextClick.getAttribute('data-id')
            setEditingText(texts.find(t => t.id === textId) || null)
            setSelectedIcon(null)
            setSelectedPolygon(null)
            return
        }

        if (isPolygonClick) {
            //if user mode then select polygon annd open sub canvas
            if (isUserMode) {
                const polygonId = isPolygonClick.getAttribute('data-id')
                setSelectedPolygon(polygonId)
                setSubCanvasPolygon(polygons.find(p => p.id === polygonId) || null)
                return
            }

            const polygonId = isPolygonClick.getAttribute('data-id')
            setSelectedPolygon(polygonId)
            setSelectedIcon(null)
            setEditingText(null)
            return
        }

        if (!isIconClick && !isScaleControlClick && !isBottomBarClick && !isPolygonClick && !isTextClick) {
            setSelectedIcon(null)
            setSelectedPolygon(null)
            setEditingText(null)
        }
    }


    // ============= Effects =============
    useEffect(() => {
        if (!subCanvasPolygon) {
            drawCanvas()
        }
    }, [polygons, currentPolygon, selectedPolygon, subCanvasPolygon, texts, icons])

    const [mode, setMode] = useState<'select' | 'move'>('select')
    const [showDrawElements, setShowDrawElements] = useState(false)
    const { zoom, pan, setZoom, setPan, handleZoom, handlePan } = useLayoutHooks({ mode, svgRef })

    const ExportSeatmap = () => {
        //save polygons with grids and texts and all other elements
        const seatmapData = {
            polygons: polygons,
            grids: subCanvasPolygon?.grids || [],
            texts: subCanvasPolygon?.text || [],
            icons: icons
        }
        //save to json file
        const jsonString = JSON.stringify(seatmapData)
        const blob = new Blob([jsonString], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'seatmap.json'
        a.click()
    }

    const ImportSeatmap = () => {
        setLoading(true)
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = '.json'
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (file) {
                const reader = new FileReader()
                reader.onload = (event) => {
                    if (!event.target) return
                    const seatmapData = JSON.parse(event.target.result as string)
                    setPolygons(seatmapData.polygons)
                    if (seatmapData.grids && setSubCanvasPolygon) {
                        setSubCanvasPolygon(prev => {
                            if (!prev) return null
                            return {
                                ...prev,
                                grids: seatmapData.grids,
                                text: seatmapData.texts || []
                            }
                        })
                    }
                    if (seatmapData.icons) {
                        setIcons(seatmapData.icons)
                    }

                    // Calculate the bounding box of all polygons
                    const allPoints = seatmapData.polygons.map((p: Polygon) => p.points).flat();
                    if (allPoints.length > 0) {
                        // Get all Y coordinates sorted
                        const sortedYPoints = [...allPoints].sort((a, b) => b[1] - a[1]);
                        const highestY = sortedYPoints[0][1];
                        const secondHighestY = sortedYPoints[1]?.[1] || highestY;

                        // Get X extremes
                        const minX = Math.min(...allPoints.map((p: Point) => p[0]));
                        const maxX = Math.max(...allPoints.map((p: Point) => p[0]));

                        // Calculate effective dimensions
                        const effectiveWidth = maxX - minX;
                        const effectiveHeight = highestY - secondHighestY;

                        // Get SVG dimensions
                        const svgWidth = svgRef.current?.clientWidth || 1000;
                        const svgHeight = svgRef.current?.clientHeight || 1000;

                        // Calculate scale factors for both dimensions
                        const scaleX = svgWidth / effectiveWidth;
                        const scaleY = svgHeight / effectiveHeight;

                        // Use the smaller scale to ensure everything fits
                        const scale = Math.min(scaleX, scaleY) * 0.90; // 80% to add some padding

                        handleScale(scale);

                        // // Calculate pan calculation using screen size
                        const contentCenterX = (minX + maxX) / 2;
                        const contentCenterY = (secondHighestY + highestY) / 2;
                        const screenCenterX = svgWidth / 2;
                        const screenCenterY = svgHeight / 2;

                        // Calculate the offset needed to center the content
                        const newPanX = screenCenterX - (contentCenterX * scale);
                        const newPanY = screenCenterY - (contentCenterY * scale);
                        const isMobile = window.innerWidth < 768;

                        setPan({
                            x: newPanX,
                            y: newPanY + (adjustHeight ? (isMobile ? 0 : 200) : (!isMobile ? 400 : 0))
                        });

                    }
                }
                reader.readAsText(file)
            }
        }
        input.click()
        setLoading(false)
    }
    const router = useRouter();
    const [loading, setLoading] = useState(false)

    const { uploadFile, fileUrl: configUrl } = useFileUpload({
        fileName: 'venue-config.json',
        onSuccess: async (url: string) => {
            try {
                const response = await AddSeatmapToEvent(eventId, {
                    venue_config: url
                })
                if (response.statusCode === 200) {
                    toast.success("Seatmap saved successfully");
                } else {
                    toast.error("Failed to save seatmap. Please try again.");
                }
                setLoading(false)
                router.push(`/edit-event/${eventId}`);
            } catch (error) {
                console.error('Error exporting configuration:', error);
                axiosErrorHandler(error, "Error saving seatmap");
            }
        },
        onError: (error: any) => {
            console.error('Error exporting configuration:', error);
            setLoading(false)
        },
        showToast: false
    });

    const SaveSeatmap = async () => {
        setLoading(true)
        const config = {
            polygons: polygons,
            grids: subCanvasPolygon?.grids || [],
            texts: subCanvasPolygon?.text || [],
            icons: icons
        }
        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        await uploadFile(blob);
        setLoading(false)
    };
    
    const ImportSeatmapFromFile = async (venueConfig: string) => {
        setLoading(true)
        try {
            const response = await axios.get(venueConfig);
            const config = response.data;
            setPolygons(config.polygons)
            if (config.grids && setSubCanvasPolygon) {
                setSubCanvasPolygon(prev => {
                    if (!prev) return null
                            return {
                                ...prev,
                                grids: config.grids,
                                text: config.texts || []
                            }
                        })
                    }
            if (config.icons) {
                setIcons(config.icons)
            }

            // Calculate the bounding box of all polygons
            const allPoints = config.polygons.map((p: Polygon) => p.points).flat();
            if (allPoints.length > 0) {
                // Get all Y coordinates sorted
                const sortedYPoints = [...allPoints].sort((a, b) => b[1] - a[1]);
                const highestY = sortedYPoints[0][1];
                const secondHighestY = sortedYPoints[1]?.[1] || highestY;

                // Get X extremes
                const minX = Math.min(...allPoints.map((p: Point) => p[0]));
                const maxX = Math.max(...allPoints.map((p: Point) => p[0]));

                // Calculate effective dimensions
                const effectiveWidth = maxX - minX;
                const effectiveHeight = highestY - secondHighestY;

                // Get SVG dimensions
                const svgWidth = svgRef.current?.clientWidth || 1000;
                const svgHeight = svgRef.current?.clientHeight || 1000;

                // Calculate scale factors for both dimensions
                const scaleX = svgWidth / effectiveWidth;
                const scaleY = svgHeight / effectiveHeight;

                // Use the smaller scale to ensure everything fits
                const scale = Math.min(scaleX, scaleY) * 0.90; // 80% to add some padding

                handleScale(scale);

                // // Calculate pan calculation using screen size
                const contentCenterX = (minX + maxX) / 2;
                const contentCenterY = (secondHighestY + highestY) / 2;
                const screenCenterX = svgWidth / 2;
                const screenCenterY = svgHeight / 2;

                // Calculate the offset needed to center the content
                const newPanX = screenCenterX - (contentCenterX * scale);
                const newPanY = screenCenterY - (contentCenterY * scale);
                const isMobile = window.innerWidth < 768;



                setPan({
                    x: newPanX,
                    y: newPanY + (adjustHeight ? (isMobile ? 0 : 200) : (!isMobile ? 400 : 0))
                });
            }
        } catch (error) {
            console.error('Error importing configuration:', error);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (venueConfig && venueConfig !== "") {
            ImportSeatmapFromFile(venueConfig);
        }
    }, [venueConfig,eventId]);

    const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
        e.preventDefault()
        e.stopPropagation()
        const delta = -e.deltaY;
        const scaleFactor = delta > 0 ? 1.1 : 0.9;
        setZoom(prevZoom => {
            const newZoom = prevZoom * scaleFactor;
            return Math.min(Math.max(newZoom, 0.1), 5);
        });
    }

    //scale up and down whole shapes of the canvas by positions
    const handleScale = (scale: number) => {
        //scale the polygons by positions
        setPolygons(prevPolygons => prevPolygons.map(p => ({
            ...p,
            points: p.points.map(point => [point[0] * scale, point[1] * scale])
        })));
        //scale the icons by positions
        setIcons(prevIcons => prevIcons.map(i => ({
            ...i,
            position: [i.position[0] * scale, i.position[1] * scale]
        })));
        //scale the texts by positions
        setTexts(prevTexts => prevTexts.map(t => ({
            ...t,
            position: [t.position[0] * scale, t.position[1] * scale]
        })));
    }


    // ============= Render Logic =============
    if (subCanvasPolygon) {
        return (
            <div className="relative w-[100%] h-[100dvh] overflow-y-auto">
                <AnimatePresence>
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{
                            duration: 0.5,
                            ease: "easeOut",
                            opacity: { duration: 0.3 },
                        }}
                        style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            overflow: 'hidden',
                            transformOrigin: 'center center'
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            style={{ width: '100%', height: '100%' }}
                        >
                            {/* <SubCanvas
                                polygon={subCanvasPolygon}
                                polygons={polygons}
                                onSave={handleSaveSeats}
                                onCancel={() => setSubCanvasPolygon(null)}
                                seatSelections={seatSelections}
                                onSeatSelection={handleSeatSelection}
                                onRemoveSeatSelection={removeSeatSelection}
                                isUserMode={isUserMode || false}
                                calledFromEventPage={calledFromEventPage || false}
                            /> */}
                            <GridContainer
                                polygon={subCanvasPolygon}
                                polygons={polygons}
                                onSave={handleSaveSeats}
                                onCancel={() => setSubCanvasPolygon(null)}
                                seatSelections={seatSelections}
                                onSeatSelection={handleSeatSelection}
                                onRemoveSeatSelection={removeSeatSelection}
                                isUserMode={isUserMode || false}
                                calledFromEventPage={calledFromEventPage || false}
                            />

 
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>
        )
    }
    return (
        <div
            className={`relative w-[100%] overflow-hidden ${calledFromEventPage ? 'h-[50dvh] md:h-[80dvh]' : 'h-[100dvh]'}`}
            style={{
                backgroundImage: calledFromEventPage ? 'none' : `radial-gradient(circle at 1px 1px, #ccc 1px, transparent 1px)`,
                backgroundSize: calledFromEventPage ? 'none' : '20px 20px',
                cursor: mode === 'move' ? 'grab' : 'default',
                touchAction: 'none',
            }}
        >

            {/* Toolbars */}
            {selectedIcon && !calledFromEventPage && (
                <IconToolBar
                    icons={icons}
                    setIcons={setIcons}
                    selectedIcon={selectedIcon}
                    setSelectedIcon={setSelectedIcon}
                />
            )}

            {selectedPolygon && !calledFromEventPage && (
                <PolygonToolBar
                    polygons={polygons}
                    selectedPolygon={selectedPolygon}
                    setPolygons={setPolygons}
                    setSelectedPolygon={setSelectedPolygon}
                    setSubCanvasPolygon={setSubCanvasPolygon}
                />
            )}

            {editingText && !calledFromEventPage && (
                <TextToolBar
                    editingText={editingText}
                    setEditingText={setEditingText}
                    texts={texts}
                    setTexts={setTexts}
                />
            )}

            <svg
                ref={svgRef}
                className="w-full h-full"
                style={{
                    touchAction: 'none',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    overflow: 'visible',
                    transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
                }}
                onMouseDown={mode === 'select' ? handleMouseDown : undefined}
                onMouseMove={mode === 'select' ? handleMouseMove : undefined}
                onClick={mode === 'select' ? handleCanvasClick : undefined}
                onWheel={handleWheel}
            // onTouchStart={handlePan}
            // onTouchMove={handlePan}
            />

            <div className="absolute flex gap-2 bottom-4 left-1/2 -translate-x-1/2 bg-white p-2 rounded-full border border-gray-300 shadow-2xl main-mode-bar">
                <button
                    onClick={() => setMode('select')}
                    className={`border rounded-full p-2 px-4 flex items-center gap-2 text-black font-bold hover:bg-primary hover:text-white transition-all duration-300 ${mode === 'select' ? 'bg-primary text-white' : ''}`}
                >
                    <MousePointer2 className={`w-5 h-5 md:w-6 md:h-6 ${mode === 'select' ? 'text-white' : ''}`} />
                </button>
                <button
                    onClick={() => setMode('move')}
                    className={`border rounded-full p-2 px-4 flex items-center gap-2 text-black font-bold hover:bg-primary hover:text-white transition-all duration-300 ${mode === 'move' ? 'bg-primary text-white' : ''}`}
                >
                    <Hand className={`w-5 h-5 md:w-6 md:h-6 ${mode === 'move' ? 'text-white' : ''}`} />
                </button>
                {!isUserMode && (
                    <button
                        onClick={() => setShowDrawElements(!showDrawElements)}
                        className={`border rounded-full p-2 px-4 flex items-center gap-2 text-black font-bold hover:bg-primary hover:text-white transition-all duration-300 ${showDrawElements ? 'bg-primary text-white' : ''}`}
                    >
                        <ShapesIcon className={`w-5 h-5 md:w-6 md:h-6 ${showDrawElements ? 'text-white' : ''}`} />
                        {/* Draw Elements */}
                    </button>
                )}
                {!isUserMode && (
                    <button
                        // onClick={() => setMode('select')}
                        onClick={ExportSeatmap}
                        className={`border rounded-full p-2 px-4 flex items-center gap-2 text-black font-bold hover:bg-primary hover:text-white transition-all duration-300 ${mode === 'select' ? 'bg-primary text-white' : ''}`}
                    >
                        Save
                        <Download className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                )}
                {/* <button
                    onClick={ImportSeatmap}
                    className={`border rounded-full p-2 px-4 flex items-center gap-2 text-black font-bold hover:bg-primary hover:text-white transition-all duration-300 ${mode === 'select' ? 'bg-primary text-white' : ''}`}
                >
                    Import
                    <Upload className="w-5 h-5 md:w-6 md:h-6" />
                </button>
                <button
                    onClick={SaveSeatmap}
                    className={`border rounded-full p-2 px-4 flex items-center gap-2 text-black font-bold hover:bg-primary hover:text-white transition-all duration-300 ${mode === 'select' ? 'bg-primary text-white' : ''}`}
                >
                    Save
                    <Save className="w-5 h-5 md:w-6 md:h-6" />
                </button> */}
            </div>

            {showDrawElements && (
                <SelectSidebar
                    isDrawing={isDrawing}
                    setIsDrawing={setIsDrawing}
                    setCurrentPolygon={setCurrentPolygon}
                    icons={icons}
                    setIcons={setIcons}
                    texts={texts}
                    setTexts={setTexts}
                    setIsGuidelinesOpen={setIsGuidelinesOpen}
                />
            )}

            <NameAreaDialog
                isNamingDialogOpen={isNamingDialogOpen}
                polygons={polygons}
                setPolygons={setPolygons}
                selectedPolygon={selectedPolygon}
                setSelectedPolygon={setSelectedPolygon}
                currentPolygon={currentPolygon}
                setCurrentPolygon={setCurrentPolygon}
                setIsNamingDialogOpen={setIsNamingDialogOpen}
            />

            <GuidelinesDialog
                open={isGuidelinesOpen}
                onOpenChange={setIsGuidelinesOpen}
            />
        </div>
    )
}

