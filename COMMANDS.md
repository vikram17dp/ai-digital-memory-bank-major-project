# 🔧 Command Reference - Quick Commands

## Development Commands

### Database Operations
```bash
# Push schema changes to database (use this after updating schema)
npm run db:push

# Open Prisma Studio to view database
npm run db:studio

# Generate Prisma client after schema changes
npm run db:generate
```

### Development Server
```bash
# Start development server
npm run dev

# Start on different port
PORT=3001 npm run dev
```

### Production
```bash
# Build for production
npm run build

# Start production server
npm run start

# Build and start
npm run build && npm run start
```

### Linting
```bash
# Run ESLint
npm run lint

# Fix linting issues
npm run lint -- --fix
```

## AWS CLI Commands (Optional)

### S3 Operations
```bash
# List all buckets
aws s3 ls

# List contents of your bucket
aws s3 ls s3://your-bucket-name/

# List user's uploaded images
aws s3 ls s3://your-bucket-name/memories/user_xxxxx/

# Check bucket policy
aws s3api get-bucket-policy --bucket your-bucket-name

# Set bucket to public read
aws s3api put-bucket-policy --bucket your-bucket-name --policy file://bucket-policy.json
```

### IAM Operations
```bash
# List IAM users
aws iam list-users

# Get user details
aws iam get-user --user-name memory-bank-uploader

# List user's access keys
aws iam list-access-keys --user-name memory-bank-uploader
```

## Database Commands (PostgreSQL)

### Using psql
```bash
# Connect to database
psql $DATABASE_URL

# List all tables
\dt

# Describe Memory table
\d "Memory"

# View recent memories
SELECT id, title, "imageUrl", "createdAt" FROM "Memory" ORDER BY "createdAt" DESC LIMIT 10;

# Count memories with images
SELECT COUNT(*) FROM "Memory" WHERE "imageUrl" IS NOT NULL;

# View all image URLs
SELECT id, title, "imageUrl", images FROM "Memory" WHERE "imageUrl" IS NOT NULL;
```

## Git Commands

### Before Committing
```bash
# Check status
git status

# Stage changes (excluding .env.local)
git add .

# Verify .env.local is not staged
git status

# Commit
git commit -m "feat: add image upload with S3 integration"

# Push
git push origin main
```

### Important: Never commit .env.local
```bash
# If accidentally staged, unstage it
git reset .env.local

# Add to .gitignore if not already there
echo ".env.local" >> .gitignore
```

## Testing Commands

### Manual Testing
```bash
# 1. Start dev server
npm run dev

# 2. In another terminal, push database changes
npm run db:push

# 3. Open browser
open http://localhost:3000
```

### Check Logs
```bash
# View Next.js logs in terminal where `npm run dev` is running

# View database logs (if using Neon, check their dashboard)

# View AWS CloudWatch logs (AWS Console)
```

## Troubleshooting Commands

### Reset Database
```bash
# BE CAREFUL - This deletes all data!
# Push schema (creates tables if they don't exist)
npm run db:push

# Or use Prisma migrate reset (deletes all data and reseeds)
npx prisma migrate reset
```

### Clear Node Modules
```bash
# If having dependency issues
rm -rf node_modules
rm package-lock.json
npm install
```

### Rebuild Prisma Client
```bash
# If Prisma types are outdated
npx prisma generate
```

### Check Environment Variables
```bash
# On Unix/Mac
cat .env.local

# On Windows PowerShell
Get-Content .env.local

# Check if specific var is set
echo $AWS_ACCESS_KEY_ID  # Unix/Mac
echo $env:AWS_ACCESS_KEY_ID  # Windows PowerShell
```

## Quick Setup Script

Save this as `setup.sh` for quick setup:

```bash
#!/bin/bash

echo "🚀 Setting up AI Memory Bank..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local not found!"
    echo "📝 Please create .env.local with your credentials"
    echo "See ENV_SETUP.md for details"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Push database schema
echo "🗄️ Updating database schema..."
npm run db:push

# Generate Prisma client
echo "⚙️ Generating Prisma client..."
npm run db:generate

echo "✅ Setup complete!"
echo "🎉 Run 'npm run dev' to start the development server"
```

Make it executable:
```bash
chmod +x setup.sh
./setup.sh
```

## Quick Test Script

Save this as `test-upload.sh`:

