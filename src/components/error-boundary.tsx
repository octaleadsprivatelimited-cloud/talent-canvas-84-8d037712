import React, { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  label?: string;
  /** Storage key holding the last-known-good route to recover to. */
  recoveryKey?: string;
  /** Fallback route when no recovery route is stored. */
  recoveryHome?: string;
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
    console.error(`${label}crash:`, error);
    console.error(`${label}component stack:`, errorInfo.componentStack);
  }

  private reset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  private reload = () => {
    if (typeof window !== "undefined") window.location.reload();
  };

  private goRecovery = () => {
    if (typeof window === "undefined") return;
    const key = this.props.recoveryKey ?? "dock:last-route";
    const home = this.props.recoveryHome ?? "/dock";
    const last = sessionStorage.getItem(key);
    const target = last && last !== window.location.pathname ? last : home;
    this.reset();
    window.location.assign(target);
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      const home = this.props.recoveryHome ?? "/dock";
      const last =
        typeof window !== "undefined"
          ? sessionStorage.getItem(this.props.recoveryKey ?? "dock:last-route")
          : null;
      const recoveryLabel =
        last && last !== (typeof window !== "undefined" ? window.location.pathname : "")
          ? `Go back to ${last}`
          : `Go to ${home}`;

      return (
        <div className="rounded-lg border border-red-400/30 bg-red-950/30 p-6 text-sm text-red-200">
          <h3 className="mb-2 font-semibold text-red-100">Something went wrong</h3>
          <p className="mb-3 font-mono text-xs opacity-80">
            {this.state.error?.name}: {this.state.error?.message}
          </p>
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              onClick={this.reload}
              className="rounded-md bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-950 hover:bg-white"
            >
              Reload page
            </button>
            <button
              onClick={this.goRecovery}
              className="rounded-md border border-red-300/40 px-3 py-1.5 text-xs font-semibold text-red-100 hover:bg-red-900/40"
            >
              {recoveryLabel}
            </button>
            <button
              onClick={this.reset}
              className="rounded-md border border-red-300/40 px-3 py-1.5 text-xs font-semibold text-red-100 hover:bg-red-900/40"
            >
              Try again
            </button>
          </div>
          <pre className="max-h-48 overflow-auto rounded bg-black/40 p-3 text-xs leading-relaxed text-red-100/70">
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
