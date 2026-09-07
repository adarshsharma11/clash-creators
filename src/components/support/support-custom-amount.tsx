"use client";

import { MAX_SUPPORT_AMOUNT, MIN_SUPPORT_AMOUNT } from "@/lib/support-amount";
import { formatPoints } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface SupportCustomAmountProps {
  value: string;
  error: string | null;
  active: boolean;
  onChange: (value: string) => void;
}

export function SupportCustomAmount({
  value,
  error,
  active,
  onChange,
}: SupportCustomAmountProps) {
  const describedBy = error ? "custom-support-error" : "custom-support-hint";

  return (
    <section className="space-y-3">
      <div>
        <label htmlFor="custom-support" className="text-sm font-semibold text-foreground">
          Or enter custom support
        </label>
        <p id="custom-support-hint" className="mt-1 text-xs text-muted-foreground">
          Between {MIN_SUPPORT_AMOUNT} and {formatPoints(MAX_SUPPORT_AMOUNT)} support points.
        </p>
      </div>

      <div
        className={cn(
          "flex items-center rounded-2xl border bg-card/40 px-4",
          active ? "border-primary" : "border-border/50",
          error && active ? "border-destructive" : null
        )}
      >
        <input
          id="custom-support"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error) && active}
          aria-describedby={describedBy}
          placeholder="1000"
          className="h-14 w-full bg-transparent font-mono text-lg font-bold outline-none placeholder:text-muted-foreground/50"
        />
        <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Support Points
        </span>
      </div>

      {error && active ? (
        <p id="custom-support-error" role="alert" className="text-sm text-red-400">
          {error}
        </p>
      ) : null}
    </section>
  );
}
