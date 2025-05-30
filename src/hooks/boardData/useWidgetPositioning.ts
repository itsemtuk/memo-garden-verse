
import { useCallback } from 'react';
import { toast } from 'sonner';
import { useNotes } from '@/hooks/useNotes';
import { handleSecureError, logSecurityEvent } from '@/lib/secureErrorHandling';
import { useBoardValidation } from './useBoardValidation';

export const useWidgetPositioning = (boardId: string, notesAsWidgets: any[]) => {
  const { validatePosition } = useBoardValidation();
  const { updateNotePosition } = useNotes(boardId);

  const handleWidgetPositionChange = useCallback(async (widgetId: string, x: number, y: number, userId?: string) => {
    console.log('handleWidgetPositionChange called:', { widgetId, x, y, userId });
    
    // Round positions to prevent floating point issues
    const roundedX = Math.round(x);
    const roundedY = Math.round(y);
    
    const positionValidation = validatePosition(roundedX, roundedY, userId);
    if (!positionValidation.valid) {
      console.warn('Position validation failed:', { x: roundedX, y: roundedY, validation: positionValidation });
      toast.error('Invalid position - widget must be placed within board boundaries');
      return;
    }

    console.log('Position validated successfully:', { 
      original: { x: roundedX, y: roundedY }, 
      validated: { x: positionValidation.x, y: positionValidation.y } 
    });

    const isNote = notesAsWidgets.some(w => w.id === widgetId);
    
    if (isNote) {
      try {
        console.log('Updating database note position for widget:', widgetId, 'to:', { x: positionValidation.x, y: positionValidation.y });
        await updateNotePosition(widgetId, positionValidation.x, positionValidation.y);
        console.log('Database note position updated successfully');
        logSecurityEvent('note_position_updated', { widgetId, x: positionValidation.x, y: positionValidation.y, userId });
      } catch (error) {
        console.error('Failed to update note position:', error);
        const errorMessage = handleSecureError(error, 'note_position_update');
        toast.error(errorMessage);
        throw error; // Re-throw to allow drag handler to handle the error
      }
    } else {
      console.log('Widget is not a note, skipping database update for:', widgetId);
      // For non-note widgets, we might want to handle them differently in the future
      logSecurityEvent('local_widget_position_updated', { widgetId, x: positionValidation.x, y: positionValidation.y, userId });
    }
  }, [notesAsWidgets, updateNotePosition, validatePosition]);

  return {
    handleWidgetPositionChange,
  };
};
