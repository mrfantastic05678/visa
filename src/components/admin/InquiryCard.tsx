"use client";

import type { Inquiry } from "@/types/db";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Mail, Phone } from "lucide-react";

export function InquiryCard({ inquiry }: { inquiry: Inquiry }) {
  const router = useRouter();
  const [resolved, setResolved] = useState(inquiry.resolved);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const next = !resolved;
    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: inquiry.id, resolved: next }),
      });
      if (res.ok) {
        setResolved(next);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-line p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
        <div className="min-w-0">
          <h3 className="font-sans font-semibold text-ink truncate">{inquiry.subject}</h3>
          <p className="text-sm text-muted font-sans truncate">{inquiry.name}</p>
        </div>
        <button
          onClick={toggle}
          disabled={loading}
          className={
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-medium whitespace-nowrap transition-colors flex-shrink-0 " +
            (resolved
              ? "bg-success/10 text-success border border-success/20"
              : "bg-mist-2 text-muted border border-line hover:text-ink")
          }
        >
          <Check className="h-3.5 w-3.5" />
          {resolved ? "Resolved" : "Mark resolved"}
        </button>
      </div>

      <p className="text-sm text-ink font-sans leading-relaxed mb-4 break-words">
        {inquiry.message}
      </p>

      <div className="flex items-center gap-4 flex-wrap text-xs font-sans text-muted">
        <a
          href={`mailto:${inquiry.email}`}
          className="inline-flex items-center gap-1.5 hover:text-blue break-all"
        >
          <Mail className="h-3.5 w-3.5 flex-shrink-0" />
          {inquiry.email}
        </a>
        {inquiry.phone && (
          <a
            href={`tel:${inquiry.phone}`}
            className="inline-flex items-center gap-1.5 hover:text-blue"
          >
            <Phone className="h-3.5 w-3.5 flex-shrink-0" />
            {inquiry.phone}
          </a>
        )}
        <span className="ml-auto">
          {new Date(inquiry.created_at).toLocaleDateString("en-AE", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}
