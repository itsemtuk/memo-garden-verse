
import React, { useRef, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { WidgetRenderer } from "@/components/widgets/WidgetRegistry";
import { Widget } from "@/types";
import { DndContext, DragEndEvent, DragStartEvent, DragMoveEvent } from "@dnd-kit/core";

interface VirtualizedBoardProps {
  widgets: Widget[];
  selectedWidgetId: string | null;
  sensors: any;
  onDragStart: (event: DragStartEvent) => void;
  onDragMove: (event: DragMoveEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
  onWidgetSelect: (widgetId: string) => void;
  onUpdateWidget: (widgetId: string, content: string) => void;
  onUpdateWidgetSettings?: (widgetId: string, settings: any) => void;
}

const VirtualizedBoard: React.FC<VirtualizedBoardProps> = ({
  widgets,
  selectedWidgetId,
  sensors,
  onDragStart,
  onDragMove,
  onDragEnd,
  onWidgetSelect,
  onUpdateWidget,
  onUpdateWidgetSettings,
}) => {
  const parentRef = useRef<HTMLDivElement>(null);

  // Sort widgets by z-index for proper rendering order
  const sortedWidgets = useMemo(() => 
    [...widgets].sort((a, b) => (a.settings?.zIndex || 0) - (b.settings?.zIndex || 0)), 
    [widgets]
  );

  // Group widgets by their Y position for better virtualization
  const widgetRows = useMemo(() => {
    const VIRTUAL_ROW_HEIGHT = 300; // Height of each virtual row
    const rowMap = new Map<number, Widget[]>();

    sortedWidgets.forEach(widget => {
      const rowIndex = Math.floor(widget.position.y / VIRTUAL_ROW_HEIGHT);
      if (!rowMap.has(rowIndex)) {
        rowMap.set(rowIndex, []);
      }
      rowMap.get(rowIndex)!.push(widget);
    });

    // Convert to array format for virtualizer
    const maxRow = Math.max(...Array.from(rowMap.keys()), 0);
    const rows: Widget[][] = [];
    for (let i = 0; i <= maxRow; i++) {
      rows[i] = rowMap.get(i) || [];
    }

    return rows;
  }, [sortedWidgets]);

  const rowVirtualizer = useVirtualizer({
    count: widgetRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 300, // Virtual row height
    overscan: 3, // Render 3 extra rows above and below viewport
  });

  return (
    <div 
      ref={parentRef}
      className="cork-board board-canvas relative w-full overflow-auto select-none h-[calc(100vh-64px)]"
      style={{ contain: 'layout style paint' }} // Optimize for performance
    >
      <DndContext 
        sensors={sensors} 
        onDragStart={onDragStart}
        onDragMove={onDragMove}
        onDragEnd={onDragEnd}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map(virtualRow => {
            const rowWidgets = widgetRows[virtualRow.index] || [];
            
            return (
              <div
                key={virtualRow.index}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {rowWidgets.map((widget) => (
                  <div
                    key={`${widget.id}-${widget.updatedAt?.getTime() || Date.now()}`}
                    style={{
                      position: 'absolute',
                      left: `${widget.position.x}px`,
                      top: `${widget.position.y % 300}px`, // Position within the virtual row
                      transform: `rotate(${widget.rotation || 0}deg)`,
                      zIndex: widget.settings?.zIndex || 1,
                    }}
                  >
                    <WidgetRenderer
                      widget={widget}
                      isSelected={selectedWidgetId === widget.id}
                      onClick={() => onWidgetSelect(widget.id)}
                      onUpdate={(content) => onUpdateWidget(widget.id, content)}
                      onUpdateSettings={(settings) => onUpdateWidgetSettings && onUpdateWidgetSettings(widget.id, settings)}
                    />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </DndContext>
    </div>
  );
};

export default VirtualizedBoard;
