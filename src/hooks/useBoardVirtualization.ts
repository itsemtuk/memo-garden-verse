
import { useRef, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Widget } from '@/types';

const ROW_HEIGHT = 300; // Height of each virtual row

interface UseBoardVirtualizationProps {
  widgets: Widget[];
}

export const useBoardVirtualization = ({ widgets }: UseBoardVirtualizationProps) => {
  const parentRef = useRef<HTMLDivElement>(null);

  // Group widgets by their Y position for better virtualization
  const widgetRows = useMemo(() => {
    const rowMap = new Map<number, Widget[]>();

    // Sort widgets by z-index for proper rendering order first
    const sortedWidgets = [...widgets].sort((a, b) => (a.settings?.zIndex || 0) - (b.settings?.zIndex || 0));

    sortedWidgets.forEach(widget => {
      const rowIndex = Math.floor(widget.position.y / ROW_HEIGHT);
      if (!rowMap.has(rowIndex)) {
        rowMap.set(rowIndex, []);
      }
      rowMap.get(rowIndex)!.push(widget);
    });

    // Convert to array format for virtualizer
    const maxRow = Math.max(...Array.from(rowMap.keys()), 0);
    const rows: Widget[][] = [];
    for (let i = 0; i <= maxRow; i++) {
      rows[i] = rowMap.get(i) || [];
    }

    return rows;
  }, [widgets]);

  // Dynamic row height calculation
  const getRowHeight = (rowIndex: number) => {
    const widgetsInRow = widgetRows[rowIndex] || [];
    return widgetsInRow.length > 0 ? ROW_HEIGHT : ROW_HEIGHT;
  };

  const rowVirtualizer = useVirtualizer({
    count: widgetRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => getRowHeight(index),
    overscan: 3, // Render 3 extra rows above and below viewport
  });

  return {
    parentRef,
    rowVirtualizer,
    widgetRows,
    ROW_HEIGHT,
  };
};
