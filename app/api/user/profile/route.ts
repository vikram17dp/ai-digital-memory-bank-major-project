import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'anonymous';
    const email = request.headers.get('x-user-email') || 'anonymous@example.com';

    // Fetch or create user profile
    let userProfile = await prisma.userProfile.findUnique({
      where: { userId },
    })

    if (!userProfile) {
      userProfile = await prisma.userProfile.create({
        data: {
          userId,
          email,
        },
      })
    }

    // Fetch user statistics
    const memoriesCount = await prisma.memory.count({
      where: { userId },
    })

    const favoriteMemoriesCount = await prisma.memory.count({
      where: {
        userId,
        isFavorite: true,
      },
    })

    // Calculate days active
    const firstMemory = await prisma.memory.findFirst({
      where: { userId },
      orderBy: { createdAt: "asc" },
      select: { createdAt: true },
    })

    const daysActive = firstMemory
      ? Math.floor((new Date().getTime() - new Date(firstMemory.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      : 0

    // Calculate positive memories percentage
    const positiveMemoriesCount = await prisma.memory.count({
      where: {
        userId,
        mood: "positive",
      },
    })

    const positivePercentage = memoriesCount > 0 ? Math.round((positiveMemoriesCount / memoriesCount) * 100) : 0

    // Calculate streak
    const recentMemories = await prisma.memory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    })

    let streak = 0
    if (recentMemories.length > 0) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const checkDate = new Date(today)
      const memoryDates = new Set(
        recentMemories.map((m) => {
          const d = new Date(m.createdAt)
          d.setHours(0, 0, 0, 0)
          return d.getTime()
        }),
      )

      while (memoryDates.has(checkDate.getTime())) {
        streak++
        checkDate.setDate(checkDate.getDate() - 1)
      }
    }

    // Fetch recent memories for activity
    const recentMemories5 = await prisma.memory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        isFavorite: true,
      },
    })

    // Build activity timeline
    const activities: any[] = []

    // Group memories by day
    const memoriesByDay = recentMemories5.reduce(
      (acc, memory) => {
        const date = new Date(memory.createdAt).toDateString()
        if (!acc[date]) {
          acc[date] = []
        }
        acc[date].push(memory)
        return acc
      },
      {} as Record<string, typeof recentMemories5>,
    )

    // Create activity items
    for (const [date, memories] of Object.entries(memoriesByDay)) {
      if (memories.length > 0) {
        activities.push({
          type: "memory_added",
          description: `Added ${memories.length} new ${memories.length === 1 ? "memory" : "memories"}`,
          timestamp: new Date(memories[0].createdAt),
          count: memories.length,
        })
      }
    }

    // Add profile update activity if recent
    if (userProfile?.updatedAt && userProfile.createdAt) {
      const daysSinceUpdate = Math.floor(
        (new Date().getTime() - new Date(userProfile.updatedAt).getTime()) / (1000 * 60 * 60 * 24),
      )

      if (daysSinceUpdate <= 7) {
        activities.push({
          type: "profile_updated",
          description: "Updated profile information",
          timestamp: new Date(userProfile.updatedAt),
        })
      }
    }

    // Sort activities by timestamp
    activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    return NextResponse.json({
      success: true,
      profile: userProfile,
      statistics: {
        totalMemories: memoriesCount,
        daysActive,
        positivePercentage: `${positivePercentage}%`,
        streak,
        favoriteMemories: favoriteMemoriesCount,
      },
      activities: activities.slice(0, 4),
      joinDate: userProfile?.createdAt || new Date(),
    })
  } catch (error: any) {
    console.error("Profile fetch error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch profile data",
        message: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'anonymous';
    const body = await request.json()
    const { email, bio, location, website, phone, timezone } = body

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Update or create user profile
    const userProfile = await prisma.userProfile.upsert({
      where: { userId },
      update: {
        bio,
        location,
        website,
        phone,
        timezone,
        updatedAt: new Date(),
      },
      create: {
        userId,
        email,
        bio,
        location,
        website,
        phone,
        timezone,
      },
    })

    return NextResponse.json({
      success: true,
      profile: userProfile,
      message: "Profile updated successfully",
    })
  } catch (error: any) {
    console.error("Profile update error:", error)
    return NextResponse.json(
      {
        error: "Failed to update profile",
        message: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
      },
      { status: 500 },
    )
  }
}

