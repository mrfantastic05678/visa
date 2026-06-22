"use client";

import { CURRENT_USER } from "@/lib/admin-sample-data";
import { Avatar } from "./ui";
import { Bell, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  searchPlaceholder?: string;
  action?: React.ReactNode;
}

export function AdminPageHeader({
  title,
  subtitle,
  searchPlaceholder = "Search applications, clients…",
  action,
}: AdminPageHeaderProps) {
  const router = useRouter();
  const [q, setQ] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    // Route to whichever section is most likely given the query shape
    if (/^VIS-/i.test(term)) {
      router.push(`/admin/applications?q=${encodeURIComponent(term)}`);
    } else if (/@/.test(term)) {
      router.push(`/admin/inquiries?q=${encodeURIComponent(term)}`);
    } else {
      router.push(`/admin/applications?q=${encodeURIComponent(term)}`);
    }
    setQ("");
  }

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden bg-navy px-4 pt-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-display font-bold text-xl text-white truncate">{title}</h1>
            {subtitle && (
              <p className="text-xs text-white/60 font-sans mt-0.5 truncate">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="h-9 w-9 grid place-items-center rounded-lg bg-white/10 text-white">
              <Bell className="h-4 w-4" />
            </button>
            <Avatar initials={CURRENT_USER.initials} className="h-9 w-9 text-xs" />
          </div>
        </div>
      </div>

      {/* Desktop header */}
      <div className="hidden lg:flex items-center justify-between gap-6 px-8 pt-7 pb-5">
        <div className="min-w-0">
          <h1 className="font-display font-bold text-2xl text-navy truncate">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted font-sans mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-10 w-72 pl-9 pr-3 rounded-lg border border-line bg-white text-sm font-sans text-navy placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue"
            />
          </form>
          <Avatar initials={CURRENT_USER.initials} className="h-9 w-9 text-xs" />
          {action}
        </div>
      </div>
    </>
  );
}
