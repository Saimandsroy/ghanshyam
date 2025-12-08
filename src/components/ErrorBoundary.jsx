import React, { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

/**
 * ErrorBoundary - Catches React errors and displays fallback UI
 */
export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });

        // Log error to console (could be sent to error tracking service)
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });

        // Optionally refresh the page
        if (this.props.onReset) {
            this.props.onReset();
        }
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-[400px] flex items-center justify-center p-8">
                    <div
                        className="max-w-md w-full rounded-2xl p-8 text-center"
                        style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}
                    >
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                            style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                        >
                            <AlertTriangle className="h-8 w-8" style={{ color: '#EF4444' }} />
                        </div>

                        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                            Something went wrong
                        </h2>

                        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                            We encountered an unexpected error. Please try again or return to the homepage.
                        </p>

                        {/* Error details (only in development) */}
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div
                                className="text-left p-4 rounded-xl mb-6 text-xs font-mono overflow-auto max-h-32"
                                style={{ backgroundColor: 'var(--background-dark)', color: 'var(--error)' }}
                            >
                                {this.state.error.toString()}
                            </div>
                        )}

                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all hover:opacity-80"
                                style={{
                                    backgroundColor: 'var(--background-dark)',
                                    color: 'var(--text-primary)',
                                    border: '1px solid var(--border)'
                                }}
                            >
                                <RefreshCw className="h-4 w-4" />
                                Try Again
                            </button>
                            <button
                                onClick={this.handleGoHome}
                                className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all hover:opacity-80"
                                style={{
                                    background: 'linear-gradient(135deg, #6BF0FF 0%, #3ED9EB 100%)',
                                    color: 'var(--background-dark)'
                                }}
                            >
                                <Home className="h-4 w-4" />
                                Go Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

/**
 * withErrorBoundary - HOC to wrap components with error boundary
 */
export function withErrorBoundary(WrappedComponent, fallback = null) {
    return function WithErrorBoundaryWrapper(props) {
        return (
            <ErrorBoundary fallback={fallback}>
                <WrappedComponent {...props} />
            </ErrorBoundary>
        );
    };
}
