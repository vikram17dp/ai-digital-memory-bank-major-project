import AWS from 'aws-sdk';
import { Textract } from 'aws-sdk';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

const s3 = new AWS.S3();
const textract = new AWS.Textract();

/**
 * Upload file to AWS S3 bucket
 */
export async function uploadToS3(file: File, userId: string): Promise<string> {
  try {
    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `memories/${userId}/${uuidv4()}.${fileExtension}`;
    
    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Optimize image if it's an image file
    let processedBuffer = buffer;
    if (file.type.startsWith('image/')) {
      processedBuffer = await optimizeImage(buffer);
    }
    
    // Upload to S3
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: fileName,
      Body: processedBuffer,
      ContentType: file.type,
      // ACL: 'public-read' as AWS.S3.ObjectCannedACL
    };
    
    const result = await s3.upload(uploadParams).promise();
    return result.Location;
    
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error('Failed to upload file to S3');
  }
}

/**
 * Optimize image for web using Sharp
 */
async function optimizeImage(buffer: Buffer): Promise<Buffer> {
  try {
    return await sharp(buffer)
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({
        quality: 85,
        progressive: true
      })
      .toBuffer();
  } catch (error) {
    console.error('Image optimization error:', error);
    return buffer; // Return original if optimization fails
  }
}

/**
 * Extract text from image using AWS Textract
 */
export async function extractTextFromImage(file: File): Promise<string> {
  try {
    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Use Textract to detect text
    const params = {
      Document: {
        Bytes: buffer
      },
      FeatureTypes: ['TABLES', 'FORMS']
    };
    
    const result = await textract.analyzeDocument(params).promise();
    
    if (!result.Blocks) {
      return '';
    }
    
    // Extract text from blocks
    const textBlocks = result.Blocks
      .filter(block => block.BlockType === 'LINE')
      .map(block => block.Text)
      .filter(text => text && text.trim().length > 0);
    
    return textBlocks.join(' ');
    
  } catch (error) {
    console.error('Textract error:', error);
    
    // Fallback to basic OCR using alternative method
    try {
      return await extractTextFallback(file);
    } catch (fallbackError) {
      console.error('OCR fallback error:', fallbackError);
      return '';
    }
  }
}

/**
 * Fallback text extraction method
 */
async function extractTextFallback(file: File): Promise<string> {
  // This is a placeholder for alternative OCR methods
  // You could integrate with Tesseract.js or another OCR service here
  
  // For now, we'll return empty string and rely on manual input
  return '';
}

/**
 * Delete file from S3
 */
export async function deleteFromS3(fileUrl: string): Promise<boolean> {
  try {
    // Extract key from URL
    const url = new URL(fileUrl);
    const key = url.pathname.substring(1); // Remove leading slash
    
    const deleteParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key
    };
    
    await s3.deleteObject(deleteParams).promise();
    return true;
    
  } catch (error) {
    console.error('S3 delete error:', error);
    return false;
  }
}

/**
 * Generate signed URL for private file access
 */
export async function generateSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
      Expires: expiresIn
    };
    
    return s3.getSignedUrl('getObject', params);
    
  } catch (error) {
    console.error('Signed URL generation error:', error);
    throw new Error('Failed to generate signed URL');
  }
}

/**
 * Check if file exists in S3
 */
export async function fileExistsInS3(key: string): Promise<boolean> {
  try {
    await s3.headObject({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key
    }).promise();
    
    return true;
  } catch (error) {
    return false;
  }
}
