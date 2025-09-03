import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server'; // ✅ notice /server here
import { uploadToS3, extractTextFromImage } from '@/lib/aws-s3';
import { analyzeSentimentHuggingFace, generateContentFromTitle, generateTagsFromContent, expandMemoryContent } from '@/lib/hugging-face';
import { analyzeSentimentML, processImageML, generateMemoryDataML } from '@/lib/ml-backend';
import { validateMemoryData, sanitizeInput } from '@/lib/validation';

export async function POST(req: NextRequest) {
  try {
    // Await the auth() call
    const { userId } = await auth(); // ✅ use await

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const mode = formData.get('mode') as string; // 'manual', 'minimal', 'image'

    // Extract form data
    let title = sanitizeInput(formData.get('title') as string || '');
    let content = sanitizeInput(formData.get('content') as string || '');
    let mood = sanitizeInput(formData.get('mood') as string || '');
    let tags = JSON.parse(formData.get('tags') as string || '[]');
    let images = formData.getAll('images') as File[];

    let result: any = {
      title: '',
      content: '',
      tags: [],
      mood: {
        label: 'Neutral',
        score: 0.5
      },
      imageUrl: ''
    };

    switch (mode) {
      case 'manual':
        result.title = title;
        result.content = content;
        result.tags = tags;

        // Parallel sentiment analysis
        const [hfSentiment, mlSentiment] = await Promise.all([
          analyzeSentimentHuggingFace(content),
          analyzeSentimentML(content)
        ]);

        result.mood = {
          label: mlSentiment.label || hfSentiment.label || 'Neutral',
          score: Math.max(mlSentiment.score || 0, hfSentiment.score || 0.5)
        };
        break;

      case 'minimal':
        if (title && !content) {
          const [expandedContent, generatedTags, sentimentData] = await Promise.all([
            expandMemoryContent(title),
            generateTagsFromContent(title),
            Promise.all([
              analyzeSentimentHuggingFace(title),
              analyzeSentimentML(title)
            ])
          ]);

          result.title = title;
          result.content = expandedContent;
          result.tags = generatedTags;
          result.mood = {
            label: sentimentData[1].label || sentimentData[0].label || 'Neutral',
            score: Math.max(sentimentData[1].score || 0, sentimentData[0].score || 0.5)
          };
        } else if (mood && !title && !content) {
          const memoryData = await generateMemoryDataML(mood);
          const [hfSentiment, mlSentiment] = await Promise.all([
            analyzeSentimentHuggingFace(memoryData.content),
            analyzeSentimentML(memoryData.content)
          ]);

          result.title = memoryData.title;
          result.content = memoryData.content;
          result.tags = memoryData.tags;
          result.mood = {
            label: mlSentiment.label || hfSentiment.label || mood,
            score: Math.max(mlSentiment.score || 0, hfSentiment.score || 0.5)
          };
        }
        break;

      case 'image':
        if (images.length > 0) {
          const processedImages = [];
          for (const image of images) {
            const imageUrl = await uploadToS3(image, userId);
            processedImages.push(imageUrl);

            const extractedText = await extractTextFromImage(image);
            if (extractedText) {
              content += extractedText + ' ';
            }
          }

          if (content.trim()) {
            const [mlProcessedData, hfSentiment, mlSentiment, generatedTags] = await Promise.all([
              processImageML(content.trim()),
              analyzeSentimentHuggingFace(content.trim()),
              analyzeSentimentML(content.trim()),
              generateTagsFromContent(content.trim())
            ]);

            result.title = mlProcessedData.suggestedTitle || 'Untitled Memory';
            result.content = content.trim();
            result.tags = [...new Set([...generatedTags, ...mlProcessedData.suggestedTags])];
            result.mood = {
              label: mlSentiment.label || hfSentiment.label || 'Neutral',
              score: Math.max(mlSentiment.score || 0, hfSentiment.score || 0.5)
            };
            result.imageUrl = processedImages[0];
          }
        }
        break;

      default:
        return NextResponse.json({ error: 'Invalid processing mode' }, { status: 400 });
    }

    const validationResult = validateMemoryData(result);
    if (!validationResult.isValid) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validationResult.errors 
      }, { status: 400 });
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Memory processing error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Processing failed'
    }, { status: 500 });
  }
}
