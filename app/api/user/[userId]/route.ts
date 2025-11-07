
// api/user/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = request.headers.get('x-user-id') || params.userId;

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