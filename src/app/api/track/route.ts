import { db } from "@/lib/db";
import { applications, statusHistory, visaTypes } from "@/lib/db/schema";
import { APP_ID_REGEX } from "@/lib/utils";
import { SAMPLE_TRACKING } from "@/lib/sample-tracking";
import { asc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id")?.trim().toUpperCase();

  if (!id || !APP_ID_REGEX.test(id)) {
    return NextResponse.json(
      { error: "Invalid Application ID format" },
      { status: 400 }
    );
  }

  /* UI-first phase: try the database; fall back to sample data on any failure
     (covers both unset DATABASE_URL and placeholder/unreachable URLs). */
  try {
    const [row] = await db
      .select()
      .from(applications)
      .innerJoin(visaTypes, eq(applications.visa_type_id, visaTypes.id))
      .where(eq(applications.id, id))
      .limit(1);

    if (!row) {
      // Not in DB — check sample data before returning 404.
      const sample = SAMPLE_TRACKING[id];
      if (sample) return NextResponse.json(sample);
      return NextResponse.json(
        { error: "Application not found. Please check your ID and try again." },
        { status: 404 }
      );
    }

    const history = await db
      .select()
      .from(statusHistory)
      .where(eq(statusHistory.application_id, id))
      .orderBy(asc(statusHistory.created_at));

    const app = row.applications;
    const visa = row.visa_types;

    return NextResponse.json({
      application_id: app.id,
      status: app.status,
      visa_type_name: visa.name,
      applicant_name: `${app.given_name} ${app.surname}`,
      travel_date: app.travel_date,
      processing_tier: app.processing_tier,
      created_at: app.created_at.toISOString(),
      updated_at: app.updated_at.toISOString(),
      status_history: history.map((h) => ({
        ...h,
        created_at: h.created_at.toISOString(),
      })),
    });
  } catch {
    // DB unreachable (placeholder URL, no connection) — serve sample data.
    const sample = SAMPLE_TRACKING[id];
    if (sample) return NextResponse.json(sample);
    return NextResponse.json(
      { error: "Application not found. Please check your ID and try again." },
      { status: 404 }
    );
  }
}
