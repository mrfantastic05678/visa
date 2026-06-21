import { db } from "@/lib/db";
import { applications, documents, statusHistory, visaTypes } from "@/lib/db/schema";
import { getDocumentSignedUrl } from "@/lib/r2";
import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { StatusUpdateForm } from "@/components/admin/StatusUpdateForm";
import { formatAed, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-muted uppercase tracking-widest font-sans">{label}</p>
      <p className="text-sm text-ink font-sans font-medium mt-0.5 break-words">{value}</p>
    </div>
  );
}

export default async function AdminApplicationDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [row] = await db
    .select()
    .from(applications)
    .innerJoin(visaTypes, eq(applications.visa_type_id, visaTypes.id))
    .where(eq(applications.id, id))
    .limit(1);

  if (!row) notFound();

  const app = row.applications;
  const visa = row.visa_types;

  const [history, docs] = await Promise.all([
    db
      .select()
      .from(statusHistory)
      .where(eq(statusHistory.application_id, id))
      .orderBy(asc(statusHistory.created_at)),
    db.select().from(documents).where(eq(documents.application_id, id)),
  ]);

  const docsWithUrls = await Promise.all(
    docs.map(async (d) => ({
      ...d,
      signed_url: await getDocumentSignedUrl(d.r2_key),
    }))
  );

  return (
    <div className="p-8 max-w-5xl">
      <Link
        href="/admin/applications"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink font-sans mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to applications
      </Link>

      <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
        <div className="min-w-0">
          <p className="font-mono text-sm text-muted">{app.id}</p>
          <h1 className="font-display font-bold text-2xl text-navy">
            {app.given_name} {app.surname}
          </h1>
        </div>
        <StatusBadge status={app.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Applicant */}
          <div className="bg-white rounded-xl border border-line p-6 shadow-sm">
            <h2 className="font-display font-semibold text-navy mb-4">Applicant Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Email" value={app.applicant_email ?? "—"} />
              <Field label="Nationality" value={app.nationality} />
              <Field label="Passport No." value={app.passport_number} />
              <Field label="Date of Birth" value={app.date_of_birth} />
              <Field label="Passport Expiry" value={app.passport_expiry} />
              <Field label="Travel Date" value={app.travel_date} />
            </div>
          </div>

          {/* Visa + payment */}
          <div className="bg-white rounded-xl border border-line p-6 shadow-sm">
            <h2 className="font-display font-semibold text-navy mb-4">Visa & Payment</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Visa Type" value={visa.name} />
              <Field label="Processing" value={app.processing_tier === "express" ? "Express" : "Standard"} />
              <Field label="Amount Paid" value={app.amount_paid_aed ? formatAed(app.amount_paid_aed) : "—"} />
              <Field label="Submitted" value={formatDate(app.created_at.toISOString())} />
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-xl border border-line p-6 shadow-sm">
            <h2 className="font-display font-semibold text-navy mb-4">Documents</h2>
            {docsWithUrls.length === 0 ? (
              <p className="text-sm text-muted font-sans">No documents uploaded.</p>
            ) : (
              <ul className="space-y-2">
                {docsWithUrls.map((d) => (
                  <li
                    key={d.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-line"
                  >
                    <FileText className="h-5 w-5 text-blue flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-ink font-sans font-medium truncate">
                        {d.filename}
                      </p>
                      <p className="text-xs text-muted font-sans capitalize">
                        {d.document_type.replace(/_/g, " ")} · {(d.size_bytes / 1024).toFixed(0)} KB
                      </p>
                    </div>
                    <a
                      href={d.signed_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-blue font-sans font-medium hover:underline flex-shrink-0"
                    >
                      <Download className="h-4 w-4" />
                      View
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* History */}
          <div className="bg-white rounded-xl border border-line p-6 shadow-sm">
            <h2 className="font-display font-semibold text-navy mb-4">Status History</h2>
            <ul className="space-y-4">
              {history.map((h) => (
                <li key={h.id} className="flex gap-3">
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-blue flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <StatusBadge status={h.status} />
                      <span className="text-xs text-muted font-sans">
                        {formatDate(h.created_at.toISOString())}
                      </span>
                    </div>
                    {h.note && (
                      <p className="text-sm text-ink font-sans mt-1.5">{h.note}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: status update */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-line p-6 shadow-sm sticky top-8">
            <StatusUpdateForm applicationId={app.id} currentStatus={app.status} />
          </div>
        </div>
      </div>
    </div>
  );
}
