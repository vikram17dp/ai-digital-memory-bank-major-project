// Client library for communicating with the ML service
const ML_API_URL = process.env.ML_API_URL || "http://localhost:8000"

export interface MemoryAnalysisRequest {
  id: string
  title: string
  content: string
  tags?: string[]
}

export interface MemoryAnalysisResponse {
  id: string
  sentiment: string
  confidence: number
  suggested_tags: string[]
  embedding: number[]
  pinecone_id: string
}

export interface SearchRequest {
  query: string
  user_id: string
  top_k?: number
}

export interface SearchResponse {
  results: Array<{
    memory_id: string
    title: string
    content: string
    tags: string[]
    sentiment: string
    score: number
    timestamp: string
  }>
  query_embedding: number[]
}

export interface ChatRequest {
  message: string
  user_id: string
  context_memories?: Array<{
    id: string
    title: string
    content: string
  }>
}

export interface ChatResponse {
  response: string
  related_memories: Array<{
    id: string
    title: string
    content: string
  }>
}

class MLServiceClient {
  private baseUrl: string

  constructor(baseUrl: string = ML_API_URL) {
    this.baseUrl = baseUrl
  }

  async analyzeMemory(request: MemoryAnalysisRequest): Promise<MemoryAnalysisResponse> {
    const response = await fetch(`${this.baseUrl}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`ML service error: ${response.statusText}`)
    }

    return response.json()
  }

  async searchMemories(request: SearchRequest): Promise<SearchResponse> {
    const response = await fetch(`${this.baseUrl}/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`ML service error: ${response.statusText}`)
    }

    return response.json()
  }

  async chatWithMemories(request: ChatRequest): Promise<ChatResponse> {
    const response = await fetch(`${this.baseUrl}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`ML service error: ${response.statusText}`)
    }

    return response.json()
  }

  async healthCheck(): Promise<{ status: string; models_loaded: boolean; pinecone_connected: boolean }> {
    const response = await fetch(`${this.baseUrl}/health`)

    if (!response.ok) {
      throw new Error(`ML service error: ${response.statusText}`)
    }

    return response.json()
  }
}

export const mlService = new MLServiceClient()
