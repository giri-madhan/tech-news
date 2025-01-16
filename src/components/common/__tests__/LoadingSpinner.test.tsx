import React from 'react';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />);

    // Check if spinner exists
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toBeInTheDocument();

    // Check default message
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Check default classes
    expect(spinner).toHaveClass(
      'loading-container',
      'loading-container--padded',
      'loading-container--fullscreen'
    );
  });

  it('renders with custom message', () => {
    const customMessage = 'Please wait...';
    render(<LoadingSpinner message={customMessage} />);

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('renders without fullscreen mode when fullscreen is false', () => {
    render(<LoadingSpinner fullscreen={false} />);

    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('loading-container', 'loading-container--padded');
    expect(spinner).not.toHaveClass('loading-container--fullscreen');
  });

  it('has correct ARIA attributes for accessibility', () => {
    const message = 'Custom loading message';
    render(<LoadingSpinner message={message} />);

    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveAttribute('role', 'progressbar');
    expect(spinner).toHaveAttribute('aria-label', message);
  });

  it('maintains proper structure with spinner and message elements', () => {
    render(<LoadingSpinner />);

    const container = screen.getByTestId('loading-spinner');
    const spinnerElement = container.querySelector('.loading-spinner');
    const messageElement = container.querySelector('p');

    expect(spinnerElement).toBeInTheDocument();
    expect(messageElement).toBeInTheDocument();
  });

  it('applies padding class consistently', () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('loading-container--padded');
  });

  it('combines classes correctly based on props', () => {
    const { rerender } = render(<LoadingSpinner fullscreen={true} />);

    let spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass(
      'loading-container',
      'loading-container--padded',
      'loading-container--fullscreen'
    );

    rerender(<LoadingSpinner fullscreen={false} />);
    spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('loading-container', 'loading-container--padded');
    expect(spinner).not.toHaveClass('loading-container--fullscreen');
  });
});
