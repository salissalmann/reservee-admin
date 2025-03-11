import React from 'react'

export default function GridContainer() {
  return (
    <div>GridContainer</div>
  )
}

// 'use client'
// import React, { useEffect, useState, useCallback, useRef, use } from "react";
// import { useHotkeys } from 'react-hotkeys-hook';
// import toast from "react-hot-toast";
// import { Grid, GridSize, Position, Category, Shape, Text } from "../d3/interface";
// import D3Grid from "../d3/(components)/grid";
// import D3Shape from "../d3/(components)/shape";
// import D3Texts from "../d3/(components)/text";
// import { CalendarSearch, Circle, Clock, Minus, PlusIcon } from "lucide-react";
// import axios from "axios";

// const GridContainer: React.FC = () => {
//   const [grids, setGrids] = useState<Grid[]>([]);
//   const [selectedGrid, setSelectedGrid] = useState<number | null>(null);
//   const [copiedGrid, setCopiedGrid] = useState<Grid | null>(null);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const canvasRef = useRef<HTMLDivElement | null>(null);
//   const [zoom, setZoom] = useState(1);
//   const [pan, setPan] = useState<Position>({ x: 0, y: 0 });
//   const [isVenueMode, setIsVenueMode] = useState(false);
//   const [selectedSeats, setSelectedSeats] = useState<{ [key: number]: number[] }>({});
//   const [shapes, setShapes] = useState<Shape[]>([]);
//   const [selectedShapeId, setSelectedShapeId] = useState<number | null>(null);
//   const [isResizing, setIsResizing] = useState(false);
//   const [texts, setTexts] = useState<Text[]>([]);
//   const [selectedText, setSelectedText] = useState<number | null>(null);

//   const handleGridSelect = useCallback((id: number) => {
//     setSelectedGrid((prevSelected) => {
//       const newSelected = prevSelected === id ? null : id;
//       return newSelected;
//     });
//     setIsResizing(false);
//     setSelectedShapeId(null);
//     setSelectedText(null);
//   }, []);

//   const handleGridSizeChange = useCallback((id: number, newSize: GridSize) => {
//     setGrids((prevGrids) => {
//       const updatedGrids = prevGrids.map((grid) => {
//         if (grid.id === id) {
//           return { ...grid, size: newSize, rotation: grid.rotation }; // Keep rotation unchanged
//         }
//         return grid;
//       });
//       const categorySeatCounts: { [key: string]: number } = {};
//       updatedGrids.forEach((grid) => {
//         const categoryName = grid.category.name;
//         if (!categorySeatCounts[categoryName]) {
//           categorySeatCounts[categoryName] = 0;
//         }
//         grid.seatStartIndex = categorySeatCounts[categoryName] + 1;
//         categorySeatCounts[categoryName] += grid.size.rows * grid.size.cols;
//       });

//       return updatedGrids;
//     });
//   }, []);

//   const copyGrid = useCallback(() => {
//     if (selectedGrid) {
//       const gridToCopy = grids.find(grid => grid.id === selectedGrid);
//       if (gridToCopy) {
//         setCopiedGrid({ ...gridToCopy });
//       }
//     }
//   }, [selectedGrid, grids]);

//   const pasteGrid = useCallback(() => {
//     if (copiedGrid) {
//       const newId = Math.max(...grids.map(g => g.id), 0) + 1;
//       const newGrid: Grid = {
//         ...copiedGrid,
//         id: newId,
//         position: {
//           x: copiedGrid.position.x + 20,
//           y: copiedGrid.position.y + 20
//         }
//       };
//       setGrids([...grids, newGrid]);
//     }
//   }, [copiedGrid, grids]);

//   // Set up hotkeys
//   useHotkeys('ctrl+c', copyGrid, [copyGrid]);
//   useHotkeys('ctrl+v', pasteGrid, [pasteGrid]);

//   useEffect(() => {
//     const handleOutsideClick = (event: MouseEvent) => {
//       const target = event.target as HTMLElement;

//       if (!(target.closest('svg')) && !target.closest('#sidebar') && selectedGrid !== null) {
//         setSelectedGrid(null);
//       }

//       if (!(target.closest('div.shape')) && !target.closest('#sidebar') && selectedShapeId !== null) {
//         setSelectedShapeId(null);
//         setIsResizing(false);
//         setShapes(prevShapes =>
//           prevShapes.map(shape => ({ ...shape, isResizing: false }))
//         );
//       }

