
import React from 'react';
import { useDraggable } from "@dnd-kit/core";
import { Widget } from '@/types';
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

const DraggableWidget: React.FC<{
  widget: Widget;
  isSelected: boolean;
  onSelect: () => void;
  onUpdateContent: (content: string) => void;
  onUpdateSettings?: (settings: any) => void;
  draggedPosition?: { x: number; y: number };
  readonly?: boolean;
}> = ({ widget, isSelected, onSelect, onUpdateContent, onUpdateSettings, draggedPosition, readonly }) => {
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

  const position = draggedPosition || widget.position;
  
  // Apply transform for smooth dragging
  const dragTransform = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  console.log(`Rendering draggable widget ${widget.id} at position:`, position, 'with transform:', dragTransform);

  return (
    <div
      ref={setNodeRef}
      className={`absolute ${isDragging ? 'opacity-75 z-50' : ''} ${readonly ? '' : 'cursor-move'}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: isDragging ? 1000 : (widget.settings?.zIndex || 1),
        transform: `rotate(${widget.rotation || 0}deg)`,
        ...dragTransform,
      }}
      {...attributes}
      {...(readonly ? {} : listeners)}
    >
      <WidgetRenderer
        widget={widget}
        isSelected={isSelected}
        onClick={onSelect}
        onUpdate={onUpdateContent}
        onUpdateSettings={onUpdateSettings}
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
  console.log(`WidgetRow rendering ${widgets.length} widgets`);
  
  return (
    <div className="relative w-full" style={{ height: `${rowHeight}px` }}>
      {widgets.map((widget) => {
        const draggedPosition = draggedWidgets.get(widget.id);
        
        console.log(`Rendering widget ${widget.id} in row, dragged position:`, draggedPosition);
        
        return (
          <DraggableWidget
            key={widget.id}
            widget={widget}
            isSelected={selectedWidgetId === widget.id}
            onSelect={() => !readonly && onWidgetSelect(widget.id)}
            onUpdateContent={(content: string) => !readonly && onUpdateWidget(widget.id, content)}
            onUpdateSettings={(settings: any) => !readonly && onUpdateWidgetSettings?.(widget.id, settings)}
            draggedPosition={draggedPosition}
            readonly={readonly}
          />
        );
      })}
    </div>
  );
};

export default WidgetRow;
