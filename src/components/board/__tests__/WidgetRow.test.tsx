
import React from 'react';
import { render } from '@testing-library/react';
import WidgetRow from '../WidgetRow';

describe('WidgetRow', () => {
  it('renders without crashing', () => {
    const mockWidgets = [];
    const mockDraggedWidgets = new Map();
    const mockProps = {
      widgets: mockWidgets,
      rowHeight: 300,
      selectedWidgetId: null,
      onWidgetSelect: jest.fn(),
      onUpdateWidget: jest.fn(),
      onUpdateWidgetSettings: jest.fn(),
      draggedWidgets: mockDraggedWidgets,
    };
    render(<WidgetRow {...mockProps} />);
  });
});
