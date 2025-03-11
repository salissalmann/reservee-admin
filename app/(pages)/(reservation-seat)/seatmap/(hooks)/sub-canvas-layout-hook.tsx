import React, { useCallback, useEffect, useState } from 'react'

export default function useSubCanvasLayoutHook({
    selectedGrid,
    selectedText,
    svgRef,
    mode,
}: {
    selectedGrid: number | null,
    selectedText: number | null,
    svgRef: React.RefObject<SVGSVGElement>,
    mode: 'select' | 'move',
    setMode: (mode: 'select' | 'move') => void
}) {

    const [zoom, setZoom] = useState(1)
    const [pan, setPan] = useState({ x: 0, y: 0 })

    const handleZoom = useCallback((direction: 'in' | 'out' | number) => {
        if (mode !== 'move') {
            return
        }

        setZoom(prevZoom => {
            let newZoom;
            if (typeof direction === 'number') {
                newZoom = direction > 0 ? prevZoom * 1.1 : prevZoom / 1.1;
            } else {
                newZoom = direction === 'in' ? prevZoom * 1.2 : prevZoom / 1.2;
            }
            return Math.min(Math.max(newZoom, 0), 5);
        });
    }, [mode]);

    const handlePan = useCallback((dx: number, dy: number) => {
        //if any grid is selected, don't pan
        if (selectedGrid || selectedText || mode !== 'move') {
            return
        }

        setPan(prevPan => ({
            x: prevPan.x + dx,
            y: prevPan.y + dy
        }));
    }, [selectedGrid, selectedText, mode]);

    useEffect(() => {
        if (!selectedGrid || !selectedText || mode !== 'move') {

            const canvas = svgRef.current
            if (!canvas) return;

            let isDragging = false;
            let lastPosition = { x: 0, y: 0 };

            const handleMouseDown = (e: MouseEvent) => {
                isDragging = true;
                lastPosition = { x: e.clientX, y: e.clientY };
            };

            const handleMouseMove = (e: MouseEvent) => {
                if (!isDragging) return;
                const dx = e.clientX - lastPosition.x;
                const dy = e.clientY - lastPosition.y;
                handlePan(dx, dy);
                lastPosition = { x: e.clientX, y: e.clientY };
            };

            const handleMouseUp = () => {
                isDragging = false;
            };

            const handleWheel = (e: WheelEvent) => {
                e.preventDefault();
                handleZoom(e.deltaY);
            };

            canvas.addEventListener('mousedown', handleMouseDown);
            canvas.addEventListener('mousemove', handleMouseMove);
            canvas.addEventListener('mouseup', handleMouseUp);
            canvas.addEventListener('mouseleave', handleMouseUp);
            canvas.addEventListener('wheel', handleWheel);

            return () => {
                canvas.removeEventListener('mousedown', handleMouseDown);
                canvas.removeEventListener('mousemove', handleMouseMove);
                canvas.removeEventListener('mouseup', handleMouseUp);
                canvas.removeEventListener('mouseleave', handleMouseUp);
                canvas.removeEventListener('wheel', handleWheel);
            };
        }

    }, [handlePan, handleZoom, selectedGrid, selectedText, mode]);


    const handleWheel = useCallback((e: React.WheelEvent) => {
        if (mode !== 'move') {
            return
        }

        if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            const delta = e.deltaY > 0 ? 0.9 : 1.1
            setZoom(prev => Math.min(Math.max(prev * delta, 0.1), 5))
        }
    }, [mode])

    return {
        zoom,
        pan,
        setPan,
        setZoom,
        handleWheel
    }
}