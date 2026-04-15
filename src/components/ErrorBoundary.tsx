"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex min-h-[300px] items-center justify-center p-8">
          <div className="max-w-md text-center">
            <div className="text-4xl mb-3">&#x26A0;&#xFE0F;</div>
            <h2 className="font-bold text-lg text-slate-800 mb-2">
              Something went wrong
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: undefined })}
              className="px-5 py-2.5 rounded-md bg-spark-primary text-white font-bold text-sm hover:brightness-110 transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
