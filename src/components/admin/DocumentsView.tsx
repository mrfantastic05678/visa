"use client";

import { cn } from "@/lib/utils";
import { ALL_DOCUMENTS } from "@/lib/admin-sample-data";
import { DocBadge } from "./ui";
import { FileText, LayoutGrid, List, Search } from "lucide-react";
import { useMemo, useState } from "react";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "passport", label: "Passports" },
  { value: "photo", label: "Photos" },
  { value: "supporting", label: "Supporting" },
  { value: "pending", label: "Pending" },
  { value: "rejected", label: "Rejected" },
];

export function DocumentsView() {
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [applicant, setApplicant] = useState("all");
  const [q, setQ] = useState("");

  const applicants = useMemo(
    () => Array.from(new Set(ALL_DOCUMENTS.map((d) => d.applicant))).sort(),
    []
  );

  const docs = ALL_DOCUMENTS.filter((d) => {
    if (filter !== "all") {
      if (filter === "pending" || filter === "rejected") {
        if (d.status !== filter) return false;
      } else if (d.type !== filter) return false;
    }
    if (applicant !== "all" && d.applicant !== applicant) return false;
    if (q.trim()) {
      const s = q.toLowerCase();
      return d.filename.toLowerCase().includes(s) || d.applicant.toLowerCase().includes(s);
    }
    return true;
  });

  return (
    <div className="px-4 lg:px-8 pb-10">
      {/* Toolbar */}
      <div className="space-y-3 mb-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-sm font-sans font-medium whitespace-nowrap transition-colors flex-shrink-0",
                  filter === f.value ? "bg-navy text-white" : "bg-white border border-line text-muted hover:text-ink"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="hidden sm:flex items-center gap-1 bg-white border border-line rounded-lg p-1 flex-shrink-0">
            <button onClick={() => setView("grid")} className={cn("h-7 px-2.5 rounded inline-flex items-center gap-1.5 text-xs font-sans font-medium", view === "grid" ? "bg-mist text-navy" : "text-muted")}>
              <LayoutGrid className="h-3.5 w-3.5" /> Grid
            </button>
            <button onClick={() => setView("list")} className={cn("h-7 px-2.5 rounded inline-flex items-center gap-1.5 text-xs font-sans font-medium", view === "list" ? "bg-mist text-navy" : "text-muted")}>
              <List className="h-3.5 w-3.5" /> List
            </button>
          </div>
        </div>

        {/* Search + applicant (user) filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search documents…"
              className="h-9 w-full pl-9 pr-3 rounded-lg border border-line bg-white text-sm font-sans text-navy placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue"
            />
          </div>
          <select
            value={applicant}
            onChange={(e) => setApplicant(e.target.value)}
            className="h-9 px-3 rounded-lg border border-line bg-white text-sm font-sans text-navy focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue"
          >
            <option value="all">All clients</option>
            {applicants.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>

      {docs.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted font-sans">No documents match.</p>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {docs.map((d) => (
            <div key={d.id} className="bg-white rounded-xl border border-line overflow-hidden">
              <div className="aspect-[4/3] bg-mist grid place-items-center">
                <FileText className="h-8 w-8 text-line" />
              </div>
              <div className="p-3.5">
                <p className="text-sm font-sans font-medium text-ink truncate">{d.filename}</p>
                <p className="text-xs text-muted font-sans truncate">{d.applicant}</p>
                <div className="flex items-center justify-between gap-2 mt-2.5">
                  <DocBadge status={d.status} />
                  <span className="text-xs text-muted font-sans">{d.size}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-line overflow-hidden divide-y divide-line">
          {docs.map((d) => (
            <div key={d.id} className="flex items-center gap-3 px-4 py-3">
              <span className="h-9 w-9 rounded-lg bg-mist grid place-items-center flex-shrink-0">
                <FileText className="h-4 w-4 text-muted" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-sans font-medium text-ink truncate">{d.filename}</p>
                <p className="text-xs text-muted font-sans truncate">{d.applicant} · {d.size}</p>
              </div>
              <DocBadge status={d.status} />
              <button className="text-sm font-sans font-medium text-blue hover:underline flex-shrink-0 hidden sm:block">View</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
