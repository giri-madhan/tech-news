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
    <div
      className={`error-fallback ${className}`.trim()}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="error-fallback__content">
        <h2 id="error-heading" tabIndex={-1}>
          Something went wrong
        </h2>
        <p id="error-message">{message}</p>
        {error?.message && (
          <p className="error-fallback__details" aria-labelledby="error-heading">
            Error details: {error.message}
          </p>
        )}
        <div className="error-fallback__actions">
          <button
            onClick={handleReset}
            type="button"
            aria-label="Reload page to try again"
            className="error-fallback__button"
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
};

ErrorFallback.displayName = 'ErrorFallback';

export default ErrorFallback;
