import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { DashboardMainLayout } from "@/components/dashboard-main-layout"
import { DashboardContent } from "@/components/dashboard-content-new"
import { prisma } from "@/lib/prisma"

export default async function DashboardPage() {
  const user = await currentUser()

  if (!user) {
    redirect("/")
  }

  // Convert the Clerk user object to a plain object with only serializable properties
  const serializableUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.emailAddresses[0]?.emailAddress || "",
    imageUrl: user.imageUrl,
  }

  // Fetch memories from database
  const memories = await prisma.memory.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 100, // Fetch more recent memories for better search and browsing
  })

  // Calculate insights
  const totalMemories = await prisma.memory.count({
    where: { userId: user.id },
  })

  // Get sentiment breakdown
  const sentimentCounts = await prisma.memory.groupBy({
    by: ['sentiment'],
    where: { userId: user.id },
    _count: true,
  })

  const sentimentBreakdown = {
    positive: sentimentCounts.find(s => s.sentiment.toLowerCase().includes('positive'))?._count || 0,
    negative: sentimentCounts.find(s => s.sentiment.toLowerCase().includes('negative'))?._count || 0,
    neutral: sentimentCounts.find(s => s.sentiment.toLowerCase() === 'neutral')?._count || 0,
  }

  // Get top tags
  const allTags = memories.flatMap(m => m.tags)
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag, count]) => ({ tag, count }))

  // Get recent trends (this week vs last week)
  const now = new Date()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

  const thisWeek = await prisma.memory.count({
    where: {
      userId: user.id,
      createdAt: { gte: oneWeekAgo },
    },
  })

  const lastWeek = await prisma.memory.count({
    where: {
      userId: user.id,
      createdAt: { gte: twoWeeksAgo, lt: oneWeekAgo },
    },
  })

  // Serialize memories for client component
  const serializedMemories = memories.map(memory => ({
    id: memory.id,
    userId: memory.userId,
    title: memory.title || 'Untitled Memory',
    content: memory.content,
    tags: memory.tags,
    sentiment: memory.sentiment,
    mood: memory.mood,
    date: memory.date.toISOString(),
    location: memory.location,
    people: memory.people,
    imageUrl: memory.imageUrl,
    images: memory.images,
    isFavorite: memory.isFavorite,
    isPrivate: memory.isPrivate,
    createdAt: memory.createdAt.toISOString(),
    updatedAt: memory.updatedAt.toISOString(),
  }))

  const insights = {
    totalMemories,
    sentimentBreakdown,
    topTags,
    recentTrends: { thisWeek, lastWeek },
  }

  return (
    <DashboardMainLayout user={serializableUser}>
      <DashboardContent 
        memories={serializedMemories}
        insights={insights}
      />
    </DashboardMainLayout>
  )
}
