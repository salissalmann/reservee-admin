'use client'
import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useHotkeys } from 'react-hotkeys-hook';
import D3Grid from "./(components)/grid";
import D3Shape from "./(components)/shape";
import D3Texts from "./(components)/text";
import ControlPanal from "./(components)/control-panal/main-panal";
import { useVirtualizer } from '@tanstack/react-virtual';
import { Grid, Polygon, IText, Position, Shape } from "@/app/(pages)/(reservation-seat)/seatmap/types";
import { ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, Hand, MinusIcon, MousePointer2, Plus, PlusIcon, RefreshCcwIcon } from "lucide-react";

const GridContainer: React.FC<{
  polygon: Polygon
  polygons: Polygon[]
  onSave: (polygonId: string, grids: Grid[], texts: IText[], shapes: Shape[], pan: Position) => void
  onCancel: () => void
  onSeatSelection: (polygonId: string, seatNumber: number, areaName: string, price: number) => void
  seatSelections: { polygonId: string, seatNumber: number, areaName: string, price: number }[]
  onRemoveSeatSelection: (polygonId: string, seatNumber: number) => void
  isUserMode: boolean
  calledFromEventPage: boolean
}> = ({
  polygon, polygons, onSave, onCancel, onSeatSelection, seatSelections, onRemoveSeatSelection, isUserMode, calledFromEventPage }) => {

    const [grids, setGrids] = useState<Grid[]>([]);
    const [selectedGrid, setSelectedGrid] = useState<number | null>(null);
    const [copiedGrid, setCopiedGrid] = useState<Grid | null>(null);
    const canvasRef = useRef<HTMLDivElement | null>(null);
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState<Position>({ x: 0, y: 0 });
    const [isVenueMode, setIsVenueMode] = useState(!calledFromEventPage);
    const [shapes, setShapes] = useState<Shape[]>([]);
    const [selectedShapeId, setSelectedShapeId] = useState<number | null>(null);
    const [isResizing, setIsResizing] = useState(false);
    const [texts, setTexts] = useState<IText[]>([]);
    const [selectedText, setSelectedText] = useState<number | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [originalZoom, setOriginalZoom] = useState(1);
    const [originalPan, setOriginalPan] = useState({ x: 0, y: 0 });

    useEffect(() => {
      setGrids(polygon.grids || [])
      setTexts(polygon.text || [])
      setShapes(polygon.shapes || [])

      const allElements = [...(polygon.grids || []), ...(polygon.shapes || []), ...(polygon.text || [])];

      if (allElements.length === 0) {
        setZoom(1);
        setPan({ x: 0, y: 0 });
        setIsLoading(false);
        return;
      }

      const xValues = allElements.map(el => el.position.x);
      const yValues = allElements.map(el => el.position.y);

      polygon.grids?.forEach(grid => {
        const gridWidth = grid.size.cols * 50;
        const gridHeight = grid.size.rows * 50;
        xValues.push(grid.position.x + gridWidth);
        yValues.push(grid.position.y + gridHeight);
      });

      const minX = Math.min(...xValues);
      const maxX = Math.max(...xValues);
      const minY = Math.min(...yValues);
      const maxY = Math.max(...yValues);

      const canvasWidth = canvasRef.current?.clientWidth || 1000;
      const canvasHeight = canvasRef.current?.clientHeight || 1000;

      const contentWidth = maxX - minX;
      const contentHeight = maxY - minY;

      const paddingFactor = 1.2;
      const zoomX = canvasWidth / (contentWidth * paddingFactor);
      const zoomY = canvasHeight / (contentHeight * paddingFactor);

      const newZoom = Math.min(zoomX, zoomY, 1);
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;

      setZoom(newZoom);
      setOriginalZoom(newZoom);

      setPan({
        x: (canvasWidth / 2 / newZoom) - centerX,
        y: (canvasHeight / 2 / newZoom) - centerY
      });
      setOriginalPan({
        x: (canvasWidth / 2 / newZoom) - centerX,
        y: (canvasHeight / 2 / newZoom) - centerY
      });

      setIsLoading(false);
    }, [polygon.grids, polygon.text, polygon.shapes]);

    const parentRef = useRef<HTMLDivElement>(null);


    const copyGrid = useCallback(() => {
      if (selectedGrid) {
        const gridToCopy = grids.find(grid => grid.id === selectedGrid);
        if (gridToCopy) {
          setCopiedGrid({ ...gridToCopy });
        }
      }
    }, [selectedGrid, grids]);

    const handleGridSizeChange = useCallback((id: number, newSize: { rows: number, cols: number }) => {
      setGrids((prevGrids) => {
        const updatedGrids = prevGrids.map((grid) => {
          if (grid.id === id) {
            return { ...grid, size: newSize, rotation: grid.rotation }; // Keep rotation unchanged
          }
          return grid;
        });
        const categorySeatCounts: { [key: string]: number } = {};
        updatedGrids.forEach((grid) => {
          const categoryName = grid.category?.name;
          if (!categoryName) return;
          if (!categorySeatCounts[categoryName]) {
            categorySeatCounts[categoryName] = 0;
          }
          grid.seatStartIndex = categorySeatCounts[categoryName] + 1;
          categorySeatCounts[categoryName] += grid.size.rows * grid.size.cols;
        });

        return updatedGrids;
      });
    }, []);

    const calculateStartIndex = (grids: Grid[]) => {
      if (grids.length === 0) return 1

      let maxIndex = 1
      grids.forEach(grid => {
        const lastIndex = (grid.seatStartIndex || 1) + (grid.size.rows * grid.size.cols) - 1
        maxIndex = Math.max(maxIndex, lastIndex + 1)
      })
      return maxIndex
    }


    const pasteGrid = useCallback(() => {
      if (copiedGrid) {
        const newId = Math.max(...grids.map(g => g.id), 0) + 1;
        const newGrid: Grid = {
          ...copiedGrid,
          id: newId,
          position: {
            x: copiedGrid.position.x + 20,
            y: copiedGrid.position.y + 20
          },
          seatStartIndex: calculateStartIndex(grids)
        };
        setGrids([...grids, newGrid]);
      }
    }, [copiedGrid, grids]);

    useHotkeys('ctrl+c', copyGrid, [copyGrid]);
    useHotkeys('ctrl+v', pasteGrid, [pasteGrid]);

    useEffect(() => {
      const handleOutsideClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;

        if (!(target.closest('svg')) && !target.closest('#sidebar') && !target.closest('#control-panel') && !target.closest('#shape-layout') && !target.closest('#grid-layout') && !target.closest('#grid-category') && !target.closest('#text-layout') && !target.closest('#text-inner') && selectedGrid !== null) {
          setSelectedGrid(null);
        }

        if (!(target.closest('div.shape')) && !target.closest('#sidebar') && !target.closest('#control-panel') && !target.closest('#shape-layout') && !target.closest('#grid-layout') && !target.closest('#grid-category') && !target.closest('#text-layout') && !target.closest('#text-inner') && selectedShapeId !== null && !target.closest('#color-menu')) {
          setSelectedShapeId(null);
          setIsResizing(false);
          setShapes(prevShapes =>
            prevShapes.map(shape => ({ ...shape, isResizing: false }))
          );
        }

        if (!(target.closest('div.text')) && !target.closest('#sidebar') && !target.closest('#control-panel') && !target.closest('#shape-layout') && !target.closest('#grid-layout') && !target.closest('#grid-category') && !target.closest('#text-layout') && !target.closest('#text-inner') && selectedText !== null) {
          setSelectedText(null);
        }
      };

      document.addEventListener('click', handleOutsideClick);
      return () => document.removeEventListener('click', handleOutsideClick);
    }, [selectedGrid, selectedShapeId, selectedText]);
    const [mode, setMode] = useState<'select' | 'move'>('select')

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
        return Math.min(Math.max(newZoom, 0.1), 5);
      });
    }, [mode]);

    const handlePan = useCallback((dx: number, dy: number) => {
      if (mode !== 'move') {
        return
      }
      setPan(prevPan => ({
        x: prevPan.x + dx,
        y: prevPan.y + dy
      }));
    }, [mode]);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      let isDragging = false;
      let lastPosition = { x: 0, y: 0 };
      let initialTouchDistance = 0;

      if (mode !== 'move') {
        return;
      }

      const handleStart = (e: MouseEvent | TouchEvent) => {
        isDragging = true;
        
        if (e instanceof TouchEvent) {
          if (e.touches.length === 1) {
            // Single touch for panning
            const touch = e.touches[0];
            lastPosition = { x: touch.clientX, y: touch.clientY };
          } else if (e.touches.length === 2) {
            // Two-finger touch for zooming
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            initialTouchDistance = Math.hypot(
              touch1.clientX - touch2.clientX, 
              touch1.clientY - touch2.clientY
            );
          }
        } else {
          // Mouse event
          lastPosition = { x: e.clientX, y: e.clientY };
        }
      };

      const handleMove = (e: MouseEvent | TouchEvent) => {
        if (!isDragging) return;

        if (e instanceof TouchEvent) {
          if (e.touches.length === 1) {
            // Single touch panning
            const touch = e.touches[0];
            const dx = touch.clientX - lastPosition.x;
            const dy = touch.clientY - lastPosition.y;
            handlePan(dx, dy);
            lastPosition = { x: touch.clientX, y: touch.clientY };
          } else if (e.touches.length === 2) {
            // Pinch to zoom
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const newTouchDistance = Math.hypot(
              touch1.clientX - touch2.clientX, 
              touch1.clientY - touch2.clientY
            );
            
            // Calculate zoom based on change in touch distance
            const zoomFactor = newTouchDistance / initialTouchDistance;
            handleZoom(zoomFactor > 1 ? 1 : -1);
            
            // Update initial distance
            initialTouchDistance = newTouchDistance;
          }
        } else {
          // Mouse move
          const dx = e.clientX - lastPosition.x;
          const dy = e.clientY - lastPosition.y;
          handlePan(dx, dy);
          lastPosition = { x: e.clientX, y: e.clientY };
        }
      };

      const handleEnd = () => {
        isDragging = false;
        initialTouchDistance = 0;
      };

      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        handleZoom(e.deltaY);
      };

      // Mouse events
      canvas.addEventListener('mousedown', handleStart as EventListener);
      canvas.addEventListener('mousemove', handleMove as EventListener);
      canvas.addEventListener('mouseup', handleEnd);
      canvas.addEventListener('mouseleave', handleEnd);

      // Touch events
      canvas.addEventListener('touchstart', handleStart as EventListener, { passive: false });
      canvas.addEventListener('touchmove', handleMove as EventListener, { passive: false });
      canvas.addEventListener('touchend', handleEnd);
      canvas.addEventListener('touchcancel', handleEnd);

      // Wheel event
      canvas.addEventListener('wheel', handleWheel, { passive: false });

      return () => {
        // Remove mouse events
        canvas.removeEventListener('mousedown', handleStart as EventListener);
        canvas.removeEventListener('mousemove', handleMove as EventListener);
        canvas.removeEventListener('mouseup', handleEnd);
        canvas.removeEventListener('mouseleave', handleEnd);

        // Remove touch events
        canvas.removeEventListener('touchstart', handleStart as EventListener);
        canvas.removeEventListener('touchmove', handleMove as EventListener);
        canvas.removeEventListener('touchend', handleEnd);
        canvas.removeEventListener('touchcancel', handleEnd);

        // Remove wheel event
        canvas.removeEventListener('wheel', handleWheel);
      };
    }, [handlePan, handleZoom, mode]);



    const handleDeleteGrid = (id: number) => {
      handleGridSizeChange(id, { rows: 0, cols: 0 });
      setGrids((prevGrids) => {
        const updatedGrids = prevGrids.filter(grid => grid.id !== id);
        return updatedGrids;
      });
      setSelectedGrid(null);
    };

    const handleDeleteShape = (id: number) => {
      setShapes((prevShapes) => prevShapes.filter(shape => shape.id !== id));
      setSelectedShapeId(null);
    }

    const handleDeleteText = (id: number) => {
      setTexts((prevTexts) => prevTexts.filter(text => text.id !== id));
      setSelectedText(null);
    }


    const handleSeatSelect = (gridId: number, seatnumber: number) => {
      //if already selected, remove it
      if (seatSelections.some(selection => selection.polygonId === polygon.id && selection.seatNumber === seatnumber)) {
        onRemoveSeatSelection(polygon.id, seatnumber);
      } else {
        const polygonName = polygons.find(p => p.id === polygon.id)?.name || ''
        const polygonPrice = polygons.find(p => p.id === polygon.id)?.price || 0
        onSeatSelection(polygon.id, seatnumber, polygonName, polygonPrice);
      }
    };


    const handleShapeSelect = useCallback((id: number) => {

      setSelectedShapeId((prevSelected) => {
        const newSelected = prevSelected === id ? null : id;
        return newSelected;
      });
      setSelectedGrid(null);
      setSelectedText(null);
    }, []);

    const handleTextSelect = (id: number) => {
      setSelectedText((prevSelected) => {
        const newSelected = prevSelected === id ? null : id;
        return newSelected;
      });
      setSelectedGrid(null);
      setSelectedShapeId(null);
    };

    const handleGridSelect = useCallback((id: number) => {
      setSelectedGrid(prev => prev === id ? null : id);
      setIsResizing(false);
      setSelectedShapeId(null);
      setSelectedText(null);
    }, []);

    const renderedShapes = useMemo(() => {
      return shapes.map((shape) => (
        <D3Shape
          key={shape.id}
          id={shape.id}
          position={shape.position}
          onSelect={handleShapeSelect}
          isSelected={selectedShapeId === shape.id}
          isVenueMode={isVenueMode}
          size={shape.size}
          isResizing={isResizing}
          setIsResizing={setIsResizing}
          rotation={shape.rotation}
          color={shape.color}
          onDelete={handleDeleteShape}
          setShapes={setShapes}
          skew={shape.skew}
        />
      ));
    }, [shapes, selectedShapeId, isVenueMode, isResizing]);

    const renderedTexts = useMemo(() => {
      return texts.map((text) => (
        <D3Texts
          key={text.id}
          id={text.id}
          position={text.position}
          onSelect={handleTextSelect}
          isSelected={selectedText === text.id}
          isVenueMode={isVenueMode}
          size={text.fontSize}
          rotation={text.rotation}
          color={text.color}
          onDelete={handleDeleteText}
          textContent={text.content}
          setTextContent={(textContent) =>
            setTexts(prevTexts =>
              prevTexts.map(t =>
                t.id === text.id ? { ...t, content: textContent } : t
              )
            )
          }
          setTexts={setTexts}
        />
      ));
    }, [texts, selectedText, isVenueMode]);


    // const rowVirtualizer = useVirtualizer({
    //   count: grids.length,
    //   getScrollElement: () => parentRef.current,
    //   estimateSize: () => 50,
    //   overscan: 5,
    //   initialRect: { width: window.innerWidth, height: window.innerHeight },
    // });

    // const renderedGrids = useMemo(

    //   () => {
    //     console.log(rowVirtualizer.getVirtualItems())
    //     return rowVirtualizer.getVirtualItems().map((virtualRow: any) => {
    //       const grid = grids[virtualRow.index];
    //       return (
    //         <D3Grid
    //           key={grid.id}
    //           id={grid.id}
    //           initialSize={grid.size}
    //           onSelect={handleGridSelect}
    //           isSelected={selectedGrid === grid.id}
    //           position={grid.position}
    //           seatStartIndex={grid.seatStartIndex || 0}
    //           isVenueMode={isVenueMode}
    //           onSeatSelect={handleSeatSelect}
    //           rotation={grid.rotation}
    //           setGrids={setGrids}
    //           handleGridSizeChange={handleGridSizeChange}
    //           skew={grid.skew}
    //           hideLabels={grid.hideLabels}
    //         />
    //       );
    //     });
    //   }, [
    //   grids,
    //   isLoading,
    //   onSeatSelection,
    //   onRemoveSeatSelection,
    //   seatSelections,
    //   selectedGrid, isVenueMode, handleGridSelect, handleGridSizeChange, rowVirtualizer]);

    {/*pen movement buttons*/}
    const handlePenMovement = (direction: 'left' | 'right' | 'up' | 'down') => {
      // if (mode !== 'move') {
      //   return;
      // }
      setPan(prevPan => ({
        x: prevPan.x + (direction === 'right' ? -100 : direction === 'left' ? 100 : 0),
        y: prevPan.y + (direction === 'down' ? -100 : direction === 'up' ? 100 : 0)
      }));
    }

    const handleZoomReset = () => {
      setZoom(originalZoom);
      setPan(originalPan);
    }

    return (
      <div className="grid-container" style={{ position: 'relative' }}>
        <div
          ref={canvasRef}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100vh',
            overflow: 'hidden',
            cursor: mode === 'move' ? 'move' : 'default',
            borderRadius: '8px',
            backgroundImage: `radial-gradient(circle at 1px 1px, #ccc 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
          className="bg-[#f5f5f5] dark:bg-tertiary border border-[#e5e5e5] dark:border-borderDark"
        >
          {!isVenueMode && (
            <>
              <div className="absolute top-2 left-2">
                <button className="bg-primary font-bold text-white p-2 rounded-md hover:scale-105 transition-all duration-300 text-sm"
                  onClick={() => onCancel()}
                >
                  Back to Areas
                </button>
              </div>
              <div className="absolute flex flex-row gap-2 w-full bottom-4 left-1/2 -translate-x-1/2 bg-white p-2 rounded-xl border border-gray-300 shadow-2xl main-mode-bar z-50">
                <div className="flex !flex-row md:flex-col justify-center gap-2 items-center w-full">
                  <button
                    onClick={() => setMode('select')}
                    className={`border rounded-full p-2 px-4 flex items-center gap-2 text-black font-bold hover:bg-primary hover:text-white transition-all duration-300 ${mode === 'select' ? 'bg-primary text-white' : ''}`}
                  >
                    <MousePointer2 className={`w-4 h-4 md:w-6 md:h-6`} />
                  </button>
                  <button
                    onClick={() => setMode('move')}
                    className={`border rounded-full p-2 px-4 flex items-center gap-2 text-black font-bold hover:bg-primary hover:text-white transition-all duration-300 ${mode === 'move' ? 'bg-primary text-white' : ''}`}
                  >
                    <Hand className={`w-4 h-4 md:w-6 md:h-6`} />
                  </button>
                </div>
                <div className="flex flex-col w-full gap-2">
                  <div className="grid md:hidden grid-cols-3 items-center w-full justify-center gap-2">
                    <div></div>
                    <button
                      onClick={() => handlePenMovement('up')}
                      className="w-fit bg-gray-100 hover:bg-primary hover:text-white rounded-full p-2 flex justify-center items-center"
                    >
                      <ChevronUpIcon className={`w-6 h-6 md:w-6 md:h-6`} color='black'/>
                    </button>
                    <button
                      onClick={handleZoomReset}
                      className="w-fit bg-gray-100 hover:bg-primary hover:text-white rounded-full p-2 flex justify-center items-center"
                    >
                      <RefreshCcwIcon className={`w-4 h-4 md:w-6 md:h-6`} color='black'/>
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => handlePenMovement('left')}
                      className="w-full bg-gray-100 hover:bg-primary hover:text-white rounded-full p-2 flex justify-center items-center"
                    >
                      <ChevronLeftIcon className={`w-6 h-6 md:w-6 md:h-6`} color='black'/>
                    </button>
                    <button
                      onClick={() => handlePenMovement('up')}
                      className="hidden md:flex w-full bg-gray-100 hover:bg-primary hover:text-white rounded-full p-2 justify-center items-center"
                    >
                      <ChevronUpIcon className={`w-6 h-6 md:w-6 md:h-6`} color='black'/>
                    </button>                    
                    <button
                      onClick={() => handlePenMovement('down')}
                      className="w-full bg-gray-100 hover:bg-primary hover:text-white rounded-full p-2 flex justify-center items-center"
                    >
                      <ChevronDownIcon className={`w-6 h-6 md:w-6 md:h-6`} color='black'/>
                    </button>
                    <button
                      onClick={() => handlePenMovement('right')}
                      className="w-full bg-gray-100 hover:bg-primary hover:text-white rounded-full p-2 flex justify-center items-center"
                    >
                        <ChevronRightIcon className={`w-6 h-6 md:w-6 md:h-6`} color='black'/>
                    </button>
                    <button
                      onClick={handleZoomReset}
                      className="hidden md:block w-fit bg-gray-100 hover:bg-primary hover:text-white rounded-full p-2 flex justify-center items-center"
                    >
                      <RefreshCcwIcon className={`w-4 h-4 md:w-6 md:h-6`} color='black'/>
                    </button>
                  </div>

                </div>
                <div className="flex !flex-row md:flex-col justify-center gap-2 items-center w-full">
                <button
                    className={`border rounded-full p-2 px-4 flex items-center gap-2 bg-primary text-white font-bold hover:scale-105 transition-all duration-300`}
                    onClick={() => {
                      setMode('move')
                      handleZoom('in')
                    }}
                  >
                    <PlusIcon className={`w-4 h-4 md:w-6 md:h-6`} />
                  </button>
                  <button
                    className={`border rounded-full p-2 px-4 flex items-center gap-2 bg-primary text-white font-bold hover:scale-105 transition-all duration-300`}
                    onClick={() => {
                      setMode('move')
                      handleZoom('out')
                    }}
                    >
                      <MinusIcon className={`w-4 h-4 md:w-6 md:h-6`} />
                    </button>
                  </div>
              </div>
            </>
          )}

          <div
            ref={parentRef}
            style={{
              transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
              transformOrigin: '0 0',
              width: '100%',
              height: '100%',
              position: 'relative'
            }}
          >
            {isLoading ? <div>Loading...</div> : (
              <>

                {grids.map((grid) => (
                  <D3Grid
                    polygonId={polygon.id}
                    key={grid.id}
                    id={grid.id}
                    initialSize={grid.size}
                    onSelect={handleGridSelect}
                    isSelected={selectedGrid === grid.id}
                    position={grid.position}
                    seatStartIndex={grid.seatStartIndex || 0}
                    isVenueMode={isVenueMode}
                    onSeatSelect={handleSeatSelect}
                    seatSelections={seatSelections}
                    rotation={grid.rotation}
                    setGrids={setGrids}
                    handleGridSizeChange={handleGridSizeChange}
                    skew={grid.skew}
                    hideLabels={grid.hideLabels}
                  />
                ))}
                {renderedShapes}
                {renderedTexts}
              </>
            )}
          </div>
        </div>

        {isVenueMode && (
          <ControlPanal
            isVenueMode={isVenueMode}
            grids={grids}
            texts={texts}
            shapes={shapes}
            selectedGrid={selectedGrid}
            selectedShapeId={selectedShapeId}
            selectedText={selectedText}
            isResizing={isResizing}
            setIsResizing={setIsResizing}
            handleZoom={handleZoom}
            setShapes={setShapes}
            setTexts={setTexts}
            setGrids={setGrids}
            handleDeleteGrid={handleDeleteGrid}
            handleDeleteShape={handleDeleteShape}
            handleDeleteText={handleDeleteText}
            onSave={onSave}
            onCancel={onCancel}
            isUserMode={isUserMode}
            polygon={polygon}
            pan={pan}
          />
        )}
      </div>
    );
  };

export default React.memo(GridContainer);
