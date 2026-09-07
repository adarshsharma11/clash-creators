import { loadRazorpaySdk, openRazorpayCheckout, readRazorpayCheckout } from "@/lib/payments/razorpay";

export function useRazorpay() {
  return {
    load: loadRazorpaySdk,
    openCheckout: openRazorpayCheckout,
    readCheckout: readRazorpayCheckout,
  };
}
