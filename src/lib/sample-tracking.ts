import type { TrackResponse } from "@/types/api";

/**
 * Sample tracked applications for the public Track page (UI-first phase, no DB).
 * Keyed by Application ID. Replaced by live Neon lookups once connected.
 */
export const SAMPLE_TRACKING: Record<string, TrackResponse> = {
  "VIS-2026-4F8A2K": {
    application_id: "VIS-2026-4F8A2K",
    status: "processing",
    visa_type_name: "Tourist Visa · 60 days",
    applicant_name: "James Whitfield",
    travel_date: "2026-03-12",
    processing_tier: "standard",
    created_at: "2026-02-21T14:22:00.000Z",
    updated_at: "2026-02-23T11:48:00.000Z",
    status_history: [
      { id: 1, application_id: "VIS-2026-4F8A2K", status: "submitted", note: "Application received and payment confirmed.", changed_by_admin_id: null, created_at: "2026-02-21T14:22:00.000Z" },
      { id: 2, application_id: "VIS-2026-4F8A2K", status: "reviewing", note: "Documents under review by our team.", changed_by_admin_id: null, created_at: "2026-02-22T09:10:00.000Z" },
      { id: 3, application_id: "VIS-2026-4F8A2K", status: "processing", note: "Submitted to UAE immigration. Awaiting decision.", changed_by_admin_id: null, created_at: "2026-02-23T11:48:00.000Z" },
    ],
  },
  "VIS-2026-7B2T5L": {
    application_id: "VIS-2026-7B2T5L",
    status: "approved",
    visa_type_name: "Tourist Visa · 30 days",
    applicant_name: "Sophie Laurent",
    travel_date: "2026-03-20",
    processing_tier: "express",
    created_at: "2026-02-20T09:40:00.000Z",
    updated_at: "2026-02-22T16:30:00.000Z",
    status_history: [
      { id: 1, application_id: "VIS-2026-7B2T5L", status: "submitted", note: "Application received.", changed_by_admin_id: null, created_at: "2026-02-20T09:40:00.000Z" },
      { id: 2, application_id: "VIS-2026-7B2T5L", status: "reviewing", note: "Documents verified.", changed_by_admin_id: null, created_at: "2026-02-20T15:00:00.000Z" },
      { id: 3, application_id: "VIS-2026-7B2T5L", status: "processing", note: "Submitted to immigration.", changed_by_admin_id: null, created_at: "2026-02-21T10:00:00.000Z" },
      { id: 4, application_id: "VIS-2026-7B2T5L", status: "approved", note: "Visa approved! Sent to your email.", changed_by_admin_id: null, created_at: "2026-02-22T16:30:00.000Z" },
    ],
  },
};
