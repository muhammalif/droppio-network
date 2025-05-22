"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { createNotification } from "./notification-actions"

// Send a tip
export async function sendTip(data: {
  senderAddress: string
  receiverAddress: string
  amount: string
  message?: string
  txHash?: string
}) {
  try {
    // Get or create sender
    const sender = await prisma.user.upsert({
      where: { address: data.senderAddress },
      update: {},
      create: { address: data.senderAddress },
    })

    // Get or create receiver
    const receiver = await prisma.user.upsert({
      where: { address: data.receiverAddress },
      update: {},
      create: { address: data.receiverAddress },
    })

    // Create tip
    const tip = await prisma.tip.create({
      data: {
        amount: data.amount,
        message: data.message,
        txHash: data.txHash,
        senderId: sender.id,
        receiverId: receiver.id,
      },
      include: {
        sender: true,
        receiver: true,
      },
    })

    // Update sender's totalTipped
    const senderTips = await prisma.tip.findMany({
      where: { senderId: sender.id },
      select: { amount: true },
    })

    const totalTipped = senderTips.reduce((total: string, tip: { amount: string }) => (BigInt(total) + BigInt(tip.amount)).toString(), "0")

    await prisma.user.update({
      where: { id: sender.id },
      data: { totalTipped },
    })

    // Create notification for receiver
    await createNotification({
      userId: receiver.id,
      type: "tip",
      message: `You received a tip of ${data.amount} IDRX from ${sender.name || "a user"}`,
      link: "/dashboard",
    })

    revalidatePath("/dashboard")
    revalidatePath("/creators")
    revalidatePath(`/creators/${receiver.id}`)

    return tip
  } catch (error) {
    console.error("Error sending tip:", error)
    throw new Error("Failed to send tip")
  }
}

// Get tips for a user (sent or received)
export async function getUserTips(userId: string, type: "sent" | "received", limit = 20, offset = 0) {
  try {
    const tips = await prisma.tip.findMany({
      where: type === "sent" ? { senderId: userId } : { receiverId: userId },
      include: {
        sender: {
          select: {
            id: true,
            address: true,
            name: true,
          },
        },
        receiver: {
          select: {
            id: true,
            address: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: offset,
    })

    return tips
  } catch (error) {
    console.error("Error getting user tips:", error)
    throw new Error("Failed to get user tips")
  }
}
