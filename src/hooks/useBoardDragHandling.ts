
import { useCallback, useState, useRef } from 'react';
import { DragEndEvent, DragStartEvent, DragMoveEvent } from "@dnd-kit/core";
import { Widget } from "@/types";

interface UseBoardDragHandlingProps {
  widgets: Widget[];
  handleWidgetPositionChange: (widgetId: string, x: number, y: number) => Promise<void>;
}

export const useBoardDragHandling = ({ widgets, handleWidgetPositionChange }: UseBoardDragHandlingProps) => {
  const [draggedWidget, setDraggedWidget] = useState<{ id: string; startPosition: { x: number; y: number } } | null>(null);
  const [draggedWidgets, setDraggedWidgets] = useState<Map<string, { x: number; y: number }>>(new Map());
  const boardRef = useRef<HTMLDivElement>(null);

  // Constrain position to board boundaries
  const constrainPosition = useCallback((x: number, y: number, widgetWidth = 200, widgetHeight = 100) => {
    if (!boardRef.current) return { x: Math.max(0, x), y: Math.max(0, y) };
    
    const boardRect = boardRef.current.getBoundingClientRect();
    const maxX = Math.max(0, boardRect.width - widgetWidth);
    const maxY = Math.max(0, boardRect.height - widgetHeight);
    
    return {
      x: Math.max(0, Math.min(x, maxX)),
      y: Math.max(0, Math.min(y, maxY))
    };
  }, []);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const widgetId = event.active.id as string;
    const widget = widgets.find(w => w.id === widgetId);
    
    if (widget) {
      console.log('Drag started for widget:', widgetId, 'at position:', widget.position);
      setDraggedWidget({
        id: widgetId,
        startPosition: widget.position
      });
      
      // Clear any existing dragged positions
      setDraggedWidgets(new Map());
    }
  }, [widgets]);

  const handleDragMove = useCallback((event: DragMoveEvent) => {
    if (!draggedWidget || !event.delta) {
      return;
    }

    const newX = draggedWidget.startPosition.x + event.delta.x;
    const newY = draggedWidget.startPosition.y + event.delta.y;
    
    // Get widget dimensions for better constraint calculation
    const widget = widgets.find(w => w.id === draggedWidget.id);
    const widgetWidth = typeof widget?.size?.width === 'string' ? 200 : (widget?.size?.width || 200);
    const widgetHeight = typeof widget?.size?.height === 'string' ? 100 : (widget?.size?.height || 100);
    
    // Constrain to board boundaries
    const constrainedPosition = constrainPosition(newX, newY, widgetWidth, widgetHeight);
    
    // Update temporary drag positions for smooth animation
    setDraggedWidgets(prev => {
      const newMap = new Map(prev);
      newMap.set(draggedWidget.id, constrainedPosition);
      return newMap;
    });
    
    console.log('Drag move - widget:', draggedWidget.id, 'new position:', constrainedPosition);
  }, [draggedWidget, widgets, constrainPosition]);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    console.log('Drag end event:', event);
    
    if (!draggedWidget || !event.delta) {
      console.log('No drag data, clearing state');
      setDraggedWidget(null);
      setDraggedWidgets(new Map());
      return;
    }

    const { active, delta } = event;
    const widgetId = active.id as string;
    
    const newX = draggedWidget.startPosition.x + delta.x;
    const newY = draggedWidget.startPosition.y + delta.y;

    // Get widget dimensions for constraint calculation
    const widget = widgets.find(w => w.id === widgetId);
    const widgetWidth = typeof widget?.size?.width === 'string' ? 200 : (widget?.size?.width || 200);
    const widgetHeight = typeof widget?.size?.height === 'string' ? 100 : (widget?.size?.height || 100);
    
    // Constrain final position to board boundaries
    const constrainedPosition = constrainPosition(newX, newY, widgetWidth, widgetHeight);

    console.log('Drag end - widget:', widgetId, 'final constrained position:', constrainedPosition);
    console.log('Original position:', draggedWidget.startPosition, 'Delta:', delta);

    // Clear temporary drag state
    setDraggedWidgets(new Map());
    setDraggedWidget(null);

    // Only update if position actually changed
    const positionChanged = constrainedPosition.x !== draggedWidget.startPosition.x || 
                           constrainedPosition.y !== draggedWidget.startPosition.y;

    if (positionChanged) {
      try {
        console.log('Position changed, updating database for widget:', widgetId);
        await handleWidgetPositionChange(widgetId, constrainedPosition.x, constrainedPosition.y);
        console.log('Widget position updated successfully in database');
      } catch (error) {
        console.error('Failed to update widget position:', error);
        // Position will be corrected by real-time updates if the database update failed
      }
    } else {
      console.log('Position unchanged, skipping database update');
    }
  }, [draggedWidget, handleWidgetPositionChange, widgets, constrainPosition]);

  return {
    boardRef,
    draggedWidgets,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    constrainPosition
  };
};
