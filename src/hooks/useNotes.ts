
import { useEffect } from 'react';
import { useNotesOperations } from './notes/useNotesOperations';
import { useNotesSubscription } from './notes/useNotesSubscription';
import { useNotesTransformation } from './notes/useNotesTransformation';

export const useNotes = (boardId: string) => {
  const {
    notes,
    loading,
    error,
    setNotes,
    fetchNotes,
    createNote,
    createWidget,
    updateNotePosition,
    updateNoteContent,
    updateWidgetSettings,
    deleteNote,
  } = useNotesOperations(boardId);

  const { notesAsWidgets } = useNotesTransformation(notes);

  // Set up real-time subscription
  useNotesSubscription(boardId, setNotes);

  // Fetch initial notes
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

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
