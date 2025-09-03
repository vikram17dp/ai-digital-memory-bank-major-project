// ML Backend integration for custom sentiment analysis and text processing
// This connects to your existing Python/Flask/FastAPI ML backend

const ML_BACKEND_URL = process.env.ML_BACKEND_URL || 'http://localhost:8000';
const ML_API_KEY = process.env.ML_API_KEY;

export interface SentimentResult {
  label: 'Positive' | 'Negative' | 'Neutral';
  score: number;
}

export interface ProcessedImageData {
  suggestedTitle: string;
  suggestedTags: string[];
  extractedText: string;
  confidence: number;
}

export interface GeneratedMemoryData {
  title: string;
  content: string;
  tags: string[];
}

/**
 * Analyze sentiment using custom ML backend
 */
export async function analyzeSentimentML(text: string): Promise<SentimentResult> {
  try {
    if (!text.trim()) {
      return { label: 'Neutral', score: 0.5 };
    }

    const response = await fetch(`${ML_BACKEND_URL}/api/sentiment/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ML_API_KEY}`,
        'X-API-Version': '1.0'
      },
      body: JSON.stringify({
        text: text.substring(0, 1000), // Limit text length
        model: 'custom-bert-sentiment',
        options: {
          include_confidence: true,
          normalize_scores: true
        }
      })
    });

    if (!response.ok) {
      throw new Error(`ML Backend error: ${response.status}`);
    }

    const result = await response.json();
    
    return {
      label: result.sentiment || 'Neutral',
      score: result.confidence || 0.5
    };

  } catch (error) {
    console.error('ML Backend sentiment analysis error:', error);
    return fallbackSentimentAnalysis(text);
  }
}

/**
 * Process image data using ML backend for OCR and analysis
 */
export async function processImageML(extractedText: string): Promise<ProcessedImageData> {
  try {
    const response = await fetch(`${ML_BACKEND_URL}/api/image/process-text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ML_API_KEY}`
      },
      body: JSON.stringify({
        text: extractedText,
        tasks: ['title_generation', 'tag_extraction', 'content_analysis'],
        options: {
          max_tags: 8,
          min_confidence: 0.3
        }
      })
    });

    if (!response.ok) {
      throw new Error(`ML Backend image processing error: ${response.status}`);
    }

    const result = await response.json();

    return {
      suggestedTitle: result.suggested_title || 'Untitled Memory',
      suggestedTags: result.tags || [],
      extractedText: extractedText,
      confidence: result.confidence || 0.5
    };

  } catch (error) {
    console.error('ML Backend image processing error:', error);
    return generateFallbackImageData(extractedText);
  }
}

/**
 * Generate memory data from mood using ML backend
 */
export async function generateMemoryDataML(mood: string): Promise<GeneratedMemoryData> {
  try {
    const response = await fetch(`${ML_BACKEND_URL}/api/memory/generate-from-mood`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ML_API_KEY}`
      },
      body: JSON.stringify({
        mood: mood.toLowerCase(),
        options: {
          style: 'personal',
          length: 'medium',
          include_emotions: true
        }
      })
    });

    if (!response.ok) {
      throw new Error(`ML Backend memory generation error: ${response.status}`);
    }

    const result = await response.json();

    return {
      title: result.title || `A ${mood} Memory`,
      content: result.content || '',
      tags: result.tags || []
    };

  } catch (error) {
    console.error('ML Backend memory generation error:', error);
    return generateFallbackMemoryFromMood(mood);
  }
}

/**
 * Enhance memory content using ML backend
 */
export async function enhanceMemoryContentML(title: string, content: string): Promise<{ enhancedContent: string; suggestedTags: string[] }> {
  try {
    const response = await fetch(`${ML_BACKEND_URL}/api/memory/enhance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ML_API_KEY}`
      },
      body: JSON.stringify({
        title,
        content,
        tasks: ['content_enhancement', 'tag_generation'],
        options: {
          preserve_original: true,
          enhancement_level: 'moderate'
        }
      })
    });

    if (!response.ok) {
      throw new Error(`ML Backend enhancement error: ${response.status}`);
    }

    const result = await response.json();

    return {
      enhancedContent: result.enhanced_content || content,
      suggestedTags: result.suggested_tags || []
    };

  } catch (error) {
    console.error('ML Backend content enhancement error:', error);
    return {
      enhancedContent: content,
      suggestedTags: []
    };
  }
}

/**
 * Batch process multiple memories for analytics
 */
export async function batchAnalyzeMemoriesML(memories: Array<{ title: string; content: string }>): Promise<any> {
  try {
    const response = await fetch(`${ML_BACKEND_URL}/api/memory/batch-analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ML_API_KEY}`
      },
      body: JSON.stringify({
        memories,
        analysis_types: ['sentiment', 'topics', 'trends', 'patterns'],
        options: {
          include_insights: true,
          generate_summary: true
        }
      })
    });

    if (!response.ok) {
      throw new Error(`ML Backend batch analysis error: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error('ML Backend batch analysis error:', error);
    return null;
  }
}

