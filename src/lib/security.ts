
import DOMPurify from 'dompurify';
import { z } from 'zod';

// Content sanitization
export const sanitizeHtml = (content: string): string => {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'span'],
    ALLOWED_ATTR: [],
    REMOVE_DATA_ATTR: true,
  });
};

export const sanitizeText = (text: string): string => {
  return text.replace(/<[^>]*>/g, '').trim();
};

// Validation schemas
export const noteContentSchema = z.string()
  .min(1, 'Note content cannot be empty')
  .max(5000, 'Note content cannot exceed 5000 characters')
  .transform(sanitizeHtml);

export const usernameSchema = z.string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username cannot exceed 30 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens');

export const boardNameSchema = z.string()
  .min(1, 'Board name cannot be empty')
  .max(100, 'Board name cannot exceed 100 characters')
  .transform(sanitizeText);

export const boardDescriptionSchema = z.string()
  .max(500, 'Board description cannot exceed 500 characters')
  .transform(sanitizeText)
  .optional();

export const plantNameSchema = z.string()
  .min(1, 'Plant name cannot be empty')
  .max(100, 'Plant name cannot exceed 100 characters')
  .transform(sanitizeText);

export const locationSchema = z.string()
  .min(1, 'Location cannot be empty')
  .max(100, 'Location cannot exceed 100 characters')
  .transform(sanitizeText);

// File validation
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file size (10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { isValid: false, error: 'File size cannot exceed 10MB' };
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Only JPEG, PNG, GIF, and WebP images are allowed' };
  }

  // Check file extension
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const fileName = file.name.toLowerCase();
  const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
  
  if (!hasValidExtension) {
    return { isValid: false, error: 'Invalid file extension' };
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
        // Only allow https URLs
        return urlObj.protocol === 'https:';
      } catch {
        return false;
      }
    },
    'Only HTTPS URLs are allowed'
  );
