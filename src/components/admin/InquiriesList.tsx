"use client";

import { cn } from "@/lib/utils";
import { INQUIRIES, type InquiryStatus } from "@/lib/admin-sample-data";
import { Avatar, FlagIcon, InquiryBadge } from "./ui";
import { Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const FILTERS: { value: InquiryStatus | "all"; label: string; count: number }[] = [
  { value: "all", label: "All", count: 38 },
  { value: "new", label: "New", count: 6 },
  { value: "replied", label: "Replied", count: 24 },
  { value: "closed", label: "Closed", count: 8 },
];

export function InquiriesList() {
  const [filter, setFilter] = useState<InquiryStatus | "all">("all");
  const [q, setQ] = useState("");

  const rows = INQUIRIES.filter((i) => {
    if (filter !== "all" && i.status !== filter) return false;
    if (q.trim()) {
      const s = q.toLowerCase();
      return (
        i.name.toLowerCase().includes(s) ||
        i.email.toLowerCase().includes(s) ||
        i.subject.toLowerCase().includes(s)
      );
    }
    return true;
  });

  return (
    <div className="px-4 lg:px-8 pb-10">
      {/* Filters + search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-sans font-medium whitespace-nowrap transition-colors flex-shrink-0",
                filter === f.value ? "bg-navy text-white" : "bg-white border border-line text-muted hover:text-ink"
              )}
            >
              {f.label}
              <span className={filter === f.value ? "text-white/70 text-xs" : "text-muted/70 text-xs"}>· {f.count}</span>
            </button>
          ))}
        </div>
        <div className="relative flex-shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search inquiries…"
            className="h-9 w-full sm:w-64 pl-9 pr-3 rounded-lg border border-line bg-white text-sm font-sans text-navy placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold"
          />
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-line overflow-hidden divide-y divide-line">
        {rows.length === 0 && (
          <p className="px-5 py-12 text-center text-sm text-muted font-sans">No inquiries match.</p>
        )}
        {rows.map((inq) => (
          <Link
            key={inq.id}
            href={`/admin/inquiries/${inq.id}`}
            className="flex items-center gap-3 lg:gap-4 px-4 lg:px-5 py-4 hover:bg-mist transition-colors"
          >
            <Avatar initials={inq.initials} color="bg-mist-2" className="h-10 w-10 text-xs flex-shrink-0 !text-muted" />
            <FlagIcon country={inq.country} className="h-4 w-6 flex-shrink-0 hidden sm:block" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 min-w-0">
                <p className="font-sans font-semibold text-ink truncate">{inq.name}</p>
                <span className="text-xs font-sans text-muted truncate hidden sm:inline">{inq.email}</span>
              </div>
              <p className="text-sm font-sans text-muted truncate">{inq.subject}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-xs font-sans text-muted hidden md:inline whitespace-nowrap">{inq.time}</span>
              <InquiryBadge status={inq.status} />
              <span className="h-8 px-3.5 rounded-lg border border-line text-sm font-sans font-medium text-ink hover:bg-mist transition-colors hidden sm:flex items-center">
                Reply
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
