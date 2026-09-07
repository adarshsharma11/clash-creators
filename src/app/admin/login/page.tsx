import type { Metadata } from "next";
import { AdminGuestGuard } from "@/components/admin/admin-guest-guard";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export const metadata: Metadata = {
  title: "Admin login",
  description: "Sign in to the ClashCreators admin console.",
};

export default function AdminLoginPage() {
  return (
    <AdminGuestGuard>
      <main className="flex min-h-screen items-center justify-center px-4 py-12">
        <AdminLoginForm />
      </main>
    </AdminGuestGuard>
  );
}
