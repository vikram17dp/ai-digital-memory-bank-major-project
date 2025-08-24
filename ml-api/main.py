from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
import json
import asyncio
from datetime import datetime
import logging

# ML and AI imports
import numpy as np
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone, ServerlessSpec
import openai
from textblob import TextBlob
import re

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="AI Memory Bank ML Service", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for models and services
embedding_model = None
pinecone_client = None
pinecone_index = None

# Pydantic models
class MemoryAnalysisRequest(BaseModel):
    id: str
    title: str
    content: str
    tags: Optional[List[str]] = []

class MemoryAnalysisResponse(BaseModel):
    id: str
    sentiment: str
    confidence: float
    suggested_tags: List[str]
    embedding: List[float]
    pinecone_id: str

class SearchRequest(BaseModel):
    query: str
    user_id: str
    top_k: Optional[int] = 5

class SearchResponse(BaseModel):
    results: List[Dict[str, Any]]
    query_embedding: List[float]

class ChatRequest(BaseModel):
    message: str
    user_id: str
    context_memories: Optional[List[Dict[str, Any]]] = []

class ChatResponse(BaseModel):
    response: str
    related_memories: List[Dict[str, Any]]

@app.on_event("startup")
async def startup_event():
    """Initialize ML models and services on startup"""
    global embedding_model, pinecone_client, pinecone_index
    
    try:
        # Initialize sentence transformer for embeddings
        logger.info("Loading sentence transformer model...")
        embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Initialize Pinecone
        logger.info("Initializing Pinecone...")
        pinecone_api_key = os.getenv("PINECONE_API_KEY")
        pinecone_index_name = os.getenv("PINECONE_INDEX_NAME", "memory-embeddings")
        
        if not pinecone_api_key:
            logger.error("PINECONE_API_KEY not found in environment variables")
            raise ValueError("PINECONE_API_KEY is required")
        
        pinecone_client = Pinecone(api_key=pinecone_api_key)
        
        # Create index if it doesn't exist
        try:
            pinecone_index = pinecone_client.Index(pinecone_index_name)
            logger.info(f"Connected to existing Pinecone index: {pinecone_index_name}")
        except Exception as e:
            logger.info(f"Creating new Pinecone index: {pinecone_index_name}")
            pinecone_client.create_index(
                name=pinecone_index_name,
                dimension=384,  # all-MiniLM-L6-v2 embedding dimension
                metric="cosine",
                spec=ServerlessSpec(cloud="aws", region="us-east-1")
            )
            pinecone_index = pinecone_client.Index(pinecone_index_name)
        
        # Initialize OpenAI (optional, for enhanced responses)
        openai_api_key = os.getenv("OPENAI_API_KEY")
        if openai_api_key:
            openai.api_key = openai_api_key
            logger.info("OpenAI API initialized")
        else:
            logger.warning("OpenAI API key not found - using basic responses")
        
        logger.info("ML service startup completed successfully")
        
    except Exception as e:
        logger.error(f"Error during startup: {str(e)}")
        raise

def analyze_sentiment(text: str) -> tuple[str, float]:
    """Analyze sentiment using TextBlob"""
    try:
        blob = TextBlob(text)
        polarity = blob.sentiment.polarity
        
        if polarity > 0.1:
            sentiment = "positive"
        elif polarity < -0.1:
            sentiment = "negative"
        else:
            sentiment = "neutral"
        
        confidence = abs(polarity)
        return sentiment, confidence
    except Exception as e:
        logger.error(f"Error in sentiment analysis: {str(e)}")
        return "neutral", 0.0

def extract_tags(text: str, existing_tags: List[str] = []) -> List[str]:
    """Extract relevant tags from text content"""
    try:
        # Simple keyword extraction
        text_lower = text.lower()
        
        # Common categories
        tag_patterns = {
            "family": ["family", "mom", "dad", "sister", "brother", "parent", "child", "relative"],
            "work": ["work", "job", "office", "meeting", "project", "colleague", "boss"],
            "travel": ["travel", "trip", "vacation", "flight", "hotel", "beach", "mountain"],
            "food": ["food", "restaurant", "dinner", "lunch", "cooking", "recipe"],
            "friends": ["friend", "buddy", "pal", "hangout", "party"],
            "health": ["doctor", "hospital", "medicine", "exercise", "gym", "health"],
            "education": ["school", "university", "class", "study", "exam", "teacher"],
            "hobby": ["hobby", "music", "art", "reading", "gaming", "sport"],
            "celebration": ["birthday", "anniversary", "wedding", "graduation", "holiday"],
            "achievement": ["success", "win", "accomplish", "achieve", "proud", "award"]
        }
        
        suggested_tags = existing_tags.copy()
        
        for category, keywords in tag_patterns.items():
            if any(keyword in text_lower for keyword in keywords):
                if category not in suggested_tags:
                    suggested_tags.append(category)
        
        # Extract potential proper nouns as tags
        words = re.findall(r'\b[A-Z][a-z]+\b', text)
        for word in words[:3]:  # Limit to 3 proper nouns
            if word.lower() not in suggested_tags and len(word) > 2:
                suggested_tags.append(word.lower())
        
        return suggested_tags[:8]  # Limit to 8 tags
        
    except Exception as e:
        logger.error(f"Error in tag extraction: {str(e)}")
        return existing_tags

