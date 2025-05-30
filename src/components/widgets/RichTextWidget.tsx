
import { Widget } from "@/types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { FileText, Bold, Italic, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface RichTextWidgetProps {
  widget: Widget;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (settings: any) => void;
}

const RichTextWidget = ({ widget, isSelected, onClick, onUpdate }: RichTextWidgetProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(widget.settings?.content || '');

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: widget.id,
    data: { widget },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    rotate: `${widget.rotation || 0}deg`,
    zIndex: isDragging ? 1000 : (widget.settings?.zIndex || 1),
  };

  const saveContent = () => {
    onUpdate({ ...widget.settings, content });
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      className={`widget absolute bg-white rounded-lg shadow-lg border-2 transition-all duration-200 ${
        isDragging ? 'dragging shadow-xl scale-105' : ''
      } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={{
        ...style,
        left: `${widget.position.x}px`,
        top: `${widget.position.y}px`,
        width: widget.size?.width || "320px",
        height: widget.size?.height || "240px",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      {...attributes}
      {...listeners}
    >
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3 border-b pb-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">Rich Text</h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(!isEditing);
            }}
            className="ml-auto"
          >
            Edit
          </Button>
        </div>

        {isEditing ? (
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex gap-1">
              <Button size="sm" variant="outline">
                <Bold className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="outline">
                <Italic className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="outline">
                <Link className="w-3 h-3" />
              </Button>
            </div>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder="Write your formatted text here..."
              className="flex-1 resize-none"
            />
            <Button size="sm" onClick={saveContent}>
              Save
            </Button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="text-sm whitespace-pre-wrap">
              {content || 'Click Edit to add rich text content...'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RichTextWidget;
