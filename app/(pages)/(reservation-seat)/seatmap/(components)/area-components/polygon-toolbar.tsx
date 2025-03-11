import { Tooltip } from "antd"
import { LayoutPanelLeft, Layout, Trash, DollarSign, Check } from "lucide-react"
import { Polygon } from "../../types"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { Input } from "@/components/ui/input"

interface PolygonToolBarProps {
    polygons: Polygon[]
    selectedPolygon: string | null
    setPolygons: (polygons: Polygon[]) => void
    setSelectedPolygon: (polygon: string | null) => void
    setSubCanvasPolygon: (polygon: Polygon | null) => void
}

const PolygonToolBar = ({
    polygons,
    selectedPolygon,
    setPolygons,
    setSelectedPolygon,
    setSubCanvasPolygon,
}: PolygonToolBarProps) => {

    const selectedPolygonData = polygons.find((p: any) => p.id === selectedPolygon)
    const colorOptions = ['#FF6B6B57', '#4ECDC54B', '#D145A25E', '#96CEB457', '#FFEEAD57', '#D4A5A557', '#9B59B657', "#000000"]


    const handleDeletePolygon = () => {
        if (selectedPolygon) {
            setPolygons(polygons.filter((p: any) => p.id !== selectedPolygon))
            setSelectedPolygon(null)
        }
    }

    const handleMarkAsLayout = () => {
        if (selectedPolygon) {
            setPolygons(polygons.map((p: any) =>
                p.id === selectedPolygon ? { ...p, isLayout: !p.isLayout } : p
            ))
        }
    }

    const handleAddSeats = () => {
        if (selectedPolygon) {
            const polygon = polygons.find((p: any) => p.id === selectedPolygon)
            if (polygon) {
                setSubCanvasPolygon(polygon)
            }
        }
    }

    const handleColorChange = (color: string) => {
        if (selectedPolygon) {
            setPolygons(polygons.map((p: any) =>
                p.id === selectedPolygon ? { ...p, color } : p
            ))
        }
    }


    const [polygonPrice, setPolygonPrice] = useState<string>('')
    useEffect(() => {
        setPolygonPrice(selectedPolygonData?.price?.toString() || '')
    }, [selectedPolygonData])

    const handleSavePrice = () => {
        if (selectedPolygon) {
            const price = parseFloat(polygonPrice)
            if (isNaN(price) || price < 0 || price === 0) {
                toast.error('Please enter a valid price')
                return
            }

            if (polygonPrice.startsWith('.')) {
                setPolygonPrice('0' + polygonPrice)
            }
            setPolygons(polygons.map((p: any) =>
                p.id === selectedPolygon ? { ...p, price: price } : p
            ))
            toast.success('Price saved')
            setPolygonPrice('')
        }
    }

    return (
        <div className="fixed top-1/2 left-2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg polygon-bottom-bar border border-gray-300 z-10">
            <div className='flex flex-col justify-between items-center gap-4'>
                <Tooltip title="Add Seats"
                    className="mt-4 px-4 py-2 text-black rounded-lg cursor-pointer hover:scale-105 transition-all duration-300 border border-gray-100 shadow-2xl w-full"
                >
                    <button
                        onClick={handleAddSeats}
                        className='border rounded-full p-2 px-4 flex items-center gap-2 text-black font-bold hover:bg-primary hover:scale-105 hover:text-white transition-all duration-300 cursor-pointer'
                    >
                        <LayoutPanelLeft className="w-4 h-4 md:w-5 md:h-5" />
                        <div className="hidden md:block text-sm font-normal">Add Seats</div>
                    </button>
                </Tooltip>

                <Tooltip title={selectedPolygonData?.isLayout ? 'Remove Layout' : 'Mark as Layout'}>
                    <button
                        onClick={handleMarkAsLayout}
                        className="px-4 py-2 text-black rounded-lg cursor-pointer hover:scale-105 transition-all duration-300 border border-gray-100 shadow-2xl w-full flex justify-center items-center gap-2"
                    >
                        <Layout className="w-4 h-4 md:w-5 md:h-5" />
                        <div className="hidden md:block text-sm font-normal">
                            {selectedPolygonData?.isLayout ? 'Remove Layout' : 'Mark as Layout'}
                        </div>
                    </button>
                </Tooltip>


                <div className='hidden md:grid md:grid-cols-4 gap-2 border border-gray-100 shadow-xl p-2 w-full rounded-lg'>
                    {colorOptions.map(color => (
                        <Tooltip key={color} title="Change Color">
                            <button
                                className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 
                                    shadow-2xl border-gray-100
                                    ${selectedPolygonData?.color === color ? 'border-black' : 'border-transparent'}`}
                                style={{ backgroundColor: color }}
                                onClick={() => handleColorChange(color)}
                            />
                        </Tooltip>
                    ))}
                </div>

                <div className="flex md:hidden">
                    <Tooltip title="Change Color">
                        <input
                            type="color"
                            style={{ backgroundColor: selectedPolygonData?.color }}
                            value={selectedPolygonData?.color}
                            onChange={(e) => handleColorChange(e.target.value)}
                        />
                    </Tooltip>
                </div>

                {/*change price*/}
                {!selectedPolygonData?.isLayout && (
                    <Tooltip title="Change Price" className='w-full flex items-center gap-2 border border-gray-100 shadow-2xl p-2 rounded-lg'>
                        <Input
                            value={polygonPrice}
                        onChange={(e) => {
                            const inputValue = e.target.value;
                            // Allow only valid number inputs
                            if (/^\.?\d*\.?\d*$/.test(inputValue)) {
                                setPolygonPrice(inputValue)
                            }
                        }}
                        placeholder="Price"
                        className="w-full max-w-[100px]"
                        required
                        type="text"
                    />
                    <button
                        onClick={handleSavePrice}
                        className="flex justify-center items-center p-2 text-primary rounded-lg cursor-pointer hover:scale-105 transition-all duration-300 border border-gray-100 shadow-2xl"
                    >
                        <Check className="w-4 h-4" />
                    </button>
                </Tooltip>
                )}

                <Tooltip title="Delete Area" className='w-full'>
                    <button
                        onClick={handleDeletePolygon}
                        className="flex justify-center items-center gap-2 px-4 py-2 text-primary rounded-lg cursor-pointer hover:scale-105 transition-all duration-300 border border-gray-100 shadow-2xl w-full"
                    >
                        <Trash className="w-4 h-4 md:w-5 md:h-5" />
                        <div className="hidden md:block text-sm font-normal">Delete Area</div>
                    </button>
                </Tooltip>

            </div>
        </div>
    )
}

export default PolygonToolBar