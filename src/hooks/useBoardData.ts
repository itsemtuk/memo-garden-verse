
import { useState, useCallback, useEffect } from 'react';
import { Widget } from '@/types';
import { CreateWidgetData } from '@/types/widget';
import { useNotes } from './useNotes';
import { validateAndSanitizeContent } from '@/lib/validation';
import { createUserFriendlyError } from '@/lib/errorHandling';
import { toast } from 'sonner';

// Helper function to validate UUID format
const isValidUUID = (str: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

export const useBoardData = (boardId: string) => {
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

  const handleAddWidget = useCallback(async (widget: Widget) => {
    console.log('handleAddWidget called with:', widget);
    console.log('Board ID:', boardId, 'Is valid UUID:', isValidUUID(boardId));
    
    // Validate board ID format
    if (!isValidUUID(boardId)) {
      console.error('Invalid board ID format:', boardId);
      const error = createUserFriendlyError('Invalid board selected. Please refresh and try again.');
      toast.error(error.message);
      return;
    }

    // Validate position bounds (prevent widgets from being placed too far off-screen)
    if (widget.position.x < -1000 || widget.position.x > 10000 || 
        widget.position.y < -1000 || widget.position.y > 10000) {
      const error = createUserFriendlyError('Widget position is invalid. Please try again.');
      toast.error(error.message);
      return;
    }
    
    if (widget.type === 'note') {
      try {
        console.log('Creating note widget');
        // Validate and sanitize content
        const sanitizedContent = validateAndSanitizeContent(widget.content);
        await createNote(sanitizedContent, widget.position.x, widget.position.y);
      } catch (error) {
        console.error('Failed to create note:', error);
        const friendlyError = createUserFriendlyError('Failed to create note. Please try again.');
        toast.error(friendlyError.message);
      }
    } else if (['image', 'weather', 'plant_reminder', 'shopping_list', 'social'].includes(widget.type)) {
      try {
        console.log('Creating widget with type:', widget.type);
        
        // Validate and sanitize content
        const sanitizedContent = validateAndSanitizeContent(widget.content, true);
        
        // Validate size settings
        const sizeSettings = widget.size ? {
          width: typeof widget.size.width === 'string' ? 
            Math.min(Math.max(parseInt(widget.size.width.replace('px', ''), 10) || 300, 100), 1000) : 
            Math.min(Math.max(widget.size.width || 300, 100), 1000),
          height: typeof widget.size.height === 'string' ? 
            Math.min(Math.max(parseInt(widget.size.height.replace('px', ''), 10) || 200, 100), 800) : 
            Math.min(Math.max(widget.size.height || 200, 100), 800)
        } : { width: 300, height: 200 };

        await createWidget({
          type: widget.type as 'note' | 'image',
          content: sanitizedContent,
          x: widget.position.x,
          y: widget.position.y,
          settings: { 
            size: sizeSettings,
            ...widget.settings
          }
        });
        console.log('Widget created successfully');
      } catch (error) {
        console.error('Failed to create widget:', error);
        const friendlyError = createUserFriendlyError('Failed to create widget. Please try again.');
        toast.error(friendlyError.message);
      }
    }
  }, [createNote, createWidget, boardId]);

  const handleUpdateWidget = useCallback(async (widgetId: string, updatedContent: string) => {
    // Check if it's a note widget (from database)
    const isNote = notesAsWidgets.some(w => w.id === widgetId);
    
    if (isNote) {
      try {
        // Validate and sanitize content
        const sanitizedContent = validateAndSanitizeContent(updatedContent);
        await updateNoteContent(widgetId, sanitizedContent);
      } catch (error) {
        console.error('Failed to update note:', error);
        const friendlyError = createUserFriendlyError('Failed to update note. Please try again.');
        toast.error(friendlyError.message);
      }
    } else {
      try {
        // Validate and sanitize content for local widgets
        const sanitizedContent = validateAndSanitizeContent(updatedContent, true);
        
        // Handle image widgets locally
        setImageWidgets(prev => prev.map(widget =>
          widget.id === widgetId
            ? { ...widget, content: sanitizedContent, updatedAt: new Date() }
            : widget
        ));
      } catch (error) {
        console.error('Failed to update widget:', error);
        const friendlyError = createUserFriendlyError('Failed to update widget. Please try again.');
        toast.error(friendlyError.message);
      }
    }
  }, [notesAsWidgets, updateNoteContent]);

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
              acc[key] = validateAndSanitizeContent(value, true);
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
        const friendlyError = createUserFriendlyError('Failed to update widget settings. Please try again.');
        toast.error(friendlyError.message);
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
        const friendlyError = createUserFriendlyError('Failed to update widget settings. Please try again.');
        toast.error(friendlyError.message);
      }
    }
  }, [notesAsWidgets, updateWidgetSettings]);

  const handleWidgetPositionChange = useCallback(async (widgetId: string, x: number, y: number) => {
    // Validate position bounds
    if (x < -1000 || x > 10000 || y < -1000 || y > 10000) {
      const error = createUserFriendlyError('Widget position is out of bounds.');
      toast.error(error.message);
      return;
    }

    // Check if it's a note widget (from database)
    const isNote = notesAsWidgets.some(w => w.id === widgetId);
    
    if (isNote) {
      try {
        await updateNotePosition(widgetId, x, y);
      } catch (error) {
        console.error('Failed to update note position:', error);
        const friendlyError = createUserFriendlyError('Failed to move note. Please try again.');
        toast.error(friendlyError.message);
      }
    } else {
      // Handle image widgets locally
      setImageWidgets(prev => prev.map(widget =>
        widget.id === widgetId
          ? { ...widget, position: { x, y }, updatedAt: new Date() }
          : widget
      ));
    }
  }, [notesAsWidgets, updateNotePosition]);

  return {
    widgets: allWidgets,
    loading: notesLoading,
    handleAddWidget,
    handleUpdateWidget,
    handleUpdateWidgetSettings,
    handleWidgetPositionChange,
  };
};
