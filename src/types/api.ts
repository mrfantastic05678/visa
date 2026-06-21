import type {
  Application,
  ApplicationStatus,
  Inquiry,
  ProcessingTier,
  StatusHistory,
  VisaType,
} from "./db";

/* ── Generic ─────────────────────────────────────────── */
export interface ApiError {
  error: string;
  code?: string;
}

/* ── Visa Types ──────────────────────────────────────── */
export interface VisaTypesResponse {
  visa_types: VisaType[];
}

/* ── Application ─────────────────────────────────────── */
export interface CreateApplicationRequest {
  visa_type_id: number;
  nationality: string;
  given_name: string;
  surname: string;
  passport_number: string;
  date_of_birth: string;
  passport_expiry: string;
  travel_date: string;
  processing_tier: ProcessingTier;
}

export interface CreateApplicationResponse {
  application_id: string;
  checkout_url: string;
}

export interface ApplicationDetailResponse extends Application {
  visa_type: VisaType;
  status_history: StatusHistory[];
  documents: {
    id: number;
    document_type: string;
    filename: string;
    size_bytes: number;
    signed_url: string;
    uploaded_at: string;
  }[];
}

/* ── Tracking ────────────────────────────────────────── */
export interface TrackResponse {
  application_id: string;
  status: ApplicationStatus;
  visa_type_name: string;
  applicant_name: string;
  travel_date: string;
  processing_tier: ProcessingTier;
  created_at: string;
  updated_at: string;
  status_history: StatusHistory[];
}

/* ── Admin: Status Update ────────────────────────────── */
export interface UpdateStatusRequest {
  status: ApplicationStatus;
  note?: string;
}

export interface UpdateStatusResponse {
  application_id: string;
  status: ApplicationStatus;
  updated_at: string;
}

/* ── Inquiry ─────────────────────────────────────────── */
export interface CreateInquiryRequest {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface CreateInquiryResponse {
  id: number;
}

export interface InquiriesListResponse {
  inquiries: Inquiry[];
  total: number;
}
