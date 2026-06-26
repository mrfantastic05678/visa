import { auth } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Server-side session guard for admin routes.
 * Checks for a session cookie. In demo mode (fake token), allows access.
 * When real auth is seeded, validates against the database.
 */
export async function requireAdminSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;

  if (!sessionToken) {
    redirect("/admin/login");
  }

  // Demo/preview mode — fake token set by LoginForm's enterDemo()
  if (sessionToken === "ui-preview-demo") {
    return null;
  }

  // Real session — validate against database
  try {
    const session = await auth.api.getSession({
      headers: new Headers({
        cookie: `better-auth.session_token=${sessionToken}`,
      }),
    });

    if (!session) {
      redirect("/admin/login");
    }

    return session;
  } catch {
    // Session validation failed — treat as unauthenticated
    redirect("/admin/login");
  }
}

/**
 * Server-side guard that requires the user to have the "admin" role.
 * In demo mode, reads role from the visati-preview-role cookie.
 */
export async function requireAdminRole() {
  const session = await requireAdminSession();

  // Demo mode — check preview role cookie
  if (session === null) {
    const cookieStore = await cookies();
    const previewRole = cookieStore.get("visati-preview-role")?.value;
    if (previewRole !== "admin") {
      redirect("/admin");
    }
    return null;
  }

  const role = (session.user as Record<string, unknown>).role;
  if (role !== "admin") {
    redirect("/admin");
  }

  return session;
}
