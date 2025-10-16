# AWS S3 Integration & CRUD Operations Setup Guide

## Overview

This implementation adds full CRUD (Create, Read, Update, Delete) functionality for memories with AWS S3 integration for image storage.

## Features Implemented

✅ **AWS S3 Image Storage**
- Images are uploaded to S3 before saving memory
- S3 URLs are stored in the database (not the actual image files)
- Automatic deletion of S3 images when memory is deleted

✅ **Create Memory**
- Upload multiple images to S3
- Store S3 URLs in database
- AI-powered content extraction

✅ **Read Memories**
- Fetch all memories from database
- Display images from S3 URLs
- Enhanced memory cards with image previews

✅ **Update Memory**
- Edit memory details
- Add new images to existing memories
- Update tags, location, people, etc.

✅ **Delete Memory**
- Delete memory from database
- Automatically delete associated S3 images
- Confirmation dialog before deletion

## Setup Instructions

### 1. AWS S3 Configuration

#### Create an S3 Bucket:
1. Go to AWS S3 Console
2. Click "Create bucket"
3. Choose a unique bucket name (e.g., `ai-memory-bank-images`)
4. Select your preferred region
5. **Important:** Uncheck "Block all public access" if you want public image URLs
6. Enable bucket versioning (optional but recommended)
7. Create the bucket

#### Configure Bucket Policy:
Add this policy to make images publicly readable:

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

#### Configure CORS (if accessing from browser):
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

### 2. AWS IAM User Setup

1. Go to AWS IAM Console
2. Create a new user (e.g., `ai-memory-bank-s3-user`)
3. Select "Programmatic access"
4. Attach the policy `AmazonS3FullAccess` or create a custom policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::YOUR_BUCKET_NAME",
        "arn:aws:s3:::YOUR_BUCKET_NAME/*"
      ]
    }
  ]
}
```

5. Save the **Access Key ID** and **Secret Access Key**

### 3. Environment Variables

Add these to your `.env.local` file:

```bash
# AWS S3 Configuration
AWS_REGION=us-east-1  # Your bucket region
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_S3_BUCKET_NAME=your_bucket_name
```

### 4. Install Dependencies

The required packages are already installed:
```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

## File Structure

```
├── lib/
│   └── s3.ts                           # S3 utility functions
├── app/
│   └── api/
│       ├── upload/
│       │   └── route.ts                # Image upload endpoint
│       └── memory/
│           ├── [id]/
│           │   └── route.ts            # GET, PUT, DELETE memory by ID
│           └── process/
│               └── route.ts            # Create new memory
├── components/
│   ├── memory-card.tsx                 # Memory card with edit/delete
│   ├── edit-memory-dialog.tsx          # Edit memory modal
│   ├── add-memory-form.tsx             # Create memory form
│   └── dashboard-content-new.tsx       # Dashboard with CRUD integration
```

## API Endpoints

### Upload Images
**POST** `/api/upload`
- Upload multiple images to S3
- Returns array of S3 URLs

```typescript
// Request: FormData with files
// Response: { success: true, urls: string[], message: string }
```

### Create Memory
**POST** `/api/memory/process`
- Creates a new memory with S3 image URLs

```typescript
// Request: FormData with memory data + imageUrls
// Response: { success: true, memory: Memory, message: string }
```

### Get Memory
**GET** `/api/memory/[id]`
- Fetch a specific memory

```typescript
// Response: { memory: Memory }
```

### Update Memory
**PUT** `/api/memory/[id]`
- Update memory details

```typescript
// Request: JSON with updated memory data
// Response: { success: true, memory: Memory, message: string }
```

### Delete Memory
**DELETE** `/api/memory/[id]`
- Delete memory and associated S3 images

```typescript
// Response: { success: true, message: string }
```

## Usage Examples

### Create Memory with Images

```typescript
// 1. Upload images first
const formData = new FormData()
images.forEach(img => formData.append('files', img))

const uploadRes = await fetch('/api/upload', {
  method: 'POST',
  body: formData
})
const { urls } = await uploadRes.json()

// 2. Create memory with S3 URLs
const memoryData = new FormData()
memoryData.append('title', 'My Memory')
memoryData.append('content', 'Description')
memoryData.append('imageUrls', JSON.stringify(urls))

await fetch('/api/memory/process', {
  method: 'POST',
  body: memoryData
})
```

### Edit Memory

```typescript
// Use EditMemoryDialog component
<EditMemoryDialog
  memory={selectedMemory}
  open={isOpen}
  onOpenChange={setIsOpen}
  onSuccess={() => router.refresh()}
/>
```

### Delete Memory

```typescript
const handleDelete = async (memoryId: string) => {
  await fetch(`/api/memory/${memoryId}`, {
    method: 'DELETE'
  })
  router.refresh()
}
```

## Testing

1. **Create a memory:**
   - Go to "Add Memory" section
   - Upload images
   - Fill in details
   - Save memory
   - Verify images are in S3 bucket

2. **Edit a memory:**
   - Click on a memory card
   - Click edit button (three dots → Edit Memory)
   - Modify details
   - Add new images
   - Save changes

3. **Delete a memory:**
   - Click on a memory card
   - Click delete button (three dots → Delete Memory)
   - Confirm deletion
   - Verify memory and images are deleted

## Cost Considerations

- **S3 Storage:** ~$0.023 per GB per month
- **S3 Requests:** PUT/POST ~$0.005 per 1,000 requests
- **Data Transfer:** First 100 GB/month free, then ~$0.09/GB

For a typical app with 1000 memories (100MB images each):
- Storage: ~$2.30/month
- Requests: Negligible
- Total: ~$2-3/month

## Troubleshooting

### Images not loading
- Check S3 bucket policy allows public access
- Verify CORS configuration
- Check AWS credentials are correct

### Upload failing
- Verify AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
- Check IAM user has S3 permissions
- Ensure bucket name is correct

### Delete not working
- Check S3 DeleteObject permission
- Verify image URLs are formatted correctly

## Security Best Practices

1. ✅ Use IAM user with minimal permissions (not root account)
2. ✅ Store AWS credentials in environment variables (never in code)
3. ✅ Enable bucket versioning for backup
4. ✅ Use HTTPS for all S3 URLs
5. ✅ Implement request rate limiting on upload endpoint
6. ✅ Validate file types and sizes on both client and server

## Next Steps

- [ ] Add image compression before upload
- [ ] Implement CDN (CloudFront) for faster delivery
- [ ] Add bulk operations (delete multiple memories)
- [ ] Implement image optimization/thumbnails
- [ ] Add download memory functionality
- [ ] Implement memory export/import

## Support

For issues or questions:
1. Check AWS S3 documentation
2. Review error logs in browser console
3. Verify environment variables are set correctly
4. Check AWS CloudWatch logs
