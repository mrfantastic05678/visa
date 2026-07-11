import { AuthShell } from "@/components/admin/AuthShell";
import { SignupForm } from "@/components/admin/SignupForm";
import Link from "next/link";

export const metadata = { title: "Create account" };

export default function AdminSignupPage() {
  return (
    <AuthShell
      eyebrow="Join the team"
      heading={"Built for visa\nexperts, by visa\nexperts."}
      blurb="Use your @visati.ae work email to register. An administrator will need to approve your account before you can sign in."
      bullets={[
        "Access all applications from one place",
        "Real-time status & document tracking",
        "Team collaboration & assignment tools",
      ]}
      mobileTitle="Visati Admin"
      mobileSubtitle="Create your staff account"
      formTitle="Create your account"
      formSubtitle="Use your @visati.ae work email to register."
    >
      <SignupForm />
      <p className="mt-6 text-center text-sm font-sans text-muted">
        Already have an account?{" "}
        <Link href="/admin/login" className="font-semibold text-blue hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
