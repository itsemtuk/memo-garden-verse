
import React, { useState, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import { useIsMobile } from '@/hooks/use-mobile';
import { Widget } from '@/types';

interface ResizableWidgetProps {
  widget: Widget;
  isSelected: boolean;
  onSelect: (widgetId: string) => void;
  onUpdateContent: (widgetId: string, content: string) => void;
  onUpdateSettings?: (widgetId: string, settings: any) => void;
  readonly?: boolean;
}

const ResizableWidget: React.FC<ResizableWidgetProps> = ({
  widget,
  isSelected,
  onSelect,
  onUpdateContent,
  onUpdateSettings,
  readonly = false,
}) => {
  const isMobile = useIsMobile();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragStop = useCallback((e: any, data: any) => {
    setIsDragging(false);
    if (onUpdateSettings) {
      onUpdateSettings(widget.id, {
        ...widget.settings,
        position: { x: data.x, y: data.y }
      });
    }
  }, [widget.id, widget.settings, onUpdateSettings]);

  const handleResizeStop = useCallback((
    e: any,
    direction: any,
    ref: any,
    delta: any,
    position: any
  ) => {
    const newWidth = parseInt(ref.style.width, 10);
    const newHeight = parseInt(ref.style.height, 10);
    if (onUpdateSettings) {
      onUpdateSettings(widget.id, {
        ...widget.settings,
        size: { width: newWidth, height: newHeight },
        position: { x: position.x, y: position.y }
      });
    }
  }, [widget.id, widget.settings, onUpdateSettings]);

  const normalizedSize = {
    width: typeof widget.size?.width === 'string' ? 
      parseInt(widget.size.width.replace('px', ''), 10) : 
      (widget.size?.width || 200),
    height: typeof widget.size?.height === 'string' ? 
      parseInt(widget.size.height.replace('px', ''), 10) : 
      (widget.size?.height || 150),
  };

  const handleClick = useCallback(() => {
    if (!readonly) {
      onSelect(widget.id);
    }
  }, [widget.id, onSelect, readonly]);

  return (
    <Rnd
      size={normalizedSize}
      position={widget.position}
      onDragStart={handleDragStart}
      onDragStop={readonly ? undefined : handleDragStop}
      onResizeStop={readonly ? undefined : handleResizeStop}
      dragHandleClassName="widget-drag-handle"
      disableDragging={readonly}
      enableResizing={!isMobile && isSelected && !readonly ? {
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true,
      } : false}
      minWidth={isMobile ? 120 : 100}
      minHeight={isMobile ? 80 : 60}
      maxWidth={isMobile ? window.innerWidth - 40 : 800}
      maxHeight={isMobile ? window.innerHeight - 200 : 600}
      className={`${isDragging ? 'dragging' : ''} ${isSelected ? 'selected' : ''}`}
      style={{
        transform: `rotate(${widget.rotation || 0}deg)`,
        zIndex: widget.settings?.zIndex || 1,
        touchAction: isMobile ? 'none' : 'auto',
      }}
      bounds="parent"
      dragAxis={isMobile ? 'both' : 'both'}
      resizeHandleStyles={!isMobile && isSelected && !readonly ? {
        bottomRight: {
          bottom: '-5px',
          right: '-5px',
          width: '10px',
          height: '10px',
          backgroundColor: '#3b82f6',
          borderRadius: '50%',
          border: '2px solid white',
          cursor: 'se-resize',
        },
        bottomLeft: {
          bottom: '-5px',
          left: '-5px',
          width: '10px',
          height: '10px',
          backgroundColor: '#3b82f6',
          borderRadius: '50%',
          border: '2px solid white',
          cursor: 'sw-resize',
        },
        topRight: {
          top: '-5px',
          right: '-5px',
          width: '10px',
          height: '10px',
          backgroundColor: '#3b82f6',
          borderRadius: '50%',
          border: '2px solid white',
          cursor: 'ne-resize',
        },
        topLeft: {
          top: '-5px',
          left: '-5px',
          width: '10px',
          height: '10px',
          backgroundColor: '#3b82f6',
          borderRadius: '50%',
          border: '2px solid white',
          cursor: 'nw-resize',
        },
      } : {}}
      onClick={handleClick}
    >
      <div className="w-full h-full widget-drag-handle">
        <div className="p-2 h-full overflow-hidden">
          {widget.type === 'note' && (
            <div className="bg-yellow-100 p-2 rounded h-full">
              <textarea 
                value={widget.content}
                onChange={(e) => !readonly && onUpdateContent(widget.id, e.target.value)}
                className="w-full h-full bg-transparent border-none resize-none outline-none"
                placeholder="Add your note..."
                readOnly={readonly}
              />
            </div>
          )}
          {widget.type === 'image' && (
            <div className="h-full flex items-center justify-center bg-gray-100 rounded">
              {widget.content ? (
                <img 
                  src={widget.content} 
                  alt="Widget content" 
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <span className="text-gray-500">No image</span>
              )}
            </div>
          )}
        </div>
        {isSelected && !readonly && (
          <div className="absolute inset-0 border-2 border-blue-500 rounded-md pointer-events-none" />
        )}
      </div>
    </Rnd>
  );
};

export default ResizableWidget;
