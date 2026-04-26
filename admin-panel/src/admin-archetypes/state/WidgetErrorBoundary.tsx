import * as React from "react";
import { AlertCircle, RotateCw } from "lucide-react";
import { Button } from "@/primitives/Button";
import { cn } from "@/lib/cn";

export interface WidgetErrorBoundaryProps {
  children: React.ReactNode;
  /** Label of the widget for the error message. */
  label?: string;
  /** Optional retry handler to allow user-triggered recovery. */
  onRetry?: () => void;
  /** Tail logger; receives the error + componentStack. */
  onError?: (error: unknown, info: { componentStack: string }) => void;
  className?: string;
}

interface State {
  error: unknown;
}

/** Per-widget error boundary. One failing widget never blanks a page. */
export class WidgetErrorBoundary extends React.Component<
  WidgetErrorBoundaryProps,
  State
> {
  state: State = { error: null };

  static getDerivedStateFromError(error: unknown): State {
    return { error };
  }

  componentDidCatch(error: unknown, info: { componentStack: string }) {
    this.props.onError?.(error, info);
  }

  reset = () => {
    this.setState({ error: null });
    this.props.onRetry?.();
  };

  render() {
    if (this.state.error == null) return this.props.children;
    const message =
      this.state.error instanceof Error
        ? this.state.error.message
        : "Something went wrong loading this widget.";
    return (
      <div
        role="alert"
        className={cn(
          "rounded-md border border-warning/30 bg-warning-soft/30 px-3 py-3 text-sm flex items-start gap-2",
          this.props.className,
        )}
      >
        <AlertCircle
          className="h-4 w-4 shrink-0 mt-0.5 text-warning"
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <div className="font-medium text-text-primary">
            {this.props.label ?? "Widget failed"}
          </div>
          <div className="text-text-muted truncate" title={message}>
            {message}
          </div>
        </div>
        {(this.props.onRetry || true) && (
          <Button
            size="sm"
            variant="ghost"
            onClick={this.reset}
            className="shrink-0"
          >
            <RotateCw className="h-3.5 w-3.5 mr-1" aria-hidden /> Retry
          </Button>
        )}
      </div>
    );
  }
}
