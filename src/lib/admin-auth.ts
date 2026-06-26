"use client";

import { authClient } from "@/lib/auth-client";

/**
 * Signs out the current user, clears cookies, and redirects to /admin/login.
 * Safe to call from any admin page.
 */
export async function signOutAndRedirect() {
  try {
    await authClient.signOut();
  } catch {
    // signOut may fail if no session — still redirect
  }
  // Clear the session cookie explicitly (BetterAuth sets "better-auth.session_token")
  document.cookie = "better-auth.session_token=; path=/; max-age=0";
  window.location.href = "/admin/login";
}
