
import { useCallback } from 'react';
import { toast } from 'sonner';
import { useNotes } from '@/hooks/useNotes';
import { handleSecureError, logSecurityEvent } from '@/lib/secureErrorHandling';
import { useBoardValidation } from './useBoardValidation';

export const useWidgetPositioning = (boardId: string, notesAsWidgets: any[]) => {
  const { validatePosition } = useBoardValidation();
  const { updateNotePosition } = useNotes(boardId);

  const handleWidgetPositionChange = useCallback(async (widgetId: string, x: number, y: number, userId?: string) => {
    console.log('=== POSITION UPDATE START ===');
    console.log('Widget ID:', widgetId);
    console.log('New position:', { x, y });
    console.log('User ID:', userId);
    
    const roundedX = Math.round(x);
    const roundedY = Math.round(y);
    
    console.log('Rounded position:', { x: roundedX, y: roundedY });
    
    const positionValidation = validatePosition(roundedX, roundedY, userId);
    if (!positionValidation.valid) {
      console.warn('Position validation failed:', positionValidation);
      toast.error('Invalid position - widget must be placed within board boundaries');
      return;
    }

    console.log('Position validation passed:', positionValidation);

    const isNote = notesAsWidgets.some(w => w.id === widgetId);
    console.log('Is note widget:', isNote);
    console.log('Available widgets:', notesAsWidgets.map(w => ({ id: w.id, type: w.type })));
    
    if (isNote) {
      try {
        console.log('Updating database position...');
        await updateNotePosition(widgetId, positionValidation.x, positionValidation.y);
        console.log('Database update successful!');
        logSecurityEvent('note_position_updated', { widgetId, x: positionValidation.x, y: positionValidation.y, userId });
      } catch (error) {
        console.error('Database update failed:', error);
        const errorMessage = handleSecureError(error, 'note_position_update');
        toast.error(errorMessage);
        throw error;
      }
    } else {
      console.log('Widget is not a note, skipping database update');
      logSecurityEvent('local_widget_position_updated', { widgetId, x: positionValidation.x, y: positionValidation.y, userId });
    }
    
    console.log('=== POSITION UPDATE END ===');
  }, [notesAsWidgets, updateNotePosition, validatePosition]);

  return {
    handleWidgetPositionChange,
  };
};
