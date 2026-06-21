import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ApplicationForm } from "@/components/apply/ApplicationForm";
import { Step5Success } from "@/components/apply/steps/Step5Success";
import { SAMPLE_VISA_TYPES } from "@/lib/sample-visas";
import type { VisaTypesResponse } from "@/types/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply for UAE Visa",
  description:
    "Complete your UAE visa application online in minutes. Secure, fast, and trusted.",
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

interface ApplyPageProps {
  searchParams: Promise<{
    visa?: string;
    nationality?: string;
    date?: string;
    success?: string;
    id?: string;
  }>;
}

export default async function ApplyPage({ searchParams }: ApplyPageProps) {
  const params = await searchParams;

  if (params.success === "1" && params.id) {
    return (
      <div className="min-h-screen bg-mist py-12 px-4">
        <div className="mx-auto max-w-2xl">
          <Step5Success applicationId={params.id} />
        </div>
      </div>
    );
  }

  const visaTypes = await getVisaTypes();
  const prefilledVisa = visaTypes.find((v) => v.slug === params.visa) ?? null;

  return (
    <div className="min-h-screen bg-mist">
      {/* Header */}
      <section className="py-10 px-4">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted font-sans hover:text-ink transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <h1 className="font-display font-bold text-3xl lg:text-4xl text-ink mb-2">
            Apply for your UAE visa.
          </h1>
          <p className="text-muted font-sans text-sm">
            Four short steps &middot; Roughly 4 minutes &middot; Auto-saved as you go
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="pb-16 px-4">
        <div className="mx-auto max-w-6xl">
          <ApplicationForm
            visaTypes={visaTypes}
            prefilledVisaTypeId={prefilledVisa?.id ?? null}
            prefilledNationality={params.nationality}
            prefilledTravelDate={params.date}
          />
        </div>
      </section>
    </div>
  );
}