/**
 * Get personalized recommendations from ML backend
 */
export async function getPersonalizedRecommendationsML(userId: string, userHistory: any): Promise<any> {
  try {
    const response = await fetch(`${ML_BACKEND_URL}/api/recommendations/personalized`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ML_API_KEY}`
      },
      body: JSON.stringify({
        user_id: userId,
        history: userHistory,
        recommendation_types: ['prompts', 'tags', 'content_suggestions'],
        options: {
          limit: 10,
          include_explanations: true
        }
      })
    });

    if (!response.ok) {
      throw new Error(`ML Backend recommendations error: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error('ML Backend recommendations error:', error);
    return null;
  }
}

// Fallback functions

function fallbackSentimentAnalysis(text: string): SentimentResult {
  const positiveWords = ['happy', 'joy', 'love', 'excited', 'amazing', 'wonderful', 'great', 'fantastic', 'perfect', 'beautiful', 'grateful', 'blessed'];
  const negativeWords = ['sad', 'angry', 'frustrated', 'terrible', 'awful', 'bad', 'hate', 'disappointed', 'worried', 'upset', 'difficult', 'challenging'];
  
  const words = text.toLowerCase().split(/\s+/);
  let positiveCount = 0;
  let negativeCount = 0;
  
  words.forEach(word => {
    if (positiveWords.some(pos => word.includes(pos))) positiveCount++;
    if (negativeWords.some(neg => word.includes(neg))) negativeCount++;
  });
  
  const totalEmotionalWords = positiveCount + negativeCount;
  if (totalEmotionalWords === 0) {
    return { label: 'Neutral', score: 0.5 };
  }
  
  const positiveRatio = positiveCount / totalEmotionalWords;
  
  if (positiveRatio > 0.6) {
    return { label: 'Positive', score: Math.min(0.95, 0.7 + (positiveRatio - 0.6) * 0.5) };
  } else if (positiveRatio < 0.4) {
    return { label: 'Negative', score: Math.min(0.95, 0.7 + (0.4 - positiveRatio) * 0.5) };
  } else {
    return { label: 'Neutral', score: 0.5 };
  }
}

function generateFallbackImageData(extractedText: string): ProcessedImageData {
  const commonWords = extractedText.toLowerCase().split(/\s+/).filter(word => word.length > 3);
  const title = commonWords.length > 0 
    ? `Memory about ${commonWords[0]?.charAt(0).toUpperCase() + commonWords[0]?.slice(1)}`
    : 'Untitled Memory';
    
  const tags = [...new Set(commonWords.slice(0, 5))].map(word => word.toLowerCase());
  
  return {
    suggestedTitle: title,
    suggestedTags: tags,
    extractedText,
    confidence: 0.3
  };
}

function generateFallbackMemoryFromMood(mood: string): GeneratedMemoryData {
  const moodTemplates: { [key: string]: { title: string; content: string; tags: string[] } } = {
    happy: {
      title: 'A Moment of Pure Joy',
      content: 'This memory fills me with such warmth and happiness. The simple pleasures and positive energy made everything feel bright and wonderful. These are the moments that remind me how beautiful life can be when we appreciate the small things.',
      tags: ['joy', 'happiness', 'positive', 'gratitude', 'celebration']
    },
    sad: {
      title: 'A Reflective Moment',
      content: 'Sometimes we need moments of sadness to appreciate the good times. This was one of those reflective days where I learned something important about myself and discovered inner strength I didn\'t know I had.',
      tags: ['reflection', 'growth', 'emotions', 'learning', 'resilience']
    },
    excited: {
      title: 'An Adventure Begins',
      content: 'The anticipation and excitement were incredible! This experience filled me with energy and enthusiasm, making me feel alive and ready for whatever amazing things come next in my journey.',
      tags: ['adventure', 'excitement', 'anticipation', 'energy', 'milestone']
    },
    loved: {
      title: 'Surrounded by Love',
      content: 'This memory is all about the incredible people in my life and the love we share. It reminds me how blessed I am to have such wonderful relationships and connections that make life meaningful.',
      tags: ['love', 'family', 'friends', 'connection', 'gratitude']
    },
    frustrated: {
      title: 'Overcoming Challenges',
      content: 'While this experience was frustrating at the time, it taught me valuable lessons about perseverance and resilience. Looking back, I can see how it helped me grow stronger and more determined.',
      tags: ['challenge', 'growth', 'perseverance', 'learning', 'strength']
    }
  };
  
  return moodTemplates[mood.toLowerCase()] || moodTemplates.happy;
}
