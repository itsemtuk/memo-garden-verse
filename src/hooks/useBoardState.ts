
import { useState, useEffect, useCallback } from 'react';
import { Widget } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";

interface UseBoardStateProps {
  widgets: Widget[];
  onUpdate?: (widgets: Widget[]) => void;
  boardId: string;
  updateCursor: (x: number, y: number) => void;
  updateSelection: (widgetId: string | null) => void;
  boardRef: React.RefObject<HTMLDivElement>;
}

export const useBoardState = ({ 
  widgets, 
  onUpdate, 
  boardId, 
  updateCursor, 
  updateSelection,
  boardRef 
}: UseBoardStateProps) => {
  const isMobile = useIsMobile();
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
  const [centerPosition, setCenterPosition] = useState({ x: 200, y: 150 });
  const [showMobileWidgetStore, setShowMobileWidgetStore] = useState(false);

  // Debug logging for widgets
  useEffect(() => {
    console.log('Board widgets updated:', widgets.length, widgets);
    if (widgets.length === 0) {
      console.log('No widgets found on board');
    } else {
      widgets.forEach(widget => {
        console.log(`Widget ${widget.id}: type=${widget.type}, position=(${widget.position.x}, ${widget.position.y})`);
      });
    }
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
  }, [isMobile, boardRef]);

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
  }, [updateCursor, isMobile, boardRef]);

  // Update selection for collaboration
  useEffect(() => {
    updateSelection(selectedWidgetId);
  }, [selectedWidgetId, updateSelection]);

  const handleWidgetSelect = useCallback((widgetId: string) => {
    setSelectedWidgetId(widgetId);
  }, []);

  const handleBoardClick = useCallback((e: React.MouseEvent) => {
    // Only deselect if clicking on the board itself, not on widgets
    if (e.target === e.currentTarget) {
      setSelectedWidgetId(null);
    }
  }, []);

  return {
    selectedWidgetId,
    centerPosition,
    showMobileWidgetStore,
    setSelectedWidgetId,
    setShowMobileWidgetStore,
    handleWidgetSelect,
    handleBoardClick
  };
};
