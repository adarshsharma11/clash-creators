"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPoints } from "@/lib/formatters";
import { paymentPhaseLabel } from "@/lib/support-errors";
import type { PaymentPhase } from "@/types/support";

interface SupportConfirmationProps {
  open: boolean;
  username: string;
  amount: number;
  phase: PaymentPhase;
  error?: string | null;
  confirmLabel?: string;
  onConfirm: () => void;
  onBack: () => void;
}

export function SupportConfirmation({
  open,
  username,
  amount,
  phase,
  error = null,
  confirmLabel = "Confirm Support",
  onConfirm,
  onBack,
}: SupportConfirmationProps) {
  const reduceMotion = useReducedMotion();
  const confirmRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const busy = phase === "creating_order" || phase === "checkout_open" || phase === "verifying";
  const retryable = phase === "failed" || phase === "cancelled";
  const statusLabel = paymentPhaseLabel(phase);

  useEffect(() => {
    if (!open) {
      return;
    }

    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

    confirmRef.current?.focus();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) {
        onBack();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [open, onBack, busy]);

  if (!open) {
    return null;
  }

  const actionLabel = retryable ? "Try Again" : confirmLabel;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close confirmation"
        className="absolute inset-0 bg-black/70"
        disabled={busy}
        onClick={busy ? undefined : onBack}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-support-title"
        aria-describedby="confirm-support-status"
        initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.22 }}
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-8"
      >
        <h2 id="confirm-support-title" className="mb-3 text-2xl font-extrabold tracking-tight">
          Confirm Support
        </h2>
        <p className="mb-6 text-muted-foreground">
          You&apos;re about to give:
        </p>
        <p className="mb-2 font-mono text-4xl font-black text-primary">
          +{formatPoints(amount)}
        </p>
        <p className="mb-8 text-lg font-semibold">Support Points to @{username}</p>

        <div id="confirm-support-status" role="status" aria-live="polite" aria-atomic="true">
          <AnimatePresence mode="wait">
            {statusLabel ? (
              <motion.p
                key={phase}
                initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="mb-6 text-sm font-medium text-primary"
              >
                {statusLabel}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>

        {error ? (
          <p role="alert" className="mb-6 text-sm text-red-400">
            {error}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            ref={confirmRef}
            size="lg"
            className="h-12 min-h-12 flex-1 font-bold"
            onClick={onConfirm}
            disabled={busy}
            aria-busy={busy}
          >
            {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            {busy ? statusLabel ?? "Working…" : actionLabel}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 min-h-12 flex-1 font-bold"
            onClick={onBack}
            disabled={busy}
          >
            Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
