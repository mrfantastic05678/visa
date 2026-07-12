/**
 * One-off migration of the previously-hardcoded homepage testimonials into
 * Sanity as real, individually-editable documents.
 * Run: npx tsx src/lib/sanity/seed-testimonials.ts
 */
import { createClient } from "@sanity/client";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "8vk4vtq0",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2026-06-27",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const TESTIMONIALS = [
  { slug: "priya-sharma", name: "Priya Sharma", country: "IN", rating: 5, text: "Got my 60-day visa in 26 hours. The WhatsApp updates kept me sane — I knew exactly where my application was at every step.", sort_order: 1 },
  { slug: "james-whitfield", name: "James Whitfield", country: "GB", rating: 5, text: "Booked a business trip on Monday, had my visa on Wednesday. Visati is a different league from the agencies I used before.", sort_order: 2 },
  { slug: "sophie-laurent", name: "Sophie Laurent", country: "FR", rating: 5, text: "A consultant called me before I even noticed my photo was the wrong size. That kind of attention is rare these days.", sort_order: 3 },
  { slug: "david-chen", name: "David Chen", country: "US", rating: 5, text: "The whole process took less time than booking my flight. Incredibly smooth experience from start to finish.", sort_order: 4 },
  { slug: "fatima-al-marzouqi", name: "Fatima Al Marzouqi", country: "AE", rating: 5, text: "I've used Visati three times now for family visitors. Every single time has been flawless. They just get it right.", sort_order: 5 },
];

async function seed() {
  console.log("Seeding testimonials...\n");
  for (const t of TESTIMONIALS) {
    await client.createOrReplace({
      _id: `testimonial-${t.slug}`,
      _type: "testimonial",
      name: t.name,
      country: t.country,
      rating: t.rating,
      text: t.text,
      sort_order: t.sort_order,
    });
    console.log(`✓ ${t.name}`);
  }
  console.log("\nDone.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
