"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { getSafeRedirectPath } from "@/lib/safe-redirect";
import { userLoginSchema } from "@/lib/validations/auth";
import { getApiErrorMessage } from "@/types/api";

export function UserLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
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
      router.replace(getSafeRedirectPath(searchParams.get("next")));
    } catch (mutationError) {
      setError(getApiErrorMessage(mutationError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={(event) => void handleSubmit(event)}>
      <div>
        <label htmlFor="user-username" className="mb-1.5 block text-sm font-semibold">
          Username or email
        </label>
        <input
          id="user-username"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="h-11 w-full rounded-xl border border-border/50 bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {fieldErrors.username ? <p className="mt-1 text-xs text-red-400">{fieldErrors.username}</p> : null}
      </div>
      <div>
        <label htmlFor="user-password" className="mb-1.5 block text-sm font-semibold">
          Password
        </label>
        <input
          id="user-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-11 w-full rounded-xl border border-border/50 bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {fieldErrors.password ? <p className="mt-1 text-xs text-red-400">{fieldErrors.password}</p> : null}
      </div>
      {error ? (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      ) : null}
      <Button type="submit" className="h-11 w-full font-bold" disabled={submitting}>
        {submitting ? "Signing in..." : "Sign In"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link href="/signup" className="font-semibold text-primary hover:text-primary/80">
          Create an account
        </Link>
      </p>
    </form>
  );
}
