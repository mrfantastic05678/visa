import type { VisaType } from "@/types/db";

/**
 * Fallback visa catalogue used when the database is unreachable or empty
 * (e.g. local preview without DATABASE_URL). Mirrors src/lib/db/seed.ts so the
 * public site always has visa cards to render. Real pricing comes from Neon.
 */
const now = new Date().toISOString();

function make(
  id: number,
  slug: string,
  name: string,
  entry_type: VisaType["entry_type"],
  duration_days: number,
  standard_price_aed: number,
  has_express: boolean,
  sort_order: number,
  extra?: Partial<VisaType>
): VisaType {
  return {
    id,
    slug,
    name,
    entry_type,
    duration_days,
    standard_price_aed,
    has_express,
    is_active: true,
    sort_order,
    created_at: now,
    updated_at: now,
    ...extra,
  };
}

export const SAMPLE_VISA_TYPES: VisaType[] = [
  make(1, "30d-single", "Tourist · 30 days", "single", 30, 349, true, 1),
  make(2, "60d-single", "Tourist · 60 days", "single", 60, 549, true, 2),
  make(3, "90d-multi", "Multi-Entry · 90 days", "multiple", 90, 1049, true, 3),
  make(4, "14d-single", "Business Visa", "single", 14, 749, true, 4),
  make(5, "96h-transit", "Transit Visa", "single", 4, 149, true, 5),
  make(6, "5y-multi", "Family Residence", "multiple", 1825, 2949, false, 6),
];

/** Marketing blurbs and feature lists keyed by visa slug. */
export const VISA_DETAILS: Record<
  string,
  { tagline: string; processing: string; features: string[] }
> = {
  "30d-single": {
    tagline: "Single entry, perfect for short visits, leisure and family stays.",
    processing: "24–72h",
    features: ["Single entry", "Photo & passport scan only", "Free re-submission if rejected"],
  },
  "60d-single": {
    tagline: "Extended stay, single or multiple entry options available.",
    processing: "24–72h",
    features: ["Extended stay", "Family bundle discount", "Express upgrade available"],
  },
  "90d-multi": {
    tagline: "Frequent travellers. Multiple entries within validity period.",
    processing: "48–72h",
    features: ["Multiple entries", "Ideal for frequent travel", "Valid for 1 year"],
  },
  "14d-single": {
    tagline: "For business travellers. Conferences, meetings, and sponsor letters.",
    processing: "24h Express",
    features: ["Conferences & meetings", "Letter from sponsor accepted", "Priority embassy queue"],
  },
  "96h-transit": {
    tagline: "Quick stop-over visa for travellers connecting through UAE.",
    processing: "12h",
    features: ["Stop-over visa", "Onward ticket required", "Issued same day"],
  },
  "5y-multi": {
    tagline: "Long-term multiple entry. End-to-end documentation support.",
    processing: "7–10 days",
    features: ["Spouse & children", "End-to-end documentation", "Renewal support"],
  },
};

/** Comparison table data for the three most popular visas. */
export const COMPARE_SLUGS = ["30d-single", "60d-single", "90d-multi"] as const;

export interface CompareRow {
  label: string;
  values: [string | boolean, string | boolean, string | boolean];
}

export const COMPARE_ROWS: CompareRow[] = [
  { label: "Price", values: ["AED 349", "AED 549", "AED 1,049"] },
  { label: "Duration", values: ["30 days", "60 days", "90 days"] },
  { label: "Entry", values: ["Single", "Single", "Multiple"] },
  { label: "Processing", values: ["24–72h", "24–72h", "48–72h"] },
  { label: "Express Available", values: [true, true, true] },
  { label: "Family Discount", values: [false, true, true] },
  { label: "Refund Guarantee", values: [true, true, true] },
  { label: "Validity", values: ["58 days from issue", "58 days from issue", "1 year"] },
];
