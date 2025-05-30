
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
      console.log('Fetching notes for board:', boardId);
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('board_id', boardId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      console.log('Fetched notes:', data?.length || 0);
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
      console.log('Creating widget:', widgetData);
      const { data, error } = await supabase
        .from('notes')
        .insert({
          board_id: boardId,
          content: widgetData.content,
          x: Math.round(widgetData.x),
          y: Math.round(widgetData.y),
          widget_type: widgetData.type,
          widget_settings: widgetData.settings || {},
          rotation: Math.floor(Math.random() * 6) - 3,
        })
        .select()
        .single();

      if (error) throw error;
      console.log('Widget created in database:', data);
      
      setNotes(prev => [...prev, data]);
      
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
      x: Math.round(x),
      y: Math.round(y),
    });
  }, [createWidget]);

  // Update note position
  const updateNotePosition = useCallback(async (noteId: string, x: number, y: number) => {
    try {
      const roundedX = Math.round(x);
      const roundedY = Math.round(y);
      
      console.log('=== DATABASE UPDATE ===');
      console.log('Note ID:', noteId);
      console.log('New position:', { x: roundedX, y: roundedY });
      
      const { data, error } = await supabase
        .from('notes')
        .update({ 
          x: roundedX, 
          y: roundedY, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', noteId)
        .select();

      if (error) {
        console.error('Database error updating position:', error);
        throw error;
      }

      console.log('Database update response:', data);

      // Optimistically update local state
      setNotes(prev => {
        const updated = prev.map(note => 
          note.id === noteId 
            ? { ...note, x: roundedX, y: roundedY, updated_at: new Date().toISOString() }
            : note
        );
        console.log('Local state updated:', updated.find(n => n.id === noteId));
        return updated;
      });
      
      console.log('Position updated successfully in database and local state');
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
      
      setNotes(prev => prev.map(note => 
        note.id === noteId 
          ? { ...note, content, updated_at: new Date().toISOString() }
          : note
      ));
    } catch (err) {
      console.error('Error updating note content:', err);
      throw err;
    }
  }, []);

  // Update widget settings
  const updateWidgetSettings = useCallback(async (widgetId: string, settings: any) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({ 
          widget_settings: settings, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', widgetId);

      if (error) throw error;
      
      setNotes(prev => prev.map(note => 
        note.id === widgetId 
          ? { ...note, widget_settings: settings, updated_at: new Date().toISOString() }
          : note
      ));
    } catch (err) {
      console.error('Error updating widget settings:', err);
      throw err;
    }
  }, []);

  // Delete note
  const deleteNote = useCallback(async (noteId: string) => {
    try {
      console.log('Deleting note:', noteId);
      
      setNotes(prev => {
        const filtered = prev.filter(note => note.id !== noteId);
        console.log('Optimistically removed note, remaining notes:', filtered.length);
        return filtered;
      });
      
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (error) {
        console.error('Database error deleting note:', error);
        fetchNotes();
        throw error;
      }
      
      console.log('Note deleted from database successfully');
    } catch (err) {
      console.error('Error deleting note:', err);
      throw err;
    }
  }, [fetchNotes]);

  // Set up real-time subscription
  useEffect(() => {
    fetchNotes();

    console.log('Setting up real-time subscription for board:', boardId);
    const channel = supabase
      .channel(`notes-changes-${boardId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notes',
        filter: `board_id=eq.${boardId}`
      }, (payload) => {
        console.log('Real-time note update received:', payload.eventType, payload);
        
        switch (payload.eventType) {
          case 'INSERT':
            setNotes(prev => {
              const exists = prev.some(note => note.id === payload.new.id);
              if (exists) {
                console.log('Note already exists, skipping insert');
                return prev;
              }
              console.log('Adding new note to state');
              return [...prev, payload.new as Note];
            });
            break;
          case 'UPDATE':
            setNotes(prev => {
              console.log('Real-time update for note:', payload.new.id);
              console.log('New data:', payload.new);
              return prev.map(note => 
                note.id === payload.new.id ? payload.new as Note : note
              );
            });
            break;
          case 'DELETE':
            setNotes(prev => {
              console.log('Real-time delete received for note:', payload.old.id);
              const filtered = prev.filter(note => note.id !== payload.old.id);
              console.log('After real-time delete, remaining notes:', filtered.length);
              return filtered;
            });
            break;
        }
      })
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [boardId, fetchNotes]);

  // Convert notes to widgets format for compatibility with existing Board component
  const notesAsWidgets: Widget[] = notes.map(note => ({
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

  return {
    notes,
    notesAsWidgets,
    loading,
    error,
    createNote,
    createWidget,
    updateNotePosition,
    updateNoteContent,
    updateWidgetSettings,
    deleteNote,
    refreshNotes: fetchNotes,
  };
};
