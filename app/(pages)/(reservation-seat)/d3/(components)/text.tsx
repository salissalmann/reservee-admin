
import { useState, useEffect } from 'react';
import * as d3 from 'd3';
import { Position } from '../interface';
import { X } from 'lucide-react';
import { IText } from '../../seatmap/types';

const D3Texts = ({
    id, 
    position, 
    onSelect, 
    isSelected, 
    isVenueMode, 
    size, 
    rotation, 
    color,
    onDelete, 
    textContent, 
    setTextContent, 
    setTexts 
}:{ id: number; 
    position: Position; 
    onSelect: (id: number) => void; 
    isSelected: boolean; 
    isVenueMode: boolean; 
    size: number; 
    rotation: number; 
    color: string; 
    onDelete: (id: number) => void; 
    textContent: string; 
    setTextContent: (textContent: string) => void; 
    setTexts: (texts: IText[]) => void }) => 
  {
  
    const [dragPosition, setDragPosition] = useState<Position>(position);
    const [isDragging, setIsDragging] = useState(false);
    const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null); 
  
    useEffect(() => {
      if(!isVenueMode) return;
      
      const drag = d3.drag<SVGSVGElement, unknown>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
  
      d3.select(`#text-${id}`).call(drag as any); 

      function dragstarted(this: SVGGElement) {
        setIsDragging(true); // Set dragging state to true
        d3.select(this).raise().classed("active", true);
      }
  
      function dragged(event: d3.D3DragEvent<SVGSVGElement, unknown, unknown>) {
        setDragPosition(prevPos => {
          const newPosition = {
            x: prevPos.x + event.dx,
            y: prevPos.y + event.dy
          };
          //@ts-ignore
          setTexts((prevTexts: IText[]) => {
            return prevTexts.map((text: IText) =>
              text.id === id ? { ...text, position: newPosition } : text
            );
          });
          return newPosition;
        });
      }
  
      function dragended(this: SVGGElement) {
        setIsDragging(false); 
        d3.select(this).classed("active", false);
      }
    }, [id, isVenueMode]);
  
    const handleMouseDown = (event: React.MouseEvent) => {
      if (isVenueMode){
        event.preventDefault(); 
      }
    };
  
    const handleClick = () => {
      if(!isVenueMode) return;
      if (clickTimeout) {
        clearTimeout(clickTimeout); 
        setClickTimeout(null);        
      } else {
        setClickTimeout(setTimeout(() => {
          onSelect(id); 
          setClickTimeout(null); 
        }, 250)); 
      }
    };
  
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if(!isVenueMode) return;
      try {
        setTextContent(e.target.value);
      } catch (error) {
        console.error("Failed to update text content:", error);
      }
    };
  
    return (
      <div
        id={`text-${id}`}
        style={{
          position: 'absolute',
          left: `${dragPosition.x}px`,
          top: `${dragPosition.y}px`,
          cursor: 'move',
          userSelect: 'none',
          transform: `rotate(${rotation}deg)`,
          border: isSelected ? '2px dotted #555555FF' : 'none', 
          zIndex: 1000,
          padding: '10px',
          borderRadius: '24px',
        }}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
      >
        {isSelected ? (
          <input
            value={textContent}
            onChange={handleTextChange} 
            style={{ fontSize: size, color: color }}
            className="text-input focus:border-none focus:outline-none bg-transparent"
            id={`text-input`}
          />
        ) : (
          <span style={{ fontSize: size, color: color }}>{textContent}</span> 
        )}
  
        {/* {isSelected && isVenueMode && (
          <button onClick={() => onDelete(id)} style={{ position: 'absolute', top: -25, right: -10 }}>
            <X className="w-6 h-6 text-gray-700 hover:text-gray-500 transition-all duration-300 cursor-pointer" />
          </button>
        )} */}
      </div>
    );
  };


export default D3Texts;