@app.post("/analyze", response_model=MemoryAnalysisResponse)
async def analyze_memory(request: MemoryAnalysisRequest):
    """Analyze memory content for sentiment, tags, and generate embeddings"""
    try:
        # Analyze sentiment
        sentiment, confidence = analyze_sentiment(request.content)
        
        # Extract tags
        suggested_tags = extract_tags(f"{request.title} {request.content}", request.tags)
        
        # Generate embedding
        combined_text = f"{request.title} {request.content} {' '.join(suggested_tags)}"
        embedding = embedding_model.encode(combined_text).tolist()
        
        # Store in Pinecone
        pinecone_id = f"memory_{request.id}"
        pinecone_index.upsert([
            {
                "id": pinecone_id,
                "values": embedding,
                "metadata": {
                    "memory_id": request.id,
                    "title": request.title,
                    "content": request.content[:500],  # Truncate for metadata
                    "tags": suggested_tags,
                    "sentiment": sentiment,
                    "timestamp": datetime.now().isoformat()
                }
            }
        ])
        
        return MemoryAnalysisResponse(
            id=request.id,
            sentiment=sentiment,
            confidence=confidence,
            suggested_tags=suggested_tags,
            embedding=embedding,
            pinecone_id=pinecone_id
        )
        
    except Exception as e:
        logger.error(f"Error analyzing memory: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/search", response_model=SearchResponse)
async def semantic_search(request: SearchRequest):
    """Perform semantic search on memories"""
    try:
        # Generate query embedding
        query_embedding = embedding_model.encode(request.query).tolist()
        
        # Search in Pinecone
        search_results = pinecone_index.query(
            vector=query_embedding,
            top_k=request.top_k,
            include_metadata=True,
            filter={"memory_id": {"$exists": True}}  # Basic filter
        )
        
        # Format results
        results = []
        for match in search_results.matches:
            results.append({
                "memory_id": match.metadata.get("memory_id"),
                "title": match.metadata.get("title"),
                "content": match.metadata.get("content"),
                "tags": match.metadata.get("tags", []),
                "sentiment": match.metadata.get("sentiment"),
                "score": float(match.score),
                "timestamp": match.metadata.get("timestamp")
            })
        
        return SearchResponse(
            results=results,
            query_embedding=query_embedding
        )
        
    except Exception as e:
        logger.error(f"Error in semantic search: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@app.post("/chat", response_model=ChatResponse)
async def chat_with_memories(request: ChatRequest):
    """Generate AI response based on user query and memory context"""
    try:
        # First, perform semantic search
        search_request = SearchRequest(
            query=request.message,
            user_id=request.user_id,
            top_k=3
        )
        search_response = await semantic_search(search_request)
        
        # Generate response based on search results
        if not search_response.results:
            response = "I couldn't find any memories related to your query. Try asking about something else or add more memories to your collection!"
            related_memories = []
        else:
            # Create context from search results
            context_memories = search_response.results
            memory_context = "\n".join([
                f"Memory: {mem['title']}\nContent: {mem['content']}\nTags: {', '.join(mem['tags'])}"
                for mem in context_memories[:2]
            ])
            
            # Generate response (basic version without OpenAI)
            if len(context_memories) == 1:
                memory = context_memories[0]
                response = f"I found a relevant memory about '{memory['title']}'. {memory['content'][:200]}{'...' if len(memory['content']) > 200 else ''}"
            else:
                response = f"I found {len(context_memories)} memories related to your query. The most relevant ones are about '{context_memories[0]['title']}' and '{context_memories[1]['title']}'. These memories seem to be related to {', '.join(set([tag for mem in context_memories for tag in mem['tags'][:3]]))}."
            
            related_memories = [
                {
                    "id": mem["memory_id"],
                    "title": mem["title"],
                    "content": mem["content"]
                }
                for mem in context_memories
            ]
        
        return ChatResponse(
            response=response,
            related_memories=related_memories
        )
        
    except Exception as e:
        logger.error(f"Error in chat response: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "models_loaded": embedding_model is not None,
        "pinecone_connected": pinecone_index is not None
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
