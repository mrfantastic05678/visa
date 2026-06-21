import { db } from "@/lib/db";
import { applications, visaTypes } from "@/lib/db/schema";
import { requireAdminApi } from "@/lib/auth-guard";
import { and, desc, eq, ilike, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import type { ApplicationStatus } from "@/types/db";

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
