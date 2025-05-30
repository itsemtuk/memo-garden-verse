
import React from 'react';
import { DndContext, DragEndEvent, DragStartEvent, DragMoveEvent } from "@dnd-kit/core";
import { Widget } from "@/types";
import { useBoardVirtualization } from '@/hooks/useBoardVirtualization';
import WidgetRow from '@/components/board/WidgetRow';

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
  const { parentRef, rowVirtualizer, widgetRows, ROW_HEIGHT } = useBoardVirtualization({ widgets });

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
                <WidgetRow
                  widgets={rowWidgets}
                  rowHeight={ROW_HEIGHT}
                  selectedWidgetId={selectedWidgetId}
                  onWidgetSelect={onWidgetSelect}
                  onUpdateWidget={onUpdateWidget}
                  onUpdateWidgetSettings={onUpdateWidgetSettings}
                />
              </div>
            );
          })}
        </div>
      </DndContext>
    </div>
  );
};

export default VirtualizedBoard;
