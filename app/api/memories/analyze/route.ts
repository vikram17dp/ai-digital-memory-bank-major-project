import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET or POST /api/memories/analyze
export async function GET(request: NextRequest) {
  return analyze(request)
}

export async function POST(request: NextRequest) {
  return analyze(request)
}

async function analyze(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'anonymous'
    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '30d'

    const sinceDate = (() => {
      const now = new Date()
      if (range.endsWith('d')) {
        const days = parseInt(range)
        return new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
      }
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    })()

    const memories = await prisma.memory.findMany({
      where: { userId, createdAt: { gte: sinceDate } },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        content: true,
        tags: true,
        sentiment: true,
        createdAt: true,
      },
    })

    const sentimentCounts = { positive: 0, neutral: 0, negative: 0 }
    const tagCounts: Record<string, number> = {}

    for (const m of memories) {
      const s = (m.sentiment as 'positive'|'neutral'|'negative') || 'neutral'
      sentimentCounts[s] = (sentimentCounts[s] || 0) + 1
      for (const t of m.tags || []) {
        tagCounts[t] = (tagCounts[t] || 0) + 1
      }
    }

    const topTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    return NextResponse.json({
      success: true,
      range,
      total: memories.length,
      sentiments: sentimentCounts,
      topTags,
      recent: memories.slice(0, 5),
    })
  } catch (error: any) {
    console.error('[Memories Analyze API] Error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