```bash
#!/bin/bash

echo "🧪 Testing image upload feature..."

# Check if server is running
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "❌ Development server not running!"
    echo "Run 'npm run dev' first"
    exit 1
fi

echo "✅ Server is running"

# Check if .env.local has AWS credentials
if ! grep -q "AWS_ACCESS_KEY_ID" .env.local; then
    echo "❌ AWS credentials not found in .env.local"
    exit 1
fi

echo "✅ AWS credentials configured"

echo "🎉 Ready to test!"
echo "1. Go to http://localhost:3000"
echo "2. Sign in"
echo "3. Click 'Add Memory'"
echo "4. Upload an image"
echo "5. Check S3 bucket and database"
```

## Environment Variable Commands

### Load from .env.local (Unix/Mac)
```bash
export $(cat .env.local | xargs)
```

### Load from .env.local (Windows PowerShell)
```powershell
Get-Content .env.local | ForEach-Object {
    if ($_ -match "^([^=]+)=(.*)$") {
        [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2])
    }
}
```

### Verify Variables Loaded
```bash
# Check specific variable
echo $AWS_S3_BUCKET_NAME

# Check all AWS variables
env | grep AWS
```

## Package Management

### Install Specific Versions
```bash
# If you need specific versions
npm install aws-sdk@2.1692.0
npm install sharp@0.34.3
npm install uuid@11.1.0
```

### Update Dependencies
```bash
# Update all to latest (be careful!)
npm update

# Update specific package
npm update aws-sdk
```

## Useful One-Liners

### Count total memories
```bash
psql $DATABASE_URL -c 'SELECT COUNT(*) FROM "Memory";'
```

### Count memories with images
```bash
psql $DATABASE_URL -c 'SELECT COUNT(*) FROM "Memory" WHERE "imageUrl" IS NOT NULL;'
```

### Find largest images in S3
```bash
aws s3 ls s3://your-bucket-name/memories/ --recursive --human-readable --summarize | sort -h
```

### Calculate total S3 storage used
```bash
aws s3 ls s3://your-bucket-name/memories/ --recursive --summarize
```

## Monitoring Commands

### Watch logs in real-time
```bash
# Next.js logs
npm run dev | tee logs.txt

# Database logs (if using local PostgreSQL)
tail -f /var/log/postgresql/postgresql-*.log
```

### Check API endpoint
```bash
# Test if API is responding
curl -X GET http://localhost:3000/api/health

# Test memory creation (requires auth token)
curl -X POST http://localhost:3000/api/memory/process \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Test Memory" \
  -F "content=Test content" \
  -F "mood=happy" \
  -F "image_0=@test-image.jpg"
```

## Emergency Commands

### If everything breaks
```bash
# 1. Stop dev server (Ctrl+C)

# 2. Clear everything
rm -rf node_modules .next

# 3. Reinstall
npm install

# 4. Regenerate Prisma
npx prisma generate

# 5. Push schema
npm run db:push

# 6. Restart
npm run dev
```

### If database is corrupted
```bash
# Reset database (DELETES ALL DATA!)
npx prisma migrate reset

# Or just push schema again
npm run db:push
```

### If S3 uploads fail
```bash
# Test AWS credentials
aws sts get-caller-identity

# Test S3 access
aws s3 ls s3://your-bucket-name/

# Upload test file
echo "test" > test.txt
aws s3 cp test.txt s3://your-bucket-name/test.txt
aws s3 rm s3://your-bucket-name/test.txt
rm test.txt
```

---

## Cheat Sheet Summary

```bash
# Essential Commands
npm run dev              # Start development
npm run db:push          # Update database schema
npm run build            # Build for production
npm run db:studio        # View database in browser

# AWS
aws s3 ls s3://bucket/   # List S3 files
aws sts get-caller-identity  # Verify AWS credentials

# Database
psql $DATABASE_URL       # Connect to database
\dt                      # List tables
SELECT * FROM "Memory";  # Query memories

# Git
git status               # Check changes
git add .                # Stage changes
git commit -m "message"  # Commit
git push                 # Push to remote
```

---

**Need more help?** See the other documentation files:
- `QUICK_START.md` - Fast setup
- `SETUP_GUIDE.md` - Detailed instructions
- `ENV_SETUP.md` - Environment variables
- `IMAGE_UPLOAD_FEATURE.md` - Technical docs

