
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
}

const WidgetRow = memo(({ 
  widgets, 
  rowHeight, 
  selectedWidgetId,
  onWidgetSelect,
  onUpdateWidget,
  onUpdateWidgetSettings 
}: WidgetRowProps) => {
  return (
    <>
      {widgets.map((widget) => (
        <div
          key={`${widget.id}-${widget.updatedAt?.getTime() || Date.now()}`}
          style={{
            position: 'absolute',
            left: `${widget.position.x}px`,
            top: `${widget.position.y % rowHeight}px`, // Position within the virtual row
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
    </>
  );
});

WidgetRow.displayName = 'WidgetRow';

export default WidgetRow;
