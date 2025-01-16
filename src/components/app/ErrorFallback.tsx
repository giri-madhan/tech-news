import React, { useCallback } from 'react';
import './ErrorFallback.css';

export interface ErrorFallbackProps {
  className?: string;
  error?: Error;
  message?: string;
  onReset?: () => void;
}

/**
 * ErrorFallback component displays a user-friendly error message with a reload option
 */
export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  className = '',
  error,
  message = 'We&apos;re sorry for the inconvenience. Please try again later.',
  onReset,
}) => {
  const handleReset = useCallback(() => {
    if (onReset) {
      onReset();
    } else {
      window.location.reload();
    }
  }, [onReset]);

  return (
    <div className={`error-fallback ${className}`.trim()} role="alert" aria-live="polite">
      <h2>Something went wrong</h2>
      <p>{message}</p>
      {error?.message && <p className="error-fallback__details">Error details: {error.message}</p>}
      <button onClick={handleReset} type="button" aria-label="Reload page">
        Reload Page
      </button>
    </div>
  );
};

ErrorFallback.displayName = 'ErrorFallback';

export default ErrorFallback;
