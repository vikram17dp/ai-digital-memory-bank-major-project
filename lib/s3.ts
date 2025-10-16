import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || '';

/**
 * Upload buffer to S3 with proper typing
 * @param buffer - File buffer to upload
 * @param fileName - Original file name
 * @param contentType - MIME type of the file
 * @returns Public URL of the uploaded file
 */
export async function uploadToS3(
  buffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  try {
    if (!BUCKET_NAME) {
      throw new Error('AWS_S3_BUCKET_NAME is not configured');
    }

    // Generate unique filename
    const fileExtension = fileName.split('.').pop() || 'jpg';
    const uniqueFileName = `memories/${uuidv4()}.${fileExtension}`;

    // Optimize image if it's an image file
    let processedBuffer = buffer;
    if (contentType.startsWith('image/')) {
      try {
        processedBuffer = await sharp(buffer)
          .resize(1920, 1920, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .jpeg({
            quality: 85,
            progressive: true,
          })
          .toBuffer();
      } catch (optimizeError) {
        console.warn('Image optimization failed, using original:', optimizeError);
        processedBuffer = buffer;
      }
    }

    // Upload to S3
    const uploadCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: uniqueFileName,
      Body: processedBuffer,
      ContentType: contentType,
      // Make the file publicly readable
      // ACL: 'public-read', // Uncomment if your bucket allows ACLs
    });

    await s3Client.send(uploadCommand);

    // Return public URL
    const publicUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${uniqueFileName}`;
    
    console.log(`File uploaded successfully to: ${publicUrl}`);
    return publicUrl;
    
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error('Failed to upload file to S3');
  }
}

/**
 * Delete file from S3 by URL
 * @param fileUrl - Full URL of the file to delete
 * @returns Success status
 */
export async function deleteFromS3(fileUrl: string): Promise<boolean> {
  try {
    if (!BUCKET_NAME) {
      throw new Error('AWS_S3_BUCKET_NAME is not configured');
    }

    // Extract key from URL
    let key: string;
    
    try {
      const url = new URL(fileUrl);
      // Remove leading slash from pathname
      key = url.pathname.substring(1);
    } catch (urlError) {
      // If URL parsing fails, assume it's already a key
      key = fileUrl;
    }

    if (!key) {
      console.warn('Invalid file URL or key provided for deletion');
      return false;
    }

    // Delete from S3
    const deleteCommand = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(deleteCommand);
    
    console.log(`File deleted successfully from S3: ${key}`);
    return true;
    
  } catch (error) {
    console.error('S3 delete error:', error);
    return false;
  }
}

/**
 * Delete multiple files from S3
 * @param fileUrls - Array of file URLs to delete
 * @returns Number of successfully deleted files
 */
export async function deleteMultipleFromS3(fileUrls: string[]): Promise<number> {
  let successCount = 0;
  
  for (const url of fileUrls) {
    const success = await deleteFromS3(url);
    if (success) successCount++;
  }
  
  return successCount;
}
