import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { QrCode } from "lucide-react"
import { GetCurrencyIcon } from "@/app/_components/_layout-components/currency-icons"

interface NormalQRCodeRowProps {
    ticket: any
    qtyIndex: number
    qrCodeData: any[]
    orderId: number
    currency: string
}

export default function NormalQRCodeRow({
    ticket,
    qtyIndex,
    qrCodeData,
    orderId,
    currency,
}: NormalQRCodeRowProps) {
    const [isExpired, setIsExpired] = useState(false)
    const ticketQRCode = qrCodeData?.find(
        (qr: any) => qr.ticket_id === ticket.ticket_id && qr.ticket_qty_index === qtyIndex + 1
    )

    useEffect(() => {
        if (!ticketQRCode) {
            setIsExpired(false)
            return
        }

        const checkExpiry = () => {
            const createdAt = new Date(ticketQRCode.created_at)
            const expiryDate = new Date(createdAt.getTime() + 5 * 60 * 1000)
            const now = new Date()
            setIsExpired(now > expiryDate)
        }

        checkExpiry()
        const timer = setInterval(checkExpiry, 1000)
        return () => clearInterval(timer)
    }, [ticketQRCode])

    const renderQRCodeAction = () => {
        if (ticketQRCode?.is_scanned) {
            return null
        }

        if (!ticketQRCode) {
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
        <div className="flex flex-col gap-2 p-4 bg-white dark:bg-tertiary rounded-lg shadow-md" key={`${ticket.id}-${qtyIndex + 1}`}>
            <div className="grid grid-cols-5 gap-4 p-4 border-b text-gray-600 dark:border-borderDark dark:text-white">
                <div>{ticket.ticket_id}</div>
                <div>General</div>
                <div>{qtyIndex + 1}</div>
                <div className="flex items-center">
                    {GetCurrencyIcon(currency ?? "EUR")} {ticket.price}
                </div>
                <div className="space-y-2">
                    <QRCodeTimer
                        ticketQRCode={ticketQRCode}
                        onExpire={() => setIsExpired(true)}
                    />
                </div>
            </div>
            {/* <div className="grid grid-cols-5 gap-4 items-center">
                <div className="font-bold text-gray-500 text-sm">Actions</div>
                {renderQRCodeAction()}
            </div> */}

        </div>
    )
}

const QRCodeTimer = ({
    ticketQRCode,
    onExpire
}: {
    ticketQRCode: any,
    onExpire?: () => void
}) => {
    const [timeLeft, setTimeLeft] = useState<{ minutes: number, seconds: number }>(() => {
        if (!ticketQRCode || ticketQRCode.is_scanned) return { minutes: 0, seconds: 0 };

        const createdAt = new Date(ticketQRCode.created_at);
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
        if (!ticketQRCode || ticketQRCode.is_scanned) return;

        const createdAt = new Date(ticketQRCode.created_at);
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
    }, [ticketQRCode, onExpire]);

    if (ticketQRCode?.is_scanned) {
        return <div className="text-sm text-green-600 font-semibold">Scanned</div>;
    }

    if (!ticketQRCode) {
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