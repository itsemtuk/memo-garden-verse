
import DOMPurify from 'dompurify';
import { z } from 'zod';

// Consolidated validation schemas
export const boardNameSchema = z.string()
  .min(1, 'Board name is required')
  .max(100, 'Board name must be less than 100 characters')
  .regex(/^[a-zA-Z0-9\s\-_.,!?]+$/, 'Board name contains invalid characters');

export const boardDescriptionSchema = z.string()
  .max(500, 'Description must be less than 500 characters')
  .optional();

export const usernameSchema = z.string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username cannot exceed 30 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens');

export const noteContentSchema = z.string()
  .min(1, 'Note content cannot be empty')
  .max(10000, 'Note content must be less than 10,000 characters');

export const widgetContentSchema = z.string()
  .max(50000, 'Widget content must be less than 50,000 characters');

export const locationSchema = z.string()
  .min(1, 'Location cannot be empty')
  .max(100, 'Location cannot exceed 100 characters');

export const plantNameSchema = z.string()
  .min(1, 'Plant name cannot be empty')
  .max(100, 'Plant name cannot exceed 100 characters');

// Enhanced content sanitization
export const sanitizeHtml = (content: string): string => {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'span', 'u'],
    ALLOWED_ATTR: ['href'],
    ALLOW_DATA_ATTR: false,
    FORBID_ATTR: ['onclick', 'onerror', 'onload', 'style'],
    FORBID_TAGS: ['script', 'object', 'embed', 'iframe', 'form']
  });
};

export const sanitizePlainText = (text: string): string => {
  return DOMPurify.sanitize(text, { 
    ALLOWED_TAGS: [], 
    ALLOWED_ATTR: [],
    FORBID_ATTR: ['data-*']
  });
};

// File validation with enhanced security
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { isValid: false, error: 'File size cannot exceed 5MB' };
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Only JPEG, PNG, GIF, and WebP images are allowed' };
  }

  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const fileName = file.name.toLowerCase();
  const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
  
  if (!hasValidExtension) {
    return { isValid: false, error: 'Invalid file extension' };
  }

  // Check for suspicious filenames
  if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
    return { isValid: false, error: 'Invalid filename detected' };
  }

  // Check minimum file size (prevent empty files)
  if (file.size < 100) {
    return { isValid: false, error: 'File appears to be corrupted or empty' };
  }

  return { isValid: true };
};

// URL validation for image URLs
export const imageUrlSchema = z.string()
  .url('Please enter a valid URL')
  .refine(
    (url) => {
      try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'https:';
      } catch {
        return false;
      }
    },
    'Only HTTPS URLs are allowed'
  );

// Consolidated validation functions
export const validateAndSanitizeBoardInput = (name: string, description?: string) => {
  const validatedName = boardNameSchema.parse(name);
  const validatedDescription = description ? boardDescriptionSchema.parse(description) : undefined;
  
  return {
    name: sanitizePlainText(validatedName),
    description: validatedDescription ? sanitizePlainText(validatedDescription) : undefined
  };
};

export const validateAndSanitizeContent = (content: string, isWidget = false) => {
  const schema = isWidget ? widgetContentSchema : noteContentSchema;
  const validatedContent = schema.parse(content);
  return sanitizeHtml(validatedContent);
};

export const validateAndSanitizeUsername = (username: string) => {
  const validatedUsername = usernameSchema.parse(username);
  return sanitizePlainText(validatedUsername);
};
