import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { mlService } from "@/lib/ml-service"

export async function GET() {
  try {
    const { userId } = await auth() // Added 'await' here

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const memories = await prisma.memory.findMany({
      where: {
        user: {
          clerkId: userId,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(memories)
  } catch (error) {
    console.error("Error fetching memories:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth() // Added 'await' here

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, content, tags, imageUrl } = await request.json()

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create memory with basic data first
    const memory = await prisma.memory.create({
      data: {
        title,
        content,
        tags: tags || [],
        imageUrl,
        userId: user.id,
        sentiment: "neutral", // Default sentiment
      },
    })

    try {
      const analysisResult = await mlService.analyzeMemory({
        id: memory.id,
        title: memory.title,
        content: memory.content,
        tags: memory.tags,
      })

      // Update memory with analysis results
      const updatedMemory = await prisma.memory.update({
        where: { id: memory.id },
        data: {
          sentiment: analysisResult.sentiment,
          tags: [...(tags || []), ...analysisResult.suggested_tags].slice(0, 10), // Combine user tags with AI suggestions
          embedding: JSON.stringify(analysisResult.embedding),
          pineconeId: analysisResult.pinecone_id,
        },
      })

      return NextResponse.json(updatedMemory, { status: 201 })
    } catch (mlError) {
      console.error("ML service error:", mlError)
      // Return memory without ML analysis if service fails
      return NextResponse.json(memory, { status: 201 })
    }
  } catch (error) {
    console.error("Error creating memory:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}