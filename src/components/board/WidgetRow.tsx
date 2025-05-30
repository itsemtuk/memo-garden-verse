
import React, { memo } from 'react';
import { WidgetRenderer } from '@/components/widgets/WidgetRegistry';
import { Widget } from '@/types';

interface WidgetRowProps {
  widgets: Widget[];
  rowHeight: number;
  selectedWidgetId: string | null;
  onWidgetSelect: (widgetId: string) => void;
  onUpdateWidget: (widgetId: string, content: string) => void;
  onUpdateWidgetSettings?: (widgetId: string, settings: any) => void;
  draggedWidgets?: Map<string, { x: number; y: number }>;
}

const WidgetRow = memo(({ 
  widgets, 
  rowHeight, 
  selectedWidgetId,
  onWidgetSelect,
  onUpdateWidget,
  onUpdateWidgetSettings,
  draggedWidgets = new Map()
}: WidgetRowProps) => {
  return (
    <>
      {widgets.map((widget) => {
        // Use dragged position if available, otherwise use widget's stored position
        const draggedPos = draggedWidgets.get(widget.id);
        const position = draggedPos || widget.position;
        
        return (
          <div
            key={`${widget.id}-${widget.updatedAt?.getTime() || Date.now()}`}
            style={{
              position: 'absolute',
              left: `${position.x}px`,
              top: `${position.y % rowHeight}px`,
              transform: `rotate(${widget.rotation || 0}deg)`,
              zIndex: widget.settings?.zIndex || 1,
              transition: draggedPos ? 'none' : 'transform 0.1s ease-out', // Smooth transition only when not dragging
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
        );
      })}
    </>
  );
});

WidgetRow.displayName = 'WidgetRow';

export default WidgetRow;
