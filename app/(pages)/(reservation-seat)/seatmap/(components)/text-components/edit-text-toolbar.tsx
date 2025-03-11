import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import { TextElement } from '../../types'

interface TextToolBarProps {
    editingText: TextElement
    texts: TextElement[]
    setTexts: (texts: any[]) => void
    setEditingText: (text: TextElement | null) => void
}

const TextToolBar = ({
    editingText,
    texts,
    setTexts,
    setEditingText }:
    TextToolBarProps
) => {

    const [textStyle, setTextStyle] = useState<{
        content: string,
        fontSize: string,
        fontWeight: string,
    }>({
        content: '',
        fontSize: '16px',
        fontWeight: 'normal',
    })

    useEffect(() => {
        if (editingText) {
            const text = texts.find(t => t.id === editingText.id)
            if (text) {
                setTextStyle({
                    content: text.content || '',
                    fontSize: text.fontSize || '16px',
                    fontWeight: text.fontWeight || 'normal',
                })
            }
        }
    }, [editingText])

    const handleDeleteText = () => {
        if (editingText) {
            setTexts(texts.filter(t => t.id !== editingText.id))
        }
        setEditingText(null)
    }
    const handleTextEditSubmit = () => {
        if (editingText && textStyle.content.trim()) {
            const updatedTexts = texts.map(t =>
                t.id === editingText.id
                    ? {
                        ...t,
                        content: textStyle.content,
                        fontSize: textStyle.fontSize,
                        fontWeight: textStyle.fontWeight,
                    }
                    : t
            )
            setTexts(updatedTexts)
            setTextStyle({
                content: '',
                fontSize: '16px',
                fontWeight: 'normal',
            })
            setEditingText(null)
        }
    }

    return (
        <div className="fixed top-1/2 left-2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-2xl polygon-bottom-bar border border-gray-300 z-10">
            <div className='flex flex-col justify-between items-center gap-4'>
                <div className='flex flex-col justify-start items-start gap-2 w-full'>
                    <div className='text-black'>Edit Content</div>
                    <Input
                        value={textStyle.content}
                        onChange={(e) => setTextStyle(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Enter text content"
                    />
                </div>

                <div className='flex flex-col justify-start items-start gap-2 w-full'>
                    <div className='text-black'>Edit Font Size</div>
                    <Select
                        value={textStyle.fontSize}
                        onValueChange={(value) => setTextStyle(prev => ({ ...prev, fontSize: value }))}
                    >
                        <SelectTrigger className="border rounded p-2">
                            <SelectValue placeholder="Select font size" />
                            <SelectContent>
                                <SelectItem value="12px">Small</SelectItem>
                                <SelectItem value="16px">Medium</SelectItem>
                                <SelectItem value="20px">Large</SelectItem>
                                <SelectItem value="24px">Extra Large</SelectItem>
                            </SelectContent>
                        </SelectTrigger>
                    </Select>
                </div>

                <div className='flex flex-col justify-start items-start gap-2 w-full'>
                    <div className='text-black'>Edit Font Weight</div>
                    <Select
                        value={textStyle.fontWeight}
                        onValueChange={(value) => setTextStyle(prev => ({ ...prev, fontWeight: value }))}
                    >
                        <SelectTrigger className="border rounded p-2">
                            <SelectValue placeholder="Select font weight" />
                            <SelectContent>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="bold">Bold</SelectItem>
                            </SelectContent>
                        </SelectTrigger>
                    </Select>
                </div>


                <div className='flex justify-between items-center gap-2 w-full'>
                    <Button
                        className="bg-primary text-white rounded-full cursor-pointer hover:scale-105 px-8 font-bold transition-all duration-300 w-full"
                        onClick={handleTextEditSubmit}
                    >
                        Save
                </Button>
                <button
                    onClick={handleDeleteText}
                    className='border rounded-full p-2 px-4 flex items-center gap-2 text-red-500 font-bold hover:bg-red-500 hover:scale-105 hover:text-white transition-all duration-300 cursor-pointer'
                >
                    <Trash className="w-5 h-5 md:w-6 md:h-6" />
                </button>
                </div>
            </div>
        </div>
    )
}

export default TextToolBar