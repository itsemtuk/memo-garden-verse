
export interface AppError {
  message: string;
  code?: string;
  userFriendly: boolean;
}

export const createUserFriendlyError = (message: string, code?: string): AppError => ({
  message,
  code,
  userFriendly: true,
});

export const createSystemError = (error: unknown, fallbackMessage: string): AppError => {
  // Log the actual error for debugging
  console.error('System error:', error);
  
  // Return user-friendly message
  return {
    message: fallbackMessage,
    userFriendly: true,
  };
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
};

export const handleValidationError = (error: unknown): string => {
  if (error instanceof Error && error.name === 'ZodError') {
    const zodError = error as any;
    const firstError = zodError.errors?.[0];
    return firstError?.message || 'Invalid input provided';
  }
  return getErrorMessage(error);
};
