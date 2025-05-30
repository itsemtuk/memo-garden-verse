
import { renderHook } from '@testing-library/react';
import { useBoardVirtualization } from '../useBoardVirtualization';
import { Widget } from '@/types';

// Mock @tanstack/react-virtual
jest.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: jest.fn(() => ({
    getTotalSize: () => 900,
    getVirtualItems: () => [
      { index: 0, start: 0, size: 300 },
      { index: 1, start: 300, size: 300 },
      { index: 2, start: 600, size: 300 },
    ],
  })),
}));

const mockWidgets: Widget[] = [
  {
    id: 'widget-1',
    type: 'note',
    content: 'Widget 1',
    position: { x: 100, y: 50 },
    size: { width: 200, height: 100 },
    settings: { zIndex: 1 },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'widget-2',
    type: 'note',
    content: 'Widget 2',
    position: { x: 200, y: 350 },
    size: { width: 200, height: 100 },
    settings: { zIndex: 2 },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'widget-3',
    type: 'note',
    content: 'Widget 3',
    position: { x: 150, y: 750 },
    size: { width: 200, height: 100 },
    settings: { zIndex: 3 },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe('useBoardVirtualization', () => {
  it('groups widgets into rows based on Y position', () => {
    const { result } = renderHook(() => 
      useBoardVirtualization({ widgets: mockWidgets })
    );

    expect(result.current.widgetRows).toHaveLength(3);
    
    // Widget 1 should be in row 0 (y: 50, rowIndex: 0)
    expect(result.current.widgetRows[0]).toContain(mockWidgets[0]);
    
    // Widget 2 should be in row 1 (y: 350, rowIndex: 1)
    expect(result.current.widgetRows[1]).toContain(mockWidgets[1]);
    
    // Widget 3 should be in row 2 (y: 750, rowIndex: 2)
    expect(result.current.widgetRows[2]).toContain(mockWidgets[2]);
  });

  it('sorts widgets by z-index within the same row', () => {
    const widgetsInSameRow: Widget[] = [
      { ...mockWidgets[0], position: { x: 100, y: 50 }, settings: { zIndex: 3 } },
      { ...mockWidgets[1], position: { x: 200, y: 50 }, settings: { zIndex: 1 } },
      { ...mockWidgets[2], position: { x: 300, y: 50 }, settings: { zIndex: 2 } },
    ];

    const { result } = renderHook(() => 
      useBoardVirtualization({ widgets: widgetsInSameRow })
    );

    const row = result.current.widgetRows[0];
    expect(row).toHaveLength(3);
    
    // Should be sorted by z-index: 1, 2, 3
    expect(row[0].settings?.zIndex).toBe(1);
    expect(row[1].settings?.zIndex).toBe(2);
    expect(row[2].settings?.zIndex).toBe(3);
  });

  it('handles empty widgets array', () => {
    const { result } = renderHook(() => 
      useBoardVirtualization({ widgets: [] })
    );

    expect(result.current.widgetRows).toHaveLength(0);
  });

  it('returns correct ROW_HEIGHT constant', () => {
    const { result } = renderHook(() => 
      useBoardVirtualization({ widgets: mockWidgets })
    );

    expect(result.current.ROW_HEIGHT).toBe(300);
  });

  it('provides parentRef for scroll element', () => {
    const { result } = renderHook(() => 
      useBoardVirtualization({ widgets: mockWidgets })
    );

    expect(result.current.parentRef).toBeDefined();
    expect(result.current.parentRef.current).toBeNull(); // Initially null
  });

  it('recalculates rows when widgets change', () => {
    const { result, rerender } = renderHook(
      ({ widgets }) => useBoardVirtualization({ widgets }),
      { initialProps: { widgets: [mockWidgets[0]] } }
    );

    expect(result.current.widgetRows).toHaveLength(1);

    rerender({ widgets: mockWidgets });

    expect(result.current.widgetRows).toHaveLength(3);
  });

  it('handles widgets with missing z-index', () => {
    const widgetsWithoutZIndex: Widget[] = [
      { ...mockWidgets[0], settings: {} },
      { ...mockWidgets[1], settings: undefined },
    ];

    const { result } = renderHook(() => 
      useBoardVirtualization({ widgets: widgetsWithoutZIndex })
    );

    // Should not crash and should still group widgets
    expect(result.current.widgetRows).toHaveLength(2);
  });
});
