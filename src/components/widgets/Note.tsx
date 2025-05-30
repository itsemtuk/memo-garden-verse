
import { Widget } from "@/types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: widget.id,
    data: { widget },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    rotate: `${widget.rotation || 0}deg`,
    zIndex: isDragging ? 1000 : (widget.settings?.zIndex || 1),
  };

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

  const handleBlur = () => {
    try {
      const validatedContent = noteContentSchema.parse(noteContent);
      setIsEditing(false);
      setValidationError("");
      onUpdate(validatedContent);
    } catch (error) {
      const errorMessage = handleValidationError(error);
      setValidationError(errorMessage);
      // Don't exit editing mode if validation fails
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setNoteContent(widget.content);
      setIsEditing(false);
      setValidationError("");
    }
    if (e.key === 'Enter' && e.ctrlKey) {
      handleBlur();
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`widget widget-note absolute transition-all duration-200 ${
        isDragging ? 'dragging shadow-lg scale-105' : ''
      } ${isSelected ? 'ring-2 ring-garden-primary' : ''}`}
      style={{
        ...style,
        left: `${widget.position.x}px`,
        top: `${widget.position.y}px`,
        width: widget.size?.width || "200px",
        height: widget.size?.height || "auto",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onDoubleClick={handleDoubleClick}
      {...attributes}
      {...listeners}
    >
      <div className="widget-pin widget-pin-left"></div>
      <div className="widget-pin widget-pin-right"></div>
      
      {/* Edit button - only show when selected and not editing */}
      {isSelected && !isEditing && (
        <button
          onClick={handleEditClick}
          className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors"
          title="Edit note"
        >
          <Edit3 className="w-3 h-3" />
        </button>
      )}
      
      {isEditing ? (
        <div className="relative">
          <textarea
            ref={textareaRef}
            className="w-full h-full bg-transparent border-none focus:outline-none resize-none min-h-[100px]"
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            placeholder="Type your note here..."
          />
          {validationError && (
            <div className="absolute -bottom-6 left-0 text-xs text-red-600 bg-white px-2 py-1 rounded shadow-lg z-50">
              {validationError}
            </div>
          )}
          <div className="absolute -bottom-6 right-0 text-xs text-gray-500 bg-white px-2 py-1 rounded shadow-sm">
            Ctrl+Enter to save, Esc to cancel
          </div>
        </div>
      ) : (
        <p className="min-h-[100px] break-words font-handwriting p-2">{widget.content || "Click to edit..."}</p>
      )}
    </div>
  );
};

export default Note;
