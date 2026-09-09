import { formatPoints } from "@/lib/formatters";
import type { SupportAmountValidation } from "@/types/support";

export const SUPPORT_PRESETS = [10, 50, 100, 250, 500, 1000] as const;

export type SupportPreset = (typeof SUPPORT_PRESETS)[number];

export const MIN_SUPPORT_AMOUNT = 10;
export const MAX_SUPPORT_AMOUNT = 1_000;
export const DEFAULT_SUPPORT_AMOUNT: SupportPreset = 50;

export function sanitizeSupportInput(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, String(MAX_SUPPORT_AMOUNT).length + 1);
}

export function validateSupportAmount(raw: string): SupportAmountValidation {
  if (raw.trim() === "") {
    return { amount: null, error: "Enter a support amount." };
  }

  if (!/^\d+$/.test(raw)) {
    return { amount: null, error: "Enter a whole number of support points." };
  }

  const amount = Number(raw);

  if (!Number.isInteger(amount)) {
    return { amount: null, error: "Enter a whole number of support points." };
  }

  if (amount < MIN_SUPPORT_AMOUNT) {
    return {
      amount: null,
      error: `Minimum support is ${MIN_SUPPORT_AMOUNT} points.`,
    };
  }

  if (amount > MAX_SUPPORT_AMOUNT) {
    return {
      amount: null,
      error: `Maximum support is ${formatPoints(MAX_SUPPORT_AMOUNT)} points.`,
    };
  }

  return { amount, error: null };
}
