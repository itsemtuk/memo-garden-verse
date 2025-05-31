
import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

export const useNotesSubscription = (
  boardId: string, 
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>
) => {
  const handleRealtimeChange = useCallback((payload: any) => {
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
  }, [setNotes]);

  // Set up real-time subscription
  useEffect(() => {
    console.log('Setting up real-time subscription for board:', boardId);
    const channel = supabase
      .channel(`notes-changes-${boardId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notes',
        filter: `board_id=eq.${boardId}`
      }, handleRealtimeChange)
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [boardId, handleRealtimeChange]);
};
