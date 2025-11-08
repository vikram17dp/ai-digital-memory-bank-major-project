import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Reuse Sarvam AI endpoint for summarization. Falls back to template if unavailable.
const API_KEYS = [
  process.env.SARVAM_API_KEY_1,
  process.env.SARVAM_API_KEY_2,
  process.env.SARVAM_API_KEY_3,
].filter(Boolean) as string[]
const SARVAM_API_URL = 'https://api.sarvam.ai/v1/chat/completions'

class ApiKeyCycleQueue {
  private keys: string[]
  private currentIndex = 0
  private errorCount = 0
  constructor(keys: string[]) { this.keys = keys }
  getCurrentKey() { return this.keys[this.currentIndex] }
  hasRetriesLeft() { return this.errorCount < Math.max(1, this.keys.length) }
  switchToNext() { this.currentIndex = (this.currentIndex + 1) % this.keys.length; this.errorCount++ }
  reset() { this.currentIndex = 0; this.errorCount = 0 }
}

async function callLLM(systemPrompt: string, userMsg: string) {
  if (!API_KEYS.length) return null
  const cycle = new ApiKeyCycleQueue(API_KEYS)
  while (cycle.hasRetriesLeft()) {
    try {
      const res = await fetch(SARVAM_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-subscription-key': cycle.getCurrentKey(),
        },
        body: JSON.stringify({
          model: 'sarvam-m',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMsg },
          ],
          temperature: 0.7,
          max_tokens: 800,
          stream: false,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        return data.choices?.[0]?.message?.content || null
      }
      cycle.switchToNext()
    } catch {
      cycle.switchToNext()
    }
  }
  return null
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, apiData, userId, userName, context } = body || {}

    const name = userName || 'there'
    const systemPrompt = `You are Memo, a warm, personal AI assistant for a user's Memory Vault. 
- Always speak as if you know the user personally (use their name when provided).
- Summarize tersely, friendly, and human-like. Prefer second-person.
- Interpret the data, call out patterns, outliers, and useful next steps.
- End with 1 short follow-up question tailored to the action.
Return plain text only.`

    const userMsg = `Action: ${action}\nUser: ${name} (${userId || 'anonymous'})\nRecent context (last turns): ${JSON.stringify(context || []).slice(0, 2000)}\nRaw data: ${JSON.stringify(apiData).slice(0, 4000)}`

    let message = await callLLM(systemPrompt, userMsg)

    if (!message) {
      // Fallback local templates
      const friendly = (t: string) => `Hey ${name}, ${t}`
      switch (action) {
        case 'search_memories': {
          const count = apiData?.count || apiData?.results?.length || 0
          message = friendly(`I found ${count} matching memories. Want me to filter further or show details of the top ones?`)
          break
        }
        case 'show_recent_memories': {
          const total = apiData?.total ?? apiData?.memories?.length ?? 0
          message = friendly(`here are your latest updates — ${total} recent memories. Should I highlight the most positive ones or group by topic?`)
          break
        }
        case 'analyze_mood': {
          const s = apiData?.sentiments || {}
          message = friendly(`your mood mix looks ${s.positive >= (s.negative||0) ? 'mostly upbeat' : 'a bit mixed'} (pos ${s.positive||0}, neu ${s.neutral||0}, neg ${s.negative||0}). Want trends or suggestions to lift positives?`)
          break
        }
        case 'create_memory': {
          message = friendly(`got it — I’ll take you to create a new memory. Want me to pre-fill with a template?`)
          break
        }
        default:
          message = friendly('here’s what I found. Want to dive deeper?')
      }
    }

    // Provide simple follow-up suggestions per action
    const followUps: string[] = (() => {
      switch (action) {
        case 'search_memories': return ['View details', 'Refine search', 'Filter by mood']
        case 'show_recent_memories': return ['Open most recent', 'Show last 30 days', 'Summarize highlights']
        case 'analyze_mood': return ['Show trends', 'See positive moments', 'Tips to improve mood']
        case 'create_memory': return ['Use template', 'Add mood now', 'Skip to editor']
        default: return ['Tell me more', 'Show examples']
      }
    })()

    return NextResponse.json({ success: true, message, followUps })
  } catch (error: any) {
    console.error('[AI Analyze API] Error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
