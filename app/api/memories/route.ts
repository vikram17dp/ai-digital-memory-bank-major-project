import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { mlService } from "@/lib/ml-service"

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'anonymous';

    const memories = await prisma.memory.findMany({
      where: {
        userId: userId,
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
    const userId = request.headers.get('x-user-id') || 'anonymous';
    const { title, content, tags, imageUrl } = await request.json()

    // Create memory with basic data first
    const memory = await prisma.memory.create({
      data: {
        title,
        content,
        tags: tags || [],
        imageUrl,
        userId: userId,
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
