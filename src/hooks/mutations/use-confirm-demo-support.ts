import { useMutation } from "@tanstack/react-query";
import { confirmDemoSupport } from "@/lib/api/supports";

export function useConfirmDemoSupport() {
  return useMutation({
    mutationFn: (id: string) => confirmDemoSupport(id),
  });
}
