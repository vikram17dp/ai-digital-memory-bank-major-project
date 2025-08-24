import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { mlService } from "@/lib/ml-service"

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { message, history } = await request.json()

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    try {
      const chatResponse = await mlService.chatWithMemories({
        message,
        user_id: user.id,
      })

      return NextResponse.json({
        response: chatResponse.response,
        relatedMemories: chatResponse.related_memories,
      })
    } catch (mlError) {
      console.error("ML service error:", mlError)

      // Fallback to basic text search if ML service fails
      const searchTerms = message
        .toLowerCase()
        .split(" ")
        .filter((term: string) => term.length > 2)

      const memories = await prisma.memory.findMany({
        where: {
          userId: user.id,
          OR: [
            {
              title: {
                contains: message,
                mode: "insensitive",
              },
            },
            {
              content: {
                contains: message,
                mode: "insensitive",
              },
            },
            {
              tags: {
                hasSome: searchTerms,
              },
            },
          ],
        },
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
      })

      // Generate fallback response
      let response = ""
      let relatedMemories = []

      if (memories.length === 0) {
        response =
          "I couldn't find any memories related to your query. Try asking about something else or add more memories to your collection!"
      } else {
        relatedMemories = memories.map((memory) => ({
          id: memory.id,
          title: memory.title,
          content: memory.content.substring(0, 100) + (memory.content.length > 100 ? "..." : ""),
        }))

        if (memories.length === 1) {
          response = `I found 1 memory related to your query. Here's what I found about "${memories[0].title}": ${memories[0].content.substring(0, 200)}${memories[0].content.length > 200 ? "..." : ""}`
        } else {
          response = `I found ${memories.length} memories related to your query. The most recent ones include "${memories[0].title}" and "${memories[1].title}". You can see all related memories below.`
        }
      }

      return NextResponse.json({
        response,
        relatedMemories,
      })
    }
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
