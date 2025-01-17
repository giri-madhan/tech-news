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
    role="status"
    aria-busy="true"
    aria-live="polite"
    aria-label={message}
    data-testid="loading-spinner"
  >
    <div className="loading-spinner" role="progressbar" aria-valuetext={message} />
    <p className="loading-message" aria-live="polite">
      {message}
    </p>
  </div>
);

export default React.memo(LoadingSpinner);
