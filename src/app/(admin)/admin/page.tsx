"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AppStatusBadge, FlagIcon } from "@/components/admin/ui";
import { NewApplicationButton } from "@/components/admin/NewApplicationButton";
import { QuickActions } from "@/components/admin/QuickActions";
import {
  APPLICATIONS,
  DASHBOARD_STATS,
  RECENT_ACTIVITY,
} from "@/lib/admin-sample-data";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const currentUser = useCurrentUser();
  const recent = APPLICATIONS.slice(0, 5);
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        subtitle={`${today} · Good afternoon, ${currentUser.name.split(" ")[0]}`}
        action={<NewApplicationButton />}
      />

      <div className="px-4 lg:px-8 pb-10 space-y-6">
        {/* Mobile: Today's queue first */}
        <div className="lg:hidden rounded-xl bg-navy p-5 text-white">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/50">
            Today&apos;s Queue
          </p>
          <div className="flex items-end justify-between gap-4 mt-1">
            <div>
              <p className="font-display font-bold text-4xl">23</p>
              <p className="text-xs text-white/60 mt-1">Applications awaiting your action</p>
            </div>
            <Link
              href="/admin/applications"
              className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-gradient-to-r from-gold to-[#F0C864] text-navy text-sm font-semibold whitespace-nowrap hover:opacity-90 transition-opacity"
            >
              Open Queue <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {DASHBOARD_STATS.map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-line p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted font-sans">
                {s.label}
              </p>
              <p className="font-display font-bold text-3xl lg:text-4xl text-navy mt-2">
                {s.value}
              </p>
              <p
                className={
                  "mt-2 inline-flex items-center gap-1 text-xs font-sans font-medium " +
                  (s.deltaType === "up" ? "text-emerald-600" : "text-muted")
                }
              >
                {s.deltaType === "up" && <ArrowUpRight className="h-3.5 w-3.5" />}
                {s.delta}
              </p>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent applications */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-line overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-line">
              <div>
                <h2 className="font-display font-bold text-navy">Recent Applications</h2>
                <p className="text-xs text-muted font-sans">Last 7 days</p>
              </div>
              <Link
                href="/admin/applications"
                className="inline-flex items-center gap-1 text-sm text-gold font-sans font-medium hover:underline"
              >
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-muted font-sans">
                    <th className="px-5 py-3 font-semibold">App ID</th>
                    <th className="px-5 py-3 font-semibold">Applicant</th>
                    <th className="px-5 py-3 font-semibold hidden sm:table-cell">Visa Type</th>
                    <th className="px-5 py-3 font-semibold hidden sm:table-cell">Date</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {recent.map((a) => (
                    <tr key={a.id} className="hover:bg-mist transition-colors">
                      <td className="px-5 py-3.5">
                        <Link href={`/admin/applications/${a.id}`} className="font-mono text-xs text-muted hover:text-gold">
                          {a.id}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FlagIcon country={a.country} className="h-4 w-6 flex-shrink-0" />
                          <span className="font-sans font-medium text-ink truncate">{a.applicant}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-sans text-muted hidden sm:table-cell whitespace-nowrap">{a.visaShort}</td>
                      <td className="px-5 py-3.5 font-sans text-muted hidden sm:table-cell whitespace-nowrap">{a.date}</td>
                      <td className="px-5 py-3.5"><AppStatusBadge status={a.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right rail */}
          <div className="space-y-6">
            {/* Today's queue (desktop) */}
            <div className="hidden lg:block rounded-xl bg-navy p-6 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/50">
                Today&apos;s Queue
              </p>
              <p className="font-display font-bold text-5xl mt-2">23</p>
              <p className="text-sm text-white/60 mt-1">Applications awaiting your action</p>
              <Link
                href="/admin/applications"
                className="mt-5 w-full inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-gradient-to-r from-gold to-[#F0C864] text-navy text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Open Queue <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Quick actions */}
            <QuickActions />

            {/* Recent activity */}
            <div className="bg-white rounded-xl border border-line p-5">
              <h3 className="font-display font-bold text-navy mb-3">Recent activity</h3>
              <ul className="space-y-3">
                {RECENT_ACTIVITY.map((a, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <span className={`h-2 w-2 rounded-full flex-shrink-0 ${a.dot}`} />
                    <span className="font-sans text-ink flex-1 min-w-0 truncate">{a.text}</span>
                    <span className="font-sans text-xs text-muted flex-shrink-0">{a.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
