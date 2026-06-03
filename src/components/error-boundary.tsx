import React, { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  label?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const label = this.props.label ? `[${this.props.label}] ` : "";
    console.error(`${label}AdminLayout crash:`, error);
    console.error(`${label}Component stack:`, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="rounded-lg border border-red-400/30 bg-red-950/30 p-6 text-sm text-red-200">
            <h3 className="mb-2 font-semibold text-red-100">Something went wrong</h3>
            <p className="mb-2 font-mono text-xs opacity-80">
              {this.state.error?.name}: {this.state.error?.message}
            </p>
            <pre className="mt-3 max-h-48 overflow-auto rounded bg-black/40 p-3 text-xs leading-relaxed text-red-100/70">
              {this.state.error?.stack}
            </pre>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
