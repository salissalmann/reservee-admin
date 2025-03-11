'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { GridSize, Position } from '../interface';
import { D3GridProps } from '../../seatmap/types';


const D3Grid: React.FC<D3GridProps> = ({
  polygonId,
  id,
  initialSize,
  onSelect,
  isSelected,
  position,
  seatStartIndex,
  isVenueMode,
  onSeatSelect,
  rotation,
  setGrids,
  skew,
  hideLabels,
  handleGridSizeChange,
  seatSelections
}) => {
  const [gridSize, setGridSize] = useState<GridSize>(initialSize);
  const gridCellSize = 50;
  const [dragPosition, setDragPosition] = useState<Position>(position);
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !isVenueMode) return;
    
    const drag = d3.drag<SVGSVGElement, unknown>()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);

    d3.select(svgRef.current).call(drag);

    function dragstarted(event: d3.D3DragEvent<SVGSVGElement, unknown, unknown>) {
      if (!isVenueMode || !isSelected) return;
      event.sourceEvent.stopPropagation();
      setIsDragging(true);
    }

    function dragged(event: d3.D3DragEvent<SVGSVGElement, unknown, unknown>) {
      if (!isVenueMode || !isSelected) return;
      event.sourceEvent.stopPropagation();
      setDragPosition((prevPos) => {
        const newPosition = {
          x: prevPos.x + event.dx,
          y: prevPos.y + event.dy
        };
        
        // Update grid position in parent state
        setGrids((prevGrids) => 
          prevGrids.map((grid) => 
            grid.id === id ? { ...grid, position: newPosition } : grid
          )
        );

        return newPosition;
      });
    }

    function dragended(event: d3.D3DragEvent<SVGSVGElement, unknown, unknown>) {
      if (!isVenueMode || !isSelected) return;
      event.sourceEvent.stopPropagation();
      setIsDragging(false);
    }

    return () => {
      d3.select(svgRef.current).on('.drag', null);
    };
  }, [isVenueMode, id, isSelected, setGrids]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isSelected) return;

      event.preventDefault();
      setGridSize((prev) => {
        switch (event.key) {
          case "ArrowUp":
            handleGridSizeChange(id, { rows: prev.rows + 1, cols: prev.cols });
            return { ...prev, rows: prev.rows + 1 };
          case "ArrowDown":
            handleGridSizeChange(id, { rows: Math.max(1, prev.rows - 1), cols: prev.cols });
            return { ...prev, rows: Math.max(1, prev.rows - 1) };
          case "ArrowRight":
            handleGridSizeChange(id, { rows: prev.rows, cols: prev.cols + 1 });
            return { ...prev, cols: prev.cols + 1 };
          case "ArrowLeft":
            handleGridSizeChange(id, { rows: prev.rows, cols: Math.max(1, prev.cols - 1) });
            return { ...prev, cols: Math.max(1, prev.cols - 1) };
          default:
            return prev;
        }
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isSelected]);

  const handleSeatClick = (index: number) => {
    if (!isVenueMode) {
        onSeatSelect(id, seatStartIndex + index)
    }
  };

  const renderSeat = useCallback((index: number) => {
    const isSelected = seatSelections.some((selection: { polygonId: any; seatNumber: number }) =>
      selection.polygonId === polygonId && selection.seatNumber === seatStartIndex + index
  )
    const scale = gridCellSize / 37;

    return (
      <g
        key={index}
        transform={`translate(${(index % gridSize.cols) * gridCellSize}, ${Math.floor(index / gridSize.cols) * gridCellSize})`}
        onClick={() => handleSeatClick(index)}
        style={{ cursor: isVenueMode ? 'default' : 'pointer' }}
      >
        <path
          d={`M ${3.74618 * scale} ${10.4537 * scale} 
             C ${2.08167 * scale} ${5.28849 * scale} ${5.93375 * scale} 0 ${11.3606 * scale} 0 
             H ${26.1672 * scale} 
             C ${31.2913 * scale} 0 ${35.0944 * scale} ${4.74998 * scale} ${33.9735 * scale} ${9.74997 * scale} 
             L ${31.8352 * scale} ${19.2884 * scale} 
             C ${31.0162 * scale} ${22.9417 * scale} ${27.773 * scale} ${25.5384 * scale} ${24.0289 * scale} ${25.5384 * scale} 
             H ${14.4344 * scale} 
             C ${10.9614 * scale} ${25.5384 * scale} ${7.88517 * scale} ${23.2977 * scale} ${6.81995 * scale} ${19.9922 * scale} 
             L ${3.74618 * scale} ${10.4537 * scale}`}
          fill={isSelected ? "#EF404A" : "rgba(239, 64, 74, 0.43)"}
          strokeWidth={1}
        />
        <rect
          x={11.4697 * scale}
          y={27.389 * scale}
          width={16.8174 * scale}
          height={2.96098 * scale}
          rx={1.48049 * scale}
          fill={isSelected ? "#EF404A" : "rgba(239, 64, 74, 0.43)"}
          stroke={"#777777FF"}
          strokeWidth={1}
        />
        <text
          x={gridCellSize / 2}
          y={gridCellSize / 3}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="10px"
          fontWeight="bold"
          fill={isSelected ? "white" : "#5F5F5FFF"}
        >
          {`${seatStartIndex + index}`}
        </text>
      </g>
    );
  }, [gridSize.cols, gridCellSize, seatSelections, isVenueMode, seatStartIndex]);

  const seats = useMemo(() => {
    return Array.from({ length: gridSize.rows * gridSize.cols }, (_, i) => renderSeat(i));
  }, [gridSize.rows, gridSize.cols, renderSeat]);

  const renderRowLabels = () => {
    if (hideLabels) return null;
    return Array.from({ length: gridSize.rows }, (_, i) => {
      const label = String.fromCharCode(65 + i); 
      return (
        <text
          key={`row-${i}`}
          x={15}  
          y={10 + (i * gridCellSize) + (gridCellSize / 2)}  
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="12px"
          fontWeight="bold"
          fill="#8B8B8BFF"
        >
          {label}
        </text>
      );
      
    });
  };

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'absolute',
        left: `${dragPosition.x}px`,
        top: `${dragPosition.y}px`,
        width: `${gridSize.cols * gridCellSize + 40}px`,
        height: `${gridSize.rows * gridCellSize + 40}px`,
      }}
    >
        <svg
          ref={svgRef}
          id={`d3-grid-${id}`}
          width={gridSize.cols * gridCellSize + 45}
          height={gridSize.rows * gridCellSize + 40}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            transform: `rotate(${rotation}deg) skewX(${skew}deg)`,
            transformOrigin: 'center',
            border: isSelected ? '2px dotted #6F7287' : 'none',
            cursor: isVenueMode ? (isSelected ? (isDragging ? 'grabbing' : 'grab') : 'default') : 'default',
            userSelect: 'none',
            borderRadius: '24px',
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (isVenueMode) onSelect(id);
          }}
        >
          {renderRowLabels()}
          <g transform={`translate(30, 20)`}>
            <rect width={gridSize.cols * gridCellSize} height={gridSize.rows * gridCellSize} fill="transparent"/>
            {seats}
          </g>
        </svg>
    </div>
  );
};

export default D3Grid;

