# 🚀 Quick Start - Image Upload Feature

## Minimal Setup (5 minutes)

### 1. Create `.env.local` file

```env
# Database (get from Neon/Supabase)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Clerk (get from clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# AWS S3 (create in AWS Console)
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=my-bucket-name

# Optional: AI Image Analysis
OPENAI_API_KEY=sk-...
```

### 2. Run Database Migration

```bash
npm run db:push
```

### 3. Start Development

```bash
npm run dev
```

### 4. Test It!

1. Go to http://localhost:3000
2. Sign in
3. Click "Add Memory"
4. Upload an image
5. Fill in details
6. Save!

## AWS S3 Setup (2 minutes)

### Create Bucket
```bash
1. AWS Console → S3 → Create bucket
2. Name: my-memory-bank-images
3. Region: us-east-1
4. Uncheck "Block all public access"
5. Create bucket
```

### Add Bucket Policy
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
  }]
}
```

### Create IAM User
```bash
1. IAM → Users → Add users
2. Name: memory-bank-uploader
3. Access type: Programmatic access
4. Permissions: AmazonS3FullAccess
5. Save Access Keys
```

## Troubleshooting

**Upload fails?**
- Check AWS credentials
- Verify bucket exists
- Check bucket permissions

**AI analysis not working?**
- Add OPENAI_API_KEY to .env.local
- Or it's optional - manual mode works fine!

**Database errors?**
- Run: `npm run db:push`

## That's it! 🎉

Your memory bank now saves images to S3 and stores URLs in the database.

For detailed docs, see `SETUP_GUIDE.md`

