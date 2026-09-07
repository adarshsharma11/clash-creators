import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface JoinFieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
}

export function JoinField({ id, label, hint, error, optional, children }: JoinFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-semibold">
        {label}
        {optional ? (
          <span className="ml-2 text-xs font-medium text-muted-foreground">Optional</span>
        ) : null}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-sm text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}

interface JoinInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function JoinInput({ error, className, ...props }: JoinInputProps) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-xl border bg-card/40 px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-ring",
        error ? "border-destructive" : "border-border/50 focus-visible:border-primary",
        className
      )}
      {...props}
    />
  );
}

interface JoinTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function JoinTextarea({ error, className, ...props }: JoinTextareaProps) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full resize-none rounded-xl border bg-card/40 px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-ring",
        error ? "border-destructive" : "border-border/50 focus-visible:border-primary",
        className
      )}
      {...props}
    />
  );
}
