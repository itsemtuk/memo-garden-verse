
import React from 'react';
import { Widget } from '@/types';
import { useDraggable } from '@dnd-kit/core';
import { WidgetRenderer } from '@/components/widgets/WidgetRegistry';

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

const DraggableWidget = ({ widget, isSelected, onSelect, onUpdate, onUpdateSettings, readonly }: {
  widget: Widget;
  isSelected: boolean;
  onSelect: (widgetId: string) => void;
  onUpdate: (widgetId: string, content: string) => void;
  onUpdateSettings?: (widgetId: string, settings: any) => void;
  readonly?: boolean;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: widget.id,
    disabled: readonly,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(readonly ? {} : listeners)}
      className={`${isDragging ? 'opacity-50' : ''} ${readonly ? '' : 'cursor-move'}`}
    >
      <WidgetRenderer
        widget={widget}
        isSelected={isSelected}
        onClick={() => !readonly && onSelect(widget.id)}
        onUpdate={(content: string) => !readonly && onUpdate(widget.id, content)}
        onUpdateSettings={(settings: any) => !readonly && onUpdateSettings?.(widget.id, settings)}
      />
    </div>
  );
};

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
              transform: `rotate(${widget.rotation || 0}deg)`,
            }}
          >
            <DraggableWidget
              widget={widget}
              isSelected={selectedWidgetId === widget.id}
              onSelect={onWidgetSelect}
              onUpdate={onUpdateWidget}
              onUpdateSettings={onUpdateWidgetSettings}
              readonly={readonly}
            />
          </div>
        );
      })}
    </div>
  );
};

export default WidgetRow;
