import { BrowserMultiFormatReader } from "@zxing/library"
import { FileUploadProps } from "@/app/_types/qr-types"
import { Upload } from "lucide-react"   

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess, isLoading, setScanError }) => {
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        setScanError(null)
        try {
            const reader = new FileReader()
            reader.onload = async (e) => {
                if (e.target?.result) {
                    const img = new Image()
                    img.src = e.target.result as string
                    await new Promise((resolve) => { img.onload = resolve })

                    const codeReader = new BrowserMultiFormatReader()
                    try {
                        const result = await codeReader.decodeFromImageElement(img)
                        if (result) {
                            onUploadSuccess(result.getText())
                        }
                    } catch (error) {
                        console.error('Error reading QR code:', error)
                        setScanError('Unable to scan the QR code. Please try again.')
                    } finally {
                        codeReader.reset()
                    }
                }
            }
            reader.readAsDataURL(file)
        } catch (error) {
            console.error('Error processing file:', error)
            setScanError('An error occurred while processing the file.')
        }
        // Reset the file input value after processing
        event.target.value = ''
    }

    return (
        <div className="border-2 bg-gray-50 dark:bg-tertiary dark:border-borderDark border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input 
                type="file" 
                accept="image/*" 
                disabled={isLoading}
                onChange={handleFileUpload} 
                className="hidden" 
                id="qr-upload" 
            />
            <label htmlFor="qr-upload" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-2">Upload QR Code</p>
                <p className="text-xs text-gray-500">Click to browse files</p>
            </label>
        </div>
    )
}

export default FileUpload