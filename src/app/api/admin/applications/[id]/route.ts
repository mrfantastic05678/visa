import { db } from "@/lib/db";
import { applications, statusHistory } from "@/lib/db/schema";
import { requireAdminApi } from "@/lib/auth-guard";
import { sendStatusUpdateEmail } from "@/lib/resend";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const UpdateStatusSchema = z.object({
  status: z.enum([
    "draft",
    "submitted",
    "reviewing",
    "processing",
    "approved",
    "rejected",
  ]),
  note: z.string().max(2000).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, response } = await requireAdminApi();
  if (response) return response;

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = UpdateStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { status, note } = parsed.data;

  const [app] = await db
    .select()
    .from(applications)
    .where(eq(applications.id, id))
    .limit(1);

  if (!app) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  /* Update status + append immutable history row */
  await db
    .update(applications)
    .set({ status, updated_at: new Date() })
    .where(eq(applications.id, id));

  await db.insert(statusHistory).values({
    application_id: id,
    status,
    note: note ?? null,
    changed_by_admin_id: session!.user.id,
  });

  /* Notify applicant (non-blocking) */
  if (app.applicant_email && status !== "draft") {
    sendStatusUpdateEmail({
      to: app.applicant_email,
      applicantName: `${app.given_name} ${app.surname}`,
      applicationId: id,
      status,
      note,
    }).catch(() => null);
  }

  return NextResponse.json({
    application_id: id,
    status,
    updated_at: new Date().toISOString(),
  });
}
