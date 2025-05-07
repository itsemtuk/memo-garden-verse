
import { Widget } from "@/types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface ImageWidgetProps {
  widget: Widget;
  isSelected: boolean;
  onClick: () => void;
}

const ImageWidget = ({ widget, isSelected, onClick }: ImageWidgetProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: widget.id,
    data: { widget },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    rotate: `${widget.rotation || 0}deg`,
    zIndex: isDragging ? 50 : isSelected ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      className={`widget widget-image absolute ${isDragging ? 'dragging' : ''} ${isSelected ? 'ring-2 ring-garden-primary' : ''}`}
      style={{
        ...style,
        left: `${widget.position.x}px`,
        top: `${widget.position.y}px`,
        maxWidth: "300px",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      {...attributes}
      {...listeners}
    >
      <div className="widget-pin widget-pin-left"></div>
      <div className="widget-pin widget-pin-right"></div>
      
      <div className="p-1 bg-white">
        <img 
          src={widget.content} 
          alt="Board image" 
          className="max-w-full h-auto object-cover"
          style={{
            width: widget.size?.width || "auto",
            height: widget.size?.height || "auto",
          }}
        />
      </div>
    </div>
  );
};

export default ImageWidget;
