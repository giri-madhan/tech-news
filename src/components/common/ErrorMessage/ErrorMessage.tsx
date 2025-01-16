import React from 'react';
import './ErrorMessage.css';

export interface ErrorMessageProps {
  title?: string;
  message: string | null;
  onRetry?: () => void;
  retryButtonText?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Error',
  message,
  onRetry,
  retryButtonText = 'Try Again',
}) => (
  <div className="error-container" role="alert">
    <h2 className="error-title">{title}</h2>
    <p className="error-message">{message || 'An unexpected error occurred.'}</p>
    {onRetry && (
      <button className="error-retry-button" onClick={onRetry} aria-label={retryButtonText}>
        {retryButtonText}
      </button>
    )}
  </div>
);

export default React.memo(ErrorMessage);
