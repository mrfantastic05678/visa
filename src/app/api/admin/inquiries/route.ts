import { db } from "@/lib/db";
import { inquiries } from "@/lib/db/schema";
import { requireAdminApi } from "@/lib/auth-guard";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(request: NextRequest) {
  const { response } = await requireAdminApi();
  if (response) return response;

  const resolvedParam = request.nextUrl.searchParams.get("resolved");

  const rows = await db
    .select()
    .from(inquiries)
    .where(
      resolvedParam === "true"
        ? eq(inquiries.resolved, true)
        : resolvedParam === "false"
          ? eq(inquiries.resolved, false)
          : undefined
    )
    .orderBy(desc(inquiries.created_at))
    .limit(200);

  return NextResponse.json({ inquiries: rows, total: rows.length });
}

const PatchSchema = z.object({
  id: z.number().int().positive(),
  resolved: z.boolean(),
});

export async function PATCH(request: NextRequest) {
  const { response } = await requireAdminApi();
  if (response) return response;

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

  await db
    .update(inquiries)
    .set({ resolved: parsed.data.resolved })
    .where(eq(inquiries.id, parsed.data.id));

  return NextResponse.json({ id: parsed.data.id, resolved: parsed.data.resolved });
}
