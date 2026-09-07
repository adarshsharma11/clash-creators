import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSetting } from "@/lib/api/admin";
import { queryKeys } from "@/lib/api/query-keys";
import type { SettingValue } from "@/types/setting";

export function useUpdateSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: SettingValue }) =>
      updateSetting(key, { value }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.settings.all });
    },
  });
}
