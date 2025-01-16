import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  message?: string;
  fullscreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  fullscreen = true,
}) => (
  <div
    className={`loading-container loading-container--padded ${fullscreen ? 'loading-container--fullscreen' : ''}`}
    role="progressbar"
    aria-label={message}
    data-testid="loading-spinner"
  >
    <div className="loading-spinner" />
    <p>{message}</p>
  </div>
);
