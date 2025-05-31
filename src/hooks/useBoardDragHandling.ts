
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
    console.log('Event details:', event);
    
    if (widget) {
      console.log('Widget ID:', widgetId);
      console.log('Initial position:', widget.position);
      
      setDraggedWidget({
        id: widgetId,
        startPosition: { ...widget.position }
      });
      
      // Clear any existing dragged positions and set initial dragged position
      const newDraggedWidgets = new Map();
      newDraggedWidgets.set(widgetId, { ...widget.position });
      setDraggedWidgets(newDraggedWidgets);
      console.log('Drag state initialized with position:', widget.position);
    } else {
      console.error('Widget not found for drag start:', widgetId);
    }
  }, [widgets]);

  const handleDragMove = useCallback((event: DragMoveEvent) => {
    if (!draggedWidget || !event.delta) {
      console.log('DragMove: Ignoring - no dragged widget or delta', { draggedWidget, delta: event.delta });
      return;
    }

    console.log('=== DRAG MOVE EVENT ===');
    console.log('Delta:', event.delta);
    console.log('Dragged widget:', draggedWidget.id);
    console.log('Start position:', draggedWidget.startPosition);

    const newX = draggedWidget.startPosition.x + event.delta.x;
    const newY = draggedWidget.startPosition.y + event.delta.y;
    
    const widget = widgets.find(w => w.id === draggedWidget.id);
    const widgetWidth = typeof widget?.size?.width === 'string' ? 200 : (widget?.size?.width || 200);
    const widgetHeight = typeof widget?.size?.height === 'string' ? 100 : (widget?.size?.height || 100);
    
    const constrainedPosition = constrainPosition(newX, newY, widgetWidth, widgetHeight);
    
    console.log('DragMove: New position calculation:');
    console.log('  Raw position:', { x: newX, y: newY });
    console.log('  Constrained position:', constrainedPosition);
    
    setDraggedWidgets(prev => {
      const newMap = new Map(prev);
      newMap.set(draggedWidget.id, constrainedPosition);
      console.log('DragMove: Updated dragged widgets map:', Array.from(newMap.entries()));
      return newMap;
    });
  }, [draggedWidget, widgets, constrainPosition]);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    console.log('=== DRAG END EVENT ===');
    console.log('Event active ID:', event.active.id);
    console.log('Event delta:', event.delta);
    console.log('Current dragged widget:', draggedWidget);
    console.log('Event details:', event);
    
    if (!draggedWidget) {
      console.log('DragEnd: No dragged widget, clearing state and returning');
      setDraggedWidgets(new Map());
      return;
    }

    const { active, delta } = event;
    const widgetId = active.id as string;
    
    console.log('DragEnd: Processing drag end for widget:', widgetId);
    console.log('DragEnd: Start position:', draggedWidget.startPosition);
    console.log('DragEnd: Delta:', delta);
    
    if (!delta) {
      console.log('DragEnd: No delta, clearing state');
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

    console.log('DragEnd: Final position calculation:');
    console.log('  Start position:', draggedWidget.startPosition);
    console.log('  Delta applied:', { x: newX, y: newY });
    console.log('  Final constrained position:', constrainedPosition);

    // Clear drag state immediately to prevent UI issues
    setDraggedWidgets(new Map());
    setDraggedWidget(null);
    console.log('DragEnd: Drag state cleared');

    // Only update if position actually changed
    const hasChanged = constrainedPosition.x !== draggedWidget.startPosition.x || 
                      constrainedPosition.y !== draggedWidget.startPosition.y;
    
    if (hasChanged) {
      try {
        console.log('DragEnd: Position changed, updating database...');
        console.log('DragEnd: Calling handleWidgetPositionChange with:', widgetId, constrainedPosition.x, constrainedPosition.y);
        await handleWidgetPositionChange(widgetId, constrainedPosition.x, constrainedPosition.y);
        console.log('DragEnd: Position update completed successfully!');
      } catch (error) {
        console.error('DragEnd: Failed to update widget position:', error);
      }
    } else {
      console.log('DragEnd: Position unchanged, skipping database update');
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
