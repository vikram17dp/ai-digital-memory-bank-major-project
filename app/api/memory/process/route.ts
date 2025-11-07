import { NextRequest, NextResponse } from 'next/server';
import { uploadToS3 } from '@/lib/s3';
import { extractTextFromImage } from '@/lib/aws-s3';
import { analyzeSentimentHuggingFace, generateContentFromTitle, generateTagsFromContent, expandMemoryContent } from '@/lib/hugging-face';
import { analyzeSentimentML, processImageML, generateMemoryDataML } from '@/lib/ml-backend';
import { validateMemoryData, sanitizeInput } from '@/lib/validation';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const userId = formData.get('userId') as string || 'anonymous';

    // Extract form data
    const title = sanitizeInput(formData.get('title') as string || '');
    const content = sanitizeInput(formData.get('content') as string || '');
    const mood = sanitizeInput(formData.get('mood') as string || 'neutral');
    const date = formData.get('date') as string || new Date().toISOString();
    const location = sanitizeInput(formData.get('location') as string || '');
    const people = sanitizeInput(formData.get('people') as string || '');
    const tags = JSON.parse(formData.get('tags') as string || '[]');
    const isPrivate = formData.get('isPrivate') === 'true';
    const isFavorite = formData.get('isFavorite') === 'true';

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json({ 
        error: 'Missing required fields', 
        details: 'Title and content are required' 
      }, { status: 400 });
    }

    // Process images and upload to S3
    const imageUrls: string[] = [];
    const imageFields = Array.from(formData.keys()).filter(key => key.startsWith('image_'));
    
    console.log(`Processing ${imageFields.length} images for user ${userId}`);

    for (const fieldName of imageFields) {
      const imageFile = formData.get(fieldName) as File;
      
      if (imageFile && imageFile.size > 0) {
        try {
          console.log(`Uploading image: ${imageFile.name}, Size: ${imageFile.size} bytes`);
          
          // Convert File to Buffer for S3 upload
          const arrayBuffer = await imageFile.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          
          const imageUrl = await uploadToS3(buffer, imageFile.name, imageFile.type);
          imageUrls.push(imageUrl);
          console.log(`Successfully uploaded image to: ${imageUrl}`);
        } catch (uploadError) {
          console.error(`Failed to upload image ${imageFile.name}:`, uploadError);
          // Continue processing other images even if one fails
        }
      }
    }

    // Analyze sentiment from content
    let sentiment = mood;
    try {
      // Try to get more accurate sentiment analysis
      const sentimentResult = await analyzeSentimentML(content).catch(() => 
        analyzeSentimentHuggingFace(content).catch(() => null)
      );
      
      if (sentimentResult?.label) {
        sentiment = sentimentResult.label.toLowerCase();
      }
    } catch (sentimentError) {
      console.error('Sentiment analysis failed:', sentimentError);
      // Use the mood provided by user as fallback
    }

    // Map mood to database enum
    const moodMapping: { [key: string]: 'positive' | 'neutral' | 'negative' } = {
      'happy': 'positive',
      'excited': 'positive',
      'loved': 'positive',
      'neutral': 'neutral',
      'sad': 'negative',
      'frustrated': 'negative',
      'angry': 'negative'
    };
    
    const dbMood = moodMapping[mood.toLowerCase()] || 'neutral';

    // Save memory to database
    console.log(`Saving memory to database with ${imageUrls.length} images:`, imageUrls);
    const memory = await prisma.memory.create({
      data: {
        userId: userId,
        title: title,
        content: content,
        tags: tags,
        mood: dbMood,
        date: new Date(date),
        location: location || null,
        people: people || null,
        imageUrl: imageUrls.length > 0 ? imageUrls[0] : null,
        images: imageUrls,
        sentiment: sentiment,
        isPrivate: isPrivate,
        isFavorite: isFavorite
      }
    });

    console.log(`Memory created successfully with ID: ${memory.id}`);
    console.log(`Stored images array (${memory.images.length}):`, memory.images);

    return NextResponse.json({
      success: true,
      memory: {
        id: memory.id,
        title: memory.title,
        content: memory.content,
        tags: memory.tags,
        mood: memory.mood,
        date: memory.date,
        location: memory.location,
        people: memory.people,
        imageUrl: memory.imageUrl,
        images: memory.images,
        sentiment: memory.sentiment,
        isPrivate: memory.isPrivate,
        isFavorite: memory.isFavorite,
        createdAt: memory.createdAt
      },
      message: 'Memory saved successfully!'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Memory processing error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Failed to save memory',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
