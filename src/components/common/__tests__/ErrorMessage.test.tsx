import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

describe('ErrorMessage', () => {
  it('renders with default props', () => {
    render(<ErrorMessage message={null} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('An unexpected error occurred.')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders with custom title and message', () => {
    const title = 'Custom Error';
    const message = 'Something went wrong';

    render(<ErrorMessage title={title} message={message} />);

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('renders retry button when onRetry is provided', () => {
    const onRetry = jest.fn();
    const retryButtonText = 'Retry Now';

    render(<ErrorMessage message="Error" onRetry={onRetry} retryButtonText={retryButtonText} />);

    const button = screen.getByRole('button', { name: retryButtonText });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('uses default retry button text when not provided', () => {
    const onRetry = jest.fn();

    render(<ErrorMessage message="Error" onRetry={onRetry} />);

    expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
  });
});
