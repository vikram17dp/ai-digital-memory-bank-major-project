import { HfInference } from '@huggingface/inference';

// Initialize Hugging Face client
const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);

// Model configurations
const SENTIMENT_MODEL = 'distilbert-base-uncased-finetuned-sst-2-english';
const TEXT_GENERATION_MODEL = 'microsoft/DialoGPT-medium';
const SUMMARIZATION_MODEL = 'facebook/bart-large-cnn';

export interface SentimentResult {
  label: 'Positive' | 'Negative' | 'Neutral';
  score: number;
}

/**
 * Analyze sentiment using Hugging Face DistilBERT model
 */
export async function analyzeSentimentHuggingFace(text: string): Promise<SentimentResult> {
  try {
    if (!text.trim()) {
      return { label: 'Neutral', score: 0.5 };
    }

    const result = await hf.textClassification({
      model: SENTIMENT_MODEL,
      inputs: text
    });

    // DistilBERT returns POSITIVE/NEGATIVE, map to our format
    const prediction = Array.isArray(result) ? result[0] : result;
    
    let label: 'Positive' | 'Negative' | 'Neutral' = 'Neutral';
    let score = prediction.score;

    if (prediction.label === 'POSITIVE') {
      label = 'Positive';
    } else if (prediction.label === 'NEGATIVE') {
      label = 'Negative';
    } else {
      // Handle edge cases or neutral predictions
      label = score > 0.6 ? 'Positive' : score < 0.4 ? 'Negative' : 'Neutral';
    }

    return { label, score };

  } catch (error) {
    console.error('Hugging Face sentiment analysis error:', error);
    
    // Fallback to basic keyword-based sentiment
    return fallbackSentimentAnalysis(text);
  }
}

/**
 * Generate expanded content from a title
 */
export async function expandMemoryContent(title: string): Promise<string> {
  try {
    if (!title.trim()) {
      return '';
    }

    // Create a prompt for content expansion
    const prompt = `Write a detailed personal memory about: "${title}". Include emotions, setting, people involved, and what made it special. Keep it personal and authentic.`;

    const result = await hf.textGeneration({
      model: TEXT_GENERATION_MODEL,
      inputs: prompt,
      parameters: {
        max_new_tokens: 200,
        temperature: 0.7,
        do_sample: true,
        top_p: 0.9
      }
    });

    // Clean up the generated text
    let content = result.generated_text || '';
    content = content.replace(prompt, '').trim();
    content = cleanGeneratedText(content);

    return content || generateFallbackContent(title);

  } catch (error) {
    console.error('Hugging Face content generation error:', error);
    return generateFallbackContent(title);
  }
}

/**
 * Generate tags from content using text analysis
 */
export async function generateTagsFromContent(text: string): Promise<string[]> {
  try {
    if (!text.trim()) {
      return [];
    }

    // Use summarization to extract key concepts
    const summary = await hf.summarization({
      model: SUMMARIZATION_MODEL,
      inputs: text,
      parameters: {
        max_length: 50,
        min_length: 10
      }
    });

    const summaryText = summary.summary_text || text;
    
    // Extract potential tags from summary and original text
    const tags = extractTagsFromText(summaryText + ' ' + text);
    
    return tags.slice(0, 8); // Limit to 8 tags

  } catch (error) {
    console.error('Hugging Face tag generation error:', error);
    return extractTagsFromText(text);
  }
}

/**
 * Generate content suggestions from mood
 */
export async function generateContentFromMood(mood: string): Promise<{ title: string; content: string; tags: string[] }> {
  try {
    const prompt = `Write a personal memory that would make someone feel ${mood}. Include a title, detailed description, and relevant tags.`;

    const result = await hf.textGeneration({
      model: TEXT_GENERATION_MODEL,
      inputs: prompt,
      parameters: {
        max_new_tokens: 250,
        temperature: 0.8,
        do_sample: true
      }
    });

    const generated = result.generated_text || '';
    
    // Parse the generated content
    const lines = generated.split('\n').filter(line => line.trim());
    const title = lines[0]?.replace(/^Title:\s*/i, '').trim() || `A ${mood} Memory`;
    const content = lines.slice(1).join(' ').replace(/^(Content|Description):\s*/i, '').trim();
    const tags = generateTagsFromMood(mood);

    return {
      title: cleanGeneratedText(title),
      content: cleanGeneratedText(content) || generateFallbackContentFromMood(mood),
      tags
    };

  } catch (error) {
    console.error('Hugging Face mood content generation error:', error);
    return generateFallbackContentFromMood(mood);
  }
}

