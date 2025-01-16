import React from 'react';
import { render, screen } from '@testing-library/react';
import { ItemGrid } from '../ItemGrid/ItemGrid';

interface TestItem {
  id: number;
  text: string;
}

describe('ItemGrid', () => {
  const mockItems: TestItem[] = [
    { id: 1, text: 'Item 1' },
    { id: 2, text: 'Item 2' },
    { id: 3, text: 'Item 3' },
  ];

  const renderItem = (item: TestItem) => <div data-testid={`item-${item.id}`}>{item.text}</div>;

  it('renders all items correctly', () => {
    render(<ItemGrid<TestItem> items={mockItems} renderItem={renderItem} />);

    mockItems.forEach(item => {
      expect(screen.getByTestId(`item-${item.id}`)).toBeInTheDocument();
      expect(screen.getByText(item.text)).toBeInTheDocument();
    });
  });

  it('applies custom className and itemClassName', () => {
    const { container } = render(
      <ItemGrid<TestItem>
        items={mockItems}
        renderItem={renderItem}
        className="custom-grid"
        itemClassName="custom-item"
      />
    );

    expect(container.firstChild).toHaveClass('item-grid', 'custom-grid');
    expect(container.querySelector('.item-grid-item')).toHaveClass('custom-item');
  });

  it('sets correct aria-label', () => {
    const customLabel = 'Custom Grid';
    render(
      <ItemGrid<TestItem> items={mockItems} renderItem={renderItem} ariaLabel={customLabel} />
    );

    expect(screen.getByRole('feed')).toHaveAttribute('aria-label', customLabel);
  });

  it('applies lastItemRef to the last item only', () => {
    const lastItemRef = jest.fn();
    render(
      <ItemGrid<TestItem> items={mockItems} renderItem={renderItem} lastItemRef={lastItemRef} />
    );

    const items = screen.getAllByTestId(/item-/);
    expect(items).toHaveLength(mockItems.length);
    expect(lastItemRef).toHaveBeenCalledTimes(1);
  });

  it('handles empty items array', () => {
    render(<ItemGrid<TestItem> items={[]} renderItem={renderItem} />);

    expect(screen.queryByTestId(/item-/)).not.toBeInTheDocument();
  });
});
