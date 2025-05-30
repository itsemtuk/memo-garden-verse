
import React from 'react';
import { render } from '@testing-library/react';
import WidgetRow from '../WidgetRow';

describe('WidgetRow', () => {
  it('renders without crashing', () => {
    const mockWidgets = [];
    render(<WidgetRow widgets={mockWidgets} />);
  });
});
