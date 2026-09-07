import type { Metadata } from "next";
import { Suspense } from "react";
import { UserLoginForm } from "@/components/auth/user-login-form";

export const metadata: Metadata = {
  title: "Sign in — ClashCreators",
};

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-border/50 bg-card/50 p-6 sm:p-8">
        <h1 className="mb-2 text-2xl font-bold tracking-tight">Sign in</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Use your ClashCreators username or email and password.
        </p>
        <Suspense>
          <UserLoginForm />
        </Suspense>
      </div>
    </main>
  );
}
