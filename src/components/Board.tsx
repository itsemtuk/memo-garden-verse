
import Note from "@/components/widgets/Note";
import ImageWidget from "@/components/widgets/ImageWidget";
import AddWidgetMenu from "@/components/AddWidgetMenu";
import { Widget } from "@/types";
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface BoardProps {
  widgets: Widget[];
  onUpdate: (widgets: Widget[]) => void;
}

const Board = ({ widgets, onUpdate }: BoardProps) => {
  const [boardWidgets, setBoardWidgets] = useState<Widget[]>(widgets);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
  const [centerPosition, setCenterPosition] = useState({ x: 400, y: 300 });
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBoardWidgets(widgets);
  }, [widgets]);
  
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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const widgetId = active.id as string;
    
    setBoardWidgets((currentWidgets) => {
      return currentWidgets.map((widget) => {
        if (widget.id === widgetId) {
          return {
            ...widget,
            position: {
              x: widget.position.x + delta.x,
              y: widget.position.y + delta.y,
            },
          };
        }
        return widget;
      });
    });
  };

  const handleAddWidget = useCallback((widget: Widget) => {
    const updatedWidgets = [...boardWidgets, widget];
    setBoardWidgets(updatedWidgets);
    onUpdate(updatedWidgets);
    setSelectedWidgetId(widget.id);
  }, [boardWidgets, onUpdate]);
  
  const handleUpdateWidget = useCallback((widgetId: string, updatedContent: string) => {
    const updatedWidgets = boardWidgets.map((widget) => {
      if (widget.id === widgetId) {
        return {
          ...widget,
          content: updatedContent,
          updatedAt: new Date(),
        };
      }
      return widget;
    });
    
    setBoardWidgets(updatedWidgets);
    onUpdate(updatedWidgets);
  }, [boardWidgets, onUpdate]);

  const handleBoardClick = () => {
    setSelectedWidgetId(null);
  };

  useEffect(() => {
    // Save changes to parent when widgets change
    onUpdate(boardWidgets);
  }, [boardWidgets, onUpdate]);

  return (
    <div 
      className="cork-board relative w-full h-[calc(100vh-64px)] overflow-auto"
      onClick={handleBoardClick}
      ref={boardRef}
    >
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        {boardWidgets.map((widget) => {
          if (widget.type === "note") {
            return (
              <Note
                key={widget.id}
                widget={widget}
                isSelected={selectedWidgetId === widget.id}
                onClick={() => setSelectedWidgetId(widget.id)}
                onUpdate={(content) => handleUpdateWidget(widget.id, content)}
              />
            );
          }
          
          if (widget.type === "image") {
            return (
              <ImageWidget
                key={widget.id}
                widget={widget}
                isSelected={selectedWidgetId === widget.id}
                onClick={() => setSelectedWidgetId(widget.id)}
              />
            );
          }
          
          return null;
        })}
      </DndContext>

      <AddWidgetMenu onAddWidget={handleAddWidget} centerPosition={centerPosition} />
    </div>
  );
};

export default Board;
