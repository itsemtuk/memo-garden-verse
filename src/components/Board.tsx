import WidgetStore from "@/components/WidgetStore";
import { Widget } from "@/types";
import { DragEndEvent, DragStartEvent, DragMoveEvent, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useCallback, useEffect, useRef, useState } from "react";
import { useBoardData } from "@/hooks/useBoardData";
import { usePresence } from "@/hooks/usePresence";
import { Trash2, MoveUp, MoveDown, Plus, RotateCw } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import CursorDisplay from "@/components/collaboration/CursorDisplay";
import VirtualizedBoard from "@/components/VirtualizedBoard";
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
        distance: isMobile ? 10 : 3,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: isMobile ? 150 : 100,
        tolerance: isMobile ? 10 : 5,
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
    // Real-time position update during drag for smooth experience
    if (draggedWidget) {
      const newX = draggedWidget.startPosition.x + event.delta.x;
      const newY = draggedWidget.startPosition.y + event.delta.y;
      
      // Update widget position in real-time during drag
      const widget = widgets.find(w => w.id === draggedWidget.id);
      if (widget) {
        widget.position = { x: newX, y: newY };
      }
    }
  }, [draggedWidget, widgets]);

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
      />

      {/* Collaboration cursors */}
      <CursorDisplay otherUsers={otherUsers} />

      {selectedWidgetId && (
        <>
          {isMobile ? (
            // Mobile: Bottom drawer with controls
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-xl border z-50 min-w-[280px] justify-center">
              <button
                onClick={handleRotateWidget}
                className="p-3 text-xs bg-purple-500 text-white rounded-full hover:bg-purple-600 flex items-center justify-center shadow-lg active:scale-95 transition-transform min-w-[44px] min-h-[44px]"
                title="Rotate Widget"
              >
                <RotateCw className="w-5 h-5" />
              </button>
              <button
                onClick={handleBringWidgetToFront}
                className="p-3 text-xs bg-blue-500 text-white rounded-full hover:bg-blue-600 flex items-center justify-center shadow-lg active:scale-95 transition-transform min-w-[44px] min-h-[44px]"
                title="Bring to Front"
              >
                <MoveUp className="w-5 h-5" />
              </button>
              <button
                onClick={handleSendWidgetToBack}
                className="p-3 text-xs bg-gray-500 text-white rounded-full hover:bg-gray-600 flex items-center justify-center shadow-lg active:scale-95 transition-transform min-w-[44px] min-h-[44px]"
                title="Send to Back"
              >
                <MoveDown className="w-5 h-5" />
              </button>
              <button
                onClick={handleDeleteSelectedWidget}
                className="p-3 text-xs bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center shadow-lg active:scale-95 transition-transform min-w-[44px] min-h-[44px]"
                title="Delete Widget"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ) : (
            // Desktop: Side controls
            <div className="fixed left-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 bg-white p-2 rounded-lg shadow-lg border z-50">
              <button
                onClick={handleRotateWidget}
                className="px-3 py-2 text-xs bg-purple-500 text-white rounded hover:bg-purple-600 flex items-center gap-1"
                title="Rotate Widget"
              >
                <RotateCw className="w-3 h-3" />
              </button>
              <button
                onClick={handleBringWidgetToFront}
                className="px-3 py-2 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
                title="Bring to Front"
              >
                <MoveUp className="w-3 h-3" />
              </button>
              <button
                onClick={handleSendWidgetToBack}
                className="px-3 py-2 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center gap-1"
                title="Send to Back"
              >
                <MoveDown className="w-3 h-3" />
              </button>
              <button
                onClick={handleDeleteSelectedWidget}
                className="px-3 py-2 text-xs bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-1"
                title="Delete Widget"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Widget Store - Mobile optimized with fixed dual navigation */}
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
              />
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <WidgetStore 
          onAddWidget={handleWidgetAdded} 
          centerPosition={centerPosition} 
          boardId={boardId}
        />
      )}
    </div>
  );
};

export default Board;
