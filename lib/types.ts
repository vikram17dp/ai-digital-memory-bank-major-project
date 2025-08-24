export interface Memory {
  id: string
  title: string
  content: string
  tags: string[]
  sentiment: "positive" | "negative" | "neutral"
  createdAt: Date
  updatedAt: Date
  userId: string
  embedding?: number[]
  aiAnalysis?: {
    confidence: number
    emotions: { emotion: string; score: number }[]
    summary: string
    topics: string[]
  }
  attachments?: {
    id: string
    name: string
    type: string
    size: number
    url: string
    analysis?: string
  }[]
}

export interface MemoryStats {
  totalMemories: number
  positiveMemories: number
  negativeMemories: number
  neutralMemories: number
  recentMemories: number
}

export interface CreateMemoryRequest {
  title: string
  content: string
  tags: string[]
}

export interface UpdateMemoryRequest {
  id: string
  title?: string
  content?: string
  tags?: string[]
}
