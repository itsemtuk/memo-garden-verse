
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
    isDragging,
  } = useDraggable({
    id: widget.id,
    disabled: readonly,
  });

  // Use draggedPosition if available (during drag), otherwise use widget position
  const currentPosition = draggedPosition || widget.position;
  
  console.log(`Widget ${widget.id} rendered at position:`, currentPosition, 'isDragging:', isDragging, 'draggedPosition:', draggedPosition);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!readonly) {
      onSelect();
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`absolute ${isDragging ? 'opacity-70 z-[1000]' : ''} ${readonly ? '' : 'cursor-move'}`}
      style={{
        left: `${currentPosition.x}px`,
        top: `${currentPosition.y}px`,
        zIndex: isDragging ? 1000 : (widget.settings?.zIndex || 1),
        transform: `rotate(${widget.rotation || 0}deg)`,
        pointerEvents: 'auto',
        transition: isDragging ? 'none' : 'all 0.2s ease',
      }}
      {...attributes}
      {...(readonly ? {} : listeners)}
      onClick={handleClick}
    >
      <WidgetRenderer
        widget={widget}
        isSelected={isSelected}
        onClick={handleClick}
        onUpdate={onUpdateContent}
        onUpdateSettings={onUpdateSettings}
      />
    </div>
  );
};

const WidgetRow: React.FC<WidgetRowProps> = ({
  widgets,
  selectedWidgetId,
  onWidgetSelect,
  onUpdateWidget,
  onUpdateWidgetSettings,
  draggedWidgets,
  readonly = false,
}) => {
  console.log(`WidgetRow rendering ${widgets.length} widgets`, widgets.map(w => ({ id: w.id, position: w.position })));
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {widgets.map((widget) => {
        const draggedPosition = draggedWidgets.get(widget.id);
        
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
