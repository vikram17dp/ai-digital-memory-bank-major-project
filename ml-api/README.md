# AI Memory Bank ML Service

This FastAPI service provides machine learning capabilities for the AI Memory Bank application, including sentiment analysis, semantic search, and AI-powered chat responses.

## Features

- **Memory Analysis**: Sentiment analysis and automatic tag extraction
- **Semantic Search**: Vector-based search using sentence transformers and Pinecone
- **AI Chat**: Intelligent responses based on memory context
- **Vector Storage**: Pinecone integration for high-performance similarity search

## Setup

### Local Development

1. Create a virtual environment:
\`\`\`bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
\`\`\`

2. Install dependencies:
\`\`\`bash
pip install -r requirements.txt
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env
# Edit .env with your API keys
\`\`\`

4. Start the service:
\`\`\`bash
chmod +x start.sh
./start.sh
\`\`\`

Or manually:
\`\`\`bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
\`\`\`

### Docker Deployment

\`\`\`bash
docker-compose up --build
\`\`\`

## API Endpoints

### POST /analyze
Analyze memory content for sentiment and tags.

### POST /search
Perform semantic search on memories.

### POST /chat
Generate AI responses based on memory context.

### GET /health
Health check endpoint.

## Environment Variables

- `PINECONE_API_KEY`: Your Pinecone API key (required)
- `PINECONE_INDEX_NAME`: Pinecone index name (default: memory-embeddings)
- `OPENAI_API_KEY`: OpenAI API key (optional, for enhanced responses)

## Testing

Run the test script:
\`\`\`bash
python test_api.py
\`\`\`

## Models Used

- **Sentence Transformers**: all-MiniLM-L6-v2 for embeddings
- **TextBlob**: For sentiment analysis
- **Pinecone**: Vector database for semantic search
