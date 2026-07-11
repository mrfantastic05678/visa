import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Server-side session guard for admin routes. Validates the session token
 * against the database — redirects to login if missing or invalid.
 *
 * Forwards the full request headers (not a manually-reconstructed cookie)
 * so Better Auth sees whichever cookie name the browser actually sent —
 * `__Secure-better-auth.session_token` on HTTPS, plain otherwise.
 */
export async function requireAdminSession() {
  let session;
  try {
    session = await auth.api.getSession({ headers: await headers() });
  } catch {
    // Session validation failed — treat as unauthenticated
    redirect("/admin/login");
  }

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

/**
 * Server-side guard that requires the user to have the "admin" role.
 */
export async function requireAdminRole() {
  const session = await requireAdminSession();

  const role = (session?.user as Record<string, unknown> | undefined)?.role;
  if (role !== "admin") {
    redirect("/admin");
  }

  return session;
}
