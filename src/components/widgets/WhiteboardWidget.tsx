
import { Widget } from "@/types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState, useRef } from "react";
import { Brush, Eraser, Circle, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WhiteboardWidgetProps {
  widget: Widget;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (settings: any) => void;
}

const WhiteboardWidget = ({ widget, isSelected, onClick, onUpdate }: WhiteboardWidgetProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('brush');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: widget.id,
    data: { widget },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    rotate: `${widget.rotation || 0}deg`,
    zIndex: isDragging ? 1000 : (widget.settings?.zIndex || 1),
  };

  const startDrawing = (e: React.MouseEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
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
        width: widget.size?.width || "400px",
        height: widget.size?.height || "300px",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      {...attributes}
      {...listeners}
    >
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-2 border-b pb-2">
          <div className="flex items-center gap-2">
            <Brush className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-800">Whiteboard</h3>
          </div>
          <div className="flex items-center gap-1">
            <Button size="sm" variant={tool === 'brush' ? 'default' : 'outline'} onClick={() => setTool('brush')}>
              <Brush className="w-3 h-3" />
            </Button>
            <Button size="sm" variant={tool === 'eraser' ? 'default' : 'outline'} onClick={() => setTool('eraser')}>
              <Eraser className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={clearCanvas}>
              Clear
            </Button>
          </div>
        </div>

        <div className="flex-1 border rounded">
          <canvas
            ref={canvasRef}
            width={350}
            height={200}
            className="w-full h-full cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>
      </div>
    </div>
  );
};

export default WhiteboardWidget;
