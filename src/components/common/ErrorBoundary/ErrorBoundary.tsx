import React, { Component, ErrorInfo, ReactNode } from 'react';
import { isEqual } from 'lodash';
import './ErrorBoundary.css';

class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

interface ErrorConfig {
  title: string;
  message: string;
  action?: () => void;
}

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: Array<string | number>;
  retryLimit?: number;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

const DEFAULT_RETRY_LIMIT = 3;

const getErrorConfig = (error: Error): ErrorConfig => {
  if (error instanceof NetworkError) {
    return {
      title: 'Connection Error',
      message: 'Please check your internet connection and try again.',
    };
  }
  return {
    title: 'Oops!',
    message: error.message || 'Something went wrong. Please try refreshing the page.',
  };
};

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    retryCount: 0,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    console.error('Uncaught error:', error, errorInfo);
  }

  public componentDidUpdate(prevProps: Props): void {
    if (
      this.props.resetKeys &&
      prevProps.resetKeys &&
      !isEqual(this.props.resetKeys, prevProps.resetKeys) &&
      this.state.hasError
    ) {
      this.resetErrorState();
    }
  }

  private resetErrorState = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleReset = (): void => {
    const retryLimit = this.props.retryLimit ?? DEFAULT_RETRY_LIMIT;
    const nextRetryCount = this.state.retryCount + 1;

    if (nextRetryCount >= retryLimit) {
      this.setState(() => ({
        retryCount: nextRetryCount,
      }));
      return;
    }

    this.setState(() => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: nextRetryCount,
    }));
  };

  private handleRefresh = (): void => {
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const error = this.state.error;
      if (!error) {
        return null;
      }

      const errorConfig = getErrorConfig(error);
      const retryLimit = this.props.retryLimit ?? DEFAULT_RETRY_LIMIT;
      const canRetry = this.state.retryCount < retryLimit;

      return (
        <div className="error-container" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="error-content">
            <h1 id="error-title" tabIndex={-1} className="error-heading">
              {errorConfig.title}
            </h1>
            <p id="error-description" className="error-message" aria-labelledby="error-title">
              {errorConfig.message}
            </p>
            <div className="error-actions" aria-label="Error recovery options">
              {canRetry && (
                <button
                  className="error-button"
                  onClick={this.handleReset}
                  aria-label="Try again to recover from error"
                  type="button"
                >
                  Try Again
                </button>
              )}
              <button
                className="error-button"
                onClick={this.handleRefresh}
                aria-label="Refresh page to recover from error"
                type="button"
              >
                Refresh Page
              </button>
            </div>
            {!canRetry && (
              <p className="error-retry-limit" role="status" aria-live="polite" aria-atomic="true">
                Maximum retry attempts reached. Please refresh the page.
              </p>
            )}
            {process.env.NODE_ENV === 'development' && (
              <details
                className="error-details"
                aria-label="Technical error details for developers"
              >
                <summary>
                  <span className="error-details-summary">Error Details</span>
                </summary>
                <div
                  className="error-details-content"
                  role="region"
                  aria-label="Error stack trace details"
                >
                  <pre role="log" aria-label="Error message">
                    {this.state.error?.toString()}
                  </pre>
                  <pre role="log" aria-label="Component stack trace">
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary, NetworkError };
export default ErrorBoundary;
