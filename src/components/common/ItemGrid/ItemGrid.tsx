import React from 'react';
import './ItemGrid.css';

export interface ItemGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  lastItemRef?: (node: HTMLDivElement | null) => void;
  className?: string;
  itemClassName?: string;
  ariaLabel?: string;
}

export function ItemGrid<T>({
  items,
  renderItem,
  lastItemRef,
  className = '',
  itemClassName = '',
  ariaLabel = 'Items grid',
}: ItemGridProps<T>) {
  return (
    <div
      className={`item-grid ${className}`}
      role="feed"
      aria-label={ariaLabel}
      aria-busy={items.length === 0}
    >
      {items.map((item, index) => (
        <div
          key={index}
          ref={index === items.length - 1 ? lastItemRef : null}
          className={`item-grid-item ${itemClassName}`}
          role="article"
          aria-setsize={items.length}
          aria-posinset={index + 1}
        >
          {renderItem(item, index)}
        </div>
      ))}
      {items.length === 0 && (
        <div role="status" aria-live="polite">
          No items to display
        </div>
      )}
    </div>
  );
}

export default React.memo(ItemGrid) as typeof ItemGrid;
