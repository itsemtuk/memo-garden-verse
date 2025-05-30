
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
    
    if (widget) {
      console.log('=== DRAG START ===');
      console.log('Widget ID:', widgetId);
      console.log('Initial position:', widget.position);
      
      setDraggedWidget({
        id: widgetId,
        startPosition: widget.position
      });
      
      setDraggedWidgets(new Map());
    }
  }, [widgets]);

  const handleDragMove = useCallback((event: DragMoveEvent) => {
    if (!draggedWidget || !event.delta) {
      return;
    }

    const newX = draggedWidget.startPosition.x + event.delta.x;
    const newY = draggedWidget.startPosition.y + event.delta.y;
    
    const widget = widgets.find(w => w.id === draggedWidget.id);
    const widgetWidth = typeof widget?.size?.width === 'string' ? 200 : (widget?.size?.width || 200);
    const widgetHeight = typeof widget?.size?.height === 'string' ? 100 : (widget?.size?.height || 100);
    
    const constrainedPosition = constrainPosition(newX, newY, widgetWidth, widgetHeight);
    
    setDraggedWidgets(prev => {
      const newMap = new Map(prev);
      newMap.set(draggedWidget.id, constrainedPosition);
      return newMap;
    });
    
    console.log('=== DRAG MOVE ===');
    console.log('Widget:', draggedWidget.id);
    console.log('Delta:', event.delta);
    console.log('New position:', constrainedPosition);
  }, [draggedWidget, widgets, constrainPosition]);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    console.log('=== DRAG END ===');
    console.log('Event:', event);
    
    if (!draggedWidget) {
      console.log('No dragged widget, returning');
      setDraggedWidgets(new Map());
      return;
    }

    const { active, delta } = event;
    const widgetId = active.id as string;
    
    console.log('Widget ID:', widgetId);
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

    console.log('Final position:', constrainedPosition);

    // Clear drag state immediately
    setDraggedWidgets(new Map());
    setDraggedWidget(null);

    // Update position in database
    try {
      console.log('Updating position in database...');
      await handleWidgetPositionChange(widgetId, constrainedPosition.x, constrainedPosition.y);
      console.log('Position update successful!');
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
