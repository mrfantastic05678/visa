"use client";

import { cn } from "@/lib/utils";
import { CONTACT } from "@/lib/constants";
import type { AdminInquiry } from "@/lib/admin-sample-data";
import { InquiryBadge } from "./ui";
import { Mail, Send } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useState } from "react";

const QUICK_REPLIES = ["Visa info sent", "Docs required", "Price quoted", "Follow-up scheduled"];

// Keyword → visa suggestion mapping
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

function autoSuggestVisa(
  subject: string,
  messages: AdminInquiry["messages"]
): { name: string; price: string } | null {
  const text = [subject, ...messages.map((m) => m.text)].join(" ").toLowerCase();
  for (const { keywords, visa } of VISA_KEYWORDS) {
    if (keywords.some((kw) => text.includes(kw))) return visa;
  }
  return null;
}

export function InquiryThread({ inquiry }: { inquiry: AdminInquiry }) {
  const [messages, setMessages] = useState(inquiry.messages);
  const [reply, setReply] = useState("");

  const suggestedVisa = inquiry.suggestedVisa ?? autoSuggestVisa(inquiry.subject, messages);

  function send(text?: string) {
    const body = (text ?? reply).trim();
    if (!body) return;
    setMessages((m) => [...m, { from: "agent" as const, time: "Just now", text: body }]);
    setReply("");
  }

  const waUrl = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(`Hello ${inquiry.name.split(" ")[0]}, regarding your inquiry about "${inquiry.subject}" — `)}`;
  const mailUrl = `mailto:${inquiry.email}?subject=Re: ${encodeURIComponent(inquiry.subject)}&body=Hello ${inquiry.name.split(" ")[0]},%0A%0A`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        {/* Thread */}
        <div className="bg-white rounded-xl border border-line p-5">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="min-w-0">
              <p className="font-display font-bold text-navy truncate">{inquiry.name}</p>
              <p className="text-xs text-muted font-sans truncate">{inquiry.email}</p>
            </div>
            <InquiryBadge status={inquiry.status} />
          </div>

          {/* How replies work — visible only when thread has just the client's first message */}
          {messages.length === 1 && messages[0].from === "client" && (
            <div className="rounded-lg bg-blue/5 border border-blue/15 px-4 py-3 mb-4 text-xs font-sans text-blue/80 leading-relaxed">
              This inquiry came from the public contact form. Reply in-app below, or use WhatsApp/Email to reach the client directly.
            </div>
          )}

          <div className="space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex", m.from === "agent" ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[80%] rounded-xl px-4 py-2.5", m.from === "agent" ? "bg-blue text-white" : "bg-mist text-ink")}>
                  <p className="text-sm font-sans leading-relaxed">{m.text}</p>
                  <p className={cn("text-[10px] font-sans mt-1", m.from === "agent" ? "text-white/60" : "text-muted")}>{m.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reply box */}
        <div className="bg-white rounded-xl border border-line p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted font-sans mb-2">Quick Reply</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {QUICK_REPLIES.map((q) => (
              <button key={q} onClick={() => send(q)} className="px-3 py-1.5 rounded-lg bg-mist text-xs font-sans font-medium text-ink hover:bg-mist-2 transition-colors">
                {q}
              </button>
            ))}
          </div>
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            rows={3}
            placeholder="Type your reply…"
            className="w-full px-3 py-2.5 rounded-lg border border-line bg-white text-sm font-sans text-navy placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue resize-none"
          />
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <button
              onClick={() => send()}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-blue text-white text-sm font-semibold font-sans hover:bg-blue-hover transition-colors"
            >
              <Send className="h-4 w-4" /> Send Reply
            </button>
            <a href={waUrl} target="_blank" rel="noopener noreferrer">
              <button className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-success text-white text-sm font-semibold font-sans hover:opacity-90 transition-opacity">
                <FaWhatsapp className="h-4 w-4" /> WhatsApp
              </button>
            </a>
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
            <p className="text-[11px] font-semibold uppercase tracking-widest text-blue mb-2">Suggested Visa</p>
            <p className="font-display font-bold text-xl">{suggestedVisa.name}</p>
            <p className="text-sm text-white/60 font-sans mt-1">{suggestedVisa.price}</p>
            <button
              onClick={() => send("I'd recommend our " + suggestedVisa!.name + ". Shall I send a quote?")}
              className="mt-4 w-full h-11 rounded-lg bg-blue text-white text-sm font-semibold hover:bg-blue-hover transition-colors"
            >
              Send quote to client
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl border border-line p-5">
          <h3 className="font-display font-bold text-navy mb-3">Details</h3>
          <dl className="space-y-3 text-sm font-sans">
            <div className="flex justify-between gap-3"><dt className="text-muted">Inquiry ID</dt><dd className="text-ink font-medium">#{inquiry.id}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted">Received</dt><dd className="text-ink font-medium">{inquiry.time}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted">Subject</dt><dd className="text-ink font-medium text-right">{inquiry.subject}</dd></div>
          </dl>
        </div>
      </div>
    </div>
  );
}
