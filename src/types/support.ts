export const SUPPORT_INTENT_STATUSES = [
  "draft",
  "pending_confirmation",
] as const;

export type SupportIntentStatus = (typeof SUPPORT_INTENT_STATUSES)[number];

export type SupportIntent = {
  id: string;
  creatorId: string;
  username: string;
  amount: number;
  status: SupportIntentStatus;
  createdAt: string;
};

export type SupportResult = {
  intent: SupportIntent;
  appliedAmount: number;
  confirmedAt: string;
};

export type SupportAmountValidation = {
  amount: number | null;
  error: string | null;
};

export type SupportStatus = "PENDING" | "CONFIRMED" | "FAILED" | "CANCELLED";

export type RazorpayCheckoutPayload = {
  keyId: string | null;
  orderId: string | null;
  amount: string;
  currency: string;
};

export type CreateSupportResponse = {
  support: {
    id: string;
    points: number;
    status: SupportStatus;
    createdAt: string;
  };
  payment: {
    id: string;
    provider: string;
    amount: string | number;
    currency: string;
    status: string;
    checkout: RazorpayCheckoutPayload | null;
  };
  keyId?: string | null;
  orderId?: string | null;
  amount?: string | number;
  currency?: string;
  supportId?: string;
};

export type VerifyRazorpayPaymentInput = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export type VerifyRazorpayPaymentResult = {
  supportId: string;
  paymentId: string;
  status: SupportStatus | string;
  alreadyProcessed: boolean;
};

export type SupportRecord = {
  id: string;
  points: number;
  status: SupportStatus;
  createdAt: string;
  clash: {
    id: string;
    title: string;
    slug: string;
    status: string;
  };
  creator: {
    id: string;
    displayName: string;
    user: {
      username: string;
      fullName: string;
    };
  };
  payment: {
    id: string;
    provider: string;
    amount: string | number;
    currency: string;
    status: string;
  } | null;
};

export type PaymentPhase =
  | "idle"
  | "creating_order"
  | "checkout_open"
  | "verifying"
  | "confirmed"
  | "failed"
  | "cancelled";

export type SupportRankPreview = {
  currentRank: number;
  currentSupport: number;
  afterSupport: number;
  afterRank: number;
  currentDistanceToFirst: number;
  afterDistanceToFirst: number;
  isCurrentlyFirst: boolean;
  becomesFirst: boolean;
  remainsFirst: boolean;
  rankImproved: boolean;
};
