"use client";

import { Button } from "@/components/ui/Button";
import { StatusTimeline } from "@/components/ui/StatusTimeline";
import type { TrackResponse } from "@/types/api";
import { APP_ID_REGEX } from "@/lib/utils";
import { FadeIn } from "@/components/ui/FadeIn";
import { WHATSAPP_URL } from "@/lib/constants";
import { inputClasses } from "@/components/ui/FormInput";
import { cn } from "@/lib/utils";
import { Search, Download, Phone } from "lucide-react";
import { useState } from "react";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString("en-AE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusColor(status: string) {
  switch (status) {
    case "approved": return "bg-success";
    case "rejected": return "bg-danger";
    case "processing": return "bg-blue";
    default: return "bg-muted";
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "submitted": return "Submitted";
    case "under_review": return "Under Review";
    case "processing": return "Processing";
    case "approved": return "Approved";
    case "rejected": return "Rejected";
    default: return status;
  }
}

export default function TrackPage() {
  const [inputId, setInputId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const id = inputId.trim().toUpperCase();
    if (!APP_ID_REGEX.test(id)) {
      setError("Please enter a valid Application ID (e.g. VIS-2026-AB1234).");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/track?id=${encodeURIComponent(id)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
      } else {
        setResult(data as TrackResponse);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-mist">
      {/* Header */}
      <section className="pt-28 pb-16 px-4">
        <div className="mx-auto max-w-2xl text-center">
          <FadeIn direction="up" delay={0}>
            <p className="text-blue text-xs font-sans font-semibold uppercase tracking-widest mb-3">
              Track
            </p>
          </FadeIn>
          <FadeIn direction="up" delay={100}>
            <h1 className="font-display font-bold text-4xl lg:text-5xl text-ink mb-3">
              Where&apos;s your visa?
            </h1>
          </FadeIn>
          <FadeIn direction="up" delay={200}>
            <p className="text-muted font-sans text-sm">
              Enter your Application ID to see real-time status, team notes, and expected decision date.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Search */}
      <section className="pb-12 px-4">
        <div className="mx-auto max-w-3xl">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-line p-4 shadow-sm flex items-center gap-3 max-w-2xl mx-auto"
          >
            <Search className="h-5 w-5 text-muted flex-shrink-0 ml-2" />
            <input
              type="text"
              value={inputId}
              onChange={(e) => {
                setInputId(e.target.value);
                setError(null);
              }}
              placeholder="VIS-2026-XXXXXX"
              className={cn(inputClasses, "flex-1 min-w-0 font-mono border-0 bg-transparent focus:ring-0 h-12")}
              autoComplete="off"
              spellCheck={false}
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              className="whitespace-nowrap flex-shrink-0"
            >
              Track &rarr;
            </Button>
          </form>

          {error && (
            <p className="mt-3 text-sm text-danger font-sans text-center max-w-2xl mx-auto">{error}</p>
          )}

          <p className="text-center text-xs text-muted font-sans mt-3 max-w-2xl mx-auto">
            Can&apos;t find your ID? Check your email or{" "}
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-blue hover:underline">
              WhatsApp us
            </a>
          </p>

          {/* Result */}
          {result && (
            <div className="mt-8 space-y-6">
              {/* Application card */}
              <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
                {/* Header row */}
                <div className="flex items-start justify-between gap-4 flex-wrap mb-1">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-mono text-sm text-muted">{result.application_id}</p>
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-sans font-medium text-white",
                        getStatusColor(result.status)
                      )}>
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        {getStatusLabel(result.status)}
                      </span>
                    </div>
                    <h2 className="font-display font-bold text-2xl text-ink mb-1">
                      {result.applicant_name}
                    </h2>
                    <p className="text-sm text-muted font-sans">
                      {result.visa_type_name} &middot; Submitted {formatDate(result.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-sans font-semibold uppercase tracking-wider text-muted mb-1">
                      Expected by
                    </p>
                    <p className="font-display font-bold text-xl text-ink">
                      {result.travel_date ? formatDate(result.travel_date) : "TBD"}
                    </p>
                    {result.status !== "rejected" && (
                      <p className="text-xs font-sans text-success font-medium mt-1 flex items-center justify-end gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-success" />
                        On track
                      </p>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-line my-5" />

                {/* Status timeline */}
                <StatusTimeline
                  history={result.status_history}
                  currentStatus={result.status}
                />

                {/* Divider */}
                <div className="border-t border-line my-5" />

                {/* Team note */}
                {result.status_history && result.status_history.length > 0 && (
                  <div className="flex items-start gap-3 mb-5">
                    <div className="h-8 w-8 rounded-full bg-blue/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-sans font-bold text-blue">A</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-sans font-semibold text-ink">Aisha</span>
                        <span className="text-xs font-sans text-muted">Visa Consultant</span>
                        <span className="text-xs font-sans text-muted">&middot;</span>
                        <span className="text-xs font-sans text-muted">
                          {result.status_history[result.status_history.length - 1]?.created_at
                            ? formatDateTime(result.status_history[result.status_history.length - 1].created_at)
                            : ""}
                        </span>
                      </div>
                      <p className="text-sm font-sans text-ink leading-relaxed">
                        Your application has cleared internal review and is now with the GDRFA. We expect a decision within 48 hours. We&apos;ll WhatsApp you the moment it lands.
                      </p>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between gap-4 flex-wrap pt-4 border-t border-line">
                  <p className="text-xs text-muted font-sans">
                    Last updated: {result.updated_at ? formatDateTime(result.updated_at) : "N/A"}
                  </p>
                  <div className="flex items-center gap-3">
                    <Button variant="secondary" size="sm">
                      <Download className="h-4 w-4 mr-1.5" />
                      Download Receipt
                    </Button>
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="whatsapp" size="sm">
                        <Phone className="h-4 w-4 mr-1.5" />
                        WhatsApp Team
                      </Button>
                    </a>
                  </div>
                </div>
              </div>

              {/* Status legend */}
              <div className="flex items-center justify-center gap-6 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-success" />
                  <span className="text-xs font-sans text-muted">On track</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-blue" />
                  <span className="text-xs font-sans text-muted">Processing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-success" />
                  <span className="text-xs font-sans text-muted">Approved</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-danger" />
                  <span className="text-xs font-sans text-muted">Rejected</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