//       if (!(target.closest('div.text')) && !target.closest('#sidebar') && selectedText !== null) {
//         setSelectedText(null);
//       }
//     };

//     document.addEventListener('click', handleOutsideClick);
//     return () => document.removeEventListener('click', handleOutsideClick);
//   }, [selectedGrid, selectedShapeId, selectedText]);

//   const handleZoom = useCallback((direction: 'in' | 'out' | number) => {
//     setZoom(prevZoom => {
//       let newZoom;
//       if (typeof direction === 'number') {
//         newZoom = direction > 0 ? prevZoom * 1.1 : prevZoom / 1.1;
//       } else {
//         newZoom = direction === 'in' ? prevZoom * 1.2 : prevZoom / 1.2;
//       }
//       return Math.min(Math.max(newZoom, 0.1), 5);
//     });
//   }, []);

//   const handlePan = useCallback((dx: number, dy: number) => {
//     setPan(prevPan => ({
//       x: prevPan.x + dx,
//       y: prevPan.y + dy
//     }));
//   }, []);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     let isDragging = false;
//     let lastPosition = { x: 0, y: 0 };

//     const handleMouseDown = (e: MouseEvent) => {
//       isDragging = true;
//       lastPosition = { x: e.clientX, y: e.clientY };
//     };

//     const handleMouseMove = (e: MouseEvent) => {
//       if (!isDragging) return;
//       const dx = e.clientX - lastPosition.x;
//       const dy = e.clientY - lastPosition.y;
//       handlePan(dx, dy);
//       lastPosition = { x: e.clientX, y: e.clientY };
//     };

//     const handleMouseUp = () => {
//       isDragging = false;
//     };

//     const handleWheel = (e: WheelEvent) => {
//       e.preventDefault();
//       handleZoom(e.deltaY > 0 ? 'in' : 'out');
//     };

//     canvas.addEventListener('mousedown', handleMouseDown);
//     canvas.addEventListener('mousemove', handleMouseMove);
//     canvas.addEventListener('mouseup', handleMouseUp);
//     canvas.addEventListener('mouseleave', handleMouseUp);
//     canvas.addEventListener('wheel', handleWheel);

//     return () => {
//       canvas.removeEventListener('mousedown', handleMouseDown);
//       canvas.removeEventListener('mousemove', handleMouseMove);
//       canvas.removeEventListener('mouseup', handleMouseUp);
//       canvas.removeEventListener('mouseleave', handleMouseUp);
//     };
//   }, [handlePan]);



//   const handleDeleteGrid = (id: number) => {
//     setGrids((prevGrids) => {
//       const updatedGrids = prevGrids.filter(grid => grid.id !== id);

//       // Recalculate seatStartIndex for all grids in the same category
//       const categorySeatCounts: { [key: string]: number } = {};
//       updatedGrids.forEach((grid) => {
//         const categoryName = grid.category.name;
//         if (!categorySeatCounts[categoryName]) {
//           categorySeatCounts[categoryName] = 0;
//         }
//         grid.seatStartIndex = categorySeatCounts[categoryName] + 1;
//         categorySeatCounts[categoryName] += grid.size.rows * grid.size.cols;
//       });

//       return updatedGrids;
//     });
//   };

//   const handleDeleteShape = (id: number) => {
//     setShapes((prevShapes) => prevShapes.filter(shape => shape.id !== id));
//   }

//   const handleDeleteText = (id: number) => {
//     setTexts((prevTexts) => prevTexts.filter(text => text.id !== id));
//   }


//   const handleSeatSelect = (gridId: number, seats: number[]) => {
//     setSelectedSeats(prev => ({ ...prev, [gridId]: seats }));
//   };


//   const handleShapeSelect = useCallback((id: number) => {

//     setSelectedShapeId((prevSelected) => {
//       const newSelected = prevSelected === id ? null : id;
//       return newSelected;
//     });
//     setSelectedGrid(null);
//     setSelectedText(null);
//   }, []);

//   const handleTextSelect = (id: number) => {
//     setSelectedText((prevSelected) => {
//       const newSelected = prevSelected === id ? null : id;
//       return newSelected;
//     });
//     setSelectedGrid(null);
//     setSelectedShapeId(null);
//   };



