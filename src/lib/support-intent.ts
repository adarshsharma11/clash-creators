import type { SupportIntent } from "@/types/support";

type CreateSupportIntentInput = {
  creatorId: string;
  username: string;
  amount: number;
};

function createIntentId(creatorId: string, amount: number): string {
  return `si_${creatorId}_${amount}_${Date.now()}`;
}

export function createSupportIntent(input: CreateSupportIntentInput): SupportIntent {
  return {
    id: createIntentId(input.creatorId, input.amount),
    creatorId: input.creatorId,
    username: input.username,
    amount: input.amount,
    status: "draft",
    createdAt: new Date().toISOString(),
  };
}

export function requestSupportConfirmation(intent: SupportIntent): SupportIntent {
  return {
    ...intent,
    status: "pending_confirmation",
  };
}
