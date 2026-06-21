import { db } from "./index";
import { visaTypes } from "./schema";
import { sql } from "drizzle-orm";

const VISA_SEED = [
  {
    slug: "14d-single",
    name: "14-Day Tourist Visa",
    entry_type: "single" as const,
    duration_days: 14,
    standard_price_aed: 649,
    has_express: true,
    is_active: true,
    sort_order: 1,
  },
  {
    slug: "30d-single",
    name: "30-Day Tourist Visa (Single Entry)",
    entry_type: "single" as const,
    duration_days: 30,
    standard_price_aed: 449,
    has_express: true,
    is_active: true,
    sort_order: 2,
  },
  {
    slug: "30d-multi",
    name: "30-Day Tourist Visa (Multiple Entry)",
    entry_type: "multiple" as const,
    duration_days: 30,
    standard_price_aed: 749,
    has_express: true,
    is_active: true,
    sort_order: 3,
  },
  {
    slug: "60d-single",
    name: "60-Day Tourist Visa (Single Entry)",
    entry_type: "single" as const,
    duration_days: 60,
    standard_price_aed: 699,
    has_express: true,
    is_active: true,
    sort_order: 4,
  },
  {
    slug: "60d-multi",
    name: "60-Day Tourist Visa (Multiple Entry)",
    entry_type: "multiple" as const,
    duration_days: 60,
    standard_price_aed: 999,
    has_express: true,
    is_active: true,
    sort_order: 5,
  },
  {
    slug: "96h-transit",
    name: "96-Hour Transit Visa",
    entry_type: "single" as const,
    duration_days: 4,
    standard_price_aed: 549,
    has_express: true,
    is_active: true,
    sort_order: 6,
  },
  {
    slug: "30d-gcc",
    name: "30-Day GCC Residents Visa",
    entry_type: "single" as const,
    duration_days: 30,
    standard_price_aed: 749,
    has_express: true,
    is_active: true,
    sort_order: 7,
  },
  {
    slug: "5y-multi",
    name: "5-Year Multiple Entry Visa",
    entry_type: "multiple" as const,
    duration_days: 1825,
    standard_price_aed: 2799,
    has_express: false,
    is_active: true,
    sort_order: 8,
  },
];

async function seed() {
  console.log("Seeding visa types…");
  for (const visa of VISA_SEED) {
    await db
      .insert(visaTypes)
      .values(visa)
      .onConflictDoUpdate({
        target: visaTypes.slug,
        set: {
          name: sql`excluded.name`,
          standard_price_aed: sql`excluded.standard_price_aed`,
          has_express: sql`excluded.has_express`,
          is_active: sql`excluded.is_active`,
          sort_order: sql`excluded.sort_order`,
          updated_at: sql`now()`,
        },
      });
    console.log(`  ✓ ${visa.slug}`);
  }
  console.log("Done.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
