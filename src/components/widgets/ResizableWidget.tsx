
import React, { useState, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResizableWidgetProps {
  children: React.ReactNode;
  position: { x: number; y: number };
  size: { width: number | string; height: number | string };
  rotation?: number;
  zIndex?: number;
  isSelected: boolean;
  onPositionChange: (x: number, y: number) => void;
  onSizeChange: (width: number, height: number) => void;
  onRotationChange?: (rotation: number) => void;
  className?: string;
}

const ResizableWidget: React.FC<ResizableWidgetProps> = ({
  children,
  position,
  size,
  rotation = 0,
  zIndex = 1,
  isSelected,
  onPositionChange,
  onSizeChange,
  className = '',
}) => {
  const isMobile = useIsMobile();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragStop = useCallback((e: any, data: any) => {
    setIsDragging(false);
    onPositionChange(data.x, data.y);
  }, [onPositionChange]);

  const handleResizeStop = useCallback((
    e: any,
    direction: any,
    ref: any,
    delta: any,
    position: any
  ) => {
    const newWidth = parseInt(ref.style.width, 10);
    const newHeight = parseInt(ref.style.height, 10);
    onSizeChange(newWidth, newHeight);
    onPositionChange(position.x, position.y);
  }, [onSizeChange, onPositionChange]);

  const normalizedSize = {
    width: typeof size.width === 'string' ? parseInt(size.width.replace('px', ''), 10) : size.width,
    height: typeof size.height === 'string' ? parseInt(size.height.replace('px', ''), 10) : size.height,
  };

  return (
    <Rnd
      size={normalizedSize}
      position={position}
      onDragStart={handleDragStart}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      dragHandleClassName="widget-drag-handle"
      enableResizing={!isMobile && isSelected ? {
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
      className={`${className} ${isDragging ? 'dragging' : ''} ${isSelected ? 'selected' : ''}`}
      style={{
        transform: `rotate(${rotation}deg)`,
        zIndex,
        touchAction: isMobile ? 'none' : 'auto',
      }}
      bounds="parent"
      dragAxis={isMobile ? 'both' : 'both'}
      resizeHandleStyles={!isMobile && isSelected ? {
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
    >
      <div className="w-full h-full widget-drag-handle">
        {children}
        {isSelected && (
          <div className="absolute inset-0 border-2 border-blue-500 rounded-md pointer-events-none" />
        )}
      </div>
    </Rnd>
  );
};

export default ResizableWidget;
