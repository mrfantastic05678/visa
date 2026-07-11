import { db } from "@/lib/db";
import { session, user } from "@/lib/db/schema";
import { requireAdminRoleApi } from "@/lib/auth-guard";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const PatchSchema = z.object({
  status: z.enum(["pending", "active", "banned"]),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session: adminSession, response } = await requireAdminRoleApi();
  if (response) return response;

  const { id } = await params;
  if (id === adminSession!.user.id) {
    return NextResponse.json(
      { error: "You cannot change your own account status" },
      { status: 400 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 422 });
  }

  const [updated] = await db
    .update(user)
    .set({ status: parsed.data.status, updatedAt: new Date() })
    .where(eq(user.id, id))
    .returning({ id: user.id });

  if (!updated) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Banning revokes any existing sessions immediately — an already-signed-in
  // user shouldn't keep dashboard access until their cookie happens to expire.
  if (parsed.data.status === "banned") {
    await db.delete(session).where(eq(session.userId, id));
  }

  return NextResponse.json({ id, status: parsed.data.status });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session: adminSession, response } = await requireAdminRoleApi();
  if (response) return response;

  const { id } = await params;
  if (id === adminSession!.user.id) {
    return NextResponse.json(
      { error: "You cannot delete your own account" },
      { status: 400 }
    );
  }

  await db.delete(session).where(eq(session.userId, id));
  await db.delete(user).where(eq(user.id, id));

  return NextResponse.json({ id, deleted: true });
}
