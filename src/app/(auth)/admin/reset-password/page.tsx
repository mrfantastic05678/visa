"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const inputCls =
  "w-full h-11 px-3.5 rounded-lg border border-line bg-white text-sm font-sans text-navy placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue transition-colors";
const labelCls = "block text-sm font-sans font-semibold text-ink mb-1.5";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mist px-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl border border-line p-8 text-center">
            <div className="h-12 w-12 rounded-full bg-red-50 grid place-items-center mx-auto mb-4">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <h1 className="font-display font-bold text-xl text-navy mb-2">
              Invalid link
            </h1>
            <p className="text-sm text-muted font-sans mb-6">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <Link
              href="/admin/forgot-password"
              className="inline-flex items-center gap-2 text-sm font-sans font-medium text-blue hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Request new link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await authClient.resetPassword({
        newPassword: password,
        token: token ?? undefined,
      });
      setDone(true);
    } catch {
      setError("This link may have expired. Please request a new one.");
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mist px-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl border border-line p-8 text-center">
            <div className="h-12 w-12 rounded-full bg-green-50 grid place-items-center mx-auto mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="font-display font-bold text-xl text-navy mb-2">
              Password updated
            </h1>
            <p className="text-sm text-muted font-sans mb-6">
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
            <button
              onClick={() => router.push("/admin/login")}
              className="w-full h-11 rounded-lg bg-blue text-white font-semibold font-sans text-sm flex items-center justify-center gap-2 hover:bg-blue-hover transition-colors"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-mist px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl border border-line p-8">
          <div className="text-center mb-6">
            <h1 className="font-display font-bold text-xl text-navy mb-1">
              Set new password
            </h1>
            <p className="text-sm text-muted font-sans">
              Choose a strong password for your admin account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={labelCls}>New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  required
                  className={inputCls}
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className={labelCls}>Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirm}
                onChange={(e) => { setConfirm(e.target.value); setError(null); }}
                required
                className={inputCls}
                placeholder="Re-enter password"
                autoComplete="new-password"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-danger font-sans">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg bg-blue text-white font-semibold font-sans text-sm flex items-center justify-center gap-2 hover:bg-blue-hover transition-colors disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Reset password
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 text-sm font-sans font-medium text-blue hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-mist">
          <Loader2 className="h-6 w-6 animate-spin text-blue" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
