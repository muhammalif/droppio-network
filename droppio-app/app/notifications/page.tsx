"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Check, Gift, Award, User, Info } from "lucide-react"
import Link from "next/link"
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/actions/notification-actions"
import { useXellarKit } from "@/lib/xellar-hooks"
import { getUserByAddress } from "@/lib/actions/user-actions"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function NotificationsPage() {
  const { address } = useXellarKit()
  const [notifications, setNotifications] = useState<any[]>([])
  const [filter, setFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const loadNotifications = async () => {
      if (!address) return

      try {
        setIsLoading(true)
        const user = await getUserByAddress(address)
        if (user) {
          const userNotifications = await getUserNotifications(user.id)
          setNotifications(userNotifications)
        }
      } catch (error) {
        console.error("Error loading notifications:", error)
        toast({
          title: "Error",
          description: "Failed to load notifications. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadNotifications()
  }, [address, toast])

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAllAsRead = async () => {
    if (!address) return

    try {
      const user = await getUserByAddress(address)
      if (user) {
        await markAllNotificationsAsRead(user.id)
        setNotifications(notifications.map((n) => ({ ...n, read: true })))
        toast({
          title: "Success",
          description: "All notifications marked as read",
        })
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive",
      })
    }
  }

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

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true
    if (filter === "unread") return !n.read
    return n.type === filter
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case "tip":
        return "text-green-500 bg-green-50"
      case "badge":
        return "text-yellow-500 bg-yellow-50"
      case "creator":
        return "text-blue-500 bg-blue-50"
      case "system":
        return "text-gray-500 bg-gray-50"
      default:
        return "text-primary bg-primary/10"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "tip":
        return <Gift className="h-4 w-4" />
      case "badge":
        return <Award className="h-4 w-4" />
      case "creator":
        return <User className="h-4 w-4" />
      case "system":
        return <Info className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex items-center justify-center h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with your activity</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            <Check className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" className="w-full mb-8">
        <TabsList className="grid w-full grid-cols-4 md:w-[400px]">
          <TabsTrigger value="all" onClick={() => setFilter("all")}>
            All
          </TabsTrigger>
          <TabsTrigger value="unread" onClick={() => setFilter("unread")}>
            Unread
          </TabsTrigger>
          <TabsTrigger value="tips" onClick={() => setFilter("tip")}>
            Tips
          </TabsTrigger>
          <TabsTrigger value="badges" onClick={() => setFilter("badge")}>
            Badges
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No notifications found</p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card key={notification.id} className={notification.read ? "opacity-60" : ""}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">{notification.message}</p>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {notification.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {notification.link && (
                      <Link
                        href={notification.link}
                        className="text-sm text-primary hover:underline mt-2 inline-block"
                      >
                        View details
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
