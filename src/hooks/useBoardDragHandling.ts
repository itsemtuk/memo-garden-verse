
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
    
    console.log('=== DRAG START EVENT ===');
    console.log('Active ID:', event.active.id);
    console.log('Widget found:', !!widget);
    
    if (widget) {
      console.log('Widget ID:', widgetId);
      console.log('Initial position:', widget.position);
      
      setDraggedWidget({
        id: widgetId,
        startPosition: widget.position
      });
      
      // Clear any existing dragged positions
      setDraggedWidgets(new Map());
      console.log('Drag state initialized');
    } else {
      console.error('Widget not found for drag start:', widgetId);
    }
  }, [widgets]);

  const handleDragMove = useCallback((event: DragMoveEvent) => {
    if (!draggedWidget || !event.delta) {
      console.log('Drag move ignored - no dragged widget or delta');
      return;
    }

    console.log('=== DRAG MOVE EVENT ===');
    console.log('Delta:', event.delta);
    console.log('Dragged widget:', draggedWidget.id);

    const newX = draggedWidget.startPosition.x + event.delta.x;
    const newY = draggedWidget.startPosition.y + event.delta.y;
    
    const widget = widgets.find(w => w.id === draggedWidget.id);
    const widgetWidth = typeof widget?.size?.width === 'string' ? 200 : (widget?.size?.width || 200);
    const widgetHeight = typeof widget?.size?.height === 'string' ? 100 : (widget?.size?.height || 100);
    
    const constrainedPosition = constrainPosition(newX, newY, widgetWidth, widgetHeight);
    
    console.log('New unconstrained position:', { x: newX, y: newY });
    console.log('Constrained position:', constrainedPosition);
    
    setDraggedWidgets(prev => {
      const newMap = new Map(prev);
      newMap.set(draggedWidget.id, constrainedPosition);
      console.log('Updated dragged widgets map:', newMap);
      return newMap;
    });
  }, [draggedWidget, widgets, constrainPosition]);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    console.log('=== DRAG END EVENT ===');
    console.log('Event active ID:', event.active.id);
    console.log('Event delta:', event.delta);
    console.log('Current dragged widget:', draggedWidget);
    
    if (!draggedWidget) {
      console.log('No dragged widget, clearing state and returning');
      setDraggedWidgets(new Map());
      return;
    }

    const { active, delta } = event;
    const widgetId = active.id as string;
    
    console.log('Processing drag end for widget:', widgetId);
    console.log('Start position:', draggedWidget.startPosition);
    console.log('Delta:', delta);
    
    if (!delta || (delta.x === 0 && delta.y === 0)) {
      console.log('No movement detected, clearing state');
      setDraggedWidget(null);
      setDraggedWidgets(new Map());
      return;
    }
    
    const newX = draggedWidget.startPosition.x + delta.x;
    const newY = draggedWidget.startPosition.y + delta.y;

    const widget = widgets.find(w => w.id === widgetId);
    const widgetWidth = typeof widget?.size?.width === 'string' ? 200 : (widget?.size?.width || 200);
    const widgetHeight = typeof widget?.size?.height === 'string' ? 100 : (widget?.size?.height || 100);
    
    const constrainedPosition = constrainPosition(newX, newY, widgetWidth, widgetHeight);

    console.log('Final position calculation:');
    console.log('  Raw position:', { x: newX, y: newY });
    console.log('  Constrained position:', constrainedPosition);

    // Clear drag state immediately to prevent UI issues
    setDraggedWidgets(new Map());
    setDraggedWidget(null);
    console.log('Drag state cleared');

    // Update position in database
    try {
      console.log('Calling handleWidgetPositionChange with:', widgetId, constrainedPosition.x, constrainedPosition.y);
      await handleWidgetPositionChange(widgetId, constrainedPosition.x, constrainedPosition.y);
      console.log('Position update completed successfully!');
    } catch (error) {
      console.error('Failed to update widget position:', error);
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
