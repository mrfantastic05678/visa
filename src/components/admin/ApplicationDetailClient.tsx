"use client";

import { cn } from "@/lib/utils";
import { type AdminApplication, type AdminAppStatus, STATUS_LABEL } from "@/lib/admin-sample-data";
import { CONTACT } from "@/lib/constants";
import { Check, ChevronDown, Download, FileText, Mail, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { DocBadge } from "./ui";
import { InternalNotes } from "./InternalNotes";
import { useState, useRef, useEffect } from "react";

const STATUS_ORDER: AdminAppStatus[] = ["submitted", "reviewing", "processing", "approved", "rejected"];

const TIMELINE = [
  { key: "submitted", label: "Submitted", date: "21 Feb · 14:22" },
  { key: "reviewing", label: "Under Review", date: "22 Feb · 09:10" },
  { key: "processing", label: "Processing", date: "23 Feb · 11:48" },
  { key: "decision", label: "Decision", date: "Expected 25 Feb" },
] as const;

const UPDATABLE_STATUSES: AdminAppStatus[] = ["reviewing", "processing", "approved", "rejected"];

export function ApplicationDetailClient({ app }: { app: AdminApplication }) {
  const [status, setStatus] = useState<AdminAppStatus>(app.status);
  const [dropOpen, setDropOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const currentIdx = Math.min(STATUS_ORDER.indexOf(status), 3);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  async function updateStatus(s: AdminAppStatus) {
    setStatus(s);
    setDropOpen(false);
    showToast(`Status updated to ${STATUS_LABEL[s]}`);
    // Persist to DB when connected — silently ignored if DATABASE_URL is not set
    fetch(`/api/admin/applications/${app.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: s }),
    }).catch(() => null);
  }

  function approve() {
    updateStatus("approved");
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  const fields = [
    { label: "Full Name", value: app.applicant },
    { label: "Date of Birth", value: app.dob },
    { label: "Nationality", value: app.nationality },
    { label: "Passport No.", value: app.passportNo },
    { label: "Passport Expiry", value: app.passportExpiry },
    { label: "Travel Date", value: app.travelDate },
    { label: "Email", value: app.email },
    { label: "Phone", value: app.phone },
    { label: "Visa Type", value: app.visaType },
  ];

  const waUrl = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(`Hello ${app.applicant.split(" ")[0]}, your Visati application (${app.id}) status: ${STATUS_LABEL[status]}. Contact us for assistance.`)}`;
  const mailUrl = `mailto:${app.email}?subject=Your Visati Application ${app.id}&body=Hello ${app.applicant.split(" ")[0]}, your visa application status is: ${STATUS_LABEL[status]}.`;

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-navy text-white text-sm font-sans font-medium px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <Check className="h-4 w-4 text-success" /> {toast}
        </div>
      )}

      <div className="px-4 lg:px-8 pb-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status timeline */}
          <div className="bg-white rounded-xl border border-line p-5 lg:p-6">
            <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
              <h2 className="font-display font-bold text-navy">Application Status</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted font-sans hidden sm:inline">Update Status</span>
                <div ref={dropRef} className="relative">
                  <button
                    onClick={() => setDropOpen((o) => !o)}
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-gold/10 text-gold text-xs font-semibold font-sans hover:bg-gold/20 transition-colors"
                  >
                    {STATUS_LABEL[status]} <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  {dropOpen && (
                    <div className="absolute right-0 top-full mt-1 z-20 min-w-[160px] bg-white rounded-xl border border-line shadow-lg py-1">
                      {UPDATABLE_STATUSES.map((s) => (
                        <button
                          key={s}
                          onClick={() => updateStatus(s)}
                          className={cn(
                            "w-full text-left px-4 py-2 text-sm font-sans hover:bg-mist transition-colors",
                            s === status ? "text-gold font-semibold" : "text-ink"
                          )}
                        >
                          {STATUS_LABEL[s]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop horizontal timeline */}
            <div className="hidden sm:flex items-start justify-between relative">
              <div className="absolute top-5 left-[12%] right-[12%] h-0.5 bg-line" />
              {TIMELINE.map((step, i) => {
                const done = i < currentIdx;
                const active = i === currentIdx;
                return (
                  <div key={step.key} className="relative z-10 flex flex-col items-center text-center w-1/4">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-full grid place-items-center font-sans font-bold text-sm",
                        done && "bg-navy text-white",
                        active && "bg-gold text-navy ring-4 ring-gold/15",
                        !done && !active && "bg-mist-2 text-muted"
                      )}
                    >
                      {done ? <Check className="h-5 w-5" /> : i + 1}
                    </div>
                    <p className={cn("mt-2 text-sm font-sans font-semibold", active || done ? "text-navy" : "text-muted")}>
                      {step.label}
                    </p>
                    <p className="text-xs text-muted font-sans mt-0.5">{step.date}</p>
                  </div>
                );
              })}
            </div>

            {/* Mobile vertical timeline */}
            <div className="sm:hidden space-y-0">
              {TIMELINE.map((step, i) => {
                const done = i < currentIdx;
                const active = i === currentIdx;
                return (
                  <div key={step.key} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "h-8 w-8 rounded-full grid place-items-center font-sans font-bold text-xs flex-shrink-0",
                        done && "bg-navy text-white",
                        active && "bg-gold text-navy",
                        !done && !active && "bg-mist-2 text-muted"
                      )}>
                        {done ? <Check className="h-4 w-4" /> : i + 1}
                      </div>
                      {i < TIMELINE.length - 1 && <div className={cn("w-0.5 flex-1 min-h-[28px]", done ? "bg-navy" : "bg-line")} />}
                    </div>
                    <div className="pb-5">
                      <p className={cn("text-sm font-sans font-semibold", active || done ? "text-navy" : "text-muted")}>{step.label}</p>
                      <p className="text-xs text-muted font-sans mt-0.5">{step.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Personal info */}
          <div className="bg-white rounded-xl border border-line p-5 lg:p-6">
            <h2 className="font-display font-bold text-navy mb-5">Personal Information</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5">
              {fields.map((f) => (
                <div key={f.label} className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted font-sans">{f.label}</p>
                  <p className="text-sm font-sans text-ink mt-1 break-words">{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-xl border border-line p-5 lg:p-6">
            <h2 className="font-display font-bold text-navy mb-4">Documents</h2>
            {app.documents.length === 0 ? (
              <p className="text-sm text-muted font-sans">No documents uploaded.</p>
            ) : (
              <ul className="space-y-3">
                {app.documents.map((d) => (
                  <li key={d.id} className="flex items-center gap-3 p-3 rounded-lg border border-line">
                    <span className="h-9 w-9 rounded-lg bg-mist grid place-items-center flex-shrink-0">
                      <FileText className="h-4 w-4 text-muted" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-sans font-medium text-ink truncate">{d.label}</p>
                      <p className="text-xs text-muted font-sans">{d.filename.split(".").pop()?.toUpperCase()} · {d.size}</p>
                    </div>
                    <DocBadge status={d.status} />
                    <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
                      <button className="text-xs font-sans font-medium text-gold hover:underline px-2">View</button>
                      <button className="inline-flex items-center gap-1 text-xs font-sans font-medium text-muted hover:text-ink px-2">
                        <Download className="h-3.5 w-3.5" /> Download
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right rail */}
        <div className="space-y-6">
          {/* Approve / Reject actions */}
          {status !== "approved" && status !== "rejected" && (
            <div className="bg-white rounded-xl border border-line p-5">
              <h3 className="font-display font-bold text-navy mb-4">Decision</h3>
              <div className="space-y-2">
                <button
                  onClick={approve}
                  className="w-full inline-flex items-center justify-center gap-2 h-11 px-4 rounded-lg bg-gradient-to-r from-gold to-[#F0C864] text-navy text-sm font-semibold font-sans hover:opacity-90 transition-opacity"
                >
                  <Check className="h-4 w-4" /> Approve Application
                </button>
                <button
                  onClick={() => updateStatus("rejected")}
                  className="w-full inline-flex items-center justify-center gap-2 h-11 px-4 rounded-lg border border-danger/30 bg-danger/5 text-danger text-sm font-semibold font-sans hover:bg-danger/10 transition-colors"
                >
                  Reject Application
                </button>
              </div>
            </div>
          )}

          {status === "approved" && (
            <div className="bg-success/5 border border-success/20 rounded-xl p-5 text-center">
              <div className="h-10 w-10 rounded-full bg-success grid place-items-center mx-auto mb-2">
                <Check className="h-5 w-5 text-white" />
              </div>
              <p className="font-display font-bold text-navy">Approved</p>
              <p className="text-xs text-muted font-sans mt-1">This application has been approved</p>
            </div>
          )}

          {status === "rejected" && (
            <div className="bg-danger/5 border border-danger/20 rounded-xl p-5 text-center">
              <p className="font-display font-bold text-navy">Rejected</p>
              <p className="text-xs text-muted font-sans mt-1">This application has been rejected</p>
            </div>
          )}

          <div className="bg-white rounded-xl border border-line p-5">
            <h3 className="font-display font-bold text-navy mb-4">Internal Notes</h3>
            <InternalNotes initial={app.notes} />
          </div>

          <div className="bg-white rounded-xl border border-line p-5">
            <h3 className="font-display font-bold text-navy mb-4">Client Communication</h3>
            <div className="space-y-2">
              <a href={waUrl} target="_blank" rel="noopener noreferrer" className="block">
                <button className="w-full inline-flex items-center gap-2.5 h-11 px-4 rounded-lg bg-success text-white text-sm font-semibold font-sans hover:opacity-90 transition-opacity">
                  <FaWhatsapp className="h-[18px] w-[18px]" /> WhatsApp {app.applicant.split(" ")[0]}
                </button>
              </a>
              <a href={mailUrl} className="block">
                <button className="w-full inline-flex items-center gap-2.5 h-11 px-4 rounded-lg border border-line text-sm font-semibold font-sans text-ink hover:bg-mist transition-colors">
                  <Mail className="h-4 w-4 text-muted" /> Send Email
                </button>
              </a>
              <button className="w-full inline-flex items-center gap-2.5 h-11 px-4 rounded-lg border border-line text-sm font-semibold font-sans text-ink hover:bg-mist transition-colors">
                <Phone className="h-4 w-4 text-muted" /> Call Back
              </button>
            </div>
            <p className="text-xs text-muted font-sans mt-4 mb-2">Send status update</p>
            <div className="flex flex-wrap gap-2">
              {["Docs received", "Under review", "Approved", "Action needed"].map((c) => (
                <button key={c} className="px-3 py-1.5 rounded-lg bg-mist text-xs font-sans font-medium text-ink hover:bg-mist-2 transition-colors">
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
