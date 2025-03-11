
export type Point = [number, number]

export type IconElement = {
    id: string
    type: 'stairs' | 'gate'
    position: Point
    scale: number
    color: string
}

export type TextElement = {
    id: string
    content: string
    position: Point
    fontSize?: string
    fontWeight?: string
}


export type Polygon = {
    id: string
    points: Point[]
    name?: string
    price: number
    isLayout?: boolean
    grids?: Grid[]
    color?: string
    text?: IText[]
    shapes?: Shape[]
    pan?: Position
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


export interface SeatSelections {
    polygonId: string,
    areaName: string,
    seatNumber: number,
    price: number
}

export interface D3GridProps {
    polygonId: string;
    id: number;
    initialSize: { rows: number, cols: number };
    onSelect: (id: number) => void;
    isSelected: boolean;
    position: { x: number, y: number };
    seatStartIndex: number;
    isVenueMode: boolean;
    onSeatSelect: (gridId: number, seatnumber: number) => void;
    rotation: number;
    setGrids: React.Dispatch<React.SetStateAction<Grid[]>>;
    skew: number;
    hideLabels: boolean;
    handleGridSizeChange: (id: number, newSize: { rows: number, cols: number }) => void;
    seatSelections: SeatSelections[]
}

export interface Position {
    x: number;
    y: number;
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

export interface ControlPanalProps {
    isVenueMode: boolean;
    grids: Grid[];
    texts: IText[];
    shapes: Shape[];
    selectedGrid: number | null;
    selectedShapeId: number | null;
    selectedText: number | null;
    isResizing: boolean;
    setIsResizing: (isResizing: boolean) => void;
    handleZoom: (direction: 'in' | 'out') => void;
    setShapes: (shapes: Shape[]) => void;
    setTexts: (texts: IText[]) => void;  
    setGrids: (grids: Grid[]) => void;
    handleDeleteGrid: (gridId: number) => void;
    handleDeleteShape: (shapeId: number) => void;
    handleDeleteText: (textId: number) => void;
    onSave: (polygonId: string, grids: Grid[], texts: IText[], shapes: Shape[], pan: Position) => void;
    onCancel: () => void;
    isUserMode: boolean;
    polygon: Polygon;
    pan: Position
  }
