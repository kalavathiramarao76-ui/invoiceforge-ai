"use client";

import React, { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--if-bg,#09090b)] p-6">
          <div className="max-w-md w-full rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-2xl p-8 text-center">
            {/* Icon */}
            <div className="mx-auto w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-[var(--if-text,#fafafa)] mb-2">
              Something went wrong
            </h2>
            <p className="text-sm text-[var(--if-text-secondary,#a1a1aa)] mb-4 leading-relaxed">
              The application encountered an unexpected error. Your invoices and data are safe.
            </p>

            {/* Error detail */}
            {this.state.error && (
              <div className="mb-6 rounded-lg bg-red-500/5 border border-red-500/10 p-3 text-left">
                <code className="text-xs text-red-300/80 break-all font-mono">
                  {this.state.error.message}
                </code>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-5 py-2.5 rounded-full bg-green-600 hover:bg-green-500 text-white text-sm font-semibold transition-colors focus:ring-2 focus:ring-green-500/30 focus:outline-none"
              >
                Try Again
              </button>
              <button
                onClick={() => (window.location.href = "/app")}
                className="px-5 py-2.5 rounded-full border border-white/10 hover:border-white/20 text-[var(--if-text-secondary,#a1a1aa)] hover:text-[var(--if-text,#fafafa)] text-sm transition-colors"
              >
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
