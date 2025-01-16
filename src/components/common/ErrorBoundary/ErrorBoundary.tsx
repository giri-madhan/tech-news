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
        <div className="error-container" role="alert" aria-live="polite">
          <div className="error-content">
            <h1 className="error-title">{errorConfig.title}</h1>
            <p className="error-message">{errorConfig.message}</p>
            <div className="error-actions">
              {canRetry && (
                <button className="error-button" onClick={this.handleReset} aria-label="Try again">
                  Try Again
                </button>
              )}
              <button
                className="error-button"
                onClick={this.handleRefresh}
                aria-label="Refresh page"
              >
                Refresh Page
              </button>
            </div>
            {!canRetry && (
              <p className="error-retry-limit">
                Maximum retry attempts reached. Please refresh the page.
              </p>
            )}
            {process.env.NODE_ENV === 'development' && (
              <details className="error-details">
                <summary>Error Details</summary>
                <pre>{this.state.error?.toString()}</pre>
                <pre>{this.state.errorInfo?.componentStack}</pre>
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
