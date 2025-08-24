import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get all memories for analysis
    const memories = await prisma.memory.findMany({
      where: { userId: user.id },
      select: {
        sentiment: true,
        tags: true,
        createdAt: true,
      },
    })

    // Calculate sentiment breakdown
    const sentimentBreakdown = {
      positive: memories.filter((m) => m.sentiment === "positive").length,
      negative: memories.filter((m) => m.sentiment === "negative").length,
      neutral: memories.filter((m) => m.sentiment === "neutral" || !m.sentiment).length,
    }

    // Calculate top tags
    const tagCounts: Record<string, number> = {}
    memories.forEach((memory) => {
      memory.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    })

    const topTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Calculate recent trends
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

    const thisWeek = memories.filter((m) => new Date(m.createdAt) >= oneWeekAgo).length
    const lastWeek = memories.filter(
      (m) => new Date(m.createdAt) >= twoWeeksAgo && new Date(m.createdAt) < oneWeekAgo,
    ).length

    return NextResponse.json({
      totalMemories: memories.length,
      sentimentBreakdown,
      topTags,
      recentTrends: {
        thisWeek,
        lastWeek,
      },
    })
  } catch (error) {
    console.error("Error fetching insights:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
