import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { requireAdminRoleApi } from "@/lib/auth-guard";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const { response } = await requireAdminRoleApi();
  if (response) return response;

  const rows = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
    })
    .from(user)
    .orderBy(desc(user.createdAt));

  return NextResponse.json({ users: rows });
}
