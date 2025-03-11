// Type Definitions
export interface GridSize {
    rows: number;
    cols: number;
}
  
export interface Position {
    x: number;
    y: number;
}
  
export interface Category {
    name: string;
    acronym: string;
    color: string;
    seatCount: number;
    price: number;
}
  
export interface Grid {
    id: number
    size: { rows: number, cols: number }
    position: { x: number, y: number }
    category?: {
      name: string
      acronym: string
      color: string
      seatCount: number
      price: number
    }
    seatStartIndex?: number
    rotation: number
    skew: number
    hideLabels: boolean
    scale: number
}
  
export interface D3GridProps {
    id: number;
    initialSize: GridSize;
    onSelect: (id: number) => void;
    isSelected: boolean;
    position: Position;
    category: Category;
    seatStartIndex: number;
    onGridSizeChange: (id: number, newSize: GridSize) => void;
    onDelete: (id: number) => void;
    isVenueMode: boolean;
    onSeatSelect: (gridId: number, seats: number[]) => void;
    rotation: number;
    //setGrids: (grids: Grid[]) => void;
    setGrids: React.Dispatch<React.SetStateAction<Grid[]>>;
    skew: number;
    hideLabels: boolean;
}
  
export interface Shape {
    id: number;
    type: string;
    position: Position;
    size: { width: number; height: number };
    rotation: number;
    color: string;
    skew: number;
}
  
export interface Text {
    id: number;
    position: Position;
    text: string;
    fontSize: number;
    rotation: number;
    color: string;
}

export interface ControlPanalProps {
    isVenueMode: boolean;
    categories: Category[];
    selectedSeats: { [key: number]: number[] };
    grids: Grid[];
    texts: Text[];
    shapes: Shape[];
    selectedGrid: number | null;
    selectedShapeId: number | null;
    selectedText: number | null;
    isResizing: boolean;
    setIsResizing: (isResizing: boolean) => void;
    handleZoom: (direction: 'in' | 'out') => void;
    setShapes: (shapes: Shape[]) => void;
    setTexts: (texts: Text[]) => void;  
    setCategories: (categories: Category[]) => void;
    setGrids: (grids: Grid[]) => void;
    exportConfig: () => void;
    handleChangeCategoryOfGrid: (gridId: number, newCategory: Category) => void;
    handleDeleteGrid: (gridId: number) => void;
    handleDeleteShape: (shapeId: number) => void;
    handleDeleteText: (textId: number) => void;
    handleAddGrid: (categoryName: string, rows: number, cols: number) => void;
  }


  export interface IText {
    id: number
    content: string
    position: { x: number, y: number }
    rotation: number
    fontSize: number
    fontFamily: string
    color: string,
    scale?: number
  }
  