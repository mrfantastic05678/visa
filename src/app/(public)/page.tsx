import { CountriesServed } from "@/components/home/CountriesServed";
import { GlobalReach } from "@/components/home/GlobalReach";
import { Hero } from "@/components/home/Hero";
import { HomeFAQ } from "@/components/home/HomeFAQ";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { QuickApplyWidget } from "@/components/home/QuickApplyWidget";
import { Testimonials } from "@/components/home/Testimonials";
import { VisaShowcase } from "@/components/home/VisaShowcase";
import { WhyChoose } from "@/components/home/WhyChoose";
import { getDisplayVisaTypes } from "@/lib/visa-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visati — Dubai Visas. Simplified.",
  description:
    "Apply for UAE tourist, transit, and long-stay visas online. Fast processing, 98% approval rate, trusted by 15,000+ travellers.",
};

export default async function HomePage() {
  const visaTypes = await getDisplayVisaTypes();

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
