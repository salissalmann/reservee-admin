

import { useState } from "react";
import { ArrowLeft, Info } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import GuidelinesPopup from "../modals/guidelines-modal";
import SideBarTools from "./side-bar-tools";
import GridControls from "./seat-controls";
import ShapeControls from "./shape-control";
import TextControls from "./text-controls";
import {  ControlPanalProps , Shape, IText, Grid} from "../../../seatmap/types";
import { calculateStartIndex } from "../../../seatmap/(components)/(sub-canvas)/other-bars";
import toast from "react-hot-toast";



const ControlPanal: React.FC<ControlPanalProps> = ({
  grids,
  texts,
  shapes,
  selectedGrid,
  selectedShapeId,
  selectedText,
  isResizing,
  setIsResizing,
  handleZoom,
  setShapes,
  setTexts,
  setGrids,
  handleDeleteGrid,
  handleDeleteShape,
  handleDeleteText,
  onSave,
  onCancel,
  isUserMode,
  polygon,
  pan
}) => {
  const [guidelinesModal, setGuidelinesModal] = useState<boolean>(false);

  const addShape = (shapeType: string) => {
    const newId = shapes.length + 1;
    const newShape = {
      id: newId,
      type: shapeType,
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      size: { width: 100, height: 100 },
      rotation: 0,
      color: '#1D1D1DFF',
      skew: 0
    };
    setShapes([...shapes, newShape]);
  };

  const addText = () => {
    const newId = texts.length + 1;
    const newText: IText = {
      id: newId,
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      content: 'Add Text', 
      fontSize: 16,
      rotation: 0,
      color: 'black',
      fontFamily: 'Arial',
      scale: 1,
    };
    setTexts([...texts, newText]);
  };

  const handleRotationChange = (newRotation: number) => {
    const updatedGrids = grids.map((grid: Grid) =>
      grid.id === selectedGrid ? { ...grid, rotation: newRotation } : grid
    );
    setGrids(updatedGrids);
  };

  const handleSkewXChange = (newSkew: number) => {
    const updatedGrids = grids.map((grid: Grid) =>
      grid.id === selectedGrid ? { ...grid, skew: newSkew } : grid
    );
    setGrids(updatedGrids);
  };

  const handleShapeRotationChange = (newRotation: number) => {
    const updatedShapes = shapes.map((shape: Shape) =>
      shape.id === selectedShapeId ? { ...shape, rotation: newRotation } : shape
    );
    setShapes(updatedShapes);
  };

  const handleShapeSkewXChange = (newSkew: number) => {
    const updatedShapes = shapes.map((shape: Shape) =>
      shape.id === selectedShapeId ? { ...shape, skew: newSkew } : shape
    );
    setShapes(updatedShapes);
  };

  const handleTextRotationChange = (newRotation: number) => {
    const updatedTexts = texts.map((text: IText) =>
      text.id === selectedText ? { ...text, rotation: newRotation } : text
    );
    setTexts(updatedTexts);
  };

  const handleColorSelect = (color: string) => {
    const updatedShapes = shapes.map((shape: Shape) =>
      shape.id === selectedShapeId ? { ...shape, color: color } : shape
    );
    setShapes(updatedShapes);
  };

  const handleTextColourChange = (color: string) => {
    const updatedTexts = texts.map((text: IText) =>
      text.id === selectedText ? { ...text, color: color } : text
    );
    setTexts(updatedTexts);
  };

  const handleTextContentChange = (newContent: string) => {
    const updatedTexts = texts.map((text: IText) =>
      text.id === selectedText ? { ...text, content: newContent } : text
    );
    setTexts(updatedTexts);
  };

  const handleTextSizeChange = (newSize: number) => {
    const updatedTexts = texts.map((text: IText) =>
      text.id === selectedText ? { ...text, fontSize: newSize } : text
    );
    setTexts(updatedTexts);
  };

  const handleAddGrid = (rows: number, cols: number) => {
    const newId = grids.length + 1;
    const startIndex = calculateStartIndex(grids)
    const newGrid: Grid = {
      id: newId,
      size: { rows: rows, cols: cols },
      position: { x: Math.random() * 500, y: Math.random() * 500 },
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
      scale: 1
    };

    setGrids([...grids, newGrid]);
    toast.success("Grid added successfully.");
  }

  return (
    <>
      <SideBarTools
        handleAddGrid={handleAddGrid}
        addShape={addShape}
        addText={addText}
        handleZoom={handleZoom}
      />

      <div className="fixed bottom-[2%] left-1/2 z-10 -translate-x-1/2 w-fit">
        <ScrollArea className="w-[95vw] md:w-auto whitespace-nowrap rounded-lg dark:bg-tertiary bg-white/80 backdrop-blur-md shadow-lg border border-gray-50 dark:border-borderDark px-2">
          <div className="flex flex-row justify-center gap-2.5 p-0.5 px-5">
            {selectedGrid !== null && (
              <GridControls
                grids={grids}
                grid={grids.find((g: Grid) => g.id === selectedGrid) as Grid}
                handleRotationChange={handleRotationChange}
                handleSkewXChange={handleSkewXChange}
                handleDeleteGrid={handleDeleteGrid}
                setGrids={setGrids}
              />
            )}
            {selectedShapeId !== null && (
              <ShapeControls
                shape={shapes.find(s => s.id === selectedShapeId)}
                isResizing={isResizing}
                setIsResizing={setIsResizing}
                handleShapeRotationChange={handleShapeRotationChange}
                handleShapeSkewXChange={handleShapeSkewXChange}
                handleColorSelect={handleColorSelect}
                handleDeleteShape={handleDeleteShape}
              />
            )}           
            {selectedText !== null && (
              <TextControls
                text={texts.find(t => t.id === selectedText)}
                handleTextRotationChange={handleTextRotationChange}
                handleTextColourChange={handleTextColourChange}
                handleTextContentChange={handleTextContentChange}
                handleTextSizeChange={handleTextSizeChange}
                handleDeleteText={handleDeleteText}
              />
            )} 
             {!isUserMode ? (
              <div className="flex flex-row justify-center gap-2">
                                <button
                    className={`border rounded-full p-1 px-8 flex items-center gap-2 border-gray-500 text-gray-500 font-bold hover:scale-105 transition-all duration-300`}
                    onClick={() => onCancel()}
                >
                  Cancel
                </button>

                <button
                    className={`border rounded-full p-1 px-8 flex items-center gap-2 bg-primary text-white font-bold hover:scale-105 transition-all duration-300`}
                    onClick={() => onSave(polygon.id, grids, texts, shapes, pan)}
                >
                    Save
                </button>
              </div>
            ) : (
                <button
                    className={`border rounded-full p-2 px-8 flex items-center gap-2 bg-primary text-white font-bold hover:scale-105 transition-all duration-300`}
                    onClick={onCancel}
                >
                    <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 md:hidden" /> 
                    <span className="hidden md:block">Back to Layout</span>
                </button>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <div className="fixed bottom-[1%] right-[1%] z-10">
        <div
          className="flex flex-row items-center gap-2 cursor-pointer dark:bg-tertiary bg-white/80 backdrop-blur-md shadow-lg rounded-xl p-2 px-4 transition-all duration-300 hover:bg-primary hover:text-white hover:shadow-md border border-gray-50 dark:border-borderDark"
          onClick={() => setGuidelinesModal(true)}
        >
          <Info className="w-5 h-5" />
          <span className="text-sm">Guidelines</span>
        </div>
      </div>

      <GuidelinesPopup
        active={guidelinesModal}
        setModal={setGuidelinesModal}
      />
    </>
  );
};

export default ControlPanal;