/**
 * Fallback sentiment analysis using keywords
 */
function fallbackSentimentAnalysis(text: string): SentimentResult {
  const positiveWords = ['happy', 'joy', 'love', 'excited', 'amazing', 'wonderful', 'great', 'fantastic', 'perfect', 'beautiful'];
  const negativeWords = ['sad', 'angry', 'frustrated', 'terrible', 'awful', 'bad', 'hate', 'disappointed', 'worried', 'upset'];
  
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
    return { label: 'Positive', score: 0.7 + (positiveRatio - 0.6) * 0.3 };
  } else if (positiveRatio < 0.4) {
    return { label: 'Negative', score: 0.7 + (0.4 - positiveRatio) * 0.3 };
  } else {
    return { label: 'Neutral', score: 0.5 };
  }
}

/**
 * Extract tags from text using NLP techniques
 */
function extractTagsFromText(text: string): string[] {
  const commonTags = [
    'family', 'friends', 'work', 'travel', 'food', 'music', 'nature', 'celebration',
    'achievement', 'learning', 'hobby', 'health', 'love', 'birthday', 'wedding',
    'graduation', 'vacation', 'weekend', 'holiday', 'milestone', 'success', 'adventure'
  ];
  
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const foundTags = commonTags.filter(tag => 
    words.some(word => word.includes(tag) || tag.includes(word))
  );
  
  // Add extracted nouns as potential tags
  const capitalizedWords = text.match(/\b[A-Z][a-z]+\b/g) || [];
  const additionalTags = capitalizedWords
    .map(word => word.toLowerCase())
    .filter(word => word.length > 3 && !commonTags.includes(word))
    .slice(0, 3);
  
  return [...foundTags, ...additionalTags].slice(0, 8);
}

/**
 * Generate fallback content from title
 */
function generateFallbackContent(title: string): string {
  const templates = [
    `This memory about "${title}" holds a special place in my heart. It reminds me of the importance of cherishing these moments and the people who make them meaningful.`,
    `Looking back at "${title}", I'm filled with gratitude for the experience. It taught me valuable lessons and created lasting memories that I'll treasure forever.`,
    `"${title}" was more than just an event - it was a moment that shaped who I am today. The emotions and experiences from that time continue to influence my perspective.`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * Generate tags based on mood
 */
function generateTagsFromMood(mood: string): string[] {
  const moodTagMap: { [key: string]: string[] } = {
    happy: ['joy', 'celebration', 'positive', 'smile', 'laughter'],
    sad: ['reflection', 'emotions', 'growth', 'healing', 'support'],
    excited: ['adventure', 'achievement', 'anticipation', 'energy', 'milestone'],
    loved: ['family', 'friends', 'affection', 'gratitude', 'connection'],
    frustrated: ['challenge', 'learning', 'perseverance', 'growth', 'resilience'],
    neutral: ['daily-life', 'routine', 'peaceful', 'calm', 'ordinary']
  };
  
  return moodTagMap[mood.toLowerCase()] || ['memory', 'personal', 'experience'];
}

/**
 * Generate fallback content from mood
 */
function generateFallbackContentFromMood(mood: string): { title: string; content: string; tags: string[] } {
  const moodTemplates: { [key: string]: { title: string; content: string } } = {
    happy: {
      title: 'A Joyful Moment',
      content: 'Today brought such happiness and joy into my life. The simple pleasures and positive energy around me made everything feel bright and wonderful. These are the moments that remind me how beautiful life can be.'
    },
    sad: {
      title: 'A Moment of Reflection',
      content: 'Sometimes we need moments of sadness to appreciate the good times. Today was one of those reflective days where I learned something important about myself and life.'
    },
    excited: {
      title: 'An Exciting Adventure',
      content: 'The anticipation and excitement were incredible! This experience filled me with energy and enthusiasm, making me feel alive and ready for whatever comes next.'
    }
  };
  
  const template = moodTemplates[mood.toLowerCase()] || moodTemplates.happy;
  
  return {
    ...template,
    tags: generateTagsFromMood(mood)
  };
}

/**
 * Clean generated text from AI models
 */
function cleanGeneratedText(text: string): string {
  return text
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/[<>]/g, '')
    .trim();
}
