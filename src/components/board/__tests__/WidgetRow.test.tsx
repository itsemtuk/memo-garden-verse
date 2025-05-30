
import React from 'react';
import { render } from '@/test/test-utils';
import { screen } from '@testing-library/react';
import WidgetRow from '../WidgetRow';
import { Widget } from '@/types';

// Mock the WidgetRenderer component
jest.mock('@/components/widgets/WidgetRegistry', () => ({
  WidgetRenderer: ({ widget, onClick }: any) => (
    <div 
      data-testid={`widget-${widget.id}`}
      onClick={onClick}
      style={{ 
        position: 'absolute',
        left: widget.position.x,
        top: widget.position.y 
      }}
    >
      {widget.type} - {widget.content}
    </div>
  ),
}));

const mockWidgets: Widget[] = [
  {
    id: 'widget-1',
    type: 'note',
    content: 'Test Note 1',
    position: { x: 100, y: 50 },
    size: { width: 200, height: 100 },
    rotation: 0,
    settings: { zIndex: 1 },
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: 'widget-2',
    type: 'note',
    content: 'Test Note 2',
    position: { x: 300, y: 75 },
    size: { width: 200, height: 100 },
    rotation: 15,
    settings: { zIndex: 2 },
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
];

describe('WidgetRow', () => {
  const defaultProps = {
    widgets: mockWidgets,
    rowHeight: 300,
    selectedWidgetId: null,
    onWidgetSelect: jest.fn(),
    onUpdateWidget: jest.fn(),
    onUpdateWidgetSettings: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all widgets with correct positioning', () => {
    render(<WidgetRow {...defaultProps} />);
    
    expect(screen.getByTestId('widget-widget-1')).toBeInTheDocument();
    expect(screen.getByTestId('widget-widget-2')).toBeInTheDocument();
    
    const widget1 = screen.getByTestId('widget-widget-1');
    expect(widget1).toHaveStyle({
      left: '100px',
      top: '50px',
    });
  });

  it('applies rotation transform correctly', () => {
    render(<WidgetRow {...defaultProps} />);
    
    const widget2Container = screen.getByTestId('widget-widget-2').parentElement;
    expect(widget2Container).toHaveStyle({
      transform: 'rotate(15deg)',
    });
  });

  it('applies correct z-index from widget settings', () => {
    render(<WidgetRow {...defaultProps} />);
    
    const widget1Container = screen.getByTestId('widget-widget-1').parentElement;
    const widget2Container = screen.getByTestId('widget-widget-2').parentElement;
    
    expect(widget1Container).toHaveStyle({ zIndex: '1' });
    expect(widget2Container).toHaveStyle({ zIndex: '2' });
  });

  it('calls onWidgetSelect when widget is clicked', () => {
    const onWidgetSelect = jest.fn();
    render(<WidgetRow {...defaultProps} onWidgetSelect={onWidgetSelect} />);
    
    const widget1 = screen.getByTestId('widget-widget-1');
    widget1.click();
    
    expect(onWidgetSelect).toHaveBeenCalledWith('widget-1');
  });

  it('memoizes correctly and only re-renders when props change', () => {
    const { rerender } = render(<WidgetRow {...defaultProps} />);
    
    const initialWidget1 = screen.getByTestId('widget-widget-1');
    
    // Re-render with same props
    rerender(<WidgetRow {...defaultProps} />);
    
    const afterRerender = screen.getByTestId('widget-widget-1');
    expect(afterRerender).toBe(initialWidget1);
    
    // Re-render with different selected widget
    rerender(<WidgetRow {...defaultProps} selectedWidgetId="widget-1" />);
    
    const afterPropChange = screen.getByTestId('widget-widget-1');
    expect(afterPropChange).not.toBe(initialWidget1);
  });

  it('handles empty widgets array', () => {
    render(<WidgetRow {...defaultProps} widgets={[]} />);
    
    expect(screen.queryByTestId(/widget-/)).not.toBeInTheDocument();
  });

  it('positions widgets within virtual row height', () => {
    const widgetsWithHighY: Widget[] = [
      {
        ...mockWidgets[0],
        position: { x: 100, y: 450 }, // Y position beyond row height
      },
    ];
    
    render(<WidgetRow {...defaultProps} widgets={widgetsWithHighY} rowHeight={300} />);
    
    const widget = screen.getByTestId('widget-widget-1');
    const container = widget.parentElement;
    
    // Should position at y % rowHeight = 450 % 300 = 150
    expect(container).toHaveStyle({ top: '150px' });
  });
});
