
import { WidgetRenderer } from "@/components/widgets/WidgetRegistry";
import WidgetStore from "@/components/WidgetStore";
import { Widget } from "@/types";
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useCallback, useEffect, useRef, useState } from "react";
import { useBoardData } from "@/hooks/useBoardData";

interface BoardProps {
  boardId: string;
  onUpdate?: (widgets: Widget[]) => void;
}

const Board = ({ boardId, onUpdate }: BoardProps) => {
  const {
    widgets,
    loading,
    handleAddWidget,
    handleUpdateWidget,
    handleWidgetPositionChange,
    handleUpdateWidgetSettings,
  } = useBoardData(boardId);

  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
  const [centerPosition, setCenterPosition] = useState({ x: 400, y: 300 });
  const boardRef = useRef<HTMLDivElement>(null);

  // Update center position based on viewport
  useEffect(() => {
    const updateCenterPosition = () => {
      if (boardRef.current) {
        const rect = boardRef.current.getBoundingClientRect();
        setCenterPosition({
          x: rect.width / 2,
          y: rect.height / 2,
        });
      }
    };
    
    updateCenterPosition();
    window.addEventListener('resize', updateCenterPosition);
    
    return () => {
      window.removeEventListener('resize', updateCenterPosition);
    };
  }, []);

  // Notify parent component of widget changes
  useEffect(() => {
    if (onUpdate) {
      onUpdate(widgets);
    }
  }, [widgets, onUpdate]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, delta } = event;
    const widgetId = active.id as string;
    
    const widget = widgets.find(w => w.id === widgetId);
    if (!widget) return;

    const newX = widget.position.x + delta.x;
    const newY = widget.position.y + delta.y;

    try {
      await handleWidgetPositionChange(widgetId, newX, newY);
    } catch (error) {
      console.error('Failed to update widget position:', error);
    }
  }, [widgets, handleWidgetPositionChange]);

  const handleBoardClick = () => {
    setSelectedWidgetId(null);
  };

  if (loading) {
    return (
      <div className="cork-board relative w-full h-[calc(100vh-64px)] overflow-auto flex items-center justify-center">
        <div className="text-garden-text">Loading board...</div>
      </div>
    );
  }

  return (
    <div 
      className="cork-board board-canvas relative w-full h-[calc(100vh-64px)] overflow-auto"
      onClick={handleBoardClick}
      ref={boardRef}
    >
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        {widgets.map((widget) => (
          <WidgetRenderer
            key={widget.id}
            widget={widget}
            isSelected={selectedWidgetId === widget.id}
            onClick={() => setSelectedWidgetId(widget.id)}
            onUpdate={(content) => handleUpdateWidget(widget.id, content)}
            onUpdateSettings={(settings) => handleUpdateWidgetSettings && handleUpdateWidgetSettings(widget.id, settings)}
          />
        ))}
      </DndContext>

      <WidgetStore 
        onAddWidget={handleAddWidget} 
        centerPosition={centerPosition} 
        boardId={boardId}
      />
    </div>
  );
};

export default Board;
