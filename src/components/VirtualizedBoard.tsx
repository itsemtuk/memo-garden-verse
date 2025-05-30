
import React from 'react';
import { DndContext, DragEndEvent, DragStartEvent, DragMoveEvent, useDraggable } from "@dnd-kit/core";
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
  draggedWidgets?: Map<string, { x: number; y: number }>;
  readonly?: boolean;
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
  draggedWidgets = new Map(),
  readonly = false,
}) => {
  const { parentRef, rowVirtualizer, widgetRows, ROW_HEIGHT } = useBoardVirtualization({ widgets });

  console.log('VirtualizedBoard rendering with widgets:', widgets.length);
  console.log('Widget rows:', widgetRows.length);

  return (
    <div 
      ref={parentRef}
      className="cork-board board-canvas relative w-full overflow-auto select-none h-[calc(100vh-64px)]"
      style={{ contain: 'layout style paint' }}
    >
      <DndContext 
        sensors={readonly ? [] : sensors} 
        onDragStart={readonly ? () => {} : onDragStart}
        onDragMove={readonly ? () => {} : onDragMove}
        onDragEnd={readonly ? () => {} : onDragEnd}
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
            
            console.log(`Rendering virtual row ${virtualRow.index} with ${rowWidgets.length} widgets`);
            
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
                  rowHeight={virtualRow.size}
                  selectedWidgetId={selectedWidgetId}
                  onWidgetSelect={onWidgetSelect}
                  onUpdateWidget={onUpdateWidget}
                  onUpdateWidgetSettings={onUpdateWidgetSettings}
                  draggedWidgets={draggedWidgets}
                  readonly={readonly}
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
