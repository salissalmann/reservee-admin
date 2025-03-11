
import { Minus, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";

const TextControls = ({
    text,
    handleTextRotationChange,
    handleTextColourChange,
    handleTextContentChange,
    handleTextSizeChange,
    handleDeleteText
}: {
    text: any,
    handleTextRotationChange: (rotation: number) => void,
    handleTextColourChange: (color: string) => void,
    handleTextContentChange: (content: string) => void,
    handleTextSizeChange: (size: number) => void,
    handleDeleteText: (textId: number) => void
}) => {
    return (
        <div className="flex flex-row items-center gap-4 md:gap-6 p-1 md:p-2">
            <Menubar className="dark:bg-tertiary bg-[#F6F6F6] rounded-full font-bold dark:text-white text-gray-500 p-2 hover:bg-black hover:text-white transition-all duration-500 cursor-pointer border border-gray-50 dark:border-borderDark"
                id="text-layout"
            >
                <MenubarMenu>
                    <MenubarTrigger className="font-bold text-sm md:text-md">Layout</MenubarTrigger>
                    <MenubarContent className="dark:bg-tertiary bg-[#F6F6F6] border-none p-4">
                        <MenubarItem
                            onSelect={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            className="flex flex-col gap-2"
                            id="text-inner"
                        >
                            <span className="text-xs text-muted-foreground">
                                Rotation
                            </span>
                            <div className="flex flex-row items-center gap-2">
                                <input
                                    type="range"
                                    min="-180"
                                    max="180"
                                    className="w-full h-2 bg-red-500 rounded-lg cursor-pointer custom-range "
                                    value={text?.rotation || 0}
                                    onChange={(e) => handleTextRotationChange(Number(e.target.value))}
                                />
                                <div className="px-4 p-1 text-xs border border-gray-100 rounded-full">
                                    {text?.rotation || 0}°
                                </div>
                                <div className="text-xs text-gray-500 cursor-pointer"
                                    onClick={() => handleTextRotationChange(0)}
                                >
                                    Reset
                                </div>
                            </div>
                        </MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>

            <Menubar className="dark:bg-tertiary bg-[#F6F6F6] rounded-full font-bold dark:text-white text-gray-500 p-2 hover:bg-black hover:text-white transition-all duration-500 cursor-pointer border border-gray-50 dark:border-borderDark"
                id="text-layout"
            >
                <MenubarMenu>
                    <MenubarTrigger className="font-bold text-sm md:text-md">Change Color</MenubarTrigger>
                    <MenubarContent className="dark:bg-tertiary bg-[#F6F6F6] border-none p-4 flex flex-row items-center gap-2 flex-wrap">
                        {['#ed5863', '#58EDA7FF', '#58E8EDFF', '#ffffff', '#000000', '#f5f5f5',
                            '#F7A000FF'
                        ].map(color => (
                            <MenubarItem key={color} onSelect={(e) => { e.preventDefault() }}
                                id="text-inner"
                            >
                                <div
                                    key={color}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleTextColourChange(color)
                                    }}
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        backgroundColor: color,
                                        cursor: 'pointer',
                                        border: '1px solid white',
                                        borderRadius: '50%',
                                    }}
                                />
                            </MenubarItem>
                        ))}
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>


            <Input
                type="text"
                value={text?.content || ''}
                onChange={(e) => handleTextContentChange(e.target.value)}
                className="w-fit h-8 bg-white rounded cursor-pointer border border-gray-300 text-sm md:text-md dark:bg-tertiary dark:text-white"
                id="text-inner"
            />

            <div className="w-fit h-8 dark:bg-tertiary bg-white rounded cursor-pointer">
                <Plus className="w-5 h-5 dark:text-white text-gray-500 hover:text-black transition-all duration-300 cursor-pointer" onClick={() => handleTextSizeChange((text?.fontSize || 10) + 1)}
                    id="text-inner"
                />
                <Minus className="w-5 h-5 dark:text-white text-gray-500 hover:text-black transition-all duration-300 cursor-pointer" onClick={() => handleTextSizeChange((text?.fontSize || 10) - 1)}
                    id="text-inner"
                />
            </div>



            <div className="flex flex-row items-center gap-2">
                <button className="flex gap-2 items-center bg-primary text-white rounded-full px-3 md:px-4 py-2 font-bold hover:bg-gray-200 transition-all duration-300 cursor-pointer text-sm md:text-md"
                    onClick={() => handleDeleteText(text?.id)}
                >
                    <Trash2 className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    Delete Text
                </button>
            </div>
        </div>
    )
}

export default TextControls;