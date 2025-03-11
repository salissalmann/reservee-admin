import * as d3 from 'd3';
import { Position, Shape } from '../interface';
import { DeleteIcon, TrashIcon, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const D3Shape = ({
  id,
  position,
  onSelect,
  isSelected,
  isVenueMode,
  size,
  isResizing,
  setIsResizing,
  rotation,
  color,
  onDelete,
  setShapes,
  skew,
}: {
  id: number;
  position: Position;
  onSelect: (id: number) => void;
  isSelected: boolean;
  isVenueMode: boolean;
  size: { width: number; height: number };
  isResizing: boolean;
  setIsResizing: (isResizing: boolean) => void;
  rotation: number;
  color: string;
  onDelete: (id: number) => void;
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
  skew: number;
}) => {
  const [dragPosition, setDragPosition] = useState<Position>(position);
  const [isDragging, setIsDragging] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);
  const [sizes, setSizes] = useState<{ width: number; height: number }>({ width: size.width, height: size.height });

  useEffect(() => {
    if (!isVenueMode) return; // Prevent drag behavior when not in venue mode

    const drag = d3.drag<SVGSVGElement, unknown>()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);

    d3.select(`#shape-${id}`).call(drag as any);

    function dragstarted(this: any, event: d3.D3DragEvent<SVGSVGElement, unknown, unknown>) {
      if (isResizing) return;
      setIsDragging(true);
      d3.select(this).raise().classed("active", true);
    }

    function dragged(this: any, event: d3.D3DragEvent<SVGSVGElement, unknown, unknown>) {
      if (isResizing && resizeDirection === 'bottom-right') {
        setSizes((prevSizes) => {
          const newSizes = {
            width: Math.max(10, prevSizes.width + event.dx),
            height: Math.max(10, prevSizes.height + event.dy)
          };

          setShapes((prevShapes) => {
            return prevShapes.map((shape) =>
              shape.id === id ? { ...shape, size: newSizes } : shape
            );
          });

          return newSizes;
        });

      } else {
        setDragPosition(prevPos => {
          const newPosition = {
            x: prevPos.x + event.dx,
            y: prevPos.y + event.dy,
          };

          setShapes((prevShapes) => {
            return prevShapes.map((shape) =>
              shape.id === id ? { ...shape, position: newPosition } : shape
            );
          });
          return newPosition;
        });
      }
    }

    function dragended(this: any) {
      setIsDragging(false);
      d3.select(this).classed("active", false);
    }
  }, [id, isResizing, resizeDirection, isVenueMode]); // Add isVenueMode to dependencies

  const handleMouseDown = (event: React.MouseEvent) => {
    if (isVenueMode) {
      event.preventDefault();
    }
  };

  const handleClick = () => {
    if (!isVenueMode) return; // Prevent click handling when not in venue mode

    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
      setIsResizing(true);
      setResizeDirection('bottom-right');
    } else {
      setClickTimeout(setTimeout(() => {
        if (isVenueMode) {
          onSelect(id);
        }
        setClickTimeout(null);
      }, 250));
    }
  };

  const handleMouseUp = () => {
    if (isVenueMode) {
      setIsResizing(false);
      setIsDragging(false);
    }
  };

  useEffect(() => {
    setIsResizing(false);
  }, [isSelected]);


  const renderDeleteButton = () => {
    if (!isSelected || !isVenueMode) return null;

    const buttonSize = 24;
    const padding = 5;
    const xPosition = sizes.width - buttonSize / 2 - padding + 20;
    const yPosition = -buttonSize / 2 - padding + 30;

    return (
      <g
        transform={`translate(${xPosition}, ${yPosition})`}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(id);
        }}
        style={{ cursor: 'pointer' }}
      >
        <circle r={buttonSize / 2} fill="red" stroke="white" strokeWidth={2} />
        <line
          x1={-buttonSize / 4}
          y1={-buttonSize / 4}
          x2={buttonSize / 4}
          y2={buttonSize / 4}
          stroke="white"
          strokeWidth={3}
        />
        <line
          x1={-buttonSize / 4}
          y1={buttonSize / 4}
          x2={buttonSize / 4}
          y2={-buttonSize / 4}
          stroke="white"
          strokeWidth={3}
        />
      </g>
    );
  };

  return (
    <svg
      id={`shape-${id}`}
      style={{
        position: 'absolute',
        left: `${dragPosition.x}px`,
        top: `${dragPosition.y}px`,
        cursor: isVenueMode ? (isDragging ? 'grabbing' : (isResizing ? 'nwse-resize' : 'grab')) : 'default',
        transform: `rotate(${rotation}deg) skewX(${skew}deg)`,
        transformOrigin: 'center',
        border: isVenueMode && isSelected ? (isResizing ? '2px dotted red' : '2px dotted #555555FF') : 'none',
        borderRadius: '24px',
      }}
      width={sizes.width + 20}
      height={sizes.height + 20}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onMouseUp={handleMouseUp}
    >
      <g transform="translate(13, 15)">
        <rect
          width={sizes.width - 10}
          height={sizes.height - 10}
          fill={color}
          strokeWidth={isSelected ? 4 : 1}
          stroke="#555555FF"
          rx={10}
          ry={10}
        />
      </g>
      {isVenueMode && isResizing && (
        <rect
          id={`shape-${id}-resize`}
          x={sizes.width + 8}
          y={sizes.height + 8}
          width={10}
          height={10}
          fill="red"
          cursor="nwse-resize"
        />
      )}

      {/* {isVenueMode && renderDeleteButton()} */}
    </svg>
  );
};


export default D3Shape;
