import React, { useCallback, useEffect, useState } from 'react'

export default function useLayoutHooks({ mode, svgRef }: { mode: 'select' | 'move', svgRef: React.RefObject<SVGSVGElement> }) {

    const [zoom, setZoom] = useState(1)
    const [pan, setPan] = useState({ x: 0, y: 0 })

    const handleZoom = useCallback((direction: 'in' | 'out' | number) => {
        setZoom(prevZoom => {
            let newZoom;
            if (typeof direction === 'number') {
                newZoom = direction > 0 ? prevZoom * 1.1 : prevZoom / 1.1;
            } else {
                newZoom = direction === 'in' ? prevZoom * 1.2 : prevZoom / 1.2;
            }
            return Math.min(Math.max(newZoom, 0.1), 5);
        });
    }, []);

    const handlePan = useCallback((dx: number, dy: number) => {
        setPan(prevPan => ({
            x: prevPan.x + dx,
            y: prevPan.y + dy
        }));
    }, []);

    useEffect(() => {
        const canvas = svgRef.current;
        if (!canvas) return;

        let isDragging = false;
        let lastPosition = { x: 0, y: 0 };

        const handleMouseDown = (e: MouseEvent) => {
            if (mode !== 'move') return;
            isDragging = true;
            lastPosition = { x: e.clientX, y: e.clientY };
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || mode !== 'move') return;
            const dx = e.clientX - lastPosition.x;
            const dy = e.clientY - lastPosition.y;
            handlePan(dx, dy);
            lastPosition = { x: e.clientX, y: e.clientY };
        };

        const handleMouseUp = () => {
            isDragging = false;
        };

        const handleWheel = (e: WheelEvent) => {
            if (mode !== 'move') return;
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            const delta = -e.deltaY;
            const scaleFactor = delta > 0 ? 1.1 : 0.9;
            
            setZoom(prevZoom => {
                const newZoom = prevZoom * scaleFactor;
                return Math.min(Math.max(newZoom, 0.1), 5);
            });
        };

        canvas.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('wheel', handleWheel);

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('wheel', handleWheel);
        };
    }, [mode, handlePan, handleZoom]);

    return { zoom, pan, setZoom, setPan, handleZoom, handlePan }
}

