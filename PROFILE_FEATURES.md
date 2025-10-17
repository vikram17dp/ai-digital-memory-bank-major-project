# Dynamic Profile Features - Implementation Guide

## Overview
The profile page is now fully dynamic with complete image upload capabilities (avatar and background), real-time data fetching from the backend, and comprehensive user profile management.

## Features Implemented

### 1. Image Upload System ✅
- **Profile Image (Avatar)**
  - Click camera icon on avatar to upload
  - Supports: JPEG, PNG, WebP, GIF
  - Max size: 5MB
  - Instant preview after upload
  - Stored in AWS S3
  
- **Background Image**
  - Hover over background to see upload button
  - Same file type and size restrictions
  - Dynamic background replacement
  - Stored in AWS S3

### 2. Dynamic Profile Data ✅
- Fetches user profile from `/api/user/profile`
- Real-time statistics:
  - Total Memories count
  - Days Active calculation
  - Positive Memories percentage
  - Current streak
- Recent activity timeline
- Join date from database

### 3. Profile Editing ✅
- Edit mode with form validation
- Editable fields:
  - Bio (text area)
  - Location
  - Website
  - Phone
  - Timezone
- Save/Cancel buttons with loading states
- Toast notifications for feedback

### 4. User Experience Features ✅
- Loading states during data fetch
- Upload progress indicators
- Error handling with user-friendly messages
- Email visibility toggle
- Copy-to-clipboard for phone number
- Responsive design for all screen sizes

## API Endpoints

### GET `/api/user/profile`
Fetches complete user profile data including:
- Profile information (bio, location, website, phone, timezone)
- Profile and background image URLs
- Statistics (memories count, days active, streak, etc.)
- Recent activities
- Join date

**Response:**
```json
{
  "success": true,
  "profile": {
    "email": "user@example.com",
    "bio": "...",
    "location": "...",
    "website": "...",
    "phone": "...",
    "timezone": "...",
    "profileImage": "https://s3.amazonaws.com/...",
    "backgroundImage": "https://s3.amazonaws.com/...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "statistics": {
    "totalMemories": 127,
    "daysActive": 89,
    "positivePercentage": "94%",
    "streak": 23
  },
  "activities": [...]
}
```

### PUT `/api/user/profile`
Updates user profile information.

**Request Body:**
```json
{
  "email": "user@example.com",
  "bio": "Updated bio",
  "location": "San Francisco, CA",
  "website": "https://example.com",
  "phone": "+1 (555) 123-4567",
  "timezone": "UTC-8 (PST)"
}
```

### POST `/api/user/upload-image`
Uploads profile or background images to S3.

**Request:** FormData
- `file`: Image file (max 5MB)
- `type`: "profile" | "background"

**Response:**
```json
{
  "success": true,
  "imageUrl": "https://s3.amazonaws.com/...",
  "message": "Profile image uploaded successfully"
}
```

## Database Schema

### UserProfile Model
```prisma
model UserProfile {
  id              String   @id @default(cuid())
  email           String   @unique
  bio             String?
  location        String?
  website         String?
  phone           String?
  timezone        String?
  profileImage    String?
  backgroundImage String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@map("UserProfile")
}
```

## File Structure

```
app/
├── api/
│   └── user/
│       ├── profile/
│       │   └── route.ts        # Profile CRUD operations
│       └── upload-image/
│           └── route.ts        # Image upload handler

components/
└── profile-content.tsx         # Main profile component

prisma/
└── schema.prisma              # Database schema with UserProfile model

lib/
└── s3.ts                      # S3 upload utilities
```

## Usage Instructions

### For Users:

1. **View Profile:**
   - Navigate to Profile section from sidebar
   - All data loads automatically

2. **Upload Profile Picture:**
   - Click camera icon on avatar
   - Select image (JPEG, PNG, WebP, GIF - max 5MB)
   - Image uploads and displays immediately

3. **Upload Background Image:**
   - Hover over background header
   - Click camera icon that appears
   - Select and upload image

4. **Edit Profile:**
   - Click "Edit Profile" button
   - Modify any fields
   - Click "Save" to update or "Cancel" to discard

5. **View Statistics:**
   - Real-time stats displayed on right sidebar
   - Total memories, days active, streak, etc.

6. **Check Recent Activity:**
   - Scroll to activity section
   - See chronological list of recent actions

### For Developers:

1. **Database Migration:**
   ```bash
   npx prisma db push
   ```

2. **Environment Variables Required:**
   ```env
   DATABASE_URL="postgresql://..."
   DIRECT_URL="postgresql://..."
   AWS_ACCESS_KEY_ID="..."
   AWS_SECRET_ACCESS_KEY="..."
   AWS_REGION="..."
   AWS_S3_BUCKET_NAME="..."
   ```

3. **Testing Checklist:**
   - [ ] Profile data loads correctly
   - [ ] Avatar upload works
   - [ ] Background upload works
   - [ ] Profile edit and save works
   - [ ] Statistics display correctly
   - [ ] Activities load properly
   - [ ] All toast notifications appear
   - [ ] Loading states work
   - [ ] Error handling works
   - [ ] Responsive on mobile

## Security Features

1. **Authentication:** 
   - All endpoints require Clerk authentication
   - User ID verified on every request

2. **File Validation:**
   - File type checking (images only)
   - File size limits (5MB max)
   - Secure filename generation

3. **Database Security:**
   - Email-based user identification
   - Upsert operations to prevent duplicates
   - Proper indexing for performance

4. **S3 Security:**
   - Unique filenames with timestamps
   - Proper content-type headers
   - ACL set to public-read for accessibility

## Performance Optimizations

1. **Lazy Loading:**
   - Profile data fetched only when needed
   - Images loaded on demand

2. **State Management:**
   - Local state for form data
   - Optimistic UI updates for images

3. **Error Recovery:**
   - Graceful degradation if API fails
   - Retry mechanisms for failed uploads

## Troubleshooting

### Profile Not Loading
- Check database connection
- Verify Clerk authentication
- Check browser console for errors

### Image Upload Fails
- Verify AWS credentials
- Check S3 bucket permissions
- Ensure file size < 5MB
- Confirm file type is image

### Statistics Not Updating
- Verify memories exist in database
- Check userId in memories table
- Refresh page to reload data

## Future Enhancements

- [ ] Image cropping before upload
- [ ] Multiple profile themes
- [ ] Achievement badges
- [ ] Social profile links
- [ ] Privacy settings per field
- [ ] Profile completeness indicator
- [ ] Profile sharing functionality
- [ ] Custom background templates

## Notes

- All image URLs from S3 are publicly accessible
- Images are stored with format: `{type}-{email}-{timestamp}.{ext}`
- Profile updates trigger `updatedAt` timestamp
- Statistics are calculated in real-time on each request
- Activities are limited to most recent 4 items

---

**Last Updated:** 2025-01-16
**Version:** 2.0
**Status:** ✅ Production Ready
