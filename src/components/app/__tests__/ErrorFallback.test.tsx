import { render, screen, fireEvent } from '@testing-library/react';
import ErrorFallback, { ErrorFallbackProps } from '../ErrorFallback';

describe('ErrorFallback', () => {
  const defaultProps: ErrorFallbackProps = {
    className: 'test-class',
    message: 'Test error message',
  };

  const renderComponent = (props: Partial<ErrorFallbackProps> = {}) => {
    return render(<ErrorFallback {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    // Mock window.location.reload
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: jest.fn() },
    });
  });

  it('renders with default props', () => {
    renderComponent();

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAccessibleName('Reload page to try again');
  });

  it('applies custom className', () => {
    renderComponent({ className: 'custom-class' });

    expect(screen.getByRole('alert')).toHaveClass('error-fallback custom-class');
  });

  it('displays error details when error prop is provided', () => {
    const testError = new Error('Test error details');
    renderComponent({ error: testError });

    expect(screen.getByText(/Error details: Test error details/)).toBeInTheDocument();
  });

  it('calls onReset when provided instead of reloading page', () => {
    const onReset = jest.fn();
    renderComponent({ onReset });

    fireEvent.click(screen.getByRole('button'));

    expect(onReset).toHaveBeenCalledTimes(1);
    expect(window.location.reload).not.toHaveBeenCalled();
  });

  it('reloads page when onReset is not provided', () => {
    renderComponent();

    fireEvent.click(screen.getByRole('button'));

    expect(window.location.reload).toHaveBeenCalledTimes(1);
  });

  it('renders with custom message', () => {
    const customMessage = 'Custom error message';
    renderComponent({ message: customMessage });

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    renderComponent();

    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'assertive');

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('aria-label', 'Reload page to try again');
  });
});
