import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { QrCode } from "lucide-react"
import { GetCurrencyIcon } from "@/app/_components/_layout-components/currency-icons"

interface SeatQRCodeRowProps {
    seat: any
    qrCodeData: any[]
    orderId: number
    currency: string
}

export default function SeatQRCodeRow({
    seat,
    qrCodeData,
    orderId,
    currency,
}: SeatQRCodeRowProps) {
    const [isExpired, setIsExpired] = useState(false)
    const seatQRCode = qrCodeData?.find(
        (qr: any) => qr.seat_number === seat.seat_number && qr.area_id === seat.area_id
    )

    useEffect(() => {
        if (!seatQRCode) {
            setIsExpired(false)
            return
        }

        const checkExpiry = () => {
            const createdAt = new Date(seatQRCode.created_at)
            const expiryDate = new Date(createdAt.getTime() + 5 * 60 * 1000)
            const now = new Date()
            setIsExpired(now > expiryDate)
        }

        checkExpiry()
        const timer = setInterval(checkExpiry, 1000)
        return () => clearInterval(timer)
    }, [seatQRCode])

    const renderQRCodeAction = () => {
        if (seatQRCode?.is_scanned) {
            return null
        }

        if (!seatQRCode) {
            return (
                <Button
                    variant="outline"
                    className="w-fit bg-primary text-white rounded-full flex items-center gap-2 px-4 py-2 font-bold hover:bg-primary hover:text-white transition-all duration-300"
                >
                    <QrCode className="w-5 h-5 mr-2" />
                    Never Generated
                </Button>
            )
        }

        if (isExpired) {
            return (
                <Button
                    variant="outline"
                    className="w-fit bg-red-500 text-white rounded-full flex items-center gap-2 px-4 py-2 font-bold hover:bg-red-600 transition-all duration-300"
                >
                    <QrCode className="w-5 h-5 mr-2" />
                    Never Regenerated
                </Button>
            )
        }

        return null
    }

    return (
        <div className="flex flex-col gap-2 p-4 bg-white dark:bg-tertiary rounded-lg border border-zinc-200 dark:border-borderDark shadow-md">
            <div className="grid grid-cols-5 gap-4 text-gray-600 dark:text-white">
                <div className="text-gray-600 dark:text-white">{seat.id}</div>
                <div className="text-gray-500 dark:text-white">{seat.area_name}</div>
                <div className="text-gray-600 dark:text-white">{seat.seat_number}</div>
                <div className="text-gray-500 dark:text-white flex items-center">
                    {GetCurrencyIcon(currency)}{seat.price}
                </div>
                <div className="space-y-2">
                    <QRCodeTimer
                        seatQRCode={seatQRCode}
                        onExpire={() => setIsExpired(true)}
                    />
                </div>
            </div>
        </div>
    )
} 

const QRCodeTimer = ({
    seatQRCode,
    onExpire
}: {
    seatQRCode: any,
    onExpire?: () => void
}) => {
    const [timeLeft, setTimeLeft] = useState<{ minutes: number, seconds: number }>(() => {
        if (!seatQRCode || seatQRCode.is_scanned) return { minutes: 0, seconds: 0 };

        const createdAt = new Date(seatQRCode.created_at);
        const expiryDate = new Date(createdAt.getTime() + 5 * 60 * 1000);
        const now = new Date();

        if (now > expiryDate) return { minutes: 0, seconds: 0 };

        const remainingTime = expiryDate.getTime() - now.getTime();
        return {
            minutes: Math.floor(remainingTime / (1000 * 60)),
            seconds: Math.floor((remainingTime % (1000 * 60)) / 1000)
        };
    });

    useEffect(() => {
        if (!seatQRCode || seatQRCode.is_scanned) return;

        const createdAt = new Date(seatQRCode.created_at);
        const expiryDate = new Date(createdAt.getTime() + 5 * 60 * 1000);

        const timer = setInterval(() => {
            const now = new Date();
            const remainingTime = expiryDate.getTime() - now.getTime();

            if (remainingTime <= 0) {
                clearInterval(timer);
                setTimeLeft({ minutes: 0, seconds: 0 });
                onExpire?.();
                return;
            }

            setTimeLeft({
                minutes: Math.floor(remainingTime / (1000 * 60)),
                seconds: Math.floor((remainingTime % (1000 * 60)) / 1000)
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [seatQRCode, onExpire]);

    if (seatQRCode?.is_scanned) {
        return <div className="text-sm text-green-600 font-semibold">Scanned</div>;
    }

    if (!seatQRCode) {
        return <div className="text-sm text-yellow-600">Not Generated</div>;
    }

    if (timeLeft.minutes === 0 && timeLeft.seconds === 0) {
        return <div className="text-sm text-red-600">Expired</div>;
    }

    return (
        <div className="text-sm text-blue-600">
            {timeLeft.minutes}m {timeLeft.seconds}s left
        </div>
    );
};