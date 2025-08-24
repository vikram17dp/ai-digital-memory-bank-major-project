import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

// api/memories/[userId]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = auth()
    
    if (!userId || userId !== params.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch memories from your database
    // Example:
    // const memories = await db.memory.findMany({
    //   where: { userId: params.userId },
    //   orderBy: { createdAt: 'desc' }
    // })

    const memories = [
      {
        id: '1',
        title: 'Sample Memory',
        content: 'This is a sample memory from your database',
        tags: ['sample', 'test'],
        sentiment: 'positive',
        createdAt: new Date().toISOString(),
        userId: params.userId
      }
    ]

    return NextResponse.json({ memories })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = auth()
    
    if (!userId || userId !== params.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, content, tags, sentiment } = await request.json()

    // Create memory in your database
    // Example:
    // const memory = await db.memory.create({
    //   data: {
    //     title,
    //     content,
    //     tags,
    //     sentiment,
    //     userId: params.userId
    //   }
    // })

    const memory = {
      id: Date.now().toString(),
      title,
      content,
      tags,
      sentiment,
      createdAt: new Date().toISOString(),
      userId: params.userId
    }

    return NextResponse.json({ memory }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}