//   const importConfig = useCallback(async () => {
//     try {
//       // const response = await fetch('https://pub-ccfdb073636e4defaa83367976a80214.r2.dev/55d3d7f0-d5b2-4267-a1f2-680450524246.json');
//       // const config = await response.json();
//       const response = await axios.get('https://pub-ccfdb073636e4defaa83367976a80214.r2.dev/a8d4b251-281f-46cc-818c-fede077e007b.json');
//         //https://pub-ccfdb073636e4defaa83367976a80214.r2.dev/e0d32d1b-db25-4839-b7bb-72102c23b98a.json');
//       //https://pub-ccfdb073636e4defaa83367976a80214.r2.dev/55d3d7f0-d5b2-4267-a1f2-680450524246.json'
//       const config = response.data;


//       setGrids(config.grids || []);
//       setShapes(config.shapes || []);
//       setTexts(config.texts || []);
//       setCategories(config.categories || []);
      
//       const allElements = [...config.grids, ...config.shapes, ...config.texts];
//       const xValues = allElements.map(el => el.position.x);
//       const yValues = allElements.map(el => el.position.y);

//       const canvasWidth = canvasRef.current?.clientWidth || 1000;
//       const canvasHeight = canvasRef.current?.clientHeight || 1000;
//       const contentWidth = Math.max(...xValues) - Math.min(...xValues);
//       const contentHeight = Math.max(...yValues) - Math.min(...yValues);

//       //SEACH FOR WORDS LIKE "STAGE", "GROUND", if found, set the zoom to set x and y to the center of the canvas else set the zoom to 1
//       const centerX = (Math.min(...xValues) + Math.max(...xValues)) / 2;
//       const centerY = (Math.min(...yValues) + Math.max(...yValues)) / 2;
//       const zoomX = canvasWidth / (contentWidth * 1.2);
//       const zoomY = canvasHeight / (contentHeight * 1.2);
//       const newZoom = Math.min(zoomX, zoomY, 1);

//       setZoom(newZoom);
//       setPan({
//         x: (canvasWidth / 2 / newZoom) - centerX,
//         y: (canvasHeight / 2 / newZoom) - centerY
//       });

//       if (config.pan) {
//         setPan(config.pan);
//       }

//       toast.success('Configuration loaded successfully');
//     } catch (error) {
//       toast.error('Error loading configuration');
//       console.error('Error loading configuration:', error);
//     }
//   }, []);



//   // Add useEffect to load the configuration when component mounts
//   useEffect(() => {
//     importConfig();
//   }, [importConfig]);

//   return (
//     <div className="grid-container" style={{ position: 'relative' }}>


//       <div
//         ref={canvasRef}
//         style={{
//           position: 'absolute',
//           width: '100%',
//           height: '100vh',
//           overflow: 'hidden',
//           cursor: 'move',
//           // backgroundColor: 'rgba(255, 255, 255, 0.8)',
//           // backdropFilter: 'blur(10px)',
//           border: '1px solid #ccc',
//           // boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
//         }}
//       >

//         {/* a center bar* at the top of the screen but middle of the screen */}
//         <div
//           className="absolute md:top-10 left-1/2 transform -translate-x-1/2 md:w-[90%] w-full mx-auto text-center text-2xl font-bold"
//         >
//           <div className="flex md:flex-row flex-col justify-between items-center md:gap-4 md:p-2">

//             <div className="flex md:hidden flex-col justify-center items-center mt-1 mb-2">
//               <h1 className="text-tertiary text-[1rem] font-extrabold">Eurasia Cinema7</h1>
//               <h1 className="text-tertiary text-xs font-semibold">Select Seats</h1>
//             </div>


//             <div className="flex flex-row justify-center items-center gap-24 bg-tertiary p-4 px-4 w-full md:w-[30%]"
//             >
//               <div className="flex flex-row justify-center items-center gap-2">
//                 <CalendarSearch className="w-4 h-4 text-primary" />
//                 <h1 className="text-white text-sm">April,15</h1>
//               </div>

//               <div className="flex flex-row justify-center items-center gap-2">
//                 <Clock className="w-4 h-4 text-primary" />
//                 <h1 className="text-white text-sm">10:00 AM</h1>
//               </div>
//             </div>

