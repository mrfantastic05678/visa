"use client";

import type { ApplicationStatus } from "@/types/db";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Dropdown } from "@/components/ui/Dropdown";
import { textareaClasses } from "@/components/ui/FormInput";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: "submitted", label: "Submitted" },
  { value: "reviewing", label: "Under Review" },
  { value: "processing", label: "Processing" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export function StatusUpdateForm({
  applicationId,
  currentStatus,
}: {
  applicationId: string;
  currentStatus: ApplicationStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<ApplicationStatus>(currentStatus);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setDone(false);
    try {
      const res = await fetch(`/api/admin/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, note: note.trim() || undefined }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Update failed.");
      } else {
        setNote("");
        setDone(true);
        router.refresh();
      }
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Dropdown
        label="Update Status"
        options={STATUS_OPTIONS}
        value={status}
        onChange={(v) => setStatus(v as ApplicationStatus)}
      />

      <div className="space-y-1">
        <label className="block text-xs font-semibold text-ink uppercase tracking-widest font-sans">
          Note (optional — sent to applicant)
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="e.g. Documents verified, submitted to immigration."
          className={textareaClasses}
        />
      </div>

      {error && <p className="text-sm text-danger font-sans">{error}</p>}
      {done && (
        <p className="text-sm text-success font-sans">Status updated successfully.</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 rounded-xl bg-blue text-white font-semibold font-sans text-sm flex items-center justify-center gap-2 hover:bg-blue-hover transition-colors disabled:opacity-60"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Save Update
      </button>
    </form>
  );
}
