# Environment Variables Setup Guide

Create a `.env.local` file in the root of your project with the following variables:

## Required Configuration

### Database Configuration
Get your connection string from your PostgreSQL provider (Neon, Supabase, etc.)
```
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
DIRECT_URL="postgresql://username:password@host:port/database?sslmode=require"
```

### Clerk Authentication
Get these from https://dashboard.clerk.com/
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### AWS S3 Configuration (Required for Image Upload)
Get these from AWS IAM Console
```
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your_s3_bucket_name
```

**AWS S3 Setup Instructions:**
1. Log in to AWS Console
2. Create an S3 bucket (e.g., `my-memory-bank-images`)
3. Set bucket permissions to allow public read access for images
4. Create an IAM user with S3 permissions
5. Generate access keys for the IAM user
6. Add the credentials to your `.env.local` file

## Optional Configuration

### AI Vision APIs (At least one recommended for AI image analysis)

**OpenAI API (Recommended for best results)**
```
OPENAI_API_KEY=sk-your_openai_api_key_here
```
Get from: https://platform.openai.com/api-keys

**OR Google Gemini API**
```
GEMINI_API_KEY=your_gemini_api_key_here
```
Get from: https://makersuite.google.com/app/apikey

**OR Google Cloud Vision API**
```
GOOGLE_VISION_API_KEY=your_google_vision_api_key_here
```
Get from: https://console.cloud.google.com/

### Hugging Face API (Optional - for sentiment analysis)
```
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
```
Get from: https://huggingface.co/settings/tokens

### Pinecone Vector Database (Optional - for semantic search)
```
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX_NAME=your_index_name
```
Get from: https://www.pinecone.io/

### ML Backend (Optional - if you have a custom ML service)
```
ML_BACKEND_URL=http://localhost:8000
```

### Next.js Configuration
```
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## After Setting Up Environment Variables

1. Run database migrations:
```bash
npm run db:push
```

2. Start the development server:
```bash
npm run dev
```

## Troubleshooting

- If S3 uploads fail, check your AWS credentials and bucket permissions
- If AI image analysis doesn't work, make sure at least one Vision API key is configured
- For database connection issues, verify your DATABASE_URL is correct

