
import { validateAndSanitizeContent } from './validation';
import { ClientRateLimit, logSecurityEvent } from './secureErrorHandling';

// Content creation rate limiting
const contentRateLimit = new ClientRateLimit(10, 60000); // 10 actions per minute

// Suspicious content detection
const suspiciousPatterns = [
  /javascript:/i,
  /data:.*base64/i,
  /<script[^>]*>/i,
  /on\w+\s*=/i,
  /eval\s*\(/i,
  /document\.cookie/i,
  /localStorage/i,
  /sessionStorage/i,
];

export const validateContentSecurity = (content: string, userId?: string): { isValid: boolean; error?: string } => {
  // Rate limiting check
  const rateLimitKey = userId || 'anonymous';
  if (!contentRateLimit.canAttempt(rateLimitKey)) {
    const remainingTime = contentRateLimit.getRemainingTime(rateLimitKey);
    logSecurityEvent('rate_limit_exceeded', { userId, remainingTime });
    return {
      isValid: false,
      error: `Too many requests. Please wait ${remainingTime} seconds before trying again.`
    };
  }

  // Check for suspicious content
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(content)) {
      logSecurityEvent('suspicious_content_detected', { 
        userId, 
        pattern: pattern.source,
        contentLength: content.length 
      });
      return {
        isValid: false,
        error: 'Content contains potentially unsafe elements. Please review and try again.'
      };
    }
  }

  // Content length validation
  if (content.length > 50000) {
    logSecurityEvent('content_too_large', { userId, contentLength: content.length });
    return {
      isValid: false,
      error: 'Content is too large. Please reduce the size and try again.'
    };
  }

  // Additional security checks for URLs
  if (content.includes('http')) {
    const urlMatches = content.match(/https?:\/\/[^\s]+/g);
    if (urlMatches) {
      for (const url of urlMatches) {
        try {
          const urlObj = new URL(url);
          // Block non-HTTPS URLs (except localhost for development)
          if (urlObj.protocol !== 'https:' && !urlObj.hostname.includes('localhost')) {
            logSecurityEvent('insecure_url_detected', { userId, url });
            return {
              isValid: false,
              error: 'Only HTTPS URLs are allowed for security reasons.'
            };
          }
        } catch (error) {
          logSecurityEvent('invalid_url_detected', { userId, url });
          return {
            isValid: false,
            error: 'Invalid URL detected. Please check your links.'
          };
        }
      }
    }
  }

  return { isValid: true };
};

export const secureContentValidation = (content: string, isWidget: boolean = false, userId?: string) => {
  // First check security constraints
  const securityCheck = validateContentSecurity(content, userId);
  if (!securityCheck.isValid) {
    throw new Error(securityCheck.error);
  }

  // Then apply standard validation and sanitization
  return validateAndSanitizeContent(content, isWidget);
};
