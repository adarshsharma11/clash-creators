"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useCreateReport } from "@/hooks/mutations/use-create-report";
import { REPORT_REASONS, createReportSchema } from "@/lib/validations/report";
import { ApiError, getApiErrorMessage } from "@/types/api";
import type { ReportReason } from "@/types/report";

const REASON_LABELS: Record<ReportReason, string> = {
  SPAM: "Spam",
  HARASSMENT: "Harassment",
  FAKE_ACCOUNT: "Fake account",
  INAPPROPRIATE_CONTENT: "Inappropriate content",
  FRAUD: "Fraud",
  OTHER: "Other",
};

interface ReportCreatorFormProps {
  creatorId: string;
  username: string;
}

export function ReportCreatorForm({ creatorId, username }: ReportCreatorFormProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const createReport = useCreateReport();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason>("SPAM");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const loginPath = `/login?next=${encodeURIComponent(`/creators/${username}`)}`;

  const handleOpen = () => {
    if (!isAuthenticated) {
      router.push(loginPath);
      return;
    }
    setOpen(true);
    setSuccess(false);
    setError(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (createReport.isPending) {
      return;
    }

    const parsed = createReportSchema.safeParse({ creatorId, reason, description: description || undefined });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter a valid report.");
      return;
    }

    setError(null);
    createReport.mutate(parsed.data, {
      onSuccess: () => {
        setSuccess(true);
        setDescription("");
      },
      onError: (mutationError) => {
        if (mutationError instanceof ApiError && mutationError.status === 409) {
          setError("A similar report is already pending. You can report again after 24 hours.");
          return;
        }
        if (mutationError instanceof ApiError && mutationError.status === 401) {
          router.push(loginPath);
          return;
        }
        setError(getApiErrorMessage(mutationError));
      },
    });
  };

  return (
    <div className="mt-8 text-center">
      {!open ? (
        <Button variant="ghost" size="sm" onClick={handleOpen}>
          Report creator
        </Button>
      ) : (
        <form className="mx-auto max-w-md rounded-2xl border border-border/50 bg-card/40 p-5 text-left" onSubmit={handleSubmit}>
          <h3 className="mb-3 text-sm font-bold">Report @{username}</h3>
          {success ? (
            <p className="text-sm text-primary">Report submitted. Thank you.</p>
          ) : (
            <>
              <label htmlFor="report-reason" className="text-sm font-semibold">
                Reason
              </label>
              <select
                id="report-reason"
                value={reason}
                onChange={(event) => setReason(event.target.value as ReportReason)}
                className="mt-1.5 h-11 w-full rounded-xl border border-border/50 bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {REPORT_REASONS.map((item) => (
                  <option key={item} value={item}>
                    {REASON_LABELS[item]}
                  </option>
                ))}
              </select>
              <label htmlFor="report-description" className="mt-4 block text-sm font-semibold">
                Details
              </label>
              <textarea
                id="report-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="mt-1.5 min-h-24 w-full rounded-xl border border-border/50 bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}
              <div className="mt-4 flex gap-2">
                <Button type="submit" size="sm" disabled={createReport.isPending}>
                  {createReport.isPending ? "Sending…" : "Submit report"}
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </div>
            </>
          )}
        </form>
      )}
    </div>
  );
}
