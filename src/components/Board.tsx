
import WidgetStore from "@/components/WidgetStore";
import { Widget } from "@/types";
import { DragEndEvent, DragStartEvent, DragMoveEvent, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useCallback, useEffect, useRef, useState } from "react";
import { useBoardData } from "@/hooks/useBoardData";
import { usePresence } from "@/hooks/usePresence";
import { Plus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import CursorDisplay from "@/components/collaboration/CursorDisplay";
import VirtualizedBoard from "@/components/VirtualizedBoard";
import BoardControls from "@/components/board/BoardControls";
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface BoardProps {
  boardId: string;
  onUpdate?: (widgets: Widget[]) => void;
}

const Board = ({ boardId, onUpdate }: BoardProps) => {
  const isMobile = useIsMobile();
  
  const {
    widgets,
    loading,
    handleAddWidget,
    handleUpdateWidget,
    handleWidgetPositionChange,
    handleUpdateWidgetSettings,
    handleBringToFront,
    handleSendToBack,
    handleDeleteWidget,
  } = useBoardData(boardId);

  const { otherUsers, updateCursor, updateSelection } = usePresence(boardId);

  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
  const [centerPosition, setCenterPosition] = useState({ x: 200, y: 150 });
  const [draggedWidget, setDraggedWidget] = useState<{ id: string; startPosition: { x: number; y: number } } | null>(null);
  const [showMobileWidgetStore, setShowMobileWidgetStore] = useState(false);
  const [draggedWidgets, setDraggedWidgets] = useState<Map<string, { x: number; y: number }>>(new Map());
  const boardRef = useRef<HTMLDivElement>(null);

  // Debug logging for widgets
  useEffect(() => {
    console.log('Board widgets updated:', widgets.length, widgets);
  }, [widgets]);

  // Update center position based on viewport
  useEffect(() => {
    const updateCenterPosition = () => {
      if (boardRef.current) {
        const rect = boardRef.current.getBoundingClientRect();
        setCenterPosition({
          x: isMobile ? rect.width / 2 : rect.width / 2,
          y: isMobile ? rect.height / 3 : rect.height / 2,
        });
      }
    };
    
    updateCenterPosition();
    window.addEventListener('resize', updateCenterPosition);
    
    return () => {
      window.removeEventListener('resize', updateCenterPosition);
    };
  }, [isMobile]);

  // Notify parent component of widget changes
  useEffect(() => {
    if (onUpdate) {
      onUpdate(widgets);
    }
  }, [widgets, onUpdate]);

  // Track cursor movement for collaboration
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (boardRef.current) {
        const rect = boardRef.current.getBoundingClientRect();
        updateCursor(e.clientX - rect.left, e.clientY - rect.top);
      }
    };

    if (boardRef.current && !isMobile) {
      boardRef.current.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (boardRef.current) {
        boardRef.current.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [updateCursor, isMobile]);

  // Update selection for collaboration
  useEffect(() => {
    updateSelection(selectedWidgetId);
  }, [selectedWidgetId, updateSelection]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: isMobile ? 8 : 2,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: isMobile ? 100 : 50,
        tolerance: isMobile ? 8 : 3,
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
      setSelectedWidgetId(widgetId);
      console.log('Drag started for widget:', widgetId);
    }
  }, [widgets]);

  const handleDragMove = useCallback((event: DragMoveEvent) => {
    if (draggedWidget && event.delta) {
      const newX = draggedWidget.startPosition.x + event.delta.x;
      const newY = draggedWidget.startPosition.y + event.delta.y;
      
      // Update temporary drag positions for smooth animation
      setDraggedWidgets(prev => new Map(prev.set(draggedWidget.id, { x: newX, y: newY })));
    }
  }, [draggedWidget]);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, delta } = event;
    const widgetId = active.id as string;
    
    if (!draggedWidget || !delta) {
      setDraggedWidget(null);
      setDraggedWidgets(new Map());
      return;
    }

    const newX = draggedWidget.startPosition.x + delta.x;
    const newY = draggedWidget.startPosition.y + delta.y;

    console.log('Drag end - widget:', widgetId, 'new position:', { newX, newY });

    try {
      // Clear temporary drag state immediately for responsiveness
      setDraggedWidgets(new Map());
      setDraggedWidget(null);
      
      // Persist to database
      await handleWidgetPositionChange(widgetId, newX, newY);
      console.log('Widget position updated successfully');
    } catch (error) {
      console.error('Failed to update widget position:', error);
      // Revert on error by refreshing
      setDraggedWidgets(new Map());
    }
  }, [draggedWidget, handleWidgetPositionChange]);

  const handleBoardClick = (e: React.MouseEvent) => {
    // Only deselect if clicking on the board itself, not on widgets
    if (e.target === e.currentTarget) {
      setSelectedWidgetId(null);
    }
  };

  const handleWidgetSelect = (widgetId: string) => {
    setSelectedWidgetId(widgetId);
  };

  const handleRotateWidget = () => {
    if (selectedWidgetId) {
      const widget = widgets.find(w => w.id === selectedWidgetId);
      if (widget) {
        const currentRotation = widget.rotation || 0;
        const newRotation = (currentRotation + 15) % 360;
        handleUpdateWidgetSettings(selectedWidgetId, { 
          ...widget.settings,
          rotation: newRotation 
        });
      }
    }
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

  const handleDeleteSelectedWidget = () => {
    if (selectedWidgetId) {
      handleDeleteWidget(selectedWidgetId);
      setSelectedWidgetId(null);
    }
  };

  const handleWidgetAdded = useCallback((widget: Widget) => {
    console.log('Widget being added to board:', widget);
    handleAddWidget(widget);
    setShowMobileWidgetStore(false);
  }, [handleAddWidget]);

  if (loading) {
    return (
      <div className="cork-board relative w-full h-[calc(100vh-64px)] overflow-auto flex items-center justify-center">
        <div className="text-garden-text">Loading board...</div>
      </div>
    );
  }

  console.log('Rendering board with widgets:', widgets.length);

  return (
    <div 
      className={`relative w-full ${
        isMobile 
          ? 'h-[calc(100vh-56px)] touch-pan-x touch-pan-y' 
          : 'h-[calc(100vh-64px)]'
      }`}
      onClick={handleBoardClick}
      ref={boardRef}
    >
      <VirtualizedBoard
        widgets={widgets}
        selectedWidgetId={selectedWidgetId}
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onWidgetSelect={handleWidgetSelect}
        onUpdateWidget={handleUpdateWidget}
        onUpdateWidgetSettings={handleUpdateWidgetSettings}
        draggedWidgets={draggedWidgets}
      />

      {/* Collaboration cursors */}
      <CursorDisplay otherUsers={otherUsers} />

      {/* Board Controls */}
      <BoardControls
        selectedWidgetId={selectedWidgetId}
        onRotateWidget={handleRotateWidget}
        onBringToFront={handleBringWidgetToFront}
        onSendToBack={handleSendWidgetToBack}
        onDeleteWidget={handleDeleteSelectedWidget}
      />

      {/* Widget Store */}
      {isMobile ? (
        <Drawer open={showMobileWidgetStore} onOpenChange={setShowMobileWidgetStore}>
          <DrawerTrigger asChild>
            <button className="fixed bottom-4 right-4 w-16 h-16 bg-garden-primary text-white rounded-full shadow-xl flex items-center justify-center z-40 active:scale-95 transition-transform">
              <Plus className="w-7 h-7" />
            </button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[85vh]">
            <DrawerHeader>
              <DrawerTitle>Add Widget</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 pb-8 overflow-y-auto">
              <WidgetStore 
                onAddWidget={handleWidgetAdded} 
                centerPosition={centerPosition} 
                boardId={boardId}
                isMobile={true}
              />
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <WidgetStore 
          onAddWidget={handleWidgetAdded} 
          centerPosition={centerPosition} 
          boardId={boardId}
          isMobile={false}
        />
      )}
    </div>
  );
};

export default Board;
