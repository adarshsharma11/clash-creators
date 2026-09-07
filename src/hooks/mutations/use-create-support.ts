import { useMutation } from "@tanstack/react-query";
import { createSupport } from "@/lib/api/supports";
import { createSupportSchema, type CreateSupportInput } from "@/lib/validations/support";

export function useCreateSupport() {
  return useMutation({
    mutationFn: (input: CreateSupportInput) => {
      const parsed = createSupportSchema.parse(input);
      return createSupport(parsed, { idempotencyKey: crypto.randomUUID() });
    },
  });
}
