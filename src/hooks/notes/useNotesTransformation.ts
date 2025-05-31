
import { useMemo } from 'react';
import { Widget } from '@/types';

interface Note {
  id: string;
  board_id: string;
  content: string;
  x: number;
  y: number;
  rotation: number;
  color: string;
  widget_type: string;
  widget_settings: any;
  created_at: string;
  updated_at: string;
}

export const useNotesTransformation = (notes: Note[]) => {
  // Convert notes to widgets format for compatibility with existing Board component
  const notesAsWidgets: Widget[] = useMemo(() => {
    return notes.map(note => ({
      id: note.id,
      type: note.widget_type as Widget['type'],
      content: note.content,
      position: { x: note.x, y: note.y },
      rotation: note.rotation,
      size: note.widget_settings?.size || { width: '200px', height: 'auto' },
      settings: note.widget_settings,
      createdAt: new Date(note.created_at),
      updatedAt: new Date(note.updated_at),
    }));
  }, [notes]);

  return { notesAsWidgets };
};
