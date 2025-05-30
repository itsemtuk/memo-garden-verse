
import React from 'react';
import { useDraggable } from "@dnd-kit/core";
import { Widget } from '@/types';
import { WidgetRenderer } from '@/components/widgets/components/WidgetRenderer';

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

  // Use draggedPosition if available (during drag), otherwise use widget position
  const currentPosition = draggedPosition || widget.position;
  
  console.log(`Widget ${widget.id} position:`, currentPosition, 'draggedPosition:', draggedPosition, 'isDragging:', isDragging);

  return (
    <div
      ref={setNodeRef}
      className={`absolute transition-opacity ${isDragging ? 'opacity-50 z-50' : ''} ${readonly ? '' : 'cursor-move'}`}
      style={{
        left: `${currentPosition.x}px`,
        top: `${currentPosition.y}px`,
        zIndex: isDragging ? 1000 : (widget.settings?.zIndex || 1),
        transform: `rotate(${widget.rotation || 0}deg)`,
        // Don't apply dnd-kit transform here - it causes double transformation
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
        
        console.log(`Rendering widget ${widget.id} in row, position:`, widget.position, 'dragged position:', draggedPosition);
        
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
