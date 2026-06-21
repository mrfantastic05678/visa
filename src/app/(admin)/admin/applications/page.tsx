import { db } from "@/lib/db";
import { applications, visaTypes } from "@/lib/db/schema";
import { desc, eq, and, ilike, or, sql } from "drizzle-orm";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate } from "@/lib/utils";
import type { ApplicationStatus } from "@/types/db";

export const dynamic = "force-dynamic";

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "submitted", label: "Submitted" },
  { value: "reviewing", label: "Under Review" },
  { value: "processing", label: "Processing" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

interface PageProps {
  searchParams: Promise<{ status?: string; q?: string }>;
}

export default async function AdminApplicationsPage({ searchParams }: PageProps) {
  const { status, q } = await searchParams;

  const conditions = [sql`${applications.status} != 'draft'`];
  if (status && status !== "all") {
    conditions.push(eq(applications.status, status as ApplicationStatus));
  }
  if (q?.trim()) {
    conditions.push(
      or(
        ilike(applications.id, `%${q.trim()}%`),
        ilike(applications.given_name, `%${q.trim()}%`),
        ilike(applications.surname, `%${q.trim()}%`),
        ilike(applications.passport_number, `%${q.trim()}%`)
      )!
    );
  }

  const rows = await db
    .select({
      id: applications.id,
      given_name: applications.given_name,
      surname: applications.surname,
      nationality: applications.nationality,
      status: applications.status,
      created_at: applications.created_at,
      visa_type_name: visaTypes.name,
    })
    .from(applications)
    .innerJoin(visaTypes, eq(applications.visa_type_id, visaTypes.id))
    .where(and(...conditions))
    .orderBy(desc(applications.created_at))
    .limit(200);

  return (
    <div className="p-8 max-w-6xl">
      <h1 className="font-display font-bold text-2xl text-navy mb-1">Applications</h1>
      <p className="text-sm text-muted font-sans mb-6">
        {rows.length} application{rows.length === 1 ? "" : "s"}
      </p>

      {/* Filters + search */}
      <div className="flex items-center justify-between gap-4 flex-wrap mb-5">
        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_FILTERS.map((f) => {
            const active = (status ?? "all") === f.value;
            const params = new URLSearchParams();
            if (f.value !== "all") params.set("status", f.value);
            if (q) params.set("q", q);
            return (
              <Link
                key={f.value}
                href={`/admin/applications${params.toString() ? `?${params}` : ""}`}
                className={
                  "px-3.5 py-1.5 rounded-lg text-sm font-sans font-medium whitespace-nowrap transition-colors " +
                  (active
                    ? "bg-navy text-white"
                    : "bg-white border border-line text-muted hover:text-ink")
                }
              >
                {f.label}
              </Link>
            );
          })}
        </div>
        <form className="flex-shrink-0">
          {status && status !== "all" && (
            <input type="hidden" name="status" value={status} />
          )}
          <input
            type="text"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search ID, name, passport…"
            className="h-9 w-64 max-w-full px-3 rounded-lg border border-line bg-white text-sm font-sans text-navy placeholder:text-muted focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/20 transition-colors"
          />
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-line shadow-sm overflow-hidden">
        {rows.length === 0 ? (
          <p className="px-6 py-16 text-center text-muted font-sans text-sm">
            No applications match your filters.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line bg-mist text-left">
                  <th className="px-5 py-3 font-sans font-semibold text-muted text-xs uppercase tracking-wide">Application</th>
                  <th className="px-5 py-3 font-sans font-semibold text-muted text-xs uppercase tracking-wide">Visa</th>
                  <th className="px-5 py-3 font-sans font-semibold text-muted text-xs uppercase tracking-wide">Submitted</th>
                  <th className="px-5 py-3 font-sans font-semibold text-muted text-xs uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((app) => (
                  <tr key={app.id} className="hover:bg-mist transition-colors">
                    <td className="px-5 py-3.5">
                      <Link href={`/admin/applications/${app.id}`} className="block min-w-0">
                        <span className="font-mono text-xs text-muted block">{app.id}</span>
                        <span className="font-sans text-ink font-medium">
                          {app.given_name} {app.surname}
                        </span>
                        <span className="text-muted font-sans text-xs"> · {app.nationality}</span>
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 font-sans text-ink whitespace-nowrap">{app.visa_type_name}</td>
                    <td className="px-5 py-3.5 font-sans text-muted whitespace-nowrap">{formatDate(app.created_at.toISOString())}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={app.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
