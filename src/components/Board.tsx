
import WidgetStore from "@/components/WidgetStore";
import { Widget } from "@/types";
import { PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useCallback } from "react";
import { useBoardData } from "@/hooks/useBoardData";
import { usePresence } from "@/hooks/usePresence";
import { useIsMobile } from "@/hooks/use-mobile";
import CursorDisplay from "@/components/collaboration/CursorDisplay";
import VirtualizedBoard from "@/components/VirtualizedBoard";
import BoardControls from "@/components/board/BoardControls";
import EmptyBoardState from "@/components/board/EmptyBoardState";
import MobileWidgetStore from "@/components/board/MobileWidgetStore";
import { useBoardDragHandling } from "@/hooks/useBoardDragHandling";
import { useBoardState } from "@/hooks/useBoardState";
import { useBoardWidgetControls } from "@/components/board/BoardWidgetControls";

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

  const {
    boardRef,
    draggedWidgets,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    constrainPosition
  } = useBoardDragHandling({ widgets, handleWidgetPositionChange });

  const {
    selectedWidgetId,
    centerPosition,
    showMobileWidgetStore,
    setSelectedWidgetId,
    setShowMobileWidgetStore,
    handleWidgetSelect,
    handleBoardClick
  } = useBoardState({ 
    widgets, 
    onUpdate, 
    boardId, 
    updateCursor, 
    updateSelection,
    boardRef 
  });

  const {
    handleRotateWidget,
    handleBringWidgetToFront,
    handleSendWidgetToBack,
    handleDeleteSelectedWidget
  } = useBoardWidgetControls({
    selectedWidgetId,
    widgets,
    handleUpdateWidgetSettings,
    handleBringToFront,
    handleSendToBack,
    handleDeleteWidget,
    setSelectedWidgetId
  });

  // Configure sensors with more permissive settings for better drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1, // Very small distance to start drag
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 50, // Short delay for touch
        tolerance: 5,
      },
    })
  );

  const handleWidgetAdded = useCallback((widget: Widget) => {
    console.log('Widget being added to board:', widget);
    
    // Ensure widget is placed within board boundaries
    const constrainedPosition = constrainPosition(
      widget.position.x, 
      widget.position.y, 
      typeof widget.size?.width === 'string' ? 200 : (widget.size?.width || 200),
      typeof widget.size?.height === 'string' ? 100 : (widget.size?.height || 100)
    );
    
    const constrainedWidget = {
      ...widget,
      position: constrainedPosition
    };
    
    handleAddWidget(constrainedWidget);
    setShowMobileWidgetStore(false);
  }, [handleAddWidget, constrainPosition, setShowMobileWidgetStore]);

  if (loading) {
    return (
      <div className="cork-board relative w-full h-[calc(100vh-64px)] overflow-hidden flex items-center justify-center">
        <div className="text-garden-text">Loading board...</div>
      </div>
    );
  }

  console.log('Board: Rendering board with widgets:', widgets.length);
  console.log('Board: Sensors configured:', sensors.length);

  return (
    <div 
      className={`relative w-full ${
        isMobile 
          ? 'h-[calc(100vh-56px)] touch-pan-x touch-pan-y' 
          : 'h-[calc(100vh-64px)]'
      } overflow-hidden`}
      onClick={handleBoardClick}
      ref={boardRef}
    >
      {widgets.length === 0 && <EmptyBoardState />}

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
        <MobileWidgetStore
          showMobileWidgetStore={showMobileWidgetStore}
          setShowMobileWidgetStore={setShowMobileWidgetStore}
          onAddWidget={handleWidgetAdded}
          centerPosition={centerPosition}
          boardId={boardId}
        />
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
