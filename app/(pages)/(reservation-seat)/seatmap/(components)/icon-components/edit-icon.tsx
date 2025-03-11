import { useState, useEffect } from 'react'
import { PlusIcon, MinusIcon, RefreshCcw, Trash } from 'lucide-react'
import { IconElement } from '../../types'

interface IconToolBarProps {
    icons: IconElement[]
    setIcons: (icons: IconElement[]) => void
    selectedIcon: string | null
    setSelectedIcon: (icon: string | null) => void
}

const IconToolBar = ({ 
    icons, 
    setIcons, 
    selectedIcon,
    setSelectedIcon,
}: IconToolBarProps) => {

    const [iconScale, setIconScale] = useState<number>(1)
    useEffect(() => {
        if (selectedIcon) {
            setIconScale(icons.find(icon => icon.id === selectedIcon)?.scale || 1)
        }
    }, [selectedIcon])

    const handleIconScale = (value: number) => {
        if (selectedIcon && value >= 0) {
            setIconScale(value)
            const updatedIcons = icons.map((icon: IconElement) =>
                icon.id === selectedIcon ? { ...icon, scale: value } : icon
            )
            setIcons(updatedIcons)
        }
    }

    const handleDeleteIcon = () => {
        if (selectedIcon) {
            const updatedIcons = icons.filter((icon: IconElement) => icon.id !== selectedIcon)
            setIcons(updatedIcons)
            setSelectedIcon(null)
        }
    }

    const ResetIconScale = () => {
        setIconScale(0.1)   
        if (selectedIcon) {
            const updatedIcons = icons.map((icon: IconElement) =>
                icon.id === selectedIcon ? { ...icon, scale: 0.1 } : icon
            )
            setIcons(updatedIcons)
        }
    }

    return (
        <div className="fixed top-1/2  left-2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-2xl polygon-bottom-bar border border-gray-300 z-10">
            <div className='flex flex-col justify-between items-center gap-2'>
                <button
                    onClick={() => handleIconScale(iconScale + 0.02)}
                    className="px-4 py-2 text-black rounded-lg cursor-pointer hover:scale-105 transition-all duration-300 border border-gray-200 shadow-2xl w-full flex justify-center items-center gap-2"
                >
                    <PlusIcon className="w-4 h-4 md:w-5 md:h-5" />
                    <div className="hidden md:block text-sm">Scale Up</div>
                </button>

                <button
                    onClick={() => handleIconScale(iconScale - 0.02)}
                    className="px-4 py-2 text-black rounded-lg cursor-pointer hover:scale-105 transition-all duration-300 border border-gray-200 shadow-2xl w-full flex justify-center items-center gap-2"
                >
                    <MinusIcon className="w-4 h-4 md:w-5 md:h-5" />
                    <div className="hidden md:block text-sm">Scale Down</div>
                </button>

                <div className='flex justify-between items-center gap-2 w-full'>
                    <div  className="px-4 py-2 text-black rounded-lg cursor-pointer hover:scale-105 transition-all duration-300 border border-gray-200 shadow-2xl w-fit flex justify-center items-center gap-2">
                        {iconScale.toFixed(2)}x
                    </div>
                    <button
                        onClick={ResetIconScale}
                        className="px-4 py-2 text-black rounded-lg cursor-pointer hover:scale-105 transition-all duration-300 border border-gray-200 shadow-2xl w-full flex justify-center items-center gap-2"
                    >
                        <RefreshCcw className="w-4 h-4 md:w-5 md:h-5" />
                        <div className="hidden md:block text-sm">Reset Scale</div>
                    </button>
                </div>

                <button
                    onClick={handleDeleteIcon}
                    className="px-4 py-2 text-primary rounded-lg cursor-pointer hover:scale-105 transition-all duration-300 border border-gray-200 shadow-2xl w-full flex justify-center items-center gap-2"

                >
                    <Trash className="w-4 h-4 md:w-5 md:h-5" />
                    <div className="hidden md:block text-sm">Delete Icon</div>
                </button>
            </div>
        </div>
    )
}

export default IconToolBar