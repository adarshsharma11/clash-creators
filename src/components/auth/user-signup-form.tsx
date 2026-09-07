"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PasswordField } from "@/components/ui/password-field";
import { useAuth } from "@/context/auth-context";
import { getSafeRedirectPath } from "@/lib/safe-redirect";
import { userSignupSchema } from "@/lib/validations/auth";
import { getApiValidationErrors, getLoginErrorMessage } from "@/types/api";

interface UserSignupFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export function UserSignupForm({ onSuccess, onSwitchToLogin }: UserSignupFormProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signup } = useAuth();
  const embedded = Boolean(onSuccess);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) {
      return;
    }

    const parsed = userSignupSchema.safeParse({ fullName, username, email, password });
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "");
        if (key && !nextErrors[key]) {
          nextErrors[key] = issue.message === "Enter a valid email" ? "Please enter a valid email address." : issue.message;
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
      await signup(parsed.data);
      if (onSuccess) {
        onSuccess();
      } else {
        router.replace(getSafeRedirectPath(searchParams.get("next")));
      }
    } catch (mutationError) {
      const validation = getApiValidationErrors(mutationError);
      setError(validation[0] ?? getLoginErrorMessage(mutationError));
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "h-11 w-full rounded-xl border border-border/50 bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <form className="space-y-4" onSubmit={(event) => void handleSubmit(event)}>
      <div>
        <label htmlFor={embedded ? "join-signup-full-name" : "signup-full-name"} className="mb-1.5 block text-sm font-semibold">
          Full name
        </label>
        <input
          id={embedded ? "join-signup-full-name" : "signup-full-name"}
          autoComplete="name"
          autoFocus
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          className={inputClass}
        />
        {fieldErrors.fullName ? <p className="mt-1 text-xs text-red-400">{fieldErrors.fullName}</p> : null}
      </div>
      <div>
        <label htmlFor={embedded ? "join-signup-username" : "signup-username"} className="mb-1.5 block text-sm font-semibold">
          Username
        </label>
        <input id={embedded ? "join-signup-username" : "signup-username"} autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} className={inputClass} />
        {fieldErrors.username ? <p className="mt-1 text-xs text-red-400">{fieldErrors.username}</p> : null}
      </div>
      <div>
        <label htmlFor={embedded ? "join-signup-email" : "signup-email"} className="mb-1.5 block text-sm font-semibold">
          Email
        </label>
        <input id={embedded ? "join-signup-email" : "signup-email"} type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass} />
        {fieldErrors.email ? <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p> : null}
      </div>
      <PasswordField
        id={embedded ? "join-signup-password" : "signup-password"}
        label="Password"
        autoComplete="new-password"
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
        {submitting ? "Creating account..." : "Create account"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        {onSwitchToLogin ? (
          <button type="button" className="font-semibold text-primary hover:text-primary/80" onClick={onSwitchToLogin}>
            Sign in
          </button>
        ) : (
          <Link href="/login" className="font-semibold text-primary hover:text-primary/80">
            Sign in
          </Link>
        )}
      </p>
    </form>
  );
}
