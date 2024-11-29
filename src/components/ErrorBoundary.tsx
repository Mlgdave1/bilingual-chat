import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '../utils/logger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Uncaught error:', { error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark-100 flex items-center justify-center p-4">
          <div className="bg-dark-200 rounded-lg p-6 max-w-md w-full border border-dark-300">
            <h2 className="text-xl font-semibold text-red-400 mb-4">Something went wrong</h2>
            <p className="text-gray-400 mb-4">
              We've been notified and will fix this as soon as possible.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}