import { SAMPLE_VISA_TYPES } from "./sample-visas";
import type { VisaType } from "@/types/db";
import type { VisaTypesResponse } from "@/types/api";

/**
 * Returns visa types for public display. UI-first phase: when no DATABASE_URL is
 * configured we return sample data directly (no network call, no failing fetch).
 * Once the database is connected, this fetches live data and falls back to
 * sample data only on error.
 */
export async function getDisplayVisaTypes(): Promise<VisaType[]> {
  if (!process.env.DATABASE_URL) return SAMPLE_VISA_TYPES;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/visa-types`,
      { cache: "no-store" }
    );
    if (!res.ok) return SAMPLE_VISA_TYPES;
    const data: VisaTypesResponse = await res.json();
    return data.visa_types.length > 0 ? data.visa_types : SAMPLE_VISA_TYPES;
  } catch {
    return SAMPLE_VISA_TYPES;
  }
}
