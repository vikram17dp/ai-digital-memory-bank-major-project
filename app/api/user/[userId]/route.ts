
// api/user/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import  auth  from '@clerk/nextjs'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = auth()
    
    if (!userId || userId !== params.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user data from your database
    // Example:
    // const user = await db.user.findUnique({
    //   where: { clerkId: userId }
    // })

    const userData = {
      id: params.userId,
      firstName: 'User',
      lastName: 'Name',
      preferences: {},
      createdAt: new Date().toISOString()
    }

    return NextResponse.json(userData)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}