"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastTone = "success" | "error" | "warning";

type ToastItem = {
  id: number;
  tone: ToastTone;
  title: string;
  message?: string;
};

type ToastContextValue = {
  notify: (toast: Omit<ToastItem, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const value = useContext(ToastContext);
  if (!value) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return value;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const notify = useCallback((toast: Omit<ToastItem, "id">) => {
    const id = Date.now() + Math.random();
    setToasts((current) => {
      const duplicate = current.some(
        (item) => item.title === toast.title && item.message === toast.message && item.tone === toast.tone
      );
      if (duplicate) {
        return current;
      }
      return [...current.slice(-2), { ...toast, id }];
    });
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 4200);
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[80] flex w-[min(100%-2rem,22rem)] flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              role="status"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 8 }}
              className={cn(
                "pointer-events-auto rounded-2xl border px-4 py-3 shadow-lg backdrop-blur",
                toast.tone === "success" && "border-emerald-500/30 bg-card/95 text-foreground",
                toast.tone === "error" && "border-red-500/30 bg-card/95 text-foreground",
                toast.tone === "warning" && "border-amber-500/30 bg-card/95 text-foreground"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold">{toast.title}</p>
                  {toast.message ? <p className="mt-1 text-xs text-muted-foreground">{toast.message}</p> : null}
                </div>
                <button
                  type="button"
                  aria-label="Dismiss notification"
                  className="rounded-md p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
