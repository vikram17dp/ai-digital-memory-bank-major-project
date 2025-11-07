import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, email, firstName, lastName } = body;

    if (!userId || !email) {
      return NextResponse.json({ error: 'Missing userId or email' }, { status: 400 });
    }

    // Check if user profile exists
    let userProfile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!userProfile) {
      // Create new user profile
      userProfile = await prisma.userProfile.create({
        data: {
          userId,
          email,
          bio: `Hi, I'm ${firstName || 'User'}! Welcome to my Memory Bank.`,
        },
      });
      console.log(`[User Sync] Created new UserProfile for ${userId}`);
    } else {
      // Update email if changed
      if (userProfile.email !== email) {
        userProfile = await prisma.userProfile.update({
          where: { userId },
          data: { email },
        });
        console.log(`[User Sync] Updated email for ${userId}`);
      }
    }

    return NextResponse.json({
      success: true,
      profile: userProfile,
    });
  } catch (error: any) {
    console.error('[User Sync] Error:', error);
    return NextResponse.json(
      { error: 'Failed to sync user', message: error.message },
      { status: 500 }
    );
  }
}
