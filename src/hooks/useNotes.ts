
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Widget } from '@/types';
import { CreateWidgetData } from '@/types/widget';

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

export const useNotes = (boardId: string) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial notes
  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('board_id', boardId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setNotes(data || []);
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  // Create a new widget
  const createWidget = useCallback(async (widgetData: CreateWidgetData) => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert({
          board_id: boardId,
          content: widgetData.content,
          x: widgetData.x,
          y: widgetData.y,
          widget_type: widgetData.type,
          widget_settings: widgetData.settings || {},
          rotation: Math.floor(Math.random() * 6) - 3, // Random rotation between -3 and 3
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error creating widget:', err);
      throw err;
    }
  }, [boardId]);

  // Create a new note (backwards compatibility)
  const createNote = useCallback(async (content: string, x: number, y: number) => {
    return createWidget({
      type: 'note',
      content,
      x,
      y,
    });
  }, [createWidget]);

  // Update note position
  const updateNotePosition = useCallback(async (noteId: string, x: number, y: number) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({ x, y, updated_at: new Date().toISOString() })
        .eq('id', noteId);

      if (error) throw error;
    } catch (err) {
      console.error('Error updating note position:', err);
      throw err;
    }
  }, []);

  // Update note content
  const updateNoteContent = useCallback(async (noteId: string, content: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', noteId);

      if (error) throw error;
    } catch (err) {
      console.error('Error updating note content:', err);
      throw err;
    }
  }, []);

  // Delete note
  const deleteNote = useCallback(async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;
    } catch (err) {
      console.error('Error deleting note:', err);
      throw err;
    }
  }, []);

  // Set up real-time subscription
  useEffect(() => {
    fetchNotes();

    const channel = supabase
      .channel(`notes-${boardId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notes',
        filter: `board_id=eq.${boardId}`
      }, (payload) => {
        console.log('Real-time note update:', payload);
        
        switch (payload.eventType) {
          case 'INSERT':
            setNotes(prev => [...prev, payload.new as Note]);
            break;
          case 'UPDATE':
            setNotes(prev => prev.map(note => 
              note.id === payload.new.id ? payload.new as Note : note
            ));
            break;
          case 'DELETE':
            setNotes(prev => prev.filter(note => note.id !== payload.old.id));
            break;
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [boardId, fetchNotes]);

  // Convert notes to widgets format for compatibility with existing Board component
  const notesAsWidgets: Widget[] = notes.map(note => ({
    id: note.id,
    type: note.widget_type as 'note' | 'image',
    content: note.content,
    position: { x: note.x, y: note.y },
    rotation: note.rotation,
    size: note.widget_settings?.size || { width: '200px', height: 'auto' },
    createdAt: new Date(note.created_at),
    updatedAt: new Date(note.updated_at),
  }));

  return {
    notes,
    notesAsWidgets,
    loading,
    error,
    createNote,
    createWidget,
    updateNotePosition,
    updateNoteContent,
    deleteNote,
    refreshNotes: fetchNotes,
  };
};
