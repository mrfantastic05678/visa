import { db } from "@/lib/db";
import { visaTypes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const types = await db
      .select()
      .from(visaTypes)
      .where(eq(visaTypes.is_active, true))
      .orderBy(visaTypes.sort_order);

    return NextResponse.json({ visa_types: types });
  } catch (err) {
    console.error("[GET /api/visa-types]", err);
    return NextResponse.json(
      { error: "Failed to fetch visa types" },
      { status: 500 }
    );
  }
}
