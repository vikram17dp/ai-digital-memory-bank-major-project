import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { deleteFromS3 } from '@/lib/s3';

export const dynamic = 'force-dynamic';

// GET - Fetch a specific memory
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = request.headers.get('x-user-id');

const memory = await prisma.memory.findFirst({
      where: {
        id: id,
        ...(userId ? { userId } : {}),
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
    const { id } = await params;
    const body = await request.json();
    const { title, content, tags, mood, location, people, images, imageUrl, sentiment, isFavorite, isPrivate } = body;
    const userId = request.headers.get('x-user-id');

    // Verify the memory exists
const existingMemory = await prisma.memory.findFirst({
      where: {
        id: id,
        ...(userId ? { userId } : {}),
      },
    });

    if (!existingMemory) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    }

    // Build update data object - only include fields that are explicitly provided
    const updateData: any = {}
    
    if (title !== undefined) updateData.title = title
    if (content !== undefined) updateData.content = content
    if (tags !== undefined) updateData.tags = tags
    if (mood !== undefined) updateData.mood = mood
    if (location !== undefined) updateData.location = location
    if (people !== undefined) updateData.people = people
    if (sentiment !== undefined) updateData.sentiment = sentiment
    if (isFavorite !== undefined) updateData.isFavorite = isFavorite
    if (isPrivate !== undefined) updateData.isPrivate = isPrivate
    
    // Only update images if explicitly provided (not undefined)
    if (images !== undefined) updateData.images = images
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl
    
    console.log(`[Memory Update] Updating memory ${id} with:`, Object.keys(updateData))
    if (images !== undefined) {
      console.log(`[Memory Update] Images array length: ${images.length}`, images)
    }

    // Update the memory
    const updatedMemory = await prisma.memory.update({
      where: {
        id: id,
      },
      data: updateData,
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
    const { id } = await params;
    const userId = request.headers.get('x-user-id');

    // Verify the memory exists and get image URLs
const existingMemory = await prisma.memory.findFirst({
      where: {
        id: id,
        ...(userId ? { userId } : {}),
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
