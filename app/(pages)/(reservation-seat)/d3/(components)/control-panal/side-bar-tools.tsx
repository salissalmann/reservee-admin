
import { useState } from "react";
import { Baseline, LayoutPanelLeft, Minus, PlusIcon, ShapesIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tooltip } from "antd";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";

const SidebarTools = ({
    handleAddGrid,
    addShape,
    addText,
    handleZoom
}: {
    handleAddGrid: (rows: number, cols: number) => void,
    addShape: (type: string) => void,
    addText: () => void,
    handleZoom: (direction: 'in' | 'out') => void
}) => {
    const [gridRows, setGridRows] = useState<number>(5)
    const [gridCols, setGridCols] = useState<number>(5)

    return (
        // <div className="fixed left-[1%] top-0 z-[10] flex flex-row md:flex-col justify-between gap-4 px-4 md:p-4 md:px-4 dark:bg-tertiary bg-white backdrop-blur-md md:h-[95vh] w-fit md:w-[3%] rounded-xl shadow-lg mt-2 mb-2
        //    border border-gray-50 dark:border-borderDark
        // ">
        <div className="fixed flex md:flex-col flex-wrap justify-center md:justify-between items-center gap-4 top-0 md:!left-auto md:translate-x-0 md:top-1/2 md:-translate-y-1/2 bg-white/80 backdrop-blur-md md:right-2 p-2 rounded-lg border border-gray-300 md:shadow-2xl draw-elements-bar md:h-[50vh] w-fit">
            <div className="flex flex-row md:flex-col gap-4 justify-start items-center">
                <div className='hidden md:block text-3xl md:text-4xl text-primary font-extrabold'>&gt;</div>
                <Tooltip title="Add Seats">
                    <Menubar className="border-none w-fit shadow-none p-0" id="sidebar1">
                        <MenubarMenu>
                            <MenubarTrigger className="p-0 shadow-none dark:bg-tertiary bg-white">
                                <button
                                    //onClick={addGrid}
                                    className="px-4 py-2 text-primary rounded-lg cursor-pointer hover:scale-105 transition-all duration-300 border border-gray-100 shadow-2xl w-fit md:w-full flex gap-2"
                                >
                                    <LayoutPanelLeft className="w-5 h-5 md:w-6 md:h-6" />
                                    <span className="hidden md:block">Add Seats</span>
                                    </button>
                            </MenubarTrigger>
                            <MenubarContent className="z-20 dark:bg-tertiary bg-white hover:bg-white hover:dark:bg-tertiary">
                                <MenubarItem className="flex flex-col gap-2
                                    dark:bg-tertiary bg-white hover:bg-white hover:dark:bg-tertiary
                                " onSelect={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}>
                                    <Input type="number" value={gridRows} onChange={(e) => setGridRows(Number(e.target.value))} className="dark:bg-tertiary bg-white hover:bg-white hover:dark:bg-tertiary border border-gray-50 dark:border-borderDark" />
                                    <Input type="number" value={gridCols} onChange={(e) => setGridCols(Number(e.target.value))} className="dark:bg-tertiary bg-white hover:bg-white hover:dark:bg-tertiary border border-gray-50 dark:border-borderDark" />

                                    <button
                                        //disabled={gridCategory === '' || gridRows === 0 || gridCols === 0}
                                        onClick={() => handleAddGrid(gridRows, gridCols)}
                                        className="w-full gap-2 items-center bg-primary text-white font-bold rounded-full hover:bg-white hover:text-primary hover:border-primary hover:border transition-all duration-300 p-2 text-center"
                                    >
                                        Add Seats
                                    </button>
                                </MenubarItem>
                            </MenubarContent>


                        </MenubarMenu>
                    </Menubar>
                </Tooltip>
                <Tooltip title="Add Blocks">
                    <button
                        onClick={() => addShape('square')}
                        className="px-4 py-2 text-primary rounded-lg cursor-pointer hover:scale-105 transition-all duration-300 border border-gray-100 shadow-2xl w-fit md:w-full flex gap-2"
                        >
                        <ShapesIcon className="w-5 h-5 md:w-6 md:h-6" />
                        <span className="hidden md:block">Add Shape</span>
                    </button>
                </Tooltip>
                <Tooltip title="Add Text">
                    <button 
                        onClick={addText} 
                        className="px-4 py-2 text-primary rounded-lg cursor-pointer hover:scale-105 transition-all duration-300 border border-gray-100 shadow-2xl w-fit md:w-full flex gap-2">
                        <Baseline className="w-5 h-5 md:w-6 md:h-6" />
                        <span className="hidden md:block">Add Text</span>
                    </button>
                </Tooltip>

             
            </div>
            <div className="flex flex-row gap-2 justify-end items-center dark:bg-tertiary bg-white rounded-xl border border-gray-100 md:border-none m-2">
                <button
                    onClick={() => handleZoom('in')}
                    className="transition-transform transform hover:scale-110 p-2 rounded-full hover:bg-rose-200  "
                >
                    <PlusIcon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </button>
                <button
                    onClick={() => handleZoom('out')}
                    className="transition-transform transform hover:scale-110 p-2 rounded-full hover:bg-rose-200"
                >
                    <Minus className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </button>
            </div>


        </div>
    )
}

export default SidebarTools;