"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PasswordField } from "@/components/ui/password-field";
import { useAuth } from "@/context/auth-context";
import { getSafeRedirectPath } from "@/lib/safe-redirect";
import { userLoginSchema } from "@/lib/validations/auth";
import { getLoginErrorMessage } from "@/types/api";

interface UserLoginFormProps {
  onSuccess?: () => void;
  onSwitchToSignup?: () => void;
}

export function UserLoginForm({ onSuccess, onSwitchToSignup }: UserLoginFormProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const embedded = Boolean(onSuccess);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) {
      return;
    }

    const parsed = userLoginSchema.safeParse({ username, password });
    if (!parsed.success) {
      const nextErrors: { username?: string; password?: string } = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (key === "username" || key === "password") {
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
      if (onSuccess) {
        onSuccess();
      } else {
        router.replace(getSafeRedirectPath(searchParams.get("next")));
      }
    } catch (mutationError) {
      setError(getLoginErrorMessage(mutationError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={(event) => void handleSubmit(event)}>
      <div>
        <label htmlFor={embedded ? "join-user-username" : "user-username"} className="mb-1.5 block text-sm font-semibold">
          Username or email
        </label>
        <input
          id={embedded ? "join-user-username" : "user-username"}
          autoComplete="username"
          autoFocus
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="h-11 w-full rounded-xl border border-border/50 bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {fieldErrors.username ? <p className="mt-1 text-xs text-red-400">{fieldErrors.username}</p> : null}
      </div>
      <PasswordField
        id={embedded ? "join-user-password" : "user-password"}
        value={password}
        onChange={setPassword}
        error={fieldErrors.password}
      />
      {error ? (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      ) : null}
      <Button type="submit" className="h-11 w-full font-bold" disabled={submitting} aria-busy={submitting}>
        {submitting ? "Signing in..." : "Sign In"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        New here?{" "}
        {onSwitchToSignup ? (
          <button type="button" className="font-semibold text-primary hover:text-primary/80" onClick={onSwitchToSignup}>
            Create an account
          </button>
        ) : (
          <Link href="/signup" className="font-semibold text-primary hover:text-primary/80">
            Create an account
          </Link>
        )}
      </p>
    </form>
  );
}
