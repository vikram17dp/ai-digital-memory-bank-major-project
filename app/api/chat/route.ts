
// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

const SARVAM_API_KEY = process.env.SARVAM_API_KEY_1 || process.env.SARVAM_API_KEY_2 || process.env.SARVAM_API_KEY_3;
const SARVAM_API_URL = 'https://api.sarvam.ai/v1/chat/completions';

if (!SARVAM_API_KEY) {
  throw new Error('Please define the SARVAM_API_KEY environment variable in .env.local');
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

    // Make Sarvam API request
    const sarvamResponse = await fetch(SARVAM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': SARVAM_API_KEY,
      },
      body: JSON.stringify({
        model: 'sarvam-m', // Updated model based on API error
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        temperature: 0.7,
        max_tokens: 1000,
        stream: false,
      }),
    });

    if (!sarvamResponse.ok) {
      const errorText = await sarvamResponse.text();
      console.error(`Sarvam API error: ${sarvamResponse.status} - ${errorText}`);
      const fallbackResponse = memories.length > 0
        ? `I found ${memories.length} memories in your bank, but I'm having trouble connecting to the AI service. Please try again later.`
        : `Welcome to Memory Bank! I'm Memo, your AI memory assistant. I'm currently unable to connect to my AI service, but please try again soon!`;
      return NextResponse.json({ message: fallbackResponse, action: 'chat_response' }, { status: 200 });
    }

    const sarvamData = await sarvamResponse.json();
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


