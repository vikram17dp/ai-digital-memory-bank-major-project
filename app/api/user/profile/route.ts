import { type NextRequest, NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Try to get auth from Clerk, fallback to headers
    let userId: string | null = null
    let email: string = ""

    try {
      const authResult = auth()
      userId = authResult.userId
      if (userId) {
        const clerkUser = await currentUser()
        email = clerkUser?.emailAddresses?.[0]?.emailAddress || ""
      }
    } catch (authError) {
      console.log("[Profile] Clerk auth failed, using headers")
    }

    // Fallback to headers if Clerk auth failed
    if (!userId) {
      userId = request.headers.get('x-user-id')
      email = request.headers.get('x-user-email') || ""
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[Profile GET] userId:", userId, "email:", email)

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
    // Try to get auth from Clerk, fallback to headers
    let userId: string | null = null
    let email: string = ""

    try {
      const authResult = auth()
      userId = authResult.userId
      if (userId) {
        const clerkUser = await currentUser()
        email = clerkUser?.emailAddresses?.[0]?.emailAddress || ""
      }
    } catch (authError) {
      console.log("[Profile] Clerk auth failed, using headers")
    }

    // Fallback to headers if Clerk auth failed
    if (!userId) {
      userId = request.headers.get('x-user-id')
      email = request.headers.get('x-user-email') || ""
    }

    const body = await request.json()
    const { bio, location, website, phone, timezone } = body

    // Use email from body if not from auth
    if (!email && body.email) {
      email = body.email
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    console.log("[Profile Update] userId:", userId, "email:", email)

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

