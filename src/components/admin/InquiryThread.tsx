"use client";

import { InquiryBadge } from "./ui";
import { CheckCircle, Loader2, Mail, Send } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useState } from "react";

interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  resolved: boolean;
  created_at: string;
}

const QUICK_REPLIES = ["Visa info sent", "Docs required", "Price quoted", "Follow-up scheduled"];

// Keyword → visa suggestion mapping (derives from the real inquiry text, no backend needed)
const VISA_KEYWORDS: { keywords: string[]; visa: { name: string; price: string } }[] = [
  {
    keywords: ["business", "journalist", "journalism", "conference", "corporate", "work", "professional", "media"],
    visa: { name: "Business Visa · 14 days", price: "AED 749 · 24h express processing" },
  },
  {
    keywords: ["transit", "layover", "stopover", "connecting"],
    visa: { name: "Transit Visa · 96 hours", price: "AED 199 · issued in 2h" },
  },
  {
    keywords: ["multi-entry", "multi entry", "monthly", "frequent"],
    visa: { name: "Multi-Entry Visa · 90 days", price: "AED 1,299 · standard processing" },
  },
  {
    keywords: ["family", "parents", "spouse", "children", "relative"],
    visa: { name: "Tourist Visa · 60 days", price: "AED 549 · ideal for long stays" },
  },
  {
    keywords: ["tourist", "tourism", "holiday", "vacation", "visit", "sightseeing"],
    visa: { name: "Tourist Visa · 30 days", price: "AED 349 · standard processing" },
  },
];

function autoSuggestVisa(subject: string, message: string): { name: string; price: string } | null {
  const text = `${subject} ${message}`.toLowerCase();
  for (const { keywords, visa } of VISA_KEYWORDS) {
    if (keywords.some((kw) => text.includes(kw))) return visa;
  }
  return null;
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

export function InquiryThread({ inquiry }: { inquiry: Inquiry }) {
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(inquiry.resolved);
  const [error, setError] = useState<string | null>(null);

  const suggestedVisa = autoSuggestVisa(inquiry.subject, inquiry.message);

  async function send(text?: string) {
    const body = (text ?? reply).trim();
    if (!body) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/inquiries/${inquiry.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: body }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not send reply.");
        return;
      }
      setSent(true);
      setReply("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  }

  const waUrl = inquiry.phone
    ? `https://wa.me/${inquiry.phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(`Hello ${inquiry.name.split(" ")[0]}, regarding your inquiry about "${inquiry.subject}" — `)}`
    : null;
  const mailUrl = `mailto:${inquiry.email}?subject=Re: ${encodeURIComponent(inquiry.subject)}&body=Hello ${inquiry.name.split(" ")[0]},%0A%0A`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        {/* Thread */}
        <div className="bg-white rounded-xl border border-line p-5">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="min-w-0">
              <p className="font-display font-bold text-navy truncate">{inquiry.name}</p>
              <p className="text-xs text-muted font-sans truncate">{inquiry.email}{inquiry.phone ? ` · ${inquiry.phone}` : ""}</p>
            </div>
            <InquiryBadge status={sent ? "closed" : "new"} />
          </div>

          <div className="rounded-lg bg-gold/5 border border-gold/15 px-4 py-3 mb-4 text-xs font-sans text-gold/80 leading-relaxed">
            This inquiry came from the public contact form. Sending a reply emails the client directly
            {inquiry.phone ? ", or use WhatsApp to reach them on their number." : "."}
          </div>

          <div className="rounded-xl px-4 py-3 bg-mist text-ink max-w-[85%]">
            <p className="text-sm font-sans leading-relaxed whitespace-pre-wrap">{inquiry.message}</p>
            <p className="text-[10px] font-sans mt-1 text-muted">{formatDateTime(inquiry.created_at)}</p>
          </div>
        </div>

        {/* Reply box */}
        <div className="bg-white rounded-xl border border-line p-5">
          {sent && (
            <div className="flex items-center gap-2 mb-3 text-sm font-sans text-emerald-600">
              <CheckCircle className="h-4 w-4" /> Marked as replied
            </div>
          )}
          <p className="text-xs font-semibold uppercase tracking-wider text-muted font-sans mb-2">Quick Reply</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {QUICK_REPLIES.map((q) => (
              <button key={q} onClick={() => send(q)} disabled={sending} className="px-3 py-1.5 rounded-lg bg-mist text-xs font-sans font-medium text-ink hover:bg-mist-2 transition-colors disabled:opacity-50">
                {q}
              </button>
            ))}
          </div>
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            rows={3}
            placeholder="Type your reply — this is emailed directly to the client…"
            className="w-full px-3 py-2.5 rounded-lg border border-line bg-white text-sm font-sans text-navy placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold resize-none"
          />
          {error && <p className="text-sm text-danger font-sans mt-2">{error}</p>}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <button
              onClick={() => send()}
              disabled={sending || !reply.trim()}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-gradient-to-r from-gold to-[#F0C864] text-navy text-sm font-semibold font-sans hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Send Reply
            </button>
            {waUrl && (
              <a href={waUrl} target="_blank" rel="noopener noreferrer">
                <button className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-success text-white text-sm font-semibold font-sans hover:opacity-90 transition-opacity">
                  <FaWhatsapp className="h-4 w-4" /> WhatsApp
                </button>
              </a>
            )}
            <a href={mailUrl}>
              <button className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-line text-sm font-semibold font-sans text-ink hover:bg-mist transition-colors">
                <Mail className="h-4 w-4 text-muted" /> Email
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* Right rail */}
      <div className="space-y-6">
        {suggestedVisa && (
          <div className="rounded-xl bg-navy p-5 text-white">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gold mb-2">Suggested Visa</p>
            <p className="font-display font-bold text-xl">{suggestedVisa.name}</p>
            <p className="text-sm text-white/60 font-sans mt-1">{suggestedVisa.price}</p>
            <button
              onClick={() => send(`I'd recommend our ${suggestedVisa.name}. Shall I send a quote?`)}
              disabled={sending}
              className="mt-4 w-full h-11 rounded-lg bg-gradient-to-r from-gold to-[#F0C864] text-navy text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Send quote to client
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl border border-line p-5">
          <h3 className="font-display font-bold text-navy mb-3">Details</h3>
          <dl className="space-y-3 text-sm font-sans">
            <div className="flex justify-between gap-3"><dt className="text-muted">Inquiry ID</dt><dd className="text-ink font-medium">#{inquiry.id}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted">Received</dt><dd className="text-ink font-medium">{formatDateTime(inquiry.created_at)}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted">Subject</dt><dd className="text-ink font-medium text-right">{inquiry.subject}</dd></div>
          </dl>
        </div>
      </div>
    </div>
  );
}
