import { useMutation } from "@tanstack/react-query";
import { verifyRazorpayPayment } from "@/lib/api/payments";
import type { VerifyRazorpayPaymentInput } from "@/types/support";

export function useVerifyRazorpayPayment() {
  return useMutation({
    mutationFn: (input: VerifyRazorpayPaymentInput) => verifyRazorpayPayment(input),
  });
}
