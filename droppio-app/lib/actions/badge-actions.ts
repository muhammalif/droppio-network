"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { createNotification } from "./notification-actions"

// Mint a badge
export async function mintBadge(data: {
  userId: string
  level: string
  txHash?: string
}) {
  try {
    // Check if user already has this badge
    const existingBadge = await prisma.badge.findFirst({
      where: {
        userId: data.userId,
        level: data.level,
      },
    })

    if (existingBadge) {
      throw new Error("User already has this badge")
    }

    // Create badge
    const badge = await prisma.badge.create({
      data: {
        level: data.level,
        txHash: data.txHash,
        userId: data.userId,
      },
    })

    // Create notification
    await createNotification({
      userId: data.userId,
      type: "badge",
      message: `Congratulations! You've earned the ${data.level} badge`,
      link: "/dashboard?tab=badges",
    })

    revalidatePath("/dashboard")
    return badge
  } catch (error) {
    console.error("Error minting badge:", error)
    throw new Error("Failed to mint badge")
  }
}

// Check badge eligibility
export async function checkBadgeEligibility(userId: string) {
  console.time("checkBadgeEligibility");
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        sentTips: {
          select: { amount: true },
        },
        badges: true,
      },
    })

    if (!user) {
      console.timeEnd("checkBadgeEligibility");
      throw new Error("User not found")
    }

    // Aggregate totalTipped in DB, not in JS
    const totalTippedAgg = await prisma.tip.aggregate({
      where: { senderId: userId },
      _sum: { amount: true }
    });
    const totalTipped = totalTippedAgg._sum.amount?.toString() || "0";

    // Update user's totalTipped
    await prisma.user.update({
      where: { id: userId },
      data: { totalTipped },
    })

    // Check eligibility
    const eligibility = {
      bronze: BigInt(totalTipped) >= BigInt(100_000 * 10 ** 6),
      silver: BigInt(totalTipped) >= BigInt(500_000 * 10 ** 6),
      gold: BigInt(totalTipped) >= BigInt(1_000_000 * 10 ** 6),
    }

    // Determine highest eligible level
    let eligibilityLevel = "none"
    if (eligibility.gold) eligibilityLevel = "gold"
    else if (eligibility.silver) eligibilityLevel = "silver"
    else if (eligibility.bronze) eligibilityLevel = "bronze"

    // Update user's eligibility level
    await prisma.user.update({
      where: { id: userId },
      data: { eligibilityLevel },
    })

    // Check for badges that can be minted
    const ownedBadgeLevels = user.badges.map((badge: { level: string }) => badge.level)

    const eligibleBadges = Object.entries(eligibility)
      .filter(([level, isEligible]) => isEligible && !ownedBadgeLevels.includes(level))
      .map(([level]) => level)

    console.timeEnd("checkBadgeEligibility");
    return {
      totalTipped,
      eligibilityLevel,
      eligibleBadges,
      ownedBadges: ownedBadgeLevels,
    }
  } catch (error) {
    console.error("Error checking badge eligibility:", error)
    console.timeEnd("checkBadgeEligibility");
    throw new Error("Failed to check badge eligibility")
  }
}
