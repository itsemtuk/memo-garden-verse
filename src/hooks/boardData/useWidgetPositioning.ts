
import { useCallback } from 'react';
import { toast } from 'sonner';
import { useNotes } from '@/hooks/useNotes';
import { handleSecureError, logSecurityEvent } from '@/lib/secureErrorHandling';
import { useBoardValidation } from './useBoardValidation';

export const useWidgetPositioning = (boardId: string, notesAsWidgets: any[]) => {
  const { validatePosition } = useBoardValidation();
  const { updateNotePosition } = useNotes(boardId);

  const handleWidgetPositionChange = useCallback(async (widgetId: string, x: number, y: number, userId?: string) => {
    const positionValidation = validatePosition(x, y, userId);
    if (!positionValidation.valid) {
      return;
    }

    console.log('Position change request:', widgetId, 'from UI to:', { x, y }, 'rounded to:', { x: positionValidation.x, y: positionValidation.y });

    const isNote = notesAsWidgets.some(w => w.id === widgetId);
    
    if (isNote) {
      try {
        console.log('Updating database note position');
        await updateNotePosition(widgetId, positionValidation.x, positionValidation.y);
        console.log('Database note position updated successfully');
      } catch (error) {
        console.error('Failed to update note position:', error);
        const errorMessage = handleSecureError(error, 'note_position_update');
        toast.error(errorMessage);
      }
    } else {
      console.log('Local widget position update not implemented for:', widgetId);
    }
  }, [notesAsWidgets, updateNotePosition, validatePosition]);

  return {
    handleWidgetPositionChange,
  };
};
