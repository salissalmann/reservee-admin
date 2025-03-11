'use client'

import React, { useCallback, useRef, useState, useMemo, memo, useEffect } from 'react'
import * as d3 from 'd3'
import { toast } from 'react-hot-toast'
import debounce from 'lodash/debounce'
import useSubCanvasLayoutHook from '../seatmap/(hooks)/sub-canvas-layout-hook'
import SelectSidebar from '../seatmap/(components)/(sub-canvas)/select-sidebar'
import { useVirtualizer } from '@tanstack/react-virtual';
import SubCanvasSelector from '../seatmap/(components)/(sub-canvas)/selector'
import GuidelinesDialog from '../seatmap/(components)/guidelines/sub-canvas-popup'
import GridComponent from '../seatmap/(components)/(sub-canvas)/grids'
import { Grid, IText, Polygon, Point } from '../seatmap/types'
import { ControlBar, AddGridDialog, getNextGridId, calculateStartIndex } from '../seatmap/(components)/(sub-canvas)/other-bars'
import { TextComponent, TextControlBar } from '../seatmap/(components)/(sub-canvas)/text'
import { Icon } from '@radix-ui/react-select'
import { Minus, Plus } from 'lucide-react'

type SelectionMode = 'transform' | 'move' | null;

interface GridSubCanvasProps {
  polygon: Polygon
  polygons: Polygon[]
  onSave: (polygonId: string, grids: Grid[], texts: IText[]) => void
  onCancel: () => void
  onSeatSelection: (polygonId: string, seatNumber: number, areaName: string, price: number) => void
  seatSelections: { polygonId: string, seatNumber: number, areaName: string, price: number }[]
  onRemoveSeatSelection: (polygonId: string, seatNumber: number) => void
  isUserMode: boolean
  calledFromEventPage: boolean
}

// Calculate the centroid of the polygon using the shoelace formula
const calculatePolygonCentroid = (points: Point[]): { x: number, y: number } => {
  let area = 0;
  let cx = 0;
  let cy = 0;

  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    const cross = points[i][0] * points[j][1] - points[j][0] * points[i][1];

    area += cross;
    cx += (points[i][0] + points[j][0]) * cross;
    cy += (points[i][1] + points[j][1]) * cross;
  }

  area /= 2;
  cx = cx / (6 * area);
  cy = cy / (6 * area);

  return { x: cx, y: cy };
}

