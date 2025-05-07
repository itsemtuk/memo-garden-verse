
import { Widget } from "@/types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

interface NoteProps {
  widget: Widget;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (updatedContent: string) => void;
}

const Note = ({ widget, isSelected, onClick, onUpdate }: NoteProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [noteContent, setNoteContent] = useState(widget.content);

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
  };

  const handleBlur = () => {
    setIsEditing(false);
    onUpdate(noteContent);
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
        <textarea
          autoFocus
          className="w-full h-full bg-transparent border-none focus:outline-none resize-none"
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          onBlur={handleBlur}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <p className="min-h-[100px] break-words font-handwriting">{widget.content}</p>
      )}
    </div>
  );
};

export default Note;
