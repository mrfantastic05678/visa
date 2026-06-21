import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "placeholder",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2026-06-21",
  useCdn: true,
  token: process.env.SANITY_API_TOKEN,
});

/* ── GROQ Queries ─────────────────────────────────────── */

export async function getFaqs() {
  return sanityClient.fetch<
    {
      _id: string;
      question: string;
      answer: string;
      category: string;
      sort_order: number;
    }[]
  >(
    `*[_type == "faqItem" && !(_id in path("drafts.**"))] | order(sort_order asc) {
      _id, question, answer, category, sort_order
    }`,
    {},
    { next: { revalidate: 60 } }
  );
}

export async function getVisaTypeContent() {
  return sanityClient.fetch<
    {
      slug: string;
      name: string;
      description: string;
      features: string[];
      badge_text: string | null;
    }[]
  >(
    `*[_type == "visaTypeContent" && !(_id in path("drafts.**"))] {
      slug, name, description, features, badge_text
    }`,
    {},
    { next: { revalidate: 60 } }
  );
}

export async function getHomepageCopy() {
  return sanityClient.fetch<{
    hero_headline: string;
    hero_subtext: string;
    trust_stats: { label: string; value: string }[];
    process_steps: { title: string; description: string }[];
    testimonials: {
      name: string;
      country: string;
      rating: number;
      text: string;
    }[];
  }>(
    `*[_type == "homepageCopy"][0] {
      hero_headline, hero_subtext, trust_stats, process_steps, testimonials
    }`,
    {},
    { next: { revalidate: 60 } }
  );
}

export async function getContactDetails() {
  return sanityClient.fetch<{
    whatsapp_number: string;
    email: string;
    phone: string;
    address: string;
    hours: string;
  }>(
    `*[_type == "contactDetails"][0] {
      whatsapp_number, email, phone, address, hours
    }`,
    {},
    { next: { revalidate: 3600 } }
  );
}
