"use client";

import { authClient } from "@/lib/auth-client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { inputClasses } from "@/components/ui/FormInput";
import { cn } from "@/lib/utils";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: authError } = await authClient.signIn.email({
      email: email.trim(),
      password,
    });
    if (authError) {
      setError("Invalid email or password.");
      setLoading(false);
    } else {
      router.push(callbackUrl);
    }
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-display font-bold text-2xl text-white">Visati</p>
          <p className="text-white/50 text-sm font-sans mt-1">Admin Portal</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-8 space-y-5 shadow-xl"
        >
          <h1 className="font-display font-bold text-xl text-navy">Sign In</h1>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-ink uppercase tracking-widest font-sans">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={cn(inputClasses, "bg-mist")}
              placeholder="admin@visati.ae"
              autoComplete="email"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-ink uppercase tracking-widest font-sans">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={cn(inputClasses, "bg-mist")}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-sm text-danger font-sans">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-blue text-white font-semibold font-sans text-sm flex items-center justify-center gap-2 hover:bg-blue-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-navy" aria-hidden="true" />}
    >
      <AdminLoginForm />
    </Suspense>
  );
}
