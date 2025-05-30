
import { toast } from 'sonner';
import { logSecurityEvent } from '@/lib/secureErrorHandling';

// Helper function to validate UUID format
const isValidUUID = (str: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

export const useBoardValidation = () => {
  const validateBoardId = (boardId: string, userId?: string) => {
    if (!isValidUUID(boardId)) {
      console.error('Invalid board ID format:', boardId);
      logSecurityEvent('invalid_board_id', { boardId, userId });
      toast.error('Invalid board selected. Please refresh and try again.');
      return false;
    }
    return true;
  };

  const validatePosition = (x: number, y: number, userId?: string) => {
    const roundedX = Math.round(x);
    const roundedY = Math.round(y);

    if (roundedX < -1000 || roundedX > 10000 || roundedY < -1000 || roundedY > 10000) {
      logSecurityEvent('invalid_widget_position', { 
        position: { x: roundedX, y: roundedY }, 
        userId 
      });
      toast.error('Widget position is invalid. Please try again.');
      return { valid: false, x: roundedX, y: roundedY };
    }

    return { valid: true, x: roundedX, y: roundedY };
  };

  const validateSizeSettings = (size?: any) => {
    if (!size) return { width: 300, height: 200 };

    return {
      width: typeof size.width === 'string' ? 
        Math.min(Math.max(parseInt(size.width.replace('px', ''), 10) || 300, 100), 1000) : 
        Math.min(Math.max(size.width || 300, 100), 1000),
      height: typeof size.height === 'string' ? 
        Math.min(Math.max(parseInt(size.height.replace('px', ''), 10) || 200, 100), 800) : 
        Math.min(Math.max(size.height || 200, 100), 800)
    };
  };

  return {
    validateBoardId,
    validatePosition,
    validateSizeSettings,
  };
};
