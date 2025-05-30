
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

const DraggableWidget = ({ widget, children, readonly }: {
  widget: Widget;
  children: React.ReactNode;
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
      {children}
    </div>
  );
};

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
                {/* Render widgets individually with drag capability */}
                {rowWidgets.map((widget) => {
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
                      <DraggableWidget widget={widget} readonly={readonly}>
                        <div
                          onClick={() => !readonly && onWidgetSelect(widget.id)}
                          className={selectedWidgetId === widget.id ? 'ring-2 ring-blue-500' : ''}
                        >
                          {widget.type === 'note' && (
                            <div className="bg-yellow-100 p-3 rounded-lg shadow-md min-w-[200px] min-h-[100px]">
                              <textarea 
                                value={widget.content || ''}
                                onChange={(e) => !readonly && onUpdateWidget(widget.id, e.target.value)}
                                className="w-full h-full bg-transparent border-none resize-none outline-none text-sm"
                                placeholder="Add your note..."
                                readOnly={readonly}
                                style={{
                                  width: typeof widget.size?.width === 'string' ? 
                                    widget.size.width : `${widget.size?.width || 200}px`,
                                  height: typeof widget.size?.height === 'string' ? 
                                    widget.size.height : `${widget.size?.height || 100}px`,
                                }}
                              />
                            </div>
                          )}
                          {widget.type === 'image' && (
                            <div 
                              className="bg-white p-2 rounded-lg shadow-md flex items-center justify-center"
                              style={{
                                width: typeof widget.size?.width === 'string' ? 
                                  widget.size.width : `${widget.size?.width || 200}px`,
                                height: typeof widget.size?.height === 'string' ? 
                                  widget.size.height : `${widget.size?.height || 150}px`,
                              }}
                            >
                              {widget.content ? (
                                <img 
                                  src={widget.content} 
                                  alt="Widget content" 
                                  className="max-w-full max-h-full object-contain rounded"
                                />
                              ) : (
                                <span className="text-gray-500 text-sm">No image</span>
                              )}
                            </div>
                          )}
                        </div>
                      </DraggableWidget>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </DndContext>
    </div>
  );
};

export default VirtualizedBoard;
