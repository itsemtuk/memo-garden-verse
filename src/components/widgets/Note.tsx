
import { Widget } from "@/types";
import { useState, useRef, useEffect } from "react";
import { noteContentSchema } from "@/lib/security";
import { handleValidationError } from "@/lib/errorHandling";
import { Edit3 } from "lucide-react";

interface NoteProps {
  widget: Widget;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (updatedContent: string) => void;
}

const Note = ({ widget, isSelected, onClick, onUpdate }: NoteProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [noteContent, setNoteContent] = useState(widget.content);
  const [validationError, setValidationError] = useState<string>("");
  const [hasChanges, setHasChanges] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  console.log('Note component rendering:', widget.id, 'content:', widget.content);

  // Update local content when widget content changes
  useEffect(() => {
    setNoteContent(widget.content);
    setHasChanges(false);
  }, [widget.content]);

  // Auto-focus textarea when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setValidationError("");
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setValidationError("");
  };

  const saveNote = () => {
    if (!hasChanges) {
      setIsEditing(false);
      return;
    }

    try {
      const validatedContent = noteContentSchema.parse(noteContent);
      setIsEditing(false);
      setValidationError("");
      setHasChanges(false);
      onUpdate(validatedContent);
    } catch (error) {
      const errorMessage = handleValidationError(error);
      setValidationError(errorMessage);
      // Don't exit editing mode if validation fails
    }
  };

  const handleBlur = () => {
    // Auto-save when clicking away from the note
    saveNote();
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setNoteContent(newContent);
    setHasChanges(newContent !== widget.content);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      // Cancel editing and revert changes
      setNoteContent(widget.content);
      setIsEditing(false);
      setValidationError("");
      setHasChanges(false);
    }
    if (e.key === 'Enter' && e.ctrlKey) {
      // Save with Ctrl+Enter
      saveNote();
    }
  };

  return (
    <div
      className={`widget widget-note bg-yellow-100 rounded-lg shadow-md transition-all duration-200 relative ${
        isSelected ? 'ring-2 ring-garden-primary' : ''
      }`}
      style={{
        width: widget.size?.width || "200px",
        height: widget.size?.height || "auto",
        minHeight: "100px",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onDoubleClick={handleDoubleClick}
    >
      <div className="widget-pin widget-pin-left"></div>
      <div className="widget-pin widget-pin-right"></div>
      
      {/* Edit button - only show when selected and not editing */}
      {isSelected && !isEditing && (
        <button
          onClick={handleEditClick}
          className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors z-10"
          title="Edit note"
        >
          <Edit3 className="w-3 h-3" />
        </button>
      )}
      
      {/* Changes indicator */}
      {isEditing && hasChanges && (
        <div className="absolute -top-1 -left-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse" title="Unsaved changes"></div>
      )}
      
      {isEditing ? (
        <div className="relative p-3 h-full">
          <textarea
            ref={textareaRef}
            className="w-full h-full bg-transparent border-none focus:outline-none resize-none min-h-[70px]"
            value={noteContent}
            onChange={handleContentChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            placeholder="Type your note here..."
          />
          {validationError && (
            <div className="absolute -bottom-8 left-0 text-xs text-red-600 bg-white px-2 py-1 rounded shadow-lg z-50 border">
              {validationError}
            </div>
          )}
          <div className="absolute -bottom-8 right-0 text-xs text-gray-500 bg-white px-2 py-1 rounded shadow-sm border">
            {hasChanges ? 'Click away to save' : 'Ctrl+Enter to save, Esc to cancel'}
          </div>
        </div>
      ) : (
        <div 
          className="min-h-[70px] break-words font-handwriting p-3 cursor-text hover:bg-yellow-50 transition-colors"
          onClick={handleEditClick}
        >
          {widget.content || (
            <span className="text-gray-400 italic">Double-click to edit...</span>
          )}
        </div>
      )}
    </div>
  );
};

export default Note;
