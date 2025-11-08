import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// POST /api/memories/search
// Body: { query?: string, topK?: number, tags?: string[], mood?: 'positive'|'neutral'|'negative'|null }
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'anonymous'
    const { searchParams } = new URL(request.url)
    const body = await request.json().catch(() => ({}))
    const query: string = (body.query || '').toString().trim()
    const topK = Number(body.topK || searchParams.get('topK') || 10)
    const tags: string[] | undefined = body.tags
    const mood = body.mood as 'positive' | 'neutral' | 'negative' | undefined

    const where: any = {
      userId,
    }

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
        { tags: { has: query } },
      ]
    }

    if (Array.isArray(tags) && tags.length > 0) {
      where.AND = [...(where.AND || []), { tags: { hasSome: tags } }]
    }

    if (mood) {
      where.AND = [...(where.AND || []), { sentiment: mood }]
    }

    const results = await prisma.memory.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: topK,
      select: {
        id: true,
        title: true,
        content: true,
        tags: true,
        sentiment: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ success: true, count: results.length, results })
  } catch (error: any) {
    console.error('[Memories Search API] Error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
