'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { NotificationCard } from "@/app/_components/_features/_notifications/notification-card"
import { Search, ChevronDown, Loader2 } from 'lucide-react'
import type { Notification } from "@/app/_types/notifications"
import * as NotificationsService from "@/app/_apis/notifications.services"
  
import toast from "react-hot-toast"

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [filter, setFilter] = useState("all")
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadNotifications()
    }, [])

    async function loadNotifications() {
        try {
            setIsLoading(true)
            const response = await NotificationsService.getNotifications("vendor")
            if (response.status) {
                const sortedNotifications = response.data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                setNotifications(sortedNotifications)
            }
        } catch (error) {
            toast.error("Failed to load notifications")
        } finally {
            setIsLoading(false)
        }
    }

    async function handleMarkAsRead(id: number) {
        try {
            const response = await NotificationsService.markNotificationAsRead(id)
            if (response.statusCode) {
                toast.success("Notification marked as read")
                loadNotifications()
            } else {
                toast.error("Failed to mark notification as read")
            }
        } catch (error) {
            toast.error("Failed to mark notification as read")
        }
    }

    async function handleMarkAllAsRead() {
        try {
            const response = await NotificationsService.markAllNotificationsAsRead()
            if (response.statusCode) {
                toast.success("All notifications marked as read")
                loadNotifications()
            } else {
                toast.error("Failed to mark all notifications as read")
            }
        } catch (error) {
            toast.error("Failed to mark all notifications as read")
        }
    }

    const filteredNotifications = notifications.filter(notification => {
        if (search) {
            return notification.title.toLowerCase().includes(search.toLowerCase()) ||
                notification.description.toLowerCase().includes(search.toLowerCase())
        }
        if (filter === "unread") {
            return !notification.is_read
        }
        return true
    })

    return (
        <>
             
            <div className="w-[90%] md:container mx-auto md:max-w-8xl py-8">
                <div className="mb-8 flex flex-wrap items-center justify-between">
                    <h1 className="text-3xl font-bold">Notifications</h1>
                    <div className="flex flex-wrap items-center gap-4 mt-4 md:mt-0">
                        <div className="relative w-full md:w-auto">
                            <Search className="absolute left-1 top-1/2 h-8 w-8 -translate-y-1/2 bg-primary text-white rounded-full p-2" />
                            <Input
                                placeholder="Search notifications..."
                                className="pl-10 rounded-full bg-white shadow-none"                                
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Select value={filter} onValueChange={setFilter}>
                            <SelectTrigger className="w-[180px] rounded-full bg-white shadow-none bg-[#EAF2FF] text-black">
                                <SelectValue>
                                    {filter === "all" ? "All Notifications" : "Unread"}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Notifications</SelectItem>
                                <SelectItem value="unread">Unread</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            className="rounded-full bg-primary text-white font-bold hover:scale-105 transition-all duration-300 cursor-pointer"
                            onClick={handleMarkAllAsRead}
                        >
                            Mark All
                        </Button>
                    </div>
                </div>
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-8">
                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        </div>
                    ) : filteredNotifications.length > 0 ? (
                        filteredNotifications.map((notification) => (
                            <NotificationCard
                                key={notification.id}
                                notification={notification}
                                onMarkAsRead={handleMarkAsRead}
                            />
                        ))
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            No notifications found
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

