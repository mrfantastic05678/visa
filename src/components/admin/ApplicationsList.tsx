"use client";

import { cn } from "@/lib/utils";
import {
  APPLICATIONS,
  CONSULTANTS,
  type AdminAppStatus,
  type AdminApplication,
} from "@/lib/admin-sample-data";
import { AppStatusBadge, Avatar, FlagIcon } from "./ui";
import { ChevronDown, Download, MoreHorizontal, Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

const STATUS_FILTERS: { value: AdminAppStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "reviewing", label: "Reviewing" },
  { value: "processing", label: "Processing" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const DATE_RANGES = [
  { label: "All time", days: 0 },
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
];

function parseSubmitted(s: string): Date | null {
  // "21 Feb · 2026" → Date
  const clean = s.replace(" · ", " ");
  const d = new Date(clean);
  return isNaN(d.getTime()) ? null : d;
}

function exportCSV(rows: AdminApplication[]) {
  const header = ["App ID", "Applicant", "Nationality", "Country", "Visa Type", "Submitted", "Status", "Passport No."];
  const lines = [
    header.join(","),
    ...rows.map((r) =>
      [r.id, `"${r.applicant}"`, r.nationality, r.country, `"${r.visaShort}"`, r.submitted, r.status, r.passportNo].join(",")
    ),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `visati-applications-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function Dropdown({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const active = options.find((o) => o.value === value);
  const isFiltered = value !== "";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border text-sm font-sans transition-colors whitespace-nowrap",
          isFiltered
            ? "border-blue bg-blue/5 text-blue font-semibold"
            : "border-line text-ink hover:bg-mist"
        )}
      >
        {isFiltered ? active?.label ?? label : label}
        {isFiltered ? (
          <X className="h-3.5 w-3.5" onClick={(e) => { e.stopPropagation(); onChange(""); setOpen(false); }} />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-muted" />
        )}
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 z-20 min-w-[160px] bg-white rounded-xl border border-line shadow-lg py-1">
          {options.map((o) => (
            <button
              key={o.value}
              onClick={() => { onChange(o.value === value ? "" : o.value); setOpen(false); }}
              className={cn(
                "w-full text-left px-4 py-2 text-sm font-sans hover:bg-mist transition-colors",
                o.value === value ? "text-blue font-semibold" : "text-ink"
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ApplicationsList() {
  const searchParams = useSearchParams();
  const urlQ = searchParams.get("q") ?? "";

  const [filter, setFilter] = useState<AdminAppStatus | "all">("all");
  const [q, setQ] = useState(urlQ);
  const [dateRange, setDateRange] = useState("");
  const [visaType, setVisaType] = useState("");
  const [country, setCountry] = useState("");

  // Sync URL search param when it changes (from global search bar)
  useEffect(() => { setQ(urlQ); }, [urlQ]);

  // Derive unique visa types and countries from sample data
  const visaOptions = Array.from(new Set(APPLICATIONS.map((a) => a.visaShort))).map((v) => ({
    label: v,
    value: v,
  }));

  const countryOptions = Array.from(new Set(APPLICATIONS.map((a) => a.nationality))).map((n) => {
    const app = APPLICATIONS.find((a) => a.nationality === n)!;
    return { label: n, value: app.country };
  });

  const dateOptions = DATE_RANGES.map((d) => ({ label: d.label, value: String(d.days) }));

  const now = new Date();

  const rows = APPLICATIONS.filter((a) => {
    if (filter !== "all" && a.status !== filter) return false;

    if (q.trim()) {
      const s = q.toLowerCase();
      if (
        !a.applicant.toLowerCase().includes(s) &&
        !a.id.toLowerCase().includes(s) &&
        !a.passportNo.toLowerCase().includes(s) &&
        !a.nationality.toLowerCase().includes(s)
      )
        return false;
    }

    if (dateRange) {
      const days = Number(dateRange);
      const d = parseSubmitted(a.submitted);
      if (d && days > 0) {
        const cutoff = new Date(now);
        cutoff.setDate(now.getDate() - days);
        if (d < cutoff) return false;
      }
    }

    if (visaType && a.visaShort !== visaType) return false;
    if (country && a.country !== country) return false;

    return true;
  });

  const hasFilters = !!dateRange || !!visaType || !!country || filter !== "all" || !!q;

  function clearAll() {
    setFilter("all");
    setQ("");
    setDateRange("");
    setVisaType("");
    setCountry("");
  }

  return (
    <div className="px-4 lg:px-8 pb-10">
      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-line p-3 mb-5 space-y-3 lg:space-y-0 lg:flex lg:items-center lg:justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 -mx-1 px-1">
          {STATUS_FILTERS.map((f) => {
            const count = f.value === "all" ? APPLICATIONS.length : APPLICATIONS.filter((a) => a.status === f.value).length;
            return (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-sans font-medium whitespace-nowrap transition-colors flex-shrink-0",
                  filter === f.value ? "bg-navy text-white" : "bg-mist text-muted hover:text-ink"
                )}
              >
                {f.label}
                <span className={cn("text-xs", filter === f.value ? "text-white/70" : "text-muted/70")}>· {count}</span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
          <div className="relative flex-1 lg:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, ID, passport…"
              className="h-9 w-full lg:w-56 pl-9 pr-3 rounded-lg border border-line bg-white text-sm font-sans text-navy placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue"
            />
          </div>
          <div className="hidden xl:flex items-center gap-2">
            <Dropdown label="Date Range" options={dateOptions} value={dateRange} onChange={setDateRange} />
            <Dropdown label="Visa Type" options={visaOptions} value={visaType} onChange={setVisaType} />
            <Dropdown label="Country" options={countryOptions} value={country} onChange={setCountry} />
          </div>
          {hasFilters && (
            <button onClick={clearAll} className="text-xs font-sans font-medium text-muted hover:text-ink whitespace-nowrap">
              Clear all
            </button>
          )}
          <button
            onClick={() => exportCSV(rows)}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-line text-sm font-sans text-ink hover:bg-mist transition-colors flex-shrink-0"
          >
            Export <Download className="h-3.5 w-3.5 text-muted" />
          </button>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block bg-white rounded-xl border border-line overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-muted font-sans border-b border-line">
              <th className="pl-5 pr-2 py-3 w-8"><input type="checkbox" className="h-4 w-4 rounded border-line accent-blue" /></th>
              <th className="px-3 py-3 font-semibold">App ID</th>
              <th className="px-3 py-3 font-semibold">Applicant</th>
              <th className="px-3 py-3 font-semibold">Visa Type</th>
              <th className="px-3 py-3 font-semibold">Submitted</th>
              <th className="px-3 py-3 font-semibold">Assigned</th>
              <th className="px-3 py-3 font-semibold">Status</th>
              <th className="px-3 py-3 w-8" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((a) => {
              const c = CONSULTANTS[a.assigned];
              return (
                <tr key={a.id} className="hover:bg-mist transition-colors group">
                  <td className="pl-5 pr-2 py-3.5"><input type="checkbox" className="h-4 w-4 rounded border-line accent-blue" /></td>
                  <td className="px-3 py-3.5">
                    <Link href={`/admin/applications/${a.id}`} className="font-mono text-xs text-muted group-hover:text-blue">{a.id}</Link>
                  </td>
                  <td className="px-3 py-3.5">
                    <Link href={`/admin/applications/${a.id}`} className="flex items-center gap-2.5 min-w-0">
                      <FlagIcon country={a.country} className="h-4 w-6 flex-shrink-0" />
                      <span className="font-sans font-medium text-ink truncate">{a.applicant}</span>
                    </Link>
                  </td>
                  <td className="px-3 py-3.5 font-sans text-muted whitespace-nowrap">{a.visaShort}</td>
                  <td className="px-3 py-3.5 font-sans text-muted whitespace-nowrap">{a.submitted}</td>
                  <td className="px-3 py-3.5">
                    <div className="flex items-center gap-2">
                      <Avatar initials={c.initials} src={c.photo} color={c.color} className="h-6 w-6 text-[10px]" />
                      <span className="font-sans text-ink">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3.5"><AppStatusBadge status={a.status} /></td>
                  <td className="px-3 py-3.5">
                    <button className="text-muted hover:text-ink"><MoreHorizontal className="h-4 w-4" /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-muted font-sans">No applications match your filters.</p>
            {hasFilters && (
              <button onClick={clearAll} className="mt-2 text-sm text-blue font-sans font-medium hover:underline">Clear filters</button>
            )}
          </div>
        )}
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-3">
        {rows.map((a) => (
          <Link key={a.id} href={`/admin/applications/${a.id}`} className="block bg-white rounded-xl border border-line p-4">
            <div className="flex items-start gap-3">
              <FlagIcon country={a.country} className="h-5 w-7 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-sans font-semibold text-ink truncate">{a.applicant}</p>
                  <AppStatusBadge status={a.status} />
                </div>
                <p className="font-mono text-xs text-muted mt-0.5">{a.id}</p>
                <div className="flex items-center justify-between gap-2 mt-2">
                  <span className="text-xs font-sans text-muted">{a.visaShort}</span>
                  <span className="text-xs font-sans text-muted">Submitted {a.submitted.replace(" · 2026", "")}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
        {rows.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-muted font-sans">No applications match your filters.</p>
            {hasFilters && (
              <button onClick={clearAll} className="mt-2 text-sm text-blue font-sans font-medium hover:underline">Clear filters</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
