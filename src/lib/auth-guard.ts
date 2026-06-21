import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

/** Returns the authenticated admin session, or null if unauthenticated. */
export async function getAdminSession() {
  return auth.api.getSession({ headers: await headers() });
}

/** Guard for admin API routes — returns a 401 response if not signed in. */
export async function requireAdminApi() {
  const session = await getAdminSession();
  if (!session?.user) {
    return {
      session: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { session, response: null };
}
