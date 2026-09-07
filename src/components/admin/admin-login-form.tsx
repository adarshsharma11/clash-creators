"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PasswordField } from "@/components/ui/password-field";
import { useAdminAuth } from "@/context/admin-auth-context";
import { adminLoginSchema } from "@/lib/validations/auth";
import { getLoginErrorMessage } from "@/types/api";

export function AdminLoginForm() {
  const router = useRouter();
  const { login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) {
      return;
    }

    const parsed = adminLoginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const nextErrors: { email?: string; password?: string } = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (key === "email" || key === "password") {
          nextErrors[key] = issue.message;
        }
      }
      setFieldErrors(nextErrors);
      setError(null);
      return;
    }

    setFieldErrors({});
    setError(null);
    setSubmitting(true);
    try {
      await login(parsed.data);
      router.replace("/admin");
    } catch (mutationError) {
      setError(getLoginErrorMessage(mutationError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-border/50 bg-card/50 p-6 sm:p-8">
      <div className="mb-8 text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <Crown className="h-6 w-6 text-primary" />
          <span className="font-bold tracking-tight">CLASHCREATORS</span>
        </div>
        <Badge className="mb-4 bg-primary/15 text-primary hover:bg-primary/15">ADMIN</Badge>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in to manage ClashCreators.</p>
      </div>

      <form className="space-y-4" onSubmit={(event) => void handleSubmit(event)}>
        <div>
          <label htmlFor="admin-email" className="mb-1.5 block text-sm font-semibold">
            Email
          </label>
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            autoFocus
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-11 w-full rounded-xl border border-border/50 bg-background px-3 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring"
          />
          {fieldErrors.email ? <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p> : null}
        </div>
        <PasswordField
          id="admin-password"
          value={password}
          onChange={setPassword}
          error={fieldErrors.password}
        />
        {error ? (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        ) : null}
        <Button type="submit" className="h-11 w-full font-bold" disabled={submitting}>
          {submitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </div>
  );
}
