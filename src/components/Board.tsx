
import { WidgetRenderer } from "@/components/widgets/WidgetRegistry";
import WidgetStore from "@/components/WidgetStore";
import { Widget } from "@/types";
import { DndContext, DragEndEvent, DragStartEvent, DragMoveEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
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
    handleBringToFront,
    handleSendToBack,
  } = useBoardData(boardId);

  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
  const [centerPosition, setCenterPosition] = useState({ x: 400, y: 300 });
  const [draggedWidget, setDraggedWidget] = useState<{ id: string; startPosition: { x: number; y: number } } | null>(null);
  const [tempPosition, setTempPosition] = useState<{ x: number; y: number } | null>(null);
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
        distance: 3,
      },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const widgetId = event.active.id as string;
    const widget = widgets.find(w => w.id === widgetId);
    
    if (widget) {
      setDraggedWidget({
        id: widgetId,
        startPosition: widget.position
      });
      console.log('Drag started for widget:', widgetId);
    }
  }, [widgets]);

  const handleDragMove = useCallback((event: DragMoveEvent) => {
    if (draggedWidget) {
      const newX = draggedWidget.startPosition.x + event.delta.x;
      const newY = draggedWidget.startPosition.y + event.delta.y;
      setTempPosition({ x: newX, y: newY });
    }
  }, [draggedWidget]);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, delta } = event;
    const widgetId = active.id as string;
    
    if (!draggedWidget) return;

    const newX = draggedWidget.startPosition.x + delta.x;
    const newY = draggedWidget.startPosition.y + delta.y;

    console.log('Drag end - widget:', widgetId, 'new position:', { newX, newY });

    try {
      await handleWidgetPositionChange(widgetId, newX, newY);
      console.log('Widget position updated successfully');
    } catch (error) {
      console.error('Failed to update widget position:', error);
    } finally {
      setDraggedWidget(null);
      setTempPosition(null);
    }
  }, [draggedWidget, handleWidgetPositionChange]);

  const handleBoardClick = () => {
    setSelectedWidgetId(null);
  };

  const handleWidgetSelect = (widgetId: string) => {
    setSelectedWidgetId(widgetId);
  };

  const handleBringWidgetToFront = () => {
    if (selectedWidgetId) {
      handleBringToFront(selectedWidgetId);
    }
  };

  const handleSendWidgetToBack = () => {
    if (selectedWidgetId) {
      handleSendToBack(selectedWidgetId);
    }
  };

  if (loading) {
    return (
      <div className="cork-board relative w-full h-[calc(100vh-64px)] overflow-auto flex items-center justify-center">
        <div className="text-garden-text">Loading board...</div>
      </div>
    );
  }

  // Sort widgets by z-index for proper rendering order
  const sortedWidgets = [...widgets].sort((a, b) => (a.settings?.zIndex || 0) - (b.settings?.zIndex || 0));

  return (
    <div 
      className="cork-board board-canvas relative w-full h-[calc(100vh-64px)] overflow-auto"
      onClick={handleBoardClick}
      ref={boardRef}
    >
      <DndContext 
        sensors={sensors} 
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
      >
        {sortedWidgets.map((widget) => {
          // Use temp position during drag if this widget is being dragged
          const isBeingDragged = draggedWidget?.id === widget.id;
          const displayPosition = isBeingDragged && tempPosition ? tempPosition : widget.position;
          
          return (
            <WidgetRenderer
              key={`${widget.id}-${widget.updatedAt?.getTime() || Date.now()}`}
              widget={{
                ...widget,
                position: displayPosition
              }}
              isSelected={selectedWidgetId === widget.id}
              onClick={() => handleWidgetSelect(widget.id)}
              onUpdate={(content) => handleUpdateWidget(widget.id, content)}
              onUpdateSettings={(settings) => handleUpdateWidgetSettings && handleUpdateWidgetSettings(widget.id, settings)}
            />
          );
        })}
      </DndContext>

      {/* Layer controls for selected widget */}
      {selectedWidgetId && (
        <div className="fixed bottom-4 right-4 flex flex-col gap-2 bg-white p-2 rounded-lg shadow-lg border">
          <button
            onClick={handleBringWidgetToFront}
            className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Bring to Front
          </button>
          <button
            onClick={handleSendWidgetToBack}
            className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Send to Back
          </button>
        </div>
      )}

      <WidgetStore 
        onAddWidget={handleAddWidget} 
        centerPosition={centerPosition} 
        boardId={boardId}
      />
    </div>
  );
};

export default Board;
