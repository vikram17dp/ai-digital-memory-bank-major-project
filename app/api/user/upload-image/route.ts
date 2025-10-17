import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as "profile" | "background"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!type || !["profile", "background"].includes(type)) {
      return NextResponse.json({ error: "Invalid image type" }, { status: 400 })
    }

    // Convert file to base64 for storage (or use a blob storage service)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")
    const dataUrl = `data:${file.type};base64,${base64}`

    // Update user profile with image
    const userProfile = await prisma.userProfile.upsert({
      where: { userId },
      update: {
        [type === "profile" ? "profileImage" : "backgroundImage"]: dataUrl,
        updatedAt: new Date(),
      },
      create: {
        userId,
        email: "", // Will be updated by user
        [type === "profile" ? "profileImage" : "backgroundImage"]: dataUrl,
      },
    })

    return NextResponse.json({
      success: true,
      imageUrl: dataUrl,
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
