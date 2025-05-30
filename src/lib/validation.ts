
import DOMPurify from 'dompurify';
import { z } from 'zod';

// Input validation schemas
export const boardNameSchema = z.string()
  .min(1, 'Board name is required')
  .max(100, 'Board name must be less than 100 characters')
  .regex(/^[a-zA-Z0-9\s\-_.,!?]+$/, 'Board name contains invalid characters');

export const boardDescriptionSchema = z.string()
  .max(500, 'Description must be less than 500 characters')
  .optional();

export const noteContentSchema = z.string()
  .max(10000, 'Note content must be less than 10,000 characters');

export const widgetContentSchema = z.string()
  .max(50000, 'Widget content must be less than 50,000 characters');

// Content sanitization
export const sanitizeHtml = (content: string): string => {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href'],
    ALLOW_DATA_ATTR: false
  });
};

// Board name sanitization (no HTML allowed)
export const sanitizePlainText = (text: string): string => {
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
};

// Validate and sanitize board input
export const validateAndSanitizeBoardInput = (name: string, description?: string) => {
  const validatedName = boardNameSchema.parse(name);
  const validatedDescription = description ? boardDescriptionSchema.parse(description) : undefined;
  
  return {
    name: sanitizePlainText(validatedName),
    description: validatedDescription ? sanitizePlainText(validatedDescription) : undefined
  };
};

// Validate and sanitize note/widget content
export const validateAndSanitizeContent = (content: string, isWidget = false) => {
  const schema = isWidget ? widgetContentSchema : noteContentSchema;
  const validatedContent = schema.parse(content);
  return sanitizeHtml(validatedContent);
};
