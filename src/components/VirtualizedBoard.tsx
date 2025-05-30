
import React from 'react';
import { DndContext, DragEndEvent, DragStartEvent, DragMoveEvent } from "@dnd-kit/core";
import { Widget } from "@/types";
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
  console.log('VirtualizedBoard rendering with widgets:', widgets.length);

  return (
    <div 
      className="cork-board board-canvas relative w-full h-[calc(100vh-64px)] bg-cork-pattern select-none overflow-hidden"
      style={{ 
        backgroundImage: 'radial-gradient(circle at 20px 20px, #8B4513 2px, transparent 2px)',
        backgroundSize: '40px 40px',
        backgroundColor: '#D2B48C'
      }}
    >
      <DndContext 
        sensors={readonly ? [] : sensors} 
        onDragStart={readonly ? () => {} : onDragStart}
        onDragMove={readonly ? () => {} : onDragMove}
        onDragEnd={readonly ? () => {} : onDragEnd}
      >
        <div className="relative w-full h-full">
          <WidgetRow
            widgets={widgets}
            rowHeight={0}
            selectedWidgetId={selectedWidgetId}
            onWidgetSelect={onWidgetSelect}
            onUpdateWidget={onUpdateWidget}
            onUpdateWidgetSettings={onUpdateWidgetSettings}
            draggedWidgets={draggedWidgets}
            readonly={readonly}
          />
        </div>
      </DndContext>
    </div>
  );
};

export default VirtualizedBoard;
