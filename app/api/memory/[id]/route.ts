import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { deleteFromS3 } from '@/lib/s3';

// GET - Fetch a specific memory
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const memory = await prisma.memory.findUnique({
      where: {
        id: id,
        userId: userId, // Ensure user can only access their own memories
      },
    });

    if (!memory) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    }

    return NextResponse.json({ memory });
  } catch (error) {
    console.error('Error fetching memory:', error);
    return NextResponse.json({ error: 'Failed to fetch memory' }, { status: 500 });
  }
}

// PUT - Update a specific memory
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, content, tags, mood, location, people, images, imageUrl, sentiment, isFavorite, isPrivate } = body;

    // Verify the memory belongs to the user
    const existingMemory = await prisma.memory.findUnique({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!existingMemory) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    }

    // Update the memory
    const updatedMemory = await prisma.memory.update({
      where: {
        id: id,
      },
      data: {
        title,
        content,
        tags: tags || [],
        mood,
        location,
        people,
        images: images || [],
        imageUrl,
        sentiment,
        isFavorite,
        isPrivate,
      },
    });

    return NextResponse.json({ 
      success: true, 
      memory: updatedMemory,
      message: 'Memory updated successfully' 
    });

  } catch (error) {
    console.error('Error updating memory:', error);
    return NextResponse.json({ error: 'Failed to update memory' }, { status: 500 });
  }
}

// DELETE - Delete a specific memory
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Verify the memory belongs to the user and get image URLs
    const existingMemory = await prisma.memory.findUnique({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!existingMemory) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    }

    // Delete images from S3
    const imagesToDelete = [
      ...(existingMemory.images || []),
      ...(existingMemory.imageUrl ? [existingMemory.imageUrl] : [])
    ];

    if (imagesToDelete.length > 0) {
      await Promise.all(
        imagesToDelete.map(url => deleteFromS3(url).catch(err => {
          console.error(`Failed to delete image ${url}:`, err);
          // Continue even if some images fail to delete
        }))
      );
    }

    // Delete the memory from database
    await prisma.memory.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ 
      success: true,
      message: 'Memory deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting memory:', error);
    return NextResponse.json({ error: 'Failed to delete memory' }, { status: 500 });
  }
}
