import { RotateCcw, RotateCw, Trash2, Scaling } from "lucide-react";
import { Tooltip } from "antd";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { SkewIcon } from "@/app/_components/_layout-components/icons";

const ShapeControls = ({
    shape,
    isResizing,
    setIsResizing,
    handleShapeRotationChange,
    handleShapeSkewXChange,
    handleColorSelect,
    handleDeleteShape
}: {
    shape: any,
    isResizing: boolean,
    setIsResizing: (resizing: boolean) => void,
    handleShapeRotationChange: (rotation: number) => void,
    handleShapeSkewXChange: (skew: number) => void,
    handleColorSelect: (color: string) => void,
    handleDeleteShape: (shapeId: number) => void
}) => {
    return (
        <div className="flex flex-row items-center gap-4 md:gap-6 p-1 md:p-2" id="control-panel">
            <Menubar className="dark:bg-tertiary bg-[#F6F6F6] rounded-full font-bold dark:text-white border border-gray-50 dark:border-borderDark text-gray-500 p-2 hover:bg-black hover:text-white transition-all duration-500 cursor-pointer">
                <MenubarMenu>
                    <MenubarTrigger className="font-bold text-sm md:text-md"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    >Layout</MenubarTrigger>
                    <MenubarContent className="dark:bg-tertiary bg-[#F6F6F6] border-none p-4">
                        <MenubarItem
                            onSelect={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            className="flex flex-col gap-2"
                            id="shape-layout"
                        >
                            <span className="text-xs text-muted-foreground">
                                Rotation
                            </span>
                            <div className="flex flex-row items-center gap-2">
                                <input
                                    type="range"
                                    min="-180"
                                    max="180"
                                    value={shape?.rotation || 0}
                                    onChange={(e) => handleShapeRotationChange(Number(e.target.value))}
                                    className="w-full h-2 bg-red-500 rounded-lg cursor-pointer custom-range "
                                />
                                <div className="px-4 p-1 text-xs border border-gray-100 rounded-full">
                                    {shape?.rotation || 0}°
                                </div>
                                <div className="text-xs text-gray-500 cursor-pointer"
                                    onClick={() => handleShapeRotationChange(0)}
                                >
                                    Reset
                                </div>
                            </div>
                            <div className="flex flex-row items-center gap-2 mt-2 justify-center dark:!bg-white rounded-full text-black">
                                <button className="p-2 rounded-full hover:bg-white transition-all duration-300 cursor-pointer"
                                    onClick={() => handleShapeRotationChange(((shape?.rotation || 0) + 90 + 270) % 270)}
                                >
                                    <RotateCcw className="w-5 h-5" />
                                </button>
                                <button className="p-2 rounded-full hover:bg-white transition-all duration-300 cursor-pointer"
                                    onClick={() => handleShapeRotationChange(((shape?.rotation || 0) - 90 + 270) % 270)}
                                >
                                    <RotateCw className="w-5 h-5"/>
                                </button>
                                <button className="p-1 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 cursor-pointer"
                                    onClick={() => handleShapeSkewXChange(((shape?.skew || 0) + 10) % 30)}
                                >
                                    <SkewIcon className="w-6 h-6"/>
                                </button>
                                <button className="p-1 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 cursor-pointer rotate-90
                                dark:text-white text-gray-500
                                "
                                    onClick={() => handleShapeSkewXChange(((shape?.skew || 0) - 10) % 30)}
                                >
                                    <SkewIcon className="w-6 h-6" />
                                </button>
                            </div>
                        </MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>

            <Menubar className="dark:bg-tertiary bg-[#F6F6F6] rounded-full font-bold dark:text-white text-gray-500 p-2 hover:bg-black hover:text-white transition-all duration-500 cursor-pointer border border-gray-50 dark:border-borderDark" id="color-menu">
                <MenubarMenu>
                    <MenubarTrigger className="font-bold text-sm md:text-md"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    >Change Color</MenubarTrigger>
                    <MenubarContent className="dark:bg-tertiary bg-[#F6F6F6] border-none p-4 flex flex-row items-center gap-2 flex-wrap"
                        id="shape-layout"
                    >
                        {['#ed5863', '#58EDA7FF', '#58E8EDFF', '#ffffff', '#000000', '#f5f5f5',
                            '#F7A000FF'
                        ].map(color => (
                            <MenubarItem key={color} onSelect={(e) => { e.preventDefault() }}
                            >
                                <div
                                    onClick={() => handleColorSelect(color)}
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        backgroundColor: color,
                                        cursor: 'pointer',
                                        border: '1px solid #374151',
                                        borderRadius: '50%',
                                    }}
                                />
                            </MenubarItem>
                        ))}
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>


            <button className="flex gap-2 items-center dark:bg-tertiary bg-[#F6F6F6] dark:text-white text-gray-500 rounded-full px-3 md:px-4 py-2 font-bold hover:bg-black hover:text-white transition-all duration-300 cursor-pointer text-sm md:text-md
                border border-gray-50 dark:border-borderDark
            "
                onClick={() => setIsResizing(!isResizing)}
            >
                <Scaling className="w-4 h-4 md:w-5 md:h-5" />
                <div className="block">{isResizing ? 'Exit Resize Mode' : 'Enter Resize Mode'}</div>
            </button>

            <Tooltip title="Delete Shape">
                <button className="flex gap-2 items-center bg-primary text-white rounded-full px-3 md:px-4 py-2 font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 cursor-pointer text-sm md:text-md"
                    onClick={() => handleDeleteShape(shape?.id)}
                >
                    <Trash2 className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    Delete Shape
                </button>
            </Tooltip>
        </div>
    )
}

export default ShapeControls;