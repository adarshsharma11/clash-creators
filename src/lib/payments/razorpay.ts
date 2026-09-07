import type { RazorpayCheckoutPayload } from "@/types/support";

const SCRIPT_ID = "razorpay-checkout-js";
const SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

type RazorpayCheckoutResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayInstance = {
  open: () => void;
  close: () => void;
  on?: (
    event: string,
    handler: (response: { error?: { description?: string } }) => void
  ) => void;
};

type RazorpayPrefill = {
  name?: string;
  email?: string;
  contact?: string;
};

type RazorpayConstructor = new (options: {
  key: string;
  order_id: string;
  amount?: string | number;
  currency?: string;
  name?: string;
  description?: string;
  prefill?: RazorpayPrefill;
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
  handler: (response: RazorpayCheckoutResponse) => void;
}) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

export type RazorpayCheckoutErrorReason =
  | "cancelled"
  | "failed"
  | "sdk"
  | "missing_order"
  | "busy";

export class RazorpayCheckoutError extends Error {
  readonly reason: RazorpayCheckoutErrorReason;

  constructor(message: string, reason: RazorpayCheckoutErrorReason) {
    super(message);
    this.name = "RazorpayCheckoutError";
    this.reason = reason;
  }
}

let scriptPromise: Promise<RazorpayConstructor> | null = null;
let checkoutOpen = false;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function readRazorpayCheckout(value: unknown): RazorpayCheckoutPayload | null {
  if (!isRecord(value)) {
    return null;
  }

  return {
    keyId: typeof value.keyId === "string" ? value.keyId : null,
    orderId: typeof value.orderId === "string" ? value.orderId : null,
    amount: typeof value.amount === "string" ? value.amount : String(value.amount ?? ""),
    currency: typeof value.currency === "string" ? value.currency : "INR",
  };
}

export function loadRazorpaySdk(): Promise<RazorpayConstructor> {
  if (typeof window === "undefined") {
    return Promise.reject(new RazorpayCheckoutError("Checkout is only available in the browser.", "sdk"));
  }

  if (window.Razorpay) {
    return Promise.resolve(window.Razorpay);
  }

  if (scriptPromise) {
    return scriptPromise;
  }

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      existing.addEventListener("load", () => {
        if (window.Razorpay) {
          resolve(window.Razorpay);
          return;
        }
        scriptPromise = null;
        reject(new RazorpayCheckoutError("Secure checkout failed to load.", "sdk"));
      });
      existing.addEventListener("error", () => {
        scriptPromise = null;
        reject(new RazorpayCheckoutError("Secure checkout failed to load.", "sdk"));
      });
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => {
      if (window.Razorpay) {
        resolve(window.Razorpay);
        return;
      }
      scriptPromise = null;
      reject(new RazorpayCheckoutError("Secure checkout failed to load.", "sdk"));
    };
    script.onerror = () => {
      script.remove();
      scriptPromise = null;
      reject(new RazorpayCheckoutError("Secure checkout failed to load.", "sdk"));
    };
    document.body.appendChild(script);
  });

  return scriptPromise;
}

export async function openRazorpayCheckout(input: {
  checkout: RazorpayCheckoutPayload;
  name?: string;
  description?: string;
  prefill?: RazorpayPrefill;
}): Promise<RazorpayCheckoutResponse> {
  if (checkoutOpen) {
    throw new RazorpayCheckoutError("Checkout is already open.", "busy");
  }

  const keyId = input.checkout.keyId;
  const orderId = input.checkout.orderId;

  if (!keyId || !orderId) {
    throw new RazorpayCheckoutError(
      "The payment order is not ready. The backend did not return a Razorpay order.",
      "missing_order"
    );
  }

  const Razorpay = await loadRazorpaySdk();

  return new Promise((resolve, reject) => {
    checkoutOpen = true;
    let settled = false;

    const finish = (callback: () => void) => {
      if (settled) {
        return;
      }
      settled = true;
      checkoutOpen = false;
      callback();
    };

    try {
      const instance = new Razorpay({
        key: keyId,
        order_id: orderId,
        amount: input.checkout.amount,
        currency: input.checkout.currency,
        name: input.name ?? "ClashCreators",
        description: input.description ?? "Creator support",
        prefill: input.prefill,
        theme: { color: "#f59e0b" },
        handler: (response) => {
          finish(() => resolve(response));
        },
        modal: {
          ondismiss: () => {
            finish(() =>
              reject(new RazorpayCheckoutError("Payment was cancelled.", "cancelled"))
            );
          },
        },
      });

      instance.on?.("payment.failed", () => {
        finish(() =>
          reject(new RazorpayCheckoutError("Payment failed. No points were added.", "failed"))
        );
      });

      instance.open();
    } catch {
      finish(() =>
        reject(new RazorpayCheckoutError("Secure checkout could not be opened.", "failed"))
      );
    }
  });
}

export function getRazorpayErrorMessage(error: unknown): string {
  if (error instanceof RazorpayCheckoutError) {
    return error.message;
  }

  return "Secure checkout could not be completed.";
}