export default function GridSubCanvas({ 
  polygon, 
  polygons, 
  onSave, 
  onCancel, 
  onSeatSelection, 
  seatSelections, 
  onRemoveSeatSelection, 
  isUserMode, 
  calledFromEventPage 
}: GridSubCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [grids, setGrids] = useState<Grid[]>([])
  const [texts, setTexts] = useState<IText[]>([])
  const [initialLoad, setInitialLoad] = useState(false)


  const [selectedGrid, setSelectedGrid] = useState<number | null>(null)
  const [isAddGridOpen, setIsAddGridOpen] = useState(false)
  const [clipboardGrid, setClipboardGrid] = useState<Grid | null>(null)
  const [selectionMode, setSelectionMode] = useState<SelectionMode>(null)
  const [selectedText, setSelectedText] = useState<number | null>(null)
  const [textMode, setTextMode] = useState<'move' | 'transform' | null>(null)
  const [mode, setMode] = useState<'select' | 'move'>('select')
  const { zoom, pan, handleWheel, setZoom, setPan } = useSubCanvasLayoutHook({ selectedGrid, selectedText, svgRef, mode, setMode })

  // Add new state for touch handling
  const [isDragging, setIsDragging] = useState(false);
  const [lastTouchPos, setLastTouchPos] = useState<{ x: number, y: number } | null>(null);

  // Add touch event handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (mode === 'move') {
      setIsDragging(true);
      setLastTouchPos({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      });
    }
  }, [mode]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isDragging && lastTouchPos && mode === 'move') {
      const touch = e.touches[0];
      const dx = touch.clientX - lastTouchPos.x;
      const dy = touch.clientY - lastTouchPos.y;

      setPan(prev => ({
        x: prev.x + dx,
        y: prev.y + dy
      }));

      setLastTouchPos({
        x: touch.clientX,
        y: touch.clientY
      });
    }
  }, [isDragging, lastTouchPos, mode, setPan]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setLastTouchPos(null);
  }, []);

  useEffect(() => {
    setGrids(polygon.grids || [])
    setTexts(polygon.text || [])

  }, [polygon.grids, polygon.text])

  // Create a debounced version of the grid update function
  const debouncedGridUpdate = useMemo(
    () =>
      debounce((updatedGrids: Grid[]) => {
        setGrids(updatedGrids);
      }, 100),
    []
  );

  const handleTextDoubleClick = useCallback((textId: number) => {
    setSelectedGrid(null)
    setSelectionMode(null)
    setSelectedText(textId)
    setTextMode('move')
  }, [])

  const handleTextEdit = useCallback((textId: number, content: string) => {
    setTexts(prev => prev.map(t =>
      t.id === textId ? { ...t, content } : t
    ))
  }, [])

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target instanceof Element &&
      (e.target.closest('.control-toolbar') ||
        e.target.closest('.grid-group') ||
        e.target.closest('text'))) {
      return
    }
    setSelectedText(null)
    setSelectedGrid(null)
    setSelectionMode(null)
    setTextMode(null)
  }, [])

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const mainGroup = svg.append('g').attr('class', 'main-group')

    // Calculate the bounds of the polygon
    const minX = Math.min(...polygon.points.map(p => p[0]))
    const maxX = Math.max(...polygon.points.map(p => p[0]))
    const minY = Math.min(...polygon.points.map(p => p[1]))
    const maxY = Math.max(...polygon.points.map(p => p[1]))

    // Calculate polygon dimensions with padding
    const padding = 40 // Add padding around the polygon
    const polygonWidth = maxX - minX
    const polygonHeight = maxY - minY

    // Get available screen dimensions
    const screenWidth = svgRef.current.clientWidth - (padding * 2)
    const screenHeight = svgRef.current.clientHeight - (padding * 2)

    // Calculate scale to fit polygon within screen bounds
    const scaleX = screenWidth / polygonWidth
    const scaleY = screenHeight / polygonHeight
    const scale = Math.min(scaleX, scaleY) // Add a little extra padding with 0.9

    //if not laptop then don't scale
    if (window.innerWidth > 1024 && !calledFromEventPage) {
      // Draw the polygon with fixed scale
      mainGroup.append('path')
        .attr('d', d3.line()
          .x(d => (d[0] - minX) * scale + padding)
          .y(d => (d[1] - minY) * scale + padding)
          (polygon.points) + 'Z')
        .attr('fill', 'rgba(0, 0, 0, 0.1)')
        .attr('stroke', 'black')
        .style('pointer-events', 'none')
      // .style('transform', `scale(${scale-0.5})`)


      // Calculate the centroid based on transformed coordinates
      const { x: centerX, y: centerY } = calculatePolygonCentroid(
        polygon.points.map(p => [
          (p[0] - minX) * scale + padding,
          (p[1] - minY) * scale + padding
        ])
      )

      // Center the polygon in the viewport
      setPan({
        x: -centerX + window.innerWidth / 2,
        y: -centerY + window.innerHeight / 2
      })
    }

    if (calledFromEventPage) {
      // mainGroup.append('path')
      //   .attr('d', d3.line()
      //     .x(d => (d[0] - minX) * scale + padding)
      //     .y(d => (d[1] - minY) * scale + padding)
      //     (polygon.points) + 'Z')
      //   .attr('fill', 'rgba(0, 0, 0, 0.1)')
      //   .attr('stroke', 'black')
      //   .style('pointer-events', 'none');
   
      // Center in viewport and apply a slightly smaller scale for better visibility
      setPan({
        x: 0,
        y: -200
      });
      setZoom(1.2); // Adjust this value as needed for better initial view
    }


    // else {
    //   mainGroup.append('path')
    //   .attr('d', d3.line()
    //     .x(d => (d[0] - minX) + padding)
    //     .y(d => (d[1] - minY) + padding)
    //     (polygon.points) + 'Z')
    //   .attr('fill', 'rgba(0, 0, 0, 0.1)')
    //   .attr('stroke', 'black')
    //   .style('pointer-events', 'none')
    //   .attr('transform', `scale(${scale})`)
    // }

  }, [polygon.points])

  const handleAddGrid = (rows: number, cols: number) => {
    // Get the SVG element and its dimensions
    const svg = svgRef.current
    if (!svg) return

    // Get the center of the current viewport
    const viewportX = -pan.x / zoom
    const viewportY = -pan.y / zoom
    const viewportWidth = svg.clientWidth / zoom
    const viewportHeight = svg.clientHeight / zoom

    // Calculate center position in the current viewport
    const centerX = viewportX + (viewportWidth / 2)
    const centerY = viewportY + (viewportHeight / 2)

    // Get the scale from the last grid, or default to 1
    const lastGrid = grids[grids.length - 1]
    const inheritedScale = lastGrid?.scale || 0.5

    const newId = getNextGridId(grids)
    const startIndex = calculateStartIndex(grids)
    const newGrid: Grid = {
      id: newId,
      size: { rows, cols },
      position: { x: centerX, y: centerY },
      category: {
        name: 'Default',
        acronym: 'D',
        color: '#000000',
        seatCount: rows * cols,
        price: 0
      },
      seatStartIndex: startIndex,
      rotation: 0,
      skew: 0,
      hideLabels: false,
      scale: inheritedScale
    }

    setGrids(prev => [...prev, newGrid])
    setIsAddGridOpen(false)
    toast.success('Grid added successfully')
  }


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedGrid) return;

      const currentGrid = grids.find(g => g.id === selectedGrid);
      if (!currentGrid) return;

      // Copy/Paste handling remains the same...
      if (e.ctrlKey && e.key === 'c') {
        setClipboardGrid(currentGrid);
        toast.success('Grid copied to clipboard');
      }

      if (e.ctrlKey && e.key === 'v' && clipboardGrid) {
        const startIndex = calculateStartIndex(grids);
        const newGrid: Grid = {
          ...clipboardGrid,
          id: getNextGridId(grids),
          position: {
            x: clipboardGrid.position.x + 50,
            y: clipboardGrid.position.y + 50
          },
          seatStartIndex: startIndex
        };
        setGrids(prev => [...prev, newGrid]);
        toast.success('Grid pasted');
      }

      // Arrow keys for grid size adjustment
      if (e.key.startsWith('Arrow')) {
        e.preventDefault();

        const newGrids = [...grids];
        const gridIndex = newGrids.findIndex(g => g.id === selectedGrid);

        if (gridIndex === -1) return;

        const newSize = { ...newGrids[gridIndex].size };

        switch (e.key) {
          case 'ArrowRight':
            newSize.cols = newSize.cols + 1;
            break;
          case 'ArrowLeft':
            newSize.cols = Math.max(newSize.cols - 1, 1);
            break;
          case 'ArrowUp':
            newSize.rows = Math.max(newSize.rows - 1, 1);
            break;
          case 'ArrowDown':
            newSize.rows = newSize.rows + 1;
            break;
        }

        // Update the selected grid
        newGrids[gridIndex] = {
          ...newGrids[gridIndex],
          size: newSize,
          category: {
            ...newGrids[gridIndex].category!,
            seatCount: newSize.rows * newSize.cols
          }
        };

        // Recalculate seat numbers
        let currentIndex = 1;
        const finalGrids = newGrids.map(grid => {
          const updatedGrid = {
            ...grid,
            seatStartIndex: currentIndex
          };
          currentIndex += grid.size.rows * grid.size.cols;
          return updatedGrid;
        });

        // Use the debounced update
        debouncedGridUpdate(finalGrids);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      debouncedGridUpdate.cancel(); // Cancel any pending debounced updates
    };
  }, [selectedGrid, grids, clipboardGrid, debouncedGridUpdate]);


  const handleTextDrag = useCallback((id: number, dx: number, dy: number) => {
    if (isUserMode) {
      return
    }
    setTexts(prev => prev.map(t =>
      t.id === id
        ? { ...t, position: { x: t.position.x + dx / zoom, y: t.position.y + dy / zoom } }
        : t
    ))
  }, [zoom, isUserMode])

  const [openGuidelines, setOpenGuidelines] = useState(false)
  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: grids.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5,
    initialRect: { width: window.innerWidth, height: window.innerHeight },
  });

  const ScaleGridsAndTexts = (scale: number) => {
    setGrids(prev => prev.map(g => ({ ...g, scale: g.scale ? g.scale * scale : 0.5 })))
    setTexts(prev => prev.map(t => ({ ...t, scale: t.scale ? t.scale * scale : 0.5 })))
  }

  const renderedGrids = useMemo(() => {
    return grids.map((grid) => (
      <GridComponent
        key={grid.id}
        grid={grid}
        isSelected={selectedGrid === grid.id}
        selectionMode={selectedGrid === grid.id ? selectionMode : null}
        polygonId={polygon.id}
        polygons={polygons}
        onSeatSelection={onSeatSelection}
        seatSelections={seatSelections}
        onRemoveSeatSelection={onRemoveSeatSelection}
        isUserMode={isUserMode}
        setGrids={setGrids}
        setSelectedGrid={setSelectedGrid}
        zoom={zoom}
        setSelectionMode={setSelectionMode}
        setSelectedText={setSelectedText}
        setTextMode={setTextMode}
      />
    ));
  }, [grids, selectedGrid, selectionMode, zoom, isUserMode, rowVirtualizer, onSeatSelection, onRemoveSeatSelection, seatSelections, polygon.id]);

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #ccc 1px, transparent 1px)`,
        backgroundSize: '20px 20px',
        cursor: mode === 'move' ? 'grab' : 'default',
        //touchAction: mode === 'move' ? 'none' : 'auto'
      }}
      ref={parentRef}
      onClick={handleCanvasClick}
      onContextMenu={(e) => e.preventDefault()}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {!isUserMode && (
        <SelectSidebar
          svgRef={svgRef}
          texts={texts}
          setTexts={setTexts}
          pan={pan}
          zoom={zoom}
          handleAddGrid={handleAddGrid}
          setOpenGuidelines={setOpenGuidelines}
        />
      )}

      {selectedGrid && !selectedText && (
        <ControlBar
          grids={grids}
          setGrids={setGrids}
          setSelectedGrid={setSelectedGrid}
          selectedGrid={grids.find(g => g.id === selectedGrid)}
          onRotationChange={(rotation) => {
            setGrids(prev => prev.map(g =>
              g.id === selectedGrid
                ? { ...g, rotation }
                : g
            ))
          }}
          onScaleChange={(newScale) => {
            setGrids(prev => prev.map(g =>
              g.id === selectedGrid
                ? { ...g, scale: newScale }
                : g
            ))
          }}
          isUserMode={isUserMode}
        />
      )}

      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{
          transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
          transformOrigin: '0 0',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          maxWidth: '100vw',
          maxHeight: '100vh',
          position: 'absolute',
          left: 0,
          top: 0,
          overflow: 'visible'
        }}
        viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {grids.length > 0 && renderedGrids}

        {texts.map(text => (
          <TextComponent
            key={text.id}
            text={text}
            isSelected={selectedText === text.id}
            mode={selectedText === text.id ? textMode : null}
            onSelect={(mode) => {
              setSelectedGrid(null)
              setSelectionMode(null)
              setSelectedText(text.id)
              setTextMode(mode)
            }}
            onDrag={(dx, dy) => handleTextDrag(text.id, dx, dy)}
            onDoubleClick={() => handleTextDoubleClick(text.id)}
            onTextEdit={(content) => handleTextEdit(text.id, content)}
            isUserMode={isUserMode}
          />
        ))}
      </svg>

      {selectedText && !selectedGrid && (
        <TextControlBar
          texts={texts}
          setTexts={setTexts}
          selectedText={texts.find(t => t.id === selectedText)}
          onDelete={() => {
            setTexts(prev => prev.filter(t => t.id !== selectedText))
            setSelectedText(null)
          }}
        />
      )}

      {calledFromEventPage && (
        <div className="absolute bottom-0 left-0 flex gap-2 bg-white shadow-lg rounded-lg p-2">
          <button className="bg-white"
            onClick={() => ScaleGridsAndTexts(1.2)}
          >
            <Plus />
          </button>
          <button className="bg-white"
            onClick={() => ScaleGridsAndTexts(0.8)}
          >
            <Minus />
          </button>
        </div>
      )}


      <AddGridDialog
        open={isAddGridOpen}
        onOpenChange={setIsAddGridOpen}
        onAdd={handleAddGrid}
      />

      <GuidelinesDialog
        open={openGuidelines}
        onOpenChange={setOpenGuidelines}
      />


      <SubCanvasSelector
        mode={mode}
        setMode={setMode}
        onSave={onSave}
        polygon={polygon}
        grids={grids}
        texts={texts}
        isUserMode={isUserMode}
        onCancel={onCancel}
      />

    </div>
  )
}


