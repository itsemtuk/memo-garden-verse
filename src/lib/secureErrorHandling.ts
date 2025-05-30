import { createUserFriendlyError, getErrorMessage } from './errorHandling';

// Enhanced error handling with security considerations
export const handleSecureError = (error: unknown, context: string): string => {
  // Log the actual error for debugging (in development)
  if (process.env.NODE_ENV === 'development') {
    console.error(`Error in ${context}:`, error);
  }

  // For production, provide generic error messages to avoid information disclosure
  if (process.env.NODE_ENV === 'production') {
    // Map specific error types to user-friendly messages
    if (error instanceof Error) {
      if (error.message.includes('duplicate')) {
        return 'This item already exists. Please try a different name.';
      }
      if (error.message.includes('permission')) {
        return 'You do not have permission to perform this action.';
      }
      if (error.message.includes('network')) {
        return 'Network error. Please check your connection and try again.';
      }
      if (error.message.includes('timeout')) {
        return 'Request timed out. Please try again.';
      }
    }
    
    return 'An unexpected error occurred. Please try again or contact support if the problem persists.';
  }

  // In development, show more detailed errors
  return getErrorMessage(error);
};

// Rate limiting helper for client-side
export class ClientRateLimit {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  
  constructor(private maxAttempts: number = 5, private windowMs: number = 60000) {}
  
  canAttempt(key: string): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(key);
    
    if (!attempt || now > attempt.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + this.windowMs });
      return true;
    }
    
    if (attempt.count >= this.maxAttempts) {
      return false;
    }
    
    attempt.count++;
    return true;
  }
  
  getRemainingTime(key: string): number {
    const attempt = this.attempts.get(key);
    if (!attempt) return 0;
    
    const remaining = attempt.resetTime - Date.now();
    return Math.max(0, Math.ceil(remaining / 1000));
  }
}

// Audit logging helper
export const logSecurityEvent = (event: string, details: Record<string, any> = {}) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[SECURITY] ${event}:`, details);
  }
  
  // In production, this would send to a secure logging service
  // For now, we'll just store basic information
  const auditLog = {
    timestamp: new Date().toISOString(),
    event,
    details: {
      ...details,
      userAgent: navigator.userAgent,
      url: window.location.href,
    }
  };
  
  // Store in localStorage for demonstration (in production, send to secure endpoint)
  const existingLogs = JSON.parse(localStorage.getItem('securityLogs') || '[]');
  existingLogs.push(auditLog);
  
  // Keep only last 100 logs to prevent storage bloat
  if (existingLogs.length > 100) {
    existingLogs.splice(0, existingLogs.length - 100);
  }
  
  localStorage.setItem('securityLogs', JSON.stringify(existingLogs));
};
