import { BrowserMultiFormatReader, type Result } from "@zxing/library"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Camera, Loader2 } from "lucide-react"
import { ScannerProps } from "@/app/_types/qr-types"

const QRScanner: React.FC<ScannerProps> = ({ onScanSuccess, isLoading, isScanning, setIsScanning }) => {
    const startScanning = async () => {
        const codeReader = new BrowserMultiFormatReader()
        try {
            setIsScanning(true)
            const videoInputDevices = await codeReader.listVideoInputDevices()
            const selectedDeviceId = videoInputDevices.find(
                (device) => device.label.toLowerCase().includes("back") || 
                           device.label.toLowerCase().includes("environment")
            )?.deviceId || videoInputDevices[0].deviceId

            await codeReader.decodeFromVideoDevice(
                selectedDeviceId, 
                "video", 
                (result: Result | null) => {
                    if (result) {
                        onScanSuccess(result.getText())
                        codeReader.reset()
                        setIsScanning(false)
                    }
                }
            )
        } catch (error) {
            console.error("Error starting scanner:", error)
            setIsScanning(false)
            codeReader.reset()
        }
    }

    return (
        <div className="w-full h-[300px] bg-gray-50 dark:bg-tertiary dark:border-borderDark rounded-lg relative flex items-center justify-center border-2 border-dashed border-gray-300">
            {isScanning ? (
                <video id="video" className="w-full h-full object-cover rounded-lg" />
            ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                        onClick={startScanning} 
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white rounded-full font-bold hover:scale-105 hover:shadow-none transition-all duration-300 shadow-2xl"
                        disabled={isLoading}
                    >
                        {isLoading ? 
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 
                            <Camera className="mr-2 h-4 w-4" />
                        }
                        Activate Camera
                    </Button>
                </motion.div>
            )}
        </div>
    )
}

export default QRScanner