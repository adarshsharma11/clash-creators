"use client";

import { useState } from "react";
import { AdminErrorState } from "@/components/admin/admin-error-state";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SettingsSkeleton } from "@/components/admin/settings-skeleton";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/context/admin-auth-context";
import { useUpdateSetting } from "@/hooks/mutations/use-admin-update-setting";
import { useAdminSettings } from "@/hooks/queries/use-admin-settings";
import { canManageSettings } from "@/lib/admin-permissions";
import { getApiErrorMessage } from "@/types/api";
import type { PlatformSetting, SettingValue } from "@/types/setting";

const SENSITIVE_KEY = /secret|password|token|private/i;

function isSensitive(key: string): boolean {
  return SENSITIVE_KEY.test(key);
}

function displayValue(setting: PlatformSetting): string {
  if (isSensitive(setting.key)) {
    return "••••••••";
  }
  if (typeof setting.value === "string" || typeof setting.value === "number" || typeof setting.value === "boolean") {
    return String(setting.value);
  }
  return JSON.stringify(setting.value);
}

export function AdminSettingsPanel() {
  const { admin } = useAdminAuth();
  const query = useAdminSettings();
  const updateSetting = useUpdateSetting();
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const settings = query.data ?? [];

  if (!canManageSettings(admin?.role)) {
    return (
      <div>
        <AdminPageHeader title="Settings" description="Platform settings are limited to Super Admins." />
        <p className="rounded-2xl border border-dashed border-border/60 px-6 py-12 text-center text-sm text-muted-foreground">
          You don&apos;t have permission to view platform settings.
        </p>
      </div>
    );
  }

  const saveSetting = (setting: PlatformSetting) => {
    if (updateSetting.isPending || isSensitive(setting.key)) {
      return;
    }

    const raw = drafts[setting.key] ?? displayValue(setting);
    let value: SettingValue = raw;

    if (typeof setting.value === "boolean") {
      value = raw === "true";
    } else if (typeof setting.value === "number") {
      value = Number(raw);
      if (!Number.isFinite(value)) {
        setError("Enter a valid number.");
        return;
      }
    }

    setError(null);
    updateSetting.mutate(
      { key: setting.key, value },
      {
        onSuccess: () => {
          setFeedback(`${setting.key} saved.`);
        },
        onError: (mutationError) => {
          setError(getApiErrorMessage(mutationError));
        },
      }
    );
  };

  if (query.isPending) {
    return <SettingsSkeleton />;
  }

  if (query.isError) {
    return <AdminErrorState error={query.error} onRetry={() => void query.refetch()} />;
  }

  return (
    <div>
      <AdminPageHeader title="Settings" description="Platform settings from the backend. Secrets stay masked." />
      {feedback ? <p className="mb-3 text-sm text-primary">{feedback}</p> : null}
      {error ? <p className="mb-3 text-sm text-red-400">{error}</p> : null}

      <div className="space-y-4">
        {settings.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border/60 px-6 py-12 text-center text-sm text-muted-foreground">
            No settings are available.
          </p>
        ) : (
          settings.map((setting) => (
            <section key={setting.key} className="rounded-2xl border border-border/50 p-5">
              <h2 className="mb-1 text-sm font-bold tracking-tight">{setting.key}</h2>
              {setting.description ? (
                <p className="mb-4 text-sm text-muted-foreground">{setting.description}</p>
              ) : null}
              {typeof setting.value === "boolean" && !isSensitive(setting.key) ? (
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={(drafts[setting.key] ?? String(setting.value)) === "true"}
                    onChange={(event) =>
                      setDrafts((current) => ({ ...current, [setting.key]: String(event.target.checked) }))
                    }
                  />
                  Enabled
                </label>
              ) : (
                <input
                  value={drafts[setting.key] ?? displayValue(setting)}
                  disabled={isSensitive(setting.key)}
                  onChange={(event) =>
                    setDrafts((current) => ({ ...current, [setting.key]: event.target.value }))
                  }
                  className="mt-1.5 h-11 w-full rounded-xl border border-border/50 bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
                />
              )}
              <div className="mt-4">
                <Button
                  size="sm"
                  disabled={updateSetting.isPending || isSensitive(setting.key)}
                  onClick={() => saveSetting(setting)}
                >
                  {updateSetting.isPending ? "Saving…" : "Save"}
                </Button>
              </div>
            </section>
          ))
        )}
      </div>

      <section className="mt-8 rounded-2xl border border-border/50 p-5">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Admin Profile
        </h2>
        <p className="text-sm">
          {admin?.name} · {admin?.email} · {admin?.role}
        </p>
      </section>
    </div>
  );
}
