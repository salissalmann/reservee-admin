import Branding from '@/app/_components/_layout-components/branding'
import React, { useState } from 'react'
import { LandPlot } from 'lucide-react'
import { ICON_PATHS } from '@/app/(pages)/(reservation-seat)/seatmap/constants'
import { Info  } from 'lucide-react'
import { IconElement, TextElement } from '../types'
import AddTextDialogue from './text-components/add-text-dialogue'

export default function SelectSidebar({
    isDrawing,
    setIsDrawing,
    setCurrentPolygon,
    icons,
    setIcons,
    texts,
    setTexts,
    setIsGuidelinesOpen,
}: {
    isDrawing: boolean
    setIsDrawing: (isDrawing: boolean) => void
    setCurrentPolygon: (polygon: any) => void
    icons: IconElement[]
    setIcons: (icons: IconElement[]) => void
    texts: TextElement[]
    setTexts: (texts: any[]) => void
    setIsGuidelinesOpen: (isOpen: boolean) => void
}) {

    const [isTextDialogOpen, setIsTextDialogOpen] = useState(false)

    const handleAddIcon = (type: 'stairs' | 'gate') => {
        const screenWidth = window.innerWidth
        const screenHeight = window.innerHeight
        const iconWidth = 100
        const iconHeight = 100
        const iconX = screenWidth / 2 - iconWidth / 2
        const iconY = screenHeight / 2 - iconHeight / 2
        const newIcon: IconElement = {
            id: Date.now().toString(),
            type,
            position: [iconX, iconY],
            scale: 0.1,
            color: 'black'
        }
        setIcons([...icons, newIcon])
    }

    const handleAddText = () => {
        setIsTextDialogOpen(true)
    }

    return (
        <>
        <div className="fixed flex md:flex-col flex-wrap justify-center md:justify-between items-center gap-4 top-0 md:!left-auto md:translate-x-0 md:top-1/2 md:-translate-y-1/2 bg-white/80 backdrop-blur-md md:right-2 p-2 rounded-lg border border-gray-300 md:shadow-2xl draw-elements-bar md:h-[90vh] w-fit">
            <div className="flex md:flex-col flex-wrap md:justify-start justify-center items-center gap-2 w-full">
                <div className='hidden md:block'>   
                <Branding />
                </div>
                <button
                    className="md:mt-4 px-4 py-2 text-primary rounded-lg cursor-pointer hover:scale-105 transition-all duration-300 border border-gray-100 shadow-2xl w-fit md:w-full"
                    onClick={() => {
                        setIsDrawing(!isDrawing)
                        if (!isDrawing) setCurrentPolygon(null)
                    }}
                >
                    <div className="flex items-center gap-2">
                        <LandPlot className="w-5 h-5 md:w-6 md:h-6" />
                        <div className='text-sm font-bold'>{isDrawing ? 'Stop' : 'Draw Area'}</div>
                    </div>
                </button>
                <button
                    className="px-4 py-2 text-primary rounded-lg cursor-pointer hover:scale-105 transition-all duration-300 border border-gray-100 shadow-2xl w-fit md:w-full"
                    onClick={handleAddText}
                >
                    <div className="flex items-center gap-2">
                        <svg
                            className="w-5 h-5 md:w-6 md:h-6"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M8 4V20M17 12V20M6 20H10M15 20H19M13 7V4H3V7M21 14V12H13V14"
                                stroke="#ef404a"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <div className='text-sm font-bold'>Add Text</div>
                    </div>
                </button>
                <button
                    className="px-4 py-2 text-primary rounded-lg cursor-pointer hover:scale-105 transition-all duration-300 border border-gray-100 shadow-2xl w-fit md:w-full"
                    onClick={() => handleAddIcon('stairs')}
                >
                    <div className="flex items-center gap-2">
                        <svg
                            className="w-5 h-5 md:w-6 md:h-6 fill-current"
                            viewBox="0 0 485.142 485.142"
                        >
                            <path d={ICON_PATHS.stairs} />
                        </svg>
                        <div className='text-sm font-bold'>Add Stairs</div>
                    </div>
                </button>
                <button
                    className="px-4 py-2 text-primary rounded-lg cursor-pointer hover:scale-105 transition-all duration-300 border border-gray-100 shadow-2xl w-fit md:w-full"
                    onClick={() => handleAddIcon('gate')}
                >
                    <div className="flex items-center gap-2">
                        <svg
                            className="w-5 h-5 md:w-6 md:h-6 fill-current"
                            viewBox="0 0 370 370.001"
                        >
                            <path d={ICON_PATHS.gate} />
                        </svg>
                        <div className='text-sm font-bold'>Add Gate</div>
                    </div>
                </button>
            </div>

            <div className="flex flex-col gap-2 w-full justify-end items-center">
                <button
                    className="px-4 py-2 text-primary rounded-lg cursor-pointer hover:scale-105 transition-all duration-300 border border-gray-100 shadow-2xl w-fit md:w-full"
                    onClick={() => {
                        setIsGuidelinesOpen(true)
                    }}
                >
                    <div className="flex items-center gap-2">
                        <Info className="w-5 h-5 md:w-6 md:h-6" />
                        <div className='text-sm font-bold'>Guidelines</div>
                    </div>
                </button>
            </div>
        </div>

        <AddTextDialogue
            isTextDialogOpen={isTextDialogOpen}
            setIsTextDialogOpen={setIsTextDialogOpen}
            texts={texts}
            setTexts={setTexts}
        />
        

        </>
    )
}