//             <div className="hidden md:flex flex-col justify-center items-center w-[40%]">
//               <h1 className="text-tertiary text-lg font-bold">Eurasia Cinema7</h1>
//               <h1 className="text-tertiary text-sm font-light">Select Seats</h1>
//             </div>

//             <div className="flex flex-row justify-center items-center gap-8 md:gap-2 border-b-2 md:border border-gray-100 rounded-md p-2 w-full md:w-[30%]">
//               <div className="flex flex-row justify-center items-center gap-2">
//                 <Circle className="w-4 h-4 text-[rgba(239, 64, 74, 0.2)]" color="rgba(239, 64, 74, 0.2)" fill="rgba(239, 64, 74, 0.2)" />
//                 <h1 className="text-tertiary text-sm font-light">Available</h1>
//               </div>
//               <div className="flex flex-row justify-center items-center gap-2">
//                 <Circle className="w-4 h-4 text-black" color="black" fill="black" />
//                 <h1 className="text-black text-sm font-light">Occupied</h1>
//               </div>
//               <div className="flex flex-row justify-center items-center gap-2">
//                 <Circle className="w-4 h-4 text-[rgba(239, 64, 74, 1)]" color="rgba(239, 64, 74, 1)" fill="rgba(239, 64, 74, 1)" />
//                 <h1 className="text-primary text-sm font-light">Selected</h1>
//               </div>


//             </div>

//           </div>

//         </div>

//         <div style={{
//           transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
//           transformOrigin: '0 0',
//           width: '100%',
//           height: '100%',
//           position: 'relative'
//         }}>
//           {/* Add grid background */}

//           {grids.map((grid) => (
//             <D3Grid
//               key={grid.id}
//               id={grid.id}
//               initialSize={grid.size}
//               onSelect={handleGridSelect}
//               isSelected={selectedGrid === grid.id}
//               position={grid.position}
//               category={grid.category}
//               seatStartIndex={grid.seatStartIndex}
//               onGridSizeChange={handleGridSizeChange}
//               onDelete={handleDeleteGrid}
//               isVenueMode={isVenueMode}
//               onSeatSelect={handleSeatSelect}
//               rotation={grid.rotation} // Use grid's rotation
//               setGrids={setGrids}
//               skew={grid.skew}
//               hideLabels={grid.hideLabels}
//             />
//           ))}
//           {shapes.map((shape) => (
//             <D3Shape
//               key={shape.id}
//               id={shape.id}
//               position={shape.position}
//               onSelect={handleShapeSelect}
//               isSelected={selectedShapeId === shape.id}
//               isVenueMode={isVenueMode}
//               size={shape.size}
//               isResizing={isResizing}
//               setIsResizing={setIsResizing}
//               rotation={shape.rotation} // Use shape's rotation
//               color={shape.color}
//               onDelete={handleDeleteShape}
//               setShapes={setShapes}
//               skew={shape.skew}
//             />
//           ))}

//           {texts.map((text) => (
//             <D3Texts
//               key={text.id}
//               id={text.id}
//               position={text.position}
//               onSelect={handleTextSelect}
//               isSelected={selectedText === text.id}
//               isVenueMode={isVenueMode}
//               size={text.fontSize} // Pass size if needed
//               rotation={text.rotation} // Use text's rotation
//               color={text.color}
//               onDelete={handleDeleteText}
//               textContent={text.text}
//               setTextContent={(textContent) => setTexts(prevTexts => prevTexts.map(t => t.id === text.id ? { ...t, text: textContent } : t))} // Fixed missing closing parenthesis and brace
//               setTexts={setTexts}
//             />
//           ))}
//         </div>

//         <div style={{
//         position: 'fixed',
//         bottom: '0',
//         right: '0',
//         zIndex: 1,
//         display: 'flex',
//         flexDirection: 'row',
//         gap: '10px',
//         padding: '10px',
//         borderRadius: '8px',
//       }}
//         id="sidebar"
//       >
//         <button
//           onClick={() => handleZoom('in')}
//           className="transition-transform transform hover:scale-110"
//         >
//           <PlusIcon className="w-8 h-8 text-gray-700" />
//         </button>
//         <button
//           onClick={() => handleZoom('out')}
//           className="transition-transform transform hover:scale-110"
//         >
//           <Minus className="w-8 h-8 text-gray-700" />
//         </button>
//       </div>

//       </div>

//     </div>
//   );
// };

// export default GridContainer;
