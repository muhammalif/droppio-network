"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

// Update or create social account
export async function upsertSocialAccount(
  userId: string,
  data: {
    platform: string
    username: string
    verified?: boolean
  },
) {
  try {
    const socialAccount = await prisma.socialAccount.upsert({
      where: {
        userId_platform: {
          userId,
          platform: data.platform,
        },
      },
      update: {
        username: data.username,
        verified: data.verified ?? false,
        verifiedAt: data.verified ? new Date() : null,
      },
      create: {
        userId,
        platform: data.platform,
        username: data.username,
        verified: data.verified ?? false,
        verifiedAt: data.verified ? new Date() : null,
      },
    })

    revalidatePath("/dashboard/settings")
    return socialAccount
  } catch (error) {
    console.error("Error upserting social account:", error)
    throw new Error("Failed to update social account")
  }
}

// Verify social account
export async function verifySocialAccount(userId: string, platform: string) {
  try {
    // In a real app, this would involve OAuth verification
    // For now, we'll just mark it as verified
    const socialAccount = await prisma.socialAccount.update({
      where: {
        userId_platform: {
          userId,
          platform,
        },
      },
      data: {
        verified: true,
        verifiedAt: new Date(),
      },
    })

    revalidatePath("/dashboard/settings")
    return socialAccount
  } catch (error) {
    console.error("Error verifying social account:", error)
    throw new Error("Failed to verify social account")
  }
}
