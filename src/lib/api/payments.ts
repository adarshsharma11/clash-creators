import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { VerifyRazorpayPaymentInput, VerifyRazorpayPaymentResult } from "@/types/support";

export function verifyRazorpayPayment(
  input: VerifyRazorpayPaymentInput,
  signal?: AbortSignal
): Promise<VerifyRazorpayPaymentResult> {
  return apiClient.post<VerifyRazorpayPaymentResult>(API_ENDPOINTS.payments.verifyRazorpay, input, {
    signal,
  });
}
