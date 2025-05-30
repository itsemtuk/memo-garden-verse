import { useState, useCallback, useEffect } from 'react';
import { Widget } from '@/types';
import { CreateWidgetData } from '@/types/widget';
import { useNotes } from './useNotes';

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
      console.error('Board ID must be a valid UUID format');
      return;
    }
    
    if (widget.type === 'note') {
      try {
        console.log('Creating note widget');
        await createNote(widget.content, widget.position.x, widget.position.y);
      } catch (error) {
        console.error('Failed to create note:', error);
      }
    } else if (['image', 'weather', 'plant_reminder', 'shopping_list', 'social'].includes(widget.type)) {
      try {
        console.log('Creating widget with type:', widget.type);
        const sizeSettings = widget.size ? {
          width: typeof widget.size.width === 'string' ? 
            parseInt(widget.size.width.replace('px', ''), 10) : 
            widget.size.width,
          height: typeof widget.size.height === 'string' ? 
            parseInt(widget.size.height.replace('px', ''), 10) || 200 : 
            widget.size.height
        } : { width: 300, height: 200 };

        await createWidget({
          type: widget.type as 'note' | 'image',
          content: widget.content,
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
      }
    }
  }, [createNote, createWidget, boardId]);

  const handleUpdateWidget = useCallback(async (widgetId: string, updatedContent: string) => {
    // Check if it's a note widget (from database)
    const isNote = notesAsWidgets.some(w => w.id === widgetId);
    
    if (isNote) {
      try {
        await updateNoteContent(widgetId, updatedContent);
      } catch (error) {
        console.error('Failed to update note:', error);
      }
    } else {
      // Handle image widgets locally
      setImageWidgets(prev => prev.map(widget =>
        widget.id === widgetId
          ? { ...widget, content: updatedContent, updatedAt: new Date() }
          : widget
      ));
    }
  }, [notesAsWidgets, updateNoteContent]);

  const handleUpdateWidgetSettings = useCallback(async (widgetId: string, settings: any) => {
    // Check if it's a widget from database
    const isDbWidget = notesAsWidgets.some(w => w.id === widgetId);
    
    if (isDbWidget) {
      try {
        await updateWidgetSettings(widgetId, settings);
      } catch (error) {
        console.error('Failed to update widget settings:', error);
      }
    } else {
      // Handle local widgets
      setImageWidgets(prev => prev.map(widget =>
        widget.id === widgetId
          ? { ...widget, settings, updatedAt: new Date() }
          : widget
      ));
    }
  }, [notesAsWidgets, updateWidgetSettings]);

  const handleWidgetPositionChange = useCallback(async (widgetId: string, x: number, y: number) => {
    // Check if it's a note widget (from database)
    const isNote = notesAsWidgets.some(w => w.id === widgetId);
    
    if (isNote) {
      try {
        await updateNotePosition(widgetId, x, y);
      } catch (error) {
        console.error('Failed to update note position:', error);
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
