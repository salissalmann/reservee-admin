import { ArrowLeft, Hand, MousePointer2 } from 'lucide-react'
import { Grid, IText, Polygon } from '@/app/(pages)/(reservation-seat)/seatmap/types'


const SubCanvasSelector = ({
    mode,
    setMode,
    onSave,
    polygon,
    grids,
    texts,
    isUserMode,
    onCancel
}: {
    mode: string
    setMode: React.Dispatch<React.SetStateAction<"move" | "select">>
    onSave: (polygon: any, grids: Grid[], texts: IText[]) => void
    polygon: any
    grids: Grid[]
    texts: IText[]
    isUserMode: boolean
    onCancel: () => void
}) => {
    return (
        <div className="fixed flex gap-2 bottom-4 left-1/2 -translate-x-1/2 bg-white p-2 rounded-full border border-gray-300 shadow-2xl main-mode-bar">
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
            {!isUserMode ? (
                <button
                    className={`border rounded-full p-2 px-8 flex items-center gap-2 bg-primary text-white font-bold hover:scale-105 transition-all duration-300`}
                    onClick={() => onSave(polygon.id, grids, texts)}
                >
                    Save
                </button>
            ) : (
                <button
                    className={`border rounded-full p-2 px-8 flex items-center gap-2 bg-primary text-white font-bold hover:scale-105 transition-all duration-300`}
                    onClick={onCancel}
                >
                    <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 md:hidden" /> 
                    <span className="hidden md:block">Back to Layout</span>
                </button>
            )}

        </div>
    )
}

export default SubCanvasSelector