
// import { Grid, Category } from "../../../seatmap/types";
import { Tooltip } from "antd";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { SkewIcon } from "@/app/_components/_layout-components/icons";
import { RotateCcw, RotateCw, Trash2 } from "lucide-react";
import { Grid } from "../../../seatmap/types";

const GridControls = ({
    grids,
    grid,
    // categories,
    handleRotationChange,
    handleSkewXChange,
    // handleChangeCategoryOfGrid,
    handleDeleteGrid,
    setGrids,
}: {
    grid: Grid,
    grids: Grid[],
    // categories: Category[],
    handleRotationChange: (rotation: number) => void,
    handleSkewXChange: (skew: number) => void,
    // handleChangeCategoryOfGrid: (gridId: number, category: Category) => void,
    handleDeleteGrid: (gridId: number) => void,
    setGrids: (grids: Grid[]) => void
}) => {
    return (
        <div className="flex flex-row items-center gap-4 md:gap-6 p-1 md:p-2">
            <Menubar
                className="dark:bg-tertiary bg-[#F6F6F6] border border-gray-50 dark:border-borderDark rounded-full font-bold dark:text-white text-gray-500 p-2 hover:bg-black hover:text-white transition-all duration-500 cursor-pointer"
                id="grid-layout"
            >
                <MenubarMenu>
                    <MenubarTrigger
                        className="font-bold text-sm md:text-md"
                        onClick={(e) => e.preventDefault()}
                    >
                        Layout
                    </MenubarTrigger>
                    <MenubarContent
                        className="dark:bg-tertiary bg-[#F6F6F6] border-none p-4"
                        onCloseAutoFocus={(e) => e.preventDefault()}
                        onPointerDownOutside={(e) => e.preventDefault()}
                        onEscapeKeyDown={(e) => e.preventDefault()}
                    >
                        <MenubarItem
                            onSelect={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            className="focus:bg-transparent p-0"
                        >
                            <div className="w-full">
                                <span className="text-xs text-muted-foreground">
                                    Rotation
                                </span>

                                <div className="flex flex-row items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                    <input
                                        type="range"
                                        min="-180"
                                        max="180"
                                        value={grid?.rotation || 0}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            handleRotationChange(Number(e.target.value));
                                        }}
                                        className="w-full h-2 bg-red-500 rounded-lg cursor-pointer custom-range"
                                    />
                                    <div className="px-4 p-1 text-xs border border-gray-100 rounded-full">
                                        {grid?.rotation || 0}°
                                    </div>
                                    <div
                                        className="text-xs text-gray-500 cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRotationChange(0);
                                        }}
                                    >
                                        Reset
                                    </div>
                                </div>
                                <div className="flex flex-row items-center gap-2 mt-2 justify-center dark:!bg-white rounded-full">
                                    <button
                                        className="p-2 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRotationChange(((grid?.rotation || 0) + 90 + 270) % 270);
                                        }}
                                    >
                                        <RotateCcw className="w-5 h-5 dark:text-tertiary text-tertiary" />
                                    </button>
                                    <button
                                        className="p-2 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRotationChange(((grid?.rotation || 0) - 90 + 270) % 270);
                                        }}
                                    >
                                        <RotateCw className="w-5 h-5 dark:text-tertiary text-tertiary" />
                                    </button>
                                    <button
                                        className="p-1 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSkewXChange(((grid?.skew || 0) + 10) % 30);
                                        }}
                                    >
                                        <SkewIcon className="w-6 h-6 dark:text-tertiary text-tertiary" />
                                    </button>
                                    <button
                                        className="p-1 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 cursor-pointer rotate-90"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSkewXChange(((grid?.skew || 0) - 10) % 30);
                                        }}
                                    >
                                        <SkewIcon className="w-6 h-6 dark:text-tertiary text-tertiary" />
                                    </button>
                                </div>
                            </div>
                        </MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>

          
            <Tooltip title="Hide Labels">
                <button
                    id="grid-layout"
                    className="flex gap-2 items-center dark:bg-tertiary bg-[#F6F6F6] border border-gray-50 dark:border-borderDark dark:text-white text-gray-500 rounded-full px-3 md:px-4 py-2 font-bold hover:bg-black hover:text-white transition-all duration-300 cursor-pointer text-sm md:text-md"
                    onClick={() => {
                        const updatedGrids = grids.map((g: Grid) =>
                            g.id === grid?.id ? { ...g, hideLabels: !g.hideLabels } : g
                        );
                        setGrids(updatedGrids);
                    }}
                >
                    {grid?.hideLabels ? 'Show Labels' : 'Hide Labels'}
                </button>
            </Tooltip>


            <Tooltip title="Delete Grid">
                <button 
                    className="flex gap-2 items-center bg-primary text-white rounded-full px-3 md:px-4 py-2 font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 cursor-pointer text-sm md:text-md"
                    onClick={() => handleDeleteGrid(grid?.id)}
                >
                    <Trash2 className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    Delete Grid
                </button>
            </Tooltip>
        </div>
    )
}

export default GridControls;