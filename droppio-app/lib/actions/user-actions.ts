"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

// Get user by wallet address
export async function getUserByAddress(address: string) {
  console.time("getUserByAddress");
  try {
    const user = await prisma.user.findUnique({
      where: { address },
      include: {
        badges: true,
        socialAccounts: true,
      },
    })
    console.timeEnd("getUserByAddress");
    return user
  } catch (error) {
    console.error("Error getting user:", error)
    console.timeEnd("getUserByAddress");
    throw new Error("Failed to get user")
  }
}

// Create or update user
export async function upsertUser(
  address: string,
  data: {
    name?: string
    bio?: string
    isCreator?: boolean
    balance?: string
    totalTipped?: string
    eligibilityLevel?: string
  },
) {
  try {
    const user = await prisma.user.upsert({
      where: { address },
      update: data,
      create: {
        address,
        ...data,
      },
    })

    revalidatePath("/dashboard")
    return user
  } catch (error) {
    console.error("Error upserting user:", error)
    throw new Error("Failed to create or update user")
  }
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  data: {
    name?: string
    bio?: string
  },
) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
    })

    revalidatePath("/dashboard/settings")
    return user
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw new Error("Failed to update user profile")
  }
}

// Register as creator
export async function registerAsCreator(userId: string) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isCreator: true },
    })

    revalidatePath("/dashboard")
    return user
  } catch (error) {
    console.error("Error registering as creator:", error)
    throw new Error("Failed to register as creator")
  }
}

// Get all creators
export async function getCreators(limit = 10, offset = 0) {
  try {
    const creators = await prisma.user.findMany({
      where: { isCreator: true },
      take: limit,
      skip: offset,
      include: {
        socialAccounts: true,
        receivedTips: false, // do not include all tips
      },
    })

    // Get total received for each creator using aggregate
    const creatorIds = creators.map((c: { id: string }) => c.id)
    const tips = await prisma.tip.groupBy({
      by: ['receiverId'],
      where: { receiverId: { in: creatorIds } },
      _sum: { amount: true },
    })
    const tipsMap = Object.fromEntries(
      tips.map((t: { receiverId: string; _sum: { amount: bigint | null } }) => [t.receiverId, t._sum.amount?.toString() || "0"])
    )

    return creators.map((creator: any) => ({
      ...creator,
      totalReceived: tipsMap[creator.id] || "0",
    }))
  } catch (error) {
    console.error("Error getting creators:", error)
    throw new Error("Failed to get creators")
  }
}

// Get top creators
export async function getTopCreators(limit = 5) {
  try {
    // This is a simplified version - in a real app, you might want to
    // calculate this with a more sophisticated query
    const creators = await getCreators(limit, 0)
    return creators.sort((a: any, b: any) => (BigInt(b.totalReceived) > BigInt(a.totalReceived) ? 1 : -1))
  } catch (error) {
    console.error("Error getting top creators:", error)
    throw new Error("Failed to get top creators")
  }
}

// Get top droppers
export async function getTopDroppers(limit = 5) {
  try {
    const droppers = await prisma.user.findMany({
      include: {
        sentTips: {
          select: {
            amount: true,
          },
        },
        badges: true,
      },
      take: limit + 10, // Get extra in case some have no tips
    })

    return droppers
      .map((dropper: any) => ({
        ...dropper,
        totalTipped: dropper.sentTips.reduce((total: string, tip: { amount: string }) => (BigInt(total) + BigInt(tip.amount)).toString(), "0"),
      }))
      .filter((dropper: any) => dropper.totalTipped !== "0")
      .sort((a: any, b: any) => (BigInt(b.totalTipped) > BigInt(a.totalTipped) ? 1 : -1))
      .slice(0, limit)
  } catch (error) {
    console.error("Error getting top droppers:", error)
    throw new Error("Failed to get top droppers")
  }
}
