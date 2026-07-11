import { db } from "@/lib/db";
import { applications, statusHistory, visaTypes } from "@/lib/db/schema";
import { requireAdminApi } from "@/lib/auth-guard";
import { generateAppId } from "@/lib/utils";
import { and, desc, eq, ilike, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import type { ApplicationStatus } from "@/types/db";
import { z } from "zod";

const VALID_STATUSES: ApplicationStatus[] = [
  "draft",
  "submitted",
  "reviewing",
  "processing",
  "approved",
  "rejected",
];

export async function GET(request: NextRequest) {
  const { response } = await requireAdminApi();
  if (response) return response;

  const sp = request.nextUrl.searchParams;
  const statusParam = sp.get("status");
  const search = sp.get("q")?.trim();

  const conditions = [];
  if (statusParam && VALID_STATUSES.includes(statusParam as ApplicationStatus)) {
    conditions.push(eq(applications.status, statusParam as ApplicationStatus));
  }
  if (search) {
    conditions.push(
      or(
        ilike(applications.id, `%${search}%`),
        ilike(applications.given_name, `%${search}%`),
        ilike(applications.surname, `%${search}%`),
        ilike(applications.passport_number, `%${search}%`)
      )
    );
  }

  const rows = await db
    .select()
    .from(applications)
    .innerJoin(visaTypes, eq(applications.visa_type_id, visaTypes.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(applications.created_at))
    .limit(200);

  return NextResponse.json({
    applications: rows.map((r) => ({
      ...r.applications,
      visa_type_name: r.visa_types.name,
    })),
  });
}

const CreateSchema = z.object({
  given_name: z.string().min(1).max(200),
  surname: z.string().min(1).max(200),
  applicant_email: z.string().email().max(255),
  nationality: z.string().min(1).max(100),
  visa_type_slug: z.string().min(1).max(100),
});

export async function POST(request: NextRequest) {
  const { response } = await requireAdminApi();
  if (response) return response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 }
    );
  }
  const data = parsed.data;

  const [visaType] = await db
    .select()
    .from(visaTypes)
    .where(eq(visaTypes.slug, data.visa_type_slug))
    .limit(1);

  if (!visaType || !visaType.is_active) {
    return NextResponse.json({ error: "Visa type not found or inactive" }, { status: 404 });
  }

  const applicationId = generateAppId();

  // Admin-created applications are for clients who already paid outside
  // Stripe (phone/in-person/bank transfer) — created directly as "submitted",
  // with placeholder identity fields the applicant fills in properly later
  // via their tracking link, matching how the public flow starts.
  await db.insert(applications).values({
    id: applicationId,
    visa_type_id: visaType.id,
    nationality: data.nationality,
    given_name: data.given_name,
    surname: data.surname,
    passport_number: "PENDING",
    date_of_birth: "1900-01-01",
    passport_expiry: "1900-01-01",
    travel_date: "1900-01-01",
    processing_tier: "standard",
    applicant_email: data.applicant_email,
    status: "submitted",
    amount_paid_aed: visaType.standard_price_aed,
  });

  await db.insert(statusHistory).values({
    application_id: applicationId,
    status: "submitted",
    note: "Application created manually by admin — payment collected outside Stripe",
  });

  return NextResponse.json({ application_id: applicationId }, { status: 201 });
}
