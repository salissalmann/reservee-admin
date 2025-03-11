import { useState, useEffect } from 'react'
import { Polygon, Grid } from '@/app/(pages)/(reservation-seat)/seatmap/types'
import { IEvent } from '@/app/_types/event-types'

interface Seatmap {
    polygons: Polygon[]
    grids: Grid[]
}

const useSeatmap = (event: IEvent) => {
    const [seatmap, setSeatmap] = useState<Seatmap | null>(null)

    const fetchSeatmap = async () => {
        if (!event?.venue_config) return
        try {
            const response = await fetch(event.venue_config)
            const data = await response.json()
            setSeatmap(data)
        } catch (error) {
            console.error("Error parsing seatmap:", error)
        }
    }

    useEffect(() => {
        fetchSeatmap()
    }, [event?.id])

    return { seatmap }
}

export default useSeatmap