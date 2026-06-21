import { CountriesServed } from "@/components/home/CountriesServed";
import { GlobalReach } from "@/components/home/GlobalReach";
import { Hero } from "@/components/home/Hero";
import { HomeFAQ } from "@/components/home/HomeFAQ";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { QuickApplyWidget } from "@/components/home/QuickApplyWidget";
import { Testimonials } from "@/components/home/Testimonials";
import { VisaShowcase } from "@/components/home/VisaShowcase";
import { WhyChoose } from "@/components/home/WhyChoose";
import { SAMPLE_VISA_TYPES } from "@/lib/sample-visas";
import type { VisaTypesResponse } from "@/types/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visati — Dubai Visas. Simplified.",
  description:
    "Apply for UAE tourist, transit, and long-stay visas online. Fast processing, 98% approval rate, trusted by 15,000+ travellers.",
};

async function getVisaTypes() {
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

export default async function HomePage() {
  const visaTypes = await getVisaTypes();

  return (
    <>
      {/* 1 — Hero with Quick Apply + stats bar */}
      <Hero>
        <QuickApplyWidget visaTypes={visaTypes} />
      </Hero>

      {/* 2 — Visa types: "Pick the visa that fits your trip." */}
      {visaTypes.length > 0 && <VisaShowcase visaTypes={visaTypes} />}

      {/* 3 — Global reach + stats */}
      <GlobalReach />

      {/* 4 — Process: "Four steps. Zero hassle." */}
      <ProcessSteps />

      {/* 5 — Countries: "184 nationalities served." */}
      <CountriesServed />

      {/* 6 — Why Choose: "The VISATI Difference." */}
      <WhyChoose />

      {/* 7 — Testimonials: "Loved by travellers." */}
      <Testimonials />

      {/* 8 — FAQ: "Questions, answered." */}
      <HomeFAQ />
    </>
  );
}
