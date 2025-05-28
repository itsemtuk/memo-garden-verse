
import { useState, useCallback, useEffect } from 'react';
import { Widget } from '@/types';
import { CreateWidgetData } from '@/types/widget';
import { useNotes } from './useNotes';

export const useBoardData = (boardId: string) => {
  const {
    notesAsWidgets,
    loading: notesLoading,
    createNote,
    createWidget,
    updateNotePosition,
    updateNoteContent,
    deleteNote,
  } = useNotes(boardId);

  const [imageWidgets, setImageWidgets] = useState<Widget[]>([]);

  // Combine notes from database with local image widgets
  const allWidgets = [...notesAsWidgets, ...imageWidgets];

  const handleAddWidget = useCallback(async (widget: Widget) => {
    if (widget.type === 'note') {
      try {
        await createNote(widget.content, widget.position.x, widget.position.y);
      } catch (error) {
        console.error('Failed to create note:', error);
      }
    } else if (widget.type === 'image') {
      try {
        await createWidget({
          type: 'image',
          content: widget.content,
          x: widget.position.x,
          y: widget.position.y,
          settings: { size: widget.size }
        });
      } catch (error) {
        console.error('Failed to create image widget:', error);
      }
    }
  }, [createNote, createWidget]);

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
    handleWidgetPositionChange,
  };
};
