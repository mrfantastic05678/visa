import { AuthShell } from "@/components/admin/AuthShell";
import { LoginForm } from "@/components/admin/LoginForm";
import Link from "next/link";
import { Suspense } from "react";

export const metadata = { title: "Sign in" };

export default function AdminLoginPage() {
  return (
    <AuthShell
      eyebrow="Internal"
      heading={"The concierge\ndesk."}
      blurb="Where every Visati application gets attention. Sign in to pick up where you left off."
      mobileTitle="Visati Admin"
      mobileSubtitle="Internal workspace"
      formTitle="Sign in"
      formSubtitle="Welcome back, consultant."
    >
      <Suspense fallback={<div className="h-72" />}>
        <LoginForm />
      </Suspense>
      <p className="mt-6 text-center text-sm font-sans text-muted">
        Need an account?{" "}
        <Link href="/admin/signup" className="font-semibold text-blue hover:underline">
          Create one
        </Link>
      </p>
    </AuthShell>
  );
}
