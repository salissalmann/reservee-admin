import Branding from '@/app/_components/_layout-components/branding'
import { LayoutPanelLeft, Info } from 'lucide-react'
import React, { useRef } from 'react'
import { IText } from '../../types'

export default function SelectSidebar({
    svgRef,
    texts,
    setTexts,
    pan,
    zoom,
    handleAddGrid,
    setOpenGuidelines,
}: {
    svgRef: React.RefObject<SVGSVGElement>,
    texts: IText[],
    setTexts: (texts: IText[]) => void,
    pan: { x: number, y: number },
    zoom: number,
    handleAddGrid: (rows: number, columns: number) => void,
    setOpenGuidelines: (open: boolean) => void
}) {

    const handleAddText = () => {
        const svg = svgRef.current
        if (!svg) return

        const viewportX = -pan.x / zoom
        const viewportY = -pan.y / zoom
        const viewportWidth = svg.clientWidth / zoom
        const viewportHeight = svg.clientHeight / zoom

        const centerX = viewportX + (viewportWidth / 2)
        const centerY = viewportY + (viewportHeight / 2)

        const newText: IText = {
            id: Math.max(0, ...texts.map(t => t.id), 0) + 1,
            content: 'New Text',
            position: { x: centerX, y: centerY },
            rotation: 0,
            fontSize: 24,
            fontFamily: 'Arial',
            color: '#000000'
        }
        const newTexts = [...texts, newText]
        setTexts(newTexts)
    }

    return (
        <div className="fixed flex flex-row md:flex-col justify-between items-center gap-4 top-1 left-1/2 -translate-x-1/2 md:top-1/2  md:left-auto md:translate-x-0 md:right-2 md:-translate-y-1/2 bg-white p-2 rounded-lg border border-gray-300 shadow-2xl draw-elements-bar md:h-[40vh] z-10">
            <div className="flex flex-row md:flex-col justify-center md:justify-start items-center gap-2 w-full">
                <div className='hidden md:block'>
                    <Branding />
                </div>
                <button
                    className="md:mt-4 px-4 py-2 text-primary rounded-lg cursor-pointer hover:scale-105 transition-all duration-300 border border-gray-100 shadow-2xl w-full"
                    onClick={handleAddText}
                >
                    <div className="flex items-center gap-2">
                        <svg
                            className="w-5 h-5 md:w-6 md:h-6"
                            viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M8 4V20M17 12V20M6 20H10M15 20H19M13 7V4H3V7M21 14V12H13V14" stroke="#ef404a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                        <span className='hidden md:block'> Add Text </span>
                    </div>
                </button>
                <button
                    className="px-4 py-2 text-primary rounded-lg cursor-pointer hover:scale-105 transition-all duration-300 border border-gray-100 shadow-2xl w-full flex items-center gap-2"
                    onClick={() => handleAddGrid(5, 5)}
                >
                    <LayoutPanelLeft className="w-5 h-5 md:w-6 md:h-6" />
                    <span className='hidden md:block'> Add Seats </span>
                </button>
            </div>
            <button
                className="px-4 py-2 text-primary rounded-lg cursor-pointer hover:scale-105 transition-all duration-300 border border-gray-100 shadow-2xl w-full flex items-center gap-2"
                onClick={() => setOpenGuidelines(true)}
            >
                <Info className="w-5 h-5 md:w-6 md:h-6" />
                <span className='hidden md:block'> Guidelines </span>
            </button>
        </div>
    )
}
