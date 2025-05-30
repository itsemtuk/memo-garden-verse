
import React from 'react';
import { Widget } from '@/types';
import ResizableWidget from '@/components/widgets/ResizableWidget';

interface WidgetRowProps {
  widgets: Widget[];
  rowHeight: number;
  selectedWidgetId: string | null;
  onWidgetSelect: (widgetId: string) => void;
  onUpdateWidget: (widgetId: string, content: string) => void;
  onUpdateWidgetSettings?: (widgetId: string, settings: any) => void;
  draggedWidgets: Map<string, { x: number; y: number }>;
  readonly?: boolean;
}

const WidgetRow: React.FC<WidgetRowProps> = ({
  widgets,
  rowHeight,
  selectedWidgetId,
  onWidgetSelect,
  onUpdateWidget,
  onUpdateWidgetSettings,
  draggedWidgets,
  readonly = false,
}) => {
  return (
    <div className="relative w-full" style={{ height: `${rowHeight}px` }}>
      {widgets.map((widget) => {
        const draggedPosition = draggedWidgets.get(widget.id);
        const position = draggedPosition || widget.position;
        
        return (
          <div
            key={widget.id}
            className="absolute"
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
              zIndex: widget.settings?.zIndex || 1,
            }}
          >
            <ResizableWidget
              widget={widget}
              isSelected={selectedWidgetId === widget.id}
              onSelect={readonly ? () => {} : onWidgetSelect}
              onUpdateContent={readonly ? () => {} : onUpdateWidget}
              onUpdateSettings={readonly ? () => {} : onUpdateWidgetSettings}
              readonly={readonly}
            />
          </div>
        );
      })}
    </div>
  );
};

export default WidgetRow;
