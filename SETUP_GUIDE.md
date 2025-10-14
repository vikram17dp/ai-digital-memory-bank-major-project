    xx# AI Memory Bank - Image Upload Setup Guide

This guide will help you set up the image upload feature with AWS S3 integration.

## 🎯 Features Implemented

✅ Image upload to AWS S3
✅ Multiple image support (up to 5 images per memory)
✅ Image optimization and compression
✅ Database storage of image URLs
✅ AI-powered image analysis (optional)
✅ Manual and AI-assisted memory creation

## 📋 Prerequisites

1. Node.js 18+ installed
2. AWS Account with S3 access
3. PostgreSQL database (Neon, Supabase, etc.)
4. Clerk account for authentication
5. (Optional) OpenAI/Gemini API key for AI image analysis

## 🚀 Setup Instructions

### Step 1: Database Setup

1. Update your database schema:
```bash
npm run db:push
```

This will add the new image-related fields to your Memory table:
- `title` - Memory title
- `location` - Location information
- `people` - People involved
- `imageUrl` - Primary image URL
- `images` - Array of all image URLs
- `sentiment` - AI-detected sentiment
- `isPrivate` - Privacy flag
- `isFavorite` - Favorite flag

### Step 2: AWS S3 Configuration

#### 2.1 Create S3 Bucket

1. Log in to [AWS Console](https://console.aws.amazon.com/)
2. Navigate to S3 service
3. Click "Create bucket"
4. Choose a unique bucket name (e.g., `my-memory-bank-images-prod`)
5. Select your preferred region
6. **Block Public Access settings:**
   - Uncheck "Block all public access"
   - Acknowledge the warning (we need public read for images)
7. Enable versioning (optional but recommended)
8. Click "Create bucket"

#### 2.2 Configure Bucket Permissions

Add this bucket policy (replace `YOUR_BUCKET_NAME`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
    }
  ]
}
```

#### 2.3 Create IAM User

1. Navigate to IAM service in AWS Console
2. Click "Users" → "Add users"
3. Username: `memory-bank-s3-uploader`
4. Select "Access key - Programmatic access"
5. Click "Next: Permissions"
6. Click "Attach existing policies directly"
7. Search and select: `AmazonS3FullAccess`
8. Click through to "Create user"
9. **IMPORTANT:** Save your Access Key ID and Secret Access Key

### Step 3: Environment Variables

Create a `.env.local` file in your project root:

```env
# Database
DATABASE_URL="your_postgresql_connection_string"
DIRECT_URL="your_postgresql_connection_string"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# AWS S3 (REQUIRED for image uploads)
AWS_ACCESS_KEY_ID=your_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your_bucket_name_here

# AI Vision API (Optional - for AI image analysis)
OPENAI_API_KEY=sk-xxxxx

# OR use Google Gemini
# GEMINI_API_KEY=xxxxx

