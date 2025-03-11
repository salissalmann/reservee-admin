import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { TextElement } from '../../types'

export default function AddTextDialogue({
    isTextDialogOpen,
    setIsTextDialogOpen,
    texts,    
    setTexts,
}: {
    isTextDialogOpen: boolean
    setIsTextDialogOpen: (open: boolean) => void
    texts: TextElement[]
    setTexts: (texts: TextElement[]) => void
}) {

    const [newTextContent, setNewTextContent] = useState('')

    const handleTextSubmit = (index: number, textContent: string) => {
        const screenWidth = window.innerWidth
        const screenHeight = window.innerHeight
        const textWidth = 100
        const textHeight = 100
        const textX = screenWidth / 2 - textWidth / 2
        const textY = screenHeight / 2 - textHeight / 2
        if (newTextContent.trim()) {
            setTexts([...texts, {
                id: index.toString(),
                content: textContent,
                position: [textX, textY],
                fontSize: '16px',
                fontWeight: 'normal',
            }])
            setNewTextContent('')
            setIsTextDialogOpen(false)
        }
    }

    return (
        <Dialog
            open={isTextDialogOpen}
            onOpenChange={setIsTextDialogOpen}
        >
            <DialogContent className="bg-white border-none shadow-2xl">
                <DialogHeader>
                    <DialogTitle>Add Text</DialogTitle>
                    <DialogDescription>
                        Enter the text content you want to add to the canvas.
                    </DialogDescription>
                </DialogHeader>
                <Input
                    value={newTextContent}
                    onChange={(e) => setNewTextContent(e.target.value)}
                    placeholder="Enter text content"
                />
                <DialogFooter>
                    <Button
                        className="bg-primary text-white rounded-full cursor-pointer hover:scale-105 px-8 font-bold transition-all duration-300"
                        onClick={() => handleTextSubmit(texts.length, newTextContent)}
                    >
                        Add
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
