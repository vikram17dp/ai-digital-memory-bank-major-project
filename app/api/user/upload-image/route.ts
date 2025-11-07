import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { uploadToS3, deleteFromS3 } from "@/lib/s3"

export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const userId = formData.get("userId") as string || request.headers.get('x-user-id') || 'anonymous'
    const file = formData.get("file") as File
    const type = formData.get("type") as "profile" | "background"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!type || !["profile", "background"].includes(type)) {
      return NextResponse.json({ error: "Invalid image type" }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: "File too large", 
        message: "File size must be less than 5MB" 
      }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ 
        error: "Invalid file type", 
        message: "Only JPEG, PNG, WebP, and GIF images are allowed" 
      }, { status: 400 })
    }

    // Get existing profile to delete old image from S3
    const existingProfile = await prisma.userProfile.findUnique({
      where: { userId },
      select: { 
        profileImage: true, 
        backgroundImage: true,
        email: true 
      }
    })

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to S3
    const imageUrl = await uploadToS3(buffer, file.name, file.type)

    // Delete old image from S3 if it exists
    const oldImageUrl = type === "profile" 
      ? existingProfile?.profileImage 
      : existingProfile?.backgroundImage

    if (oldImageUrl && oldImageUrl.startsWith('https://')) {
      await deleteFromS3(oldImageUrl).catch(err => 
        console.warn('Failed to delete old image:', err)
      )
    }

    // Get user email from Clerk if creating profile
    let email = existingProfile?.email
    if (!email) {
      const { clerkClient } = await import("@clerk/nextjs/server")
      const user = await (await clerkClient()).users.getUser(userId)
      email = user?.emailAddresses?.[0]?.emailAddress || ""
    }

    // Update user profile with S3 image URL
    const userProfile = await prisma.userProfile.upsert({
      where: { userId },
      update: {
        [type === "profile" ? "profileImage" : "backgroundImage"]: imageUrl,
        updatedAt: new Date(),
      },
      create: {
        userId,
        email: email || "",
        [type === "profile" ? "profileImage" : "backgroundImage"]: imageUrl,
      },
    })

    return NextResponse.json({
      success: true,
      imageUrl: imageUrl,
      profile: userProfile,
      message: `${type === "profile" ? "Profile" : "Background"} image uploaded successfully`,
    })
  } catch (error: any) {
    console.error("Image upload error:", error)
    return NextResponse.json(
      {
        error: "Failed to upload image",
        message: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
      },
      { status: 500 },
    )
  }
}