# OR use Google Cloud Vision
# GOOGLE_VISION_API_KEY=xxxxx
```

See `ENV_SETUP.md` for detailed environment variable documentation.

### Step 4: Install Dependencies

Make sure all dependencies are installed:

```bash
npm install
```

Key dependencies for this feature:
- `aws-sdk` - AWS S3 integration
- `sharp` - Image optimization
- `uuid` - Unique filename generation

### Step 5: Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## 🧪 Testing the Image Upload Feature

### Manual Testing Steps

1. **Sign in to your application**
   - Go to http://localhost:3000
   - Sign in with Clerk

2. **Navigate to Add Memory**
   - Click on "Add Memory" in the sidebar
   - Or go to the dashboard and click "Add Memory"

3. **Test Manual Entry Mode**
   - Fill in the title and content
   - Select a mood
   - Add tags
   - Go to Step 3
   - Upload 1-5 images (JPG, PNG, GIF, WebP)
   - Click "Save Memory"

4. **Test AI Upload Mode**
   - Switch to "AI Upload" mode
   - Upload a single image
   - Wait for AI analysis (if API key is configured)
   - Review and edit the extracted details
   - Continue to next steps
   - Click "Save Memory"

### Expected Behavior

✅ **Successful Upload:**
- Toast notification: "Image uploaded successfully"
- Image preview appears
- Images are uploaded to S3
- Memory is saved to database
- Toast notification: "Memory saved successfully"
- Redirect to memories list

❌ **Common Issues:**

1. **"Failed to upload to S3"**
   - Check AWS credentials in `.env.local`
   - Verify S3 bucket exists
   - Check bucket permissions

2. **"Unauthorized"**
   - Make sure you're signed in
   - Check Clerk configuration

3. **"File too large"**
   - Images must be under 5MB
   - Use image compression tools

4. **"AI analysis failed"**
   - Normal if no API key is configured
   - Check OpenAI/Gemini API key
   - Check API key quotas/limits

### Verify in AWS Console

1. Go to S3 Console
2. Open your bucket
3. Navigate to `memories/{userId}/`
4. You should see uploaded images with UUID filenames

### Verify in Database

```sql
SELECT id, title, "imageUrl", images, "createdAt" 
FROM "Memory" 
ORDER BY "createdAt" DESC 
LIMIT 5;
```

You should see:
- `imageUrl` - URL of the first image
- `images` - Array of all image URLs

## 📝 API Endpoints

### POST /api/memory/process

Processes and saves a memory with images.

**Request:**
- Content-Type: `multipart/form-data`
- Fields:
  - `title` (required)
  - `content` (required)
  - `mood` (required)
  - `date`
  - `location`
  - `people`
  - `tags` (JSON string)
  - `isPrivate`
  - `isFavorite`
  - `image_0`, `image_1`, etc. (File objects)

**Response:**
```json
{
  "success": true,
  "memory": {
    "id": "clxxxx",
    "title": "My Memory",
    "content": "...",
    "imageUrl": "https://bucket.s3.region.amazonaws.com/...",
    "images": ["https://..."],
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Memory saved successfully!"
}
```

### POST /api/memory/extract

Analyzes an image using AI vision APIs.

**Request:**
- Content-Type: `multipart/form-data`
- Fields:
  - `image` (File)

**Response:**
```json
{
  "success": true,
  "data": {
    "title": "...",
    "content": "...",
    "mood": "happy",
    "tags": ["..."],
    "location": "...",
    "people": "...",
    "confidence": 0.85
  }
}
```

## 🔧 Troubleshooting

### S3 Upload Errors

**Error: "Access Denied"**
```
Solution: 
1. Verify IAM user has S3 permissions
2. Check bucket policy allows uploads
3. Verify AWS credentials are correct
```

**Error: "Bucket does not exist"**
```
Solution:
1. Check bucket name in .env.local
2. Verify bucket exists in correct region
3. Ensure no typos in bucket name
```

### Image Processing Errors

**Error: "Sharp module not found"**
```bash
npm install sharp --save
npm rebuild sharp
```

**Error: "Invalid image format"**
```
Solution:
Only JPG, PNG, GIF, and WebP are supported.
Convert your image to a supported format.
```

### Database Errors

**Error: "Column does not exist"**
```bash
# Run database migration
npm run db:push
```

## 📊 Performance Optimization

### Image Optimization

The system automatically:
- Resizes large images (max 1200x1200)
- Compresses to 85% JPEG quality
- Progressive JPEG encoding

### Upload Limits

- Max file size: 5MB per image
- Max images per memory: 5
- Supported formats: JPG, PNG, GIF, WebP

## 🔐 Security Best Practices

1. **Never commit `.env.local`** to version control
2. **Use IAM roles** with minimum required permissions
3. **Enable S3 versioning** for backup
4. **Regular security audits** of bucket policies
5. **Monitor S3 access logs**

## 📈 Next Steps

- [ ] Set up CloudFront CDN for faster image delivery
- [ ] Add image editing features
- [ ] Implement lazy loading for images
- [ ] Add image galleries
- [ ] Set up automated backups

## 🆘 Getting Help

If you encounter issues:
1. Check the console for error messages
2. Verify all environment variables are set
3. Check AWS CloudWatch logs
4. Review S3 bucket permissions
5. Open an issue on GitHub with error details

## 🎉 Success!

If everything is working:
- Images upload to S3 ✓
- URLs are stored in database ✓
- Memories display with images ✓
- AI analysis works (if configured) ✓

You now have a fully functional memory bank with image storage! 🚀

