"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Notification } from "@/app/_types/notifications"
import { cn } from "@/lib/utils"
import { AlertCircle, Info, CheckCircle, AlertTriangle, Hourglass } from "lucide-react"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"

interface NotificationCardProps {
    notification: Notification
    onMarkAsRead: (id: number) => void
}

export function NotificationCard({ notification, onMarkAsRead }: NotificationCardProps) {
    const router = useRouter()

    const timeAgo = notification.created_at 
        ? formatDistanceToNow(new Date(notification.created_at), { addSuffix: true }) 
        : "Recently"

    const getIconForType = () => {
        switch (notification.icon_type) {
            case "WARNING": 
                return <AlertTriangle className="h-6 w-6 text-yellow-500" />
            case "INFO": 
                return <Info className="h-6 w-6 text-blue-500" />
            case "SUCCESS": 
                return <CheckCircle className="h-6 w-6 text-green-500" />
            case "ERROR": 
                return <AlertCircle className="h-6 w-6 text-red-500" />
            default: 
                return <Info className="h-6 w-6 text-gray-500" />
        }
    }

    return (
        <Card 
            className={cn(
                "p-4 transition-colors bg-[#F6F6F6] flex flex-col md:flex-row  md:items-center justify-between"
            )}
            style={{
                border: `1px solid ${notification.color_scheme || '#000000'}`
            }}
        >
            <div className="flex items-start gap-4">
                <div className="mt-1">
                    {getIconForType()}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-black">
                            {notification.title || 'Untitled Notification'}
                        </h3>
                        {!notification.is_read && (
                            <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                                New
                            </span>
                        )}
                    </div>
                    <p className="mt-1 text-md text-gray-700">
                        {notification.description || 'No description available'}
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Hourglass className="h-4 w-4 mr-1" />
                            {timeAgo}
                        </div>
                    </div>
                </div>
            </div>
            <div className={cn("grid grid-cols-2 gap-2 mt-4 md:mt-0", notification.buttons?.length === 1 ? "md:grid-cols-1" : "")}>
                {notification.buttons?.map((button, index) => (
                    <Button
                        key={index}
                        className="w-full flex items-center justify-center font-bold rounded-full text-white hover:scale-105 transition-all duration-300 cursor-pointer"
                        onClick={() => {
                            onMarkAsRead(notification.id)
                            
                            if (!button?.url) {
                                console.warn('No URL provided for button');
                                return;
                            }

                            try {
                                if (button.url.startsWith('http')){
                                    window.open(button.url, '_blank')
                                } else {
                                    router.push(button.url)
                                }
                            } catch (error) {
                                console.error('Navigation error:', error);
                            }
                        }}
                        style={{
                            backgroundColor: button?.color || "#000000",
                            color: button?.color 
                                ? (button.color === "#000000" ? "#ffffff" : "#333333")
                                : "#ffffff"
                        }}
                    >
                        {button?.text || 'Action'}
                    </Button>
                ))}
            </div>
        </Card>
    )
}

