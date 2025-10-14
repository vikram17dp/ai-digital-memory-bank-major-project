import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Fetch memories for the authenticated user
    const memories = await prisma.memory.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    // Get total count for pagination
    const total = await prisma.memory.count({
      where: {
        userId: userId,
      },
    });

    return NextResponse.json({
      success: true,
      memories: memories,
      total: total,
      limit: limit,
      offset: offset,
      hasMore: offset + limit < total,
    });

  } catch (error: any) {
    console.error('Error fetching memories:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Failed to fetch memories'
    }, { status: 500 });
  }
}

