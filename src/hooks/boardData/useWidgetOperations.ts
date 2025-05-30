
import { useCallback } from 'react';
import { toast } from 'sonner';
import { Widget } from '@/types';
import { CreateWidgetData } from '@/types/widget';
import { useNotes } from '@/hooks/useNotes';
import { secureContentValidation } from '@/lib/contentSecurity';
import { handleSecureError, logSecurityEvent } from '@/lib/secureErrorHandling';
import { useBoardValidation } from './useBoardValidation';

export const useWidgetOperations = (boardId: string, getMaxZIndex: () => number) => {
  const { validateBoardId, validatePosition, validateSizeSettings } = useBoardValidation();
  const {
    notesAsWidgets,
    createNote,
    createWidget,
    updateNoteContent,
    updateWidgetSettings,
    deleteNote,
  } = useNotes(boardId);

  const handleAddWidget = useCallback(async (widget: Widget, userId?: string) => {
    console.log('handleAddWidget called with:', widget);
    console.log('Board ID:', boardId, 'Is valid UUID:', validateBoardId(boardId, userId));
    
    if (!validateBoardId(boardId, userId)) {
      return;
    }

    const positionValidation = validatePosition(widget.position.x, widget.position.y, userId);
    if (!positionValidation.valid) {
      return;
    }
    
    if (widget.type === 'note') {
      try {
        console.log('Creating note widget');
        const sanitizedContent = secureContentValidation(widget.content, false, userId);
        const createdNote = await createNote(sanitizedContent, positionValidation.x, positionValidation.y);
        logSecurityEvent('note_created', { noteId: createdNote.id, userId });
        console.log('Note created successfully:', createdNote);
      } catch (error) {
        console.error('Failed to create note:', error);
        const errorMessage = handleSecureError(error, 'note_creation');
        toast.error(errorMessage);
      }
    } else {
      try {
        console.log('Creating widget with type:', widget.type);
        
        const sanitizedContent = secureContentValidation(widget.content, true, userId);
        const sizeSettings = validateSizeSettings(widget.size);

        const createdWidget = await createWidget({
          type: widget.type as 'note' | 'image',
          content: sanitizedContent,
          x: positionValidation.x,
          y: positionValidation.y,
          settings: { 
            size: sizeSettings,
            zIndex: getMaxZIndex() + 1,
            ...widget.settings
          }
        });
        logSecurityEvent('widget_created', { 
          widgetId: createdWidget.id, 
          type: widget.type, 
          userId 
        });
        console.log('Widget created successfully:', createdWidget);
      } catch (error) {
        console.error('Failed to create widget:', error);
        const errorMessage = handleSecureError(error, 'widget_creation');
        toast.error(errorMessage);
      }
    }
  }, [createNote, createWidget, boardId, getMaxZIndex, validateBoardId, validatePosition, validateSizeSettings]);

  const handleUpdateWidget = useCallback(async (widgetId: string, updatedContent: string, userId?: string) => {
    const isNote = notesAsWidgets.some(w => w.id === widgetId);
    
    if (isNote) {
      try {
        const sanitizedContent = secureContentValidation(updatedContent, false, userId);
        await updateNoteContent(widgetId, sanitizedContent);
        logSecurityEvent('note_updated', { widgetId, userId });
      } catch (error) {
        console.error('Failed to update note:', error);
        const errorMessage = handleSecureError(error, 'note_update');
        toast.error(errorMessage);
      }
    } else {
      // Handle other widget types locally if needed
      console.log('Update requested for non-note widget:', widgetId);
    }
  }, [notesAsWidgets, updateNoteContent]);

  const handleDeleteWidget = useCallback(async (widgetId: string, userId?: string) => {
    try {
      console.log('Attempting to delete widget:', widgetId);
      
      const isNote = notesAsWidgets.some(w => w.id === widgetId);
      
      if (isNote) {
        console.log('Deleting database widget:', widgetId);
        await deleteNote(widgetId);
        logSecurityEvent('note_deleted', { widgetId, userId });
        toast.success('Widget deleted successfully');
        console.log('Database widget deleted successfully');
      } else {
        console.log('Widget not found in database:', widgetId);
        logSecurityEvent('widget_deleted', { widgetId, userId });
        toast.success('Widget deleted successfully');
      }
    } catch (error) {
      console.error('Failed to delete widget:', error);
      const errorMessage = handleSecureError(error, 'widget_deletion');
      toast.error(errorMessage);
    }
  }, [notesAsWidgets, deleteNote]);

  const handleUpdateWidgetSettings = useCallback(async (widgetId: string, settings: any, userId?: string) => {
    const isDbWidget = notesAsWidgets.some(w => w.id === widgetId);
    
    if (isDbWidget) {
      try {
        if (settings && typeof settings === 'object') {
          const sanitizedSettings = Object.keys(settings).reduce((acc, key) => {
            const value = settings[key];
            if (typeof value === 'string') {
              acc[key] = secureContentValidation(value, true, userId);
            } else if (typeof value === 'object' && value !== null) {
              acc[key] = value;
            } else {
              acc[key] = value;
            }
            return acc;
          }, {} as any);
          
          await updateWidgetSettings(widgetId, sanitizedSettings);
        }
      } catch (error) {
        console.error('Failed to update widget settings:', error);
        const errorMessage = handleSecureError(error, 'widget_settings_update');
        toast.error(errorMessage);
      }
    }
  }, [notesAsWidgets, updateWidgetSettings]);

  return {
    notesAsWidgets,
    handleAddWidget,
    handleUpdateWidget,
    handleDeleteWidget,
    handleUpdateWidgetSettings,
  };
};
