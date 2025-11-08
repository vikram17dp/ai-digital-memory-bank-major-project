import validator from 'validator';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface MemoryData {
  title: string;
  content: string;
  tags: string[];
  mood: {
    label: string;
    score: number;
  };
  imageUrl?: string;
}

/**
 * Sanitize user input to prevent XSS and other security issues
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Server-side sanitization without DOM dependency
  let sanitized = input
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove script tags and content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove javascript: URLs
    .replace(/javascript:/gi, '')
    // Remove event handlers
    .replace(/on\w+\s*=/gi, '')
    // Remove data URLs
    .replace(/data:/gi, '')
    .trim();

  // Normalize whitespace
  sanitized = sanitized.replace(/\s+/g, ' ');

  return sanitized;
}

/**
 * Validate memory data structure and content
 */
export function validateMemoryData(data: MemoryData): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate title
  if (!data.title || typeof data.title !== 'string') {
    errors.push('Title is required and must be a string');
  } else {
    const sanitizedTitle = sanitizeInput(data.title);
    if (sanitizedTitle.length < 1) {
      errors.push('Title cannot be empty after sanitization');
    } else if (sanitizedTitle.length > 200) {
      errors.push('Title must be 200 characters or less');
    }
    
    if (containsProfanity(sanitizedTitle)) {
      warnings.push('Title may contain inappropriate content');
    }
  }

  // Validate content
  if (!data.content || typeof data.content !== 'string') {
    errors.push('Content is required and must be a string');
  } else {
    const sanitizedContent = sanitizeInput(data.content);
    if (sanitizedContent.length < 1) {
      errors.push('Content cannot be empty after sanitization');
    } else if (sanitizedContent.length > 5000) {
      errors.push('Content must be 5000 characters or less');
    }
    
    if (containsProfanity(sanitizedContent)) {
      warnings.push('Content may contain inappropriate language');
    }
  }

  // Validate tags
  if (!Array.isArray(data.tags)) {
    errors.push('Tags must be an array');
  } else {
    if (data.tags.length > 20) {
      errors.push('Maximum 20 tags allowed');
    }
    
    data.tags.forEach((tag, index) => {
      if (typeof tag !== 'string') {
        errors.push(`Tag at index ${index} must be a string`);
      } else {
        const sanitizedTag = sanitizeInput(tag);
        if (sanitizedTag.length === 0) {
          warnings.push(`Empty tag found at index ${index}`);
        } else if (sanitizedTag.length > 50) {
          errors.push(`Tag at index ${index} must be 50 characters or less`);
        }
      }
    });
  }

  // Validate mood
  if (!data.mood || typeof data.mood !== 'object') {
    errors.push('Mood is required and must be an object');
  } else {
    if (!data.mood.label || typeof data.mood.label !== 'string') {
      errors.push('Mood label is required and must be a string');
    } else {
      const validMoods = ['Positive', 'Negative', 'Neutral'];
      if (!validMoods.includes(data.mood.label)) {
        errors.push('Mood label must be one of: Positive, Negative, Neutral');
      }
    }
    
    if (typeof data.mood.score !== 'number') {
      errors.push('Mood score must be a number');
    } else if (data.mood.score < 0 || data.mood.score > 1) {
      errors.push('Mood score must be between 0 and 1');
    }
  }

  // Validate image URL if provided
  if (data.imageUrl) {
    if (typeof data.imageUrl !== 'string') {
      errors.push('Image URL must be a string');
    } else if (!isValidUrl(data.imageUrl)) {
      errors.push('Image URL must be a valid URL');
    } else if (!isImageUrl(data.imageUrl)) {
      warnings.push('Image URL does not appear to be an image file');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate file upload
 */
export function validateFileUpload(file: File): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    errors.push('File size must be less than 5MB');
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    errors.push('Only JPEG, PNG, GIF, and WebP images are allowed');
  }

  // Check filename
  if (file.name.length > 255) {
    errors.push('Filename must be less than 255 characters');
  }

  // Check for potentially dangerous filenames
  const dangerousPatterns = [
    /\.\./,
    /[<>:"/\\|?*]/,
    /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i
  ];

  if (dangerousPatterns.some(pattern => pattern.test(file.name))) {
    errors.push('Filename contains invalid characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Sanitize tags array
 */
export function sanitizeTags(tags: string[]): string[] {
  if (!Array.isArray(tags)) {
    return [];
  }

  return tags
    .map(tag => sanitizeInput(tag))
    .filter(tag => tag.length > 0 && tag.length <= 50)
    .map(tag => tag.toLowerCase().replace(/[^a-z0-9\-_]/g, ''))
    .filter(tag => tag.length > 0)
    .slice(0, 20); // Limit to 20 tags
}

/**
 * Check if text contains profanity (basic implementation)
 */
function containsProfanity(text: string): boolean {
  // This is a basic implementation. In production, you would use a more
  // sophisticated profanity filter or service
  const profanityList = [
    // Add common profanity words here
    'badword1', 'badword2' // placeholder
  ];

  const lowercaseText = text.toLowerCase();
  return profanityList.some(word => lowercaseText.includes(word));
}

/**
 * Check if string is a valid URL
 */
function isValidUrl(url: string): boolean {
  try {
    return validator.isURL(url, {
      protocols: ['http', 'https'],
      require_protocol: true,
      require_valid_protocol: true,
      allow_underscores: false,
      allow_trailing_dot: false,
      allow_protocol_relative_urls: false
    });
  } catch {
    return false;
  }
}

/**
 * Check if URL appears to be an image
 */
function isImageUrl(url: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
  const lowercaseUrl = url.toLowerCase();
  
  // Check for common image extensions
  if (imageExtensions.some(ext => lowercaseUrl.includes(ext))) {
    return true;
  }

  // Check for common image hosting domains
  const imageHosts = ['imgur.com', 'flickr.com', 'amazonaws.com', 'cloudinary.com'];
  return imageHosts.some(host => lowercaseUrl.includes(host));
}

/**
 * Rate limit validation for API requests
 */
export function validateRateLimit(userRequests: number, timeWindow: number = 3600): boolean {
  const maxRequests = 100; // 100 requests per hour
  return userRequests < maxRequests;
}

/**
 * Validate user permissions for memory operations
 */
export function validateUserPermissions(userId: string, memoryOwnerId: string): boolean {
  // Basic ownership check
  return userId === memoryOwnerId;
}

/**
 * Clean and validate generated AI content
 */
export function validateGeneratedContent(content: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for common AI generation artifacts
  const aiArtifacts = [
    /\[INST\]/gi,
    /\[\/INST\]/gi,
    /<\|.*?\|>/gi,
    /Human:/gi,
    /Assistant:/gi,
    /I'm an AI/gi,
    /As an AI/gi
  ];

  aiArtifacts.forEach(pattern => {
    if (pattern.test(content)) {
      warnings.push('Content may contain AI generation artifacts');
    }
  });

  // Check for repetitive content
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const uniqueSentences = new Set(sentences.map(s => s.trim().toLowerCase()));
  
  if (sentences.length > 3 && uniqueSentences.size / sentences.length < 0.7) {
    warnings.push('Content may be repetitive');
  }

  // Check minimum quality
  if (content.trim().length < 10) {
    errors.push('Generated content too short');
  }

  if (content.trim().length > 2000) {
    warnings.push('Generated content may be too long');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
