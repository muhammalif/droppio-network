"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

// Create a notification
export async function createNotification(data: {
  userId: string
  type: string
  message: string
  link?: string
}) {
  try {
    const notification = await prisma.notification.create({
      data: {
        type: data.type,
        message: data.message,
        link: data.link,
        userId: data.userId,
      },
    })

    revalidatePath("/notifications")
    return notification
  } catch (error) {
    console.error("Error creating notification:", error)
    throw new Error("Failed to create notification")
  }
}

// Get user notifications
export async function getUserNotifications(userId: string) {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })

    return notifications
  } catch (error) {
    console.error("Error getting user notifications:", error)
    throw new Error("Failed to get user notifications")
  }
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string) {
  try {
    const notification = await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    })

    revalidatePath("/notifications")
    return notification
  } catch (error) {
    console.error("Error marking notification as read:", error)
    throw new Error("Failed to mark notification as read")
  }
}

// Mark all notifications as read
export async function markAllNotificationsAsRead(userId: string) {
  try {
    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    })

    revalidatePath("/notifications")
    return { success: true }
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    throw new Error("Failed to mark all notifications as read")
  }
}
