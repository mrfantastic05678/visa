import { db } from "@/lib/db";
import { applications, inquiries } from "@/lib/db/schema";
import { desc, sql } from "drizzle-orm";
import Link from "next/link";
import { FileText, MessageSquare, Clock, CheckCircle2 } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";

export const dynamic = "force-dynamic";

async function getStats() {
  const [counts] = await db
    .select({
      total: sql<number>`count(*)`,
      submitted: sql<number>`count(*) filter (where ${applications.status} = 'submitted')`,
      reviewing: sql<number>`count(*) filter (where ${applications.status} = 'reviewing')`,
      processing: sql<number>`count(*) filter (where ${applications.status} = 'processing')`,
      approved: sql<number>`count(*) filter (where ${applications.status} = 'approved')`,
    })
    .from(applications);

  const [inquiryCount] = await db
    .select({
      open: sql<number>`count(*) filter (where ${inquiries.resolved} = false)`,
    })
    .from(inquiries);

  const recent = await db
    .select({
      id: applications.id,
      given_name: applications.given_name,
      surname: applications.surname,
      status: applications.status,
      created_at: applications.created_at,
    })
    .from(applications)
    .where(sql`${applications.status} != 'draft'`)
    .orderBy(desc(applications.created_at))
    .limit(8);

  return { counts, inquiryCount, recent };
}

export default async function AdminDashboard() {
  const { counts, inquiryCount, recent } = await getStats();

  const cards = [
    {
      label: "Total Applications",
      value: counts?.total ?? 0,
      icon: FileText,
      color: "text-blue bg-blue/10",
    },
    {
      label: "Awaiting Review",
      value: (Number(counts?.submitted ?? 0) + Number(counts?.reviewing ?? 0)),
      icon: Clock,
      color: "text-warning bg-warning/10",
    },
    {
      label: "Approved",
      value: counts?.approved ?? 0,
      icon: CheckCircle2,
      color: "text-success bg-success/10",
    },
    {
      label: "Open Inquiries",
      value: inquiryCount?.open ?? 0,
      icon: MessageSquare,
      color: "text-info bg-info/10",
    },
  ];

  return (
    <div className="p-8 max-w-6xl">
      <h1 className="font-display font-bold text-2xl text-navy mb-1">Dashboard</h1>
      <p className="text-sm text-muted font-sans mb-8">
        Overview of applications and inquiries.
      </p>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-line p-5 shadow-sm"
          >
            <div className={`h-10 w-10 rounded-lg grid place-items-center mb-3 ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="font-display font-bold text-3xl text-navy">{Number(value)}</p>
            <p className="text-xs text-muted font-sans uppercase tracking-wide mt-1">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Recent applications */}
      <div className="bg-white rounded-xl border border-line shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <h2 className="font-display font-semibold text-navy">Recent Applications</h2>
          <Link
            href="/admin/applications"
            className="text-sm text-blue font-sans font-medium hover:underline"
          >
            View all
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="px-6 py-12 text-center text-muted font-sans text-sm">
            No applications yet.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {recent.map((app) => (
              <li key={app.id}>
                <Link
                  href={`/admin/applications/${app.id}`}
                  className="flex items-center justify-between gap-4 px-6 py-3.5 hover:bg-mist transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-muted">{app.id}</p>
                    <p className="font-sans text-sm text-ink font-medium truncate">
                      {app.given_name} {app.surname}
                    </p>
                  </div>
                  <StatusBadge status={app.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
