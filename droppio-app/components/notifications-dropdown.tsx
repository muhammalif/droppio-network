"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { getUserNotifications, markNotificationAsRead } from "@/lib/actions/notification-actions"
import { useXellarKit } from "@/lib/xellar-hooks"
import { getUserByAddress } from "@/lib/actions/user-actions"
import { useToast } from "@/components/ui/use-toast"

export default function NotificationsDropdown() {
  const { address } = useXellarKit()
  const [notifications, setNotifications] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const loadNotifications = async () => {
      if (!address) return

      try {
        const user = await getUserByAddress(address)
        if (user) {
          const userNotifications = await getUserNotifications(user.id)
          setNotifications(userNotifications)
        }
      } catch (error) {
        console.error("Error loading notifications:", error)
        toast({
          title: "Error",
          description: "Failed to load notifications",
          variant: "destructive",
        })
      }
    }

    loadNotifications()
  }, [address, toast])

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId)
      setNotifications(notifications.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
    } catch (error) {
      console.error("Error marking notification as read:", error)
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      })
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          notifications.slice(0, 5).map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="flex flex-col items-start gap-1 p-4"
              onClick={() => handleMarkAsRead(notification.id)}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-medium">{notification.message}</span>
                {!notification.read && (
                  <Badge variant="secondary" className="ml-2">
                    New
                  </Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(notification.createdAt).toLocaleDateString()}
              </span>
              {notification.link && (
                <Link
                  href={notification.link}
                  className="text-xs text-primary hover:underline mt-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  View details
                </Link>
              )}
            </DropdownMenuItem>
          ))
        )}
        {notifications.length > 5 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/notifications" className="text-center">
                View all notifications
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
