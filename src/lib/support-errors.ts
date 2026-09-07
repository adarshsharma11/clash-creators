import { RazorpayCheckoutError } from "@/lib/payments/razorpay";
import { ApiError } from "@/types/api";
import type { PaymentPhase } from "@/types/support";

export function getSupportPaymentErrorMessage(error: unknown): string {
  if (error instanceof RazorpayCheckoutError) {
    if (error.reason === "cancelled") {
      return "Payment was cancelled.";
    }

    if (error.reason === "missing_order") {
      return "The payment order is not ready. Checkout cannot start until the backend returns a Razorpay order.";
    }

    if (error.reason === "sdk") {
      return "Secure checkout failed to load. Check your connection and try again.";
    }

    if (error.reason === "busy") {
      return "Checkout is already open.";
    }

    return "Payment failed. No points were added.";
  }

  if (!(error instanceof ApiError)) {
    return "Support could not be completed. No points were added.";
  }

  if (error.status === 401) {
    return "Sign in to support this creator.";
  }

  if (error.status === 403) {
    return error.message || "Support is not available for this clash right now.";
  }

  if (error.status === 404) {
    return "This clash or creator was not found.";
  }

  if (error.status === 409) {
    return "This payment was already processed.";
  }

  if (error.status === 422) {
    return "Enter a valid whole number of support points.";
  }

  if (error.status === 0) {
    return "Unable to reach the server. Check your connection and try again.";
  }

  if (error.status >= 500) {
    return "The payment service is unavailable right now.";
  }

  return error.message || "Support could not be completed. No points were added.";
}

export function paymentPhaseLabel(phase: PaymentPhase): string | null {
  switch (phase) {
    case "creating_order":
      return "Preparing payment...";
    case "checkout_open":
      return "Opening secure checkout...";
    case "verifying":
      return "Verifying payment...";
    case "confirmed":
      return "Support confirmed!";
    case "failed":
      return "Payment failed";
    case "cancelled":
      return "Payment cancelled";
    default:
      return null;
  }
}
