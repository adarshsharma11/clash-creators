import type { ReactNode } from "react";
import { SessionGuard } from "@/components/auth/session-guard";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SessionGuard />
      <Header />
      {children}
      <Footer />
    </>
  );
}
