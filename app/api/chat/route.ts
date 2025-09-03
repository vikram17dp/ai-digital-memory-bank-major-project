// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

// API Key cycling configuration
const API_KEYS = [
  process.env.SARVAM_API_KEY_1,
  process.env.SARVAM_API_KEY_2,
  process.env.SARVAM_API_KEY_3,
].filter(Boolean); // Remove undefined/null keys

const SARVAM_API_URL = 'https://api.sarvam.ai/v1/chat/completions';

if (API_KEYS.length === 0) {
  throw new Error('Please define at least one SARVAM_API_KEY environment variable in .env.local');
}

// Cycle queue class for managing API key rotation
class ApiKeyCycleQueue {
  private keys: string[];
  private currentIndex: number = 0;
  private errorCount: number = 0;
  private maxRetries: number = 3;

  constructor(keys: string[]) {
    this.keys = keys;
  }

  getCurrentKey(): string {
    return this.keys[this.currentIndex];
  }

  switchToNext(): void {
    this.currentIndex = (this.currentIndex + 1) % this.keys.length;
    this.errorCount++;
    console.log(`Switched to API key index: ${this.currentIndex}, Error count: ${this.errorCount}`);
  }

  hasRetriesLeft(): boolean {
    return this.errorCount < this.maxRetries;
  }

  reset(): void {
    this.currentIndex = 0;
    this.errorCount = 0;
  }

  getStatus(): { currentIndex: number; errorCount: number; totalKeys: number } {
    return {
      currentIndex: this.currentIndex,
      errorCount: this.errorCount,
      totalKeys: this.keys.length,
    };
  }
}

interface Memory {
  id: string;
  content: string;
  date: Date;
  mood: 'positive' | 'neutral' | 'negative';
  tags: string[];
}

interface CreateMemoryAction {
  action: 'create_memory';
  content: string;
  tags: string[];
  mood: 'positive' | 'neutral' | 'negative';
}

async function makeApiRequest(
  apiKeyCycle: ApiKeyCycleQueue,
  systemPrompt: string,
  message: string
): Promise<any> {
  while (apiKeyCycle.hasRetriesLeft()) {
    const currentKey = apiKeyCycle.getCurrentKey();
    console.log(`Attempting API call with key index: ${apiKeyCycle.getStatus().currentIndex}`);

    try {
      const response = await fetch(SARVAM_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-subscription-key': currentKey,
        },
        body: JSON.stringify({
          model: 'sarvam-m',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message },
          ],
          temperature: 0.7,
          max_tokens: 1000,
          stream: false,
        }),
      });

      if (response.ok) {
        // Reset cycle on successful request
        apiKeyCycle.reset();
        return await response.json();
      }

      // Log the error and try next key
      const errorText = await response.text();
      console.error(`API error with key ${apiKeyCycle.getStatus().currentIndex}: ${response.status} - ${errorText}`);
      
      // Switch to next key if we have retries left
      if (apiKeyCycle.hasRetriesLeft()) {
        apiKeyCycle.switchToNext();
        continue;
      } else {
        throw new Error(`All API keys failed. Last error: ${response.status} - ${errorText}`);
      }
    } catch (networkError) {
      console.error(`Network error with key ${apiKeyCycle.getStatus().currentIndex}:`, networkError);
      
      // Switch to next key if we have retries left
      if (apiKeyCycle.hasRetriesLeft()) {
        apiKeyCycle.switchToNext();
        continue;
      } else {
        throw networkError;
      }
    }
  }

  throw new Error('Exhausted all retry attempts with all API keys');
}

export async function POST(request: NextRequest) {
  try {
    // Await auth() to get userId
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message } = await request.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required and must be a string' }, { status: 400 });
    }

    // Fetch user's memories
    let memories: Memory[] = [];
    try {
      const memoryRecords = await prisma.memory.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 50,
        select: { id: true, content: true, date: true, mood: true, tags: true },
      });
      memories = memoryRecords.map((memory) => ({
        id: memory.id,
        content: memory.content,
        date: memory.date,
        mood: memory.mood as 'positive' | 'neutral' | 'negative',
        tags: memory.tags,
      }));
    } catch (error) {
      console.error('Prisma query error:', error);
      // Continue with empty memories if query fails
    }

    const systemPrompt = `You are Memory Bank AI, a personal AI memory assistant named "Memo". Your goal is to help the user manage their personal memories, which are short notes or entries about their life, thoughts, events, or emotions. Greet new users warmly and introduce yourself.

Key capabilities:
- **Search memories**: Query the provided context and return relevant memories with summaries.
- **Create new memories**: Output JSON: {"action": "create_memory", "content": "memory text", "tags": ["tag1", "tag2"], "mood": "positive/neutral/negative"}.
- **Show recent memories**: List the last 5-10 memories, sorted by date.
- **Analyze mood patterns**: Analyze moods from memories and suggest insights.
- **Understand emotional journey**: Summarize emotional changes over time.
- **Answer questions**: Respond factually using the context.
- **General chat**: Steer conversations back to memory features.

Be empathetic, positive, and concise. If no memories, suggest creating one. End responses with a question.

Context: ${JSON.stringify(memories)}`;

    // Initialize API key cycle queue
    const apiKeyCycle = new ApiKeyCycleQueue(API_KEYS);

    // Make API request with cycling
    let sarvamData;
    try {
      sarvamData = await makeApiRequest(apiKeyCycle, systemPrompt, message);
    } catch (error) {
      console.error('All API keys failed:', error);
      const fallbackResponse = memories.length > 0
        ? `I found ${memories.length} memories in your bank, but I'm having trouble connecting to the AI service. All backup services are also unavailable. Please try again later.`
        : `Welcome to Memory Bank! I'm Memo, your AI memory assistant. I'm currently unable to connect to any of my AI services, but please try again soon!`;
      return NextResponse.json({ 
        message: fallbackResponse, 
        action: 'chat_response',
        error: 'All API services unavailable'
      }, { status: 200 });
    }

    const aiResponse = sarvamData.choices?.[0]?.message?.content;

    if (!aiResponse) {
      console.error('No response from Sarvam AI:', sarvamData);
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

    // Try to parse as JSON for memory creation
    try {
      const cleanResponse = aiResponse.replace(/```json\s*|\s*```/g, '');
      const parsedResponse: CreateMemoryAction = JSON.parse(cleanResponse);
      if (parsedResponse.action === 'create_memory') {
        try {
          const newMemory = await prisma.memory.create({
            data: {
              userId,
              content: parsedResponse.content,
              tags: parsedResponse.tags || [],
              mood: parsedResponse.mood || 'neutral',
            },
          });
          return NextResponse.json({
            message: `Memory created successfully! I've saved: "${parsedResponse.content}"`,
            memory: newMemory,
            action: 'memory_created',
          });
        } catch (dbError) {
          console.error('Database error creating memory:', dbError);
          return NextResponse.json({
            message: aiResponse,
            action: 'chat_response',
            error: 'Failed to save memory to database',
          });
        }
      }
    } catch (parseError) {
      console.log('Response is not JSON, treating as chat response:', aiResponse);
    }

    return NextResponse.json({ message: aiResponse, action: 'chat_response' });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}