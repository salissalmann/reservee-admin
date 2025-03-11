import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Polygon } from '../../types'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

interface NameAreaDialogProps {
    isNamingDialogOpen: boolean
    polygons: Polygon[]
    setPolygons: (polygons: Polygon[]) => void
    selectedPolygon: string | null
    setSelectedPolygon: (polygon: string | null) => void
    currentPolygon: Polygon | null
    setCurrentPolygon: (polygon: Polygon | null) => void
    setIsNamingDialogOpen: (open: boolean) => void
}

const NameAreaDialog = ({
    isNamingDialogOpen,
    polygons,
    selectedPolygon,
    setSelectedPolygon,
    currentPolygon,
    setCurrentPolygon,
    setPolygons,
    setIsNamingDialogOpen
}: NameAreaDialogProps) => {

    const [polygonName, setPolygonName] = useState('')
    const [polygonPrice, setPolygonPrice] = useState<string>('')

    const handleNameSubmit = () => {
        // Validate price
        const price = parseFloat(polygonPrice)
        if (isNaN(price) || price < 0 || price === 0) {
            toast.error('Please enter a valid price')
            return
        }

        if (polygonPrice.startsWith('.')) {
            setPolygonPrice('0' + polygonPrice)
        }

        if (!polygonName.trim()) {
            toast.error('Please enter a name for the polygon')
            return
        }

        const nameExists = polygons.some(p => p.name === polygonName.trim())
        if (nameExists) {
            toast.error('A polygon with this name already exists. Please choose a different name.')
            return
        }

        if (selectedPolygon) {
            if (currentPolygon) {
                setPolygons([...polygons, {
                    ...currentPolygon,
                    name: polygonName.trim(),
                    price: price
                }])
                setCurrentPolygon(null)
            } else {
                setPolygons(polygons.map(p =>
                    p.id === selectedPolygon ? { ...p, name: polygonName.trim(), price: price } : p
                ))
            }
            setPolygonName('')
            setPolygonPrice('')
            setSelectedPolygon(null)
            setIsNamingDialogOpen(false)
        }
    }


    const handleDialogOpenChange = (open: boolean) => {
        if (!open && currentPolygon) return
        setIsNamingDialogOpen(open)
    }

    return (
        <Dialog
            open={isNamingDialogOpen}
            onOpenChange={() => handleDialogOpenChange(false)}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Name Area</DialogTitle>
                    <DialogDescription>
                        Please enter a unique name for the area.
                    </DialogDescription>
                </DialogHeader>
                <Input
                    value={polygonName}
                    onChange={(e) => setPolygonName(e.target.value)}
                    placeholder="Enter area name"
                    required
                />
                <Input
                    value={polygonPrice}
                    onChange={(e) => {
                        const inputValue = e.target.value;
                        // Allow only valid number inputs
                        if (/^\.?\d*\.?\d*$/.test(inputValue)) {
                            setPolygonPrice(inputValue)
                        }
                    }}
                    placeholder="Enter area price"
                    required
                    type="text"
                />
                <DialogFooter>
                    <Button
                        className="bg-primary text-white rounded-full cursor-pointer hover:scale-105 px-8 font-bold transition-all duration-300"
                        onClick={handleNameSubmit}
                    >
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default NameAreaDialog