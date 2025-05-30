
import { Widget } from "@/types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { noteContentSchema } from "@/lib/security";
import { handleValidationError } from "@/lib/errorHandling";

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

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: widget.id,
    data: { widget },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    rotate: `${widget.rotation || 0}deg`,
    zIndex: isDragging ? 50 : isSelected ? 10 : 1,
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
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
      className={`widget widget-note absolute ${isDragging ? 'dragging' : ''} ${isSelected ? 'ring-2 ring-garden-primary' : ''}`}
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
      
      {isEditing ? (
        <div className="relative">
          <textarea
            autoFocus
            className="w-full h-full bg-transparent border-none focus:outline-none resize-none"
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
          />
          {validationError && (
            <div className="absolute -bottom-6 left-0 text-xs text-red-600 bg-white px-2 py-1 rounded shadow-lg z-50">
              {validationError}
            </div>
          )}
        </div>
      ) : (
        <p className="min-h-[100px] break-words font-handwriting">{widget.content}</p>
      )}
    </div>
  );
};

export default Note;
