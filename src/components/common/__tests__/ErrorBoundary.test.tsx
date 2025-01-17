import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary, { NetworkError } from '../ErrorBoundary/ErrorBoundary';

const ErrorComponent = () => {
  throw new Error('Test error');
};

const NetworkErrorComponent = () => {
  throw new NetworkError('Network connection failed');
};

const MockFallback = () => <div>Error occurred: Please try again</div>;

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Prevent console.error from cluttering test output
    jest.spyOn(console, 'error').mockImplementation(() => {
      // Intentionally empty to suppress error logging during tests
      return;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary fallback={<MockFallback />}>
        <div>Test content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders fallback when there is an error', () => {
    render(
      <ErrorBoundary fallback={<MockFallback />}>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Error occurred: Please try again')).toBeInTheDocument();
  });

  it('handles NetworkError correctly', () => {
    render(
      <ErrorBoundary>
        <NetworkErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Connection Error')).toBeInTheDocument();
    expect(
      screen.getByText('Please check your internet connection and try again.')
    ).toBeInTheDocument();
  });

  it('calls onError prop when an error occurs', () => {
    const onError = jest.fn();
    render(
      <ErrorBoundary onError={onError}>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ componentStack: expect.any(String) })
    );
  });

  it('resets error state when retry limit is not reached', () => {
    render(
      <ErrorBoundary retryLimit={3}>
        <ErrorComponent />
      </ErrorBoundary>
    );

    const tryAgainButton = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(tryAgainButton);

    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('disables retry button when retry limit is reached', async () => {
    const { rerender } = render(
      <ErrorBoundary retryLimit={2}>
        <ErrorComponent />
      </ErrorBoundary>
    );

    // Initial error state
    const tryAgainButton = screen.getByRole('button', { name: /try again/i });

    // First click (count: 0 -> 1)
    fireEvent.click(tryAgainButton);
    rerender(
      <ErrorBoundary retryLimit={2}>
        <ErrorComponent />
      </ErrorBoundary>
    );

    // Second click (count: 1 -> 2, reaches limit)
    fireEvent.click(screen.getByRole('button', { name: /try again/i }));
    rerender(
      <ErrorBoundary retryLimit={2}>
        <ErrorComponent />
      </ErrorBoundary>
    );

    // After reaching the limit, the button should be removed
    expect(screen.queryByRole('button', { name: /try again/i })).not.toBeInTheDocument();
    expect(
      screen.getByText('Maximum retry attempts reached. Please refresh the page.')
    ).toBeInTheDocument();
  });

  it('resets error state when resetKeys change', () => {
    const { rerender } = render(
      <ErrorBoundary resetKeys={['key1']}>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Oops!')).toBeInTheDocument();

    rerender(
      <ErrorBoundary resetKeys={['key2']}>
        <div>Reset successful</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Reset successful')).toBeInTheDocument();
  });

  it('handles refresh page action', () => {
    const reloadMock = jest.fn();
    const originalLocation = window.location;

    // Define window.location as a writable property
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { reload: reloadMock },
    });

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    const refreshButton = screen.getByRole('button', { name: /refresh page/i });
    fireEvent.click(refreshButton);

    expect(reloadMock).toHaveBeenCalled();

    // Restore original location
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
  });

  it('handles null error case gracefully', () => {
    const TestComponent = () => {
      const error = new Error();
      error.message = '';
      throw error;
    };

    render(
      <ErrorBoundary>
        <TestComponent />
      </ErrorBoundary>
    );

    expect(
      screen.getByText('Something went wrong. Please try refreshing the page.')
    ).toBeInTheDocument();
  });

  it('shows error details in development environment', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Error Details')).toBeInTheDocument();
    const details = screen.getByText('Error Details').closest('details') as HTMLElement;
    expect(details).toBeTruthy();

    process.env.NODE_ENV = originalEnv;
  });
});
