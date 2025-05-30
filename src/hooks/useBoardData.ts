import { useState, useCallback, useEffect } from 'react';
import { Widget } from '@/types';
import { CreateWidgetData } from '@/types/widget';
import { useNotes } from './useNotes';
import { secureContentValidation } from '@/lib/contentSecurity';
import { handleSecureError, logSecurityEvent } from '@/lib/secureErrorHandling';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

// Helper function to validate UUID format
const isValidUUID = (str: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

export const useBoardData = (boardId: string) => {
  const { user } = useAuth();
  const {
    notesAsWidgets,
    loading: notesLoading,
    createNote,
    createWidget,
    updateNotePosition,
    updateNoteContent,
    updateWidgetSettings,
    deleteNote,
  } = useNotes(boardId);

  const [imageWidgets, setImageWidgets] = useState<Widget[]>([]);

  // Combine notes from database with local image widgets
  const allWidgets = [...notesAsWidgets, ...imageWidgets];

  // Get the highest z-index for bringing widgets to front
  const getMaxZIndex = useCallback(() => {
    return Math.max(0, ...allWidgets.map(w => w.settings?.zIndex || 0));
  }, [allWidgets]);

  // Get the lowest z-index for sending widgets to back
  const getMinZIndex = useCallback(() => {
    return Math.min(0, ...allWidgets.map(w => w.settings?.zIndex || 0));
  }, [allWidgets]);

  const handleAddWidget = useCallback(async (widget: Widget) => {
    console.log('handleAddWidget called with:', widget);
    console.log('Board ID:', boardId, 'Is valid UUID:', isValidUUID(boardId));
    
    // Validate board ID format
    if (!isValidUUID(boardId)) {
      console.error('Invalid board ID format:', boardId);
      logSecurityEvent('invalid_board_id', { boardId, userId: user?.id });
      toast.error('Invalid board selected. Please refresh and try again.');
      return;
    }

    // Round position values to integers
    const roundedX = Math.round(widget.position.x);
    const roundedY = Math.round(widget.position.y);

    // Validate position bounds (prevent widgets from being placed too far off-screen)
    if (roundedX < -1000 || roundedX > 10000 || roundedY < -1000 || roundedY > 10000) {
      logSecurityEvent('invalid_widget_position', { 
        position: { x: roundedX, y: roundedY }, 
        userId: user?.id 
      });
      toast.error('Widget position is invalid. Please try again.');
      return;
    }
    
    if (widget.type === 'note') {
      try {
        console.log('Creating note widget');
        // Enhanced security validation
        const sanitizedContent = secureContentValidation(widget.content, false, user?.id);
        const createdNote = await createNote(sanitizedContent, roundedX, roundedY);
        logSecurityEvent('note_created', { noteId: createdNote.id, userId: user?.id });
        console.log('Note created successfully:', createdNote);
      } catch (error) {
        console.error('Failed to create note:', error);
        const errorMessage = handleSecureError(error, 'note_creation');
        toast.error(errorMessage);
      }
    } else {
      // Handle all other widget types (including calendar, travel_planner, etc.)
      try {
        console.log('Creating widget with type:', widget.type);
        
        // Enhanced security validation
        const sanitizedContent = secureContentValidation(widget.content, true, user?.id);
        
        // Validate size settings
        const sizeSettings = widget.size ? {
          width: typeof widget.size.width === 'string' ? 
            Math.min(Math.max(parseInt(widget.size.width.replace('px', ''), 10) || 300, 100), 1000) : 
            Math.min(Math.max(widget.size.width || 300, 100), 1000),
          height: typeof widget.size.height === 'string' ? 
            Math.min(Math.max(parseInt(widget.size.height.replace('px', ''), 10) || 200, 100), 800) : 
            Math.min(Math.max(widget.size.height || 200, 100), 800)
        } : { width: 300, height: 200 };

        const createdWidget = await createWidget({
          type: widget.type as 'note' | 'image',
          content: sanitizedContent,
          x: roundedX,
          y: roundedY,
          settings: { 
            size: sizeSettings,
            zIndex: getMaxZIndex() + 1, // Place new widgets on top
            ...widget.settings
          }
        });
        logSecurityEvent('widget_created', { 
          widgetId: createdWidget.id, 
          type: widget.type, 
          userId: user?.id 
        });
        console.log('Widget created successfully:', createdWidget);
      } catch (error) {
        console.error('Failed to create widget:', error);
        const errorMessage = handleSecureError(error, 'widget_creation');
        toast.error(errorMessage);
      }
    }
  }, [createNote, createWidget, boardId, getMaxZIndex, user?.id]);

  const handleUpdateWidget = useCallback(async (widgetId: string, updatedContent: string) => {
    // Check if it's a note widget (from database)
    const isNote = notesAsWidgets.some(w => w.id === widgetId);
    
    if (isNote) {
      try {
        // Enhanced security validation
        const sanitizedContent = secureContentValidation(updatedContent, false, user?.id);
        await updateNoteContent(widgetId, sanitizedContent);
        logSecurityEvent('note_updated', { widgetId, userId: user?.id });
      } catch (error) {
        console.error('Failed to update note:', error);
        const errorMessage = handleSecureError(error, 'note_update');
        toast.error(errorMessage);
      }
    } else {
      try {
        // Enhanced security validation for local widgets
        const sanitizedContent = secureContentValidation(updatedContent, true, user?.id);
        
        // Handle image widgets locally
        setImageWidgets(prev => prev.map(widget =>
          widget.id === widgetId
            ? { ...widget, content: sanitizedContent, updatedAt: new Date() }
            : widget
        ));
        logSecurityEvent('widget_updated', { widgetId, userId: user?.id });
      } catch (error) {
        console.error('Failed to update widget:', error);
        const errorMessage = handleSecureError(error, 'widget_update');
        toast.error(errorMessage);
      }
    }
  }, [notesAsWidgets, updateNoteContent, user?.id]);

  const handleUpdateWidgetSettings = useCallback(async (widgetId: string, settings: any) => {
    // Check if it's a widget from database
    const isDbWidget = notesAsWidgets.some(w => w.id === widgetId);
    
    if (isDbWidget) {
      try {
        // Validate settings object structure
        if (settings && typeof settings === 'object') {
          // Sanitize any string values in settings
          const sanitizedSettings = Object.keys(settings).reduce((acc, key) => {
            const value = settings[key];
            if (typeof value === 'string') {
              acc[key] = secureContentValidation(value, true, user?.id);
            } else if (typeof value === 'object' && value !== null) {
              // Handle nested objects like size settings
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
    } else {
      // Handle local widgets with validation
      try {
        if (settings && typeof settings === 'object') {
          setImageWidgets(prev => prev.map(widget =>
            widget.id === widgetId
              ? { ...widget, settings, updatedAt: new Date() }
              : widget
          ));
        }
      } catch (error) {
        console.error('Failed to update local widget settings:', error);
        const errorMessage = handleSecureError(error, 'local_widget_settings_update');
        toast.error(errorMessage);
      }
    }
  }, [notesAsWidgets, updateWidgetSettings, user?.id]);

  const handleWidgetPositionChange = useCallback(async (widgetId: string, x: number, y: number) => {
    // Round position values to integers for database storage
    const roundedX = Math.round(x);
    const roundedY = Math.round(y);

    console.log('Position change request:', widgetId, 'from UI to:', { x, y }, 'rounded to:', { roundedX, roundedY });

    // Validate position bounds
    if (roundedX < -1000 || roundedX > 10000 || roundedY < -1000 || roundedY > 10000) {
      logSecurityEvent('invalid_position_change', { 
        widgetId, 
        position: { x: roundedX, y: roundedY }, 
        userId: user?.id 
      });
      toast.error('Widget position is out of bounds.');
      return;
    }

    // Check if it's a note widget (from database)
    const isNote = notesAsWidgets.some(w => w.id === widgetId);
    
    if (isNote) {
      try {
        console.log('Updating database note position');
        await updateNotePosition(widgetId, roundedX, roundedY);
        console.log('Database note position updated successfully');
      } catch (error) {
        console.error('Failed to update note position:', error);
        const errorMessage = handleSecureError(error, 'note_position_update');
        toast.error(errorMessage);
      }
    } else {
      // Handle image widgets locally
      console.log('Updating local widget position');
      setImageWidgets(prev => prev.map(widget =>
        widget.id === widgetId
          ? { ...widget, position: { x: roundedX, y: roundedY }, updatedAt: new Date() }
          : widget
      ));
    }
  }, [notesAsWidgets, updateNotePosition, user?.id]);

  const handleDeleteWidget = useCallback(async (widgetId: string) => {
    try {
      console.log('Attempting to delete widget:', widgetId);
      
      // Check if it's a note widget (from database)
      const isNote = notesAsWidgets.some(w => w.id === widgetId);
      
      if (isNote) {
        console.log('Deleting database widget:', widgetId);
        await deleteNote(widgetId);
        logSecurityEvent('note_deleted', { widgetId, userId: user?.id });
        toast.success('Widget deleted successfully');
        console.log('Database widget deleted successfully');
      } else {
        console.log('Deleting local widget:', widgetId);
        // Handle local widgets
        setImageWidgets(prev => {
          const filtered = prev.filter(widget => widget.id !== widgetId);
          console.log('Local widget deleted, remaining:', filtered.length);
          return filtered;
        });
        logSecurityEvent('widget_deleted', { widgetId, userId: user?.id });
        toast.success('Widget deleted successfully');
      }
    } catch (error) {
      console.error('Failed to delete widget:', error);
      const errorMessage = handleSecureError(error, 'widget_deletion');
      toast.error(errorMessage);
    }
  }, [notesAsWidgets, deleteNote, user?.id]);

  const handleBringToFront = useCallback(async (widgetId: string) => {
    const newZIndex = getMaxZIndex() + 1;
    await handleUpdateWidgetSettings(widgetId, { 
      zIndex: newZIndex
    });
  }, [getMaxZIndex, handleUpdateWidgetSettings]);

  const handleSendToBack = useCallback(async (widgetId: string) => {
    const newZIndex = getMinZIndex() - 1;
    await handleUpdateWidgetSettings(widgetId, { 
      zIndex: newZIndex
    });
  }, [getMinZIndex, handleUpdateWidgetSettings]);

  return {
    widgets: allWidgets,
    loading: notesLoading,
    handleAddWidget,
    handleUpdateWidget,
    handleUpdateWidgetSettings,
    handleWidgetPositionChange,
    handleBringToFront,
    handleSendToBack,
    handleDeleteWidget,
  };
};
