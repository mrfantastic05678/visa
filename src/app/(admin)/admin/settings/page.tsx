import { db } from "@/lib/db";
import { visaTypes } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { VisaPricingRow } from "@/components/admin/VisaPricingRow";
import type { VisaType } from "@/types/db";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const rows = await db
    .select()
    .from(visaTypes)
    .orderBy(asc(visaTypes.sort_order));

  const list: VisaType[] = rows.map((r) => ({
    ...r,
    created_at: r.created_at.toISOString(),
    updated_at: r.updated_at.toISOString(),
  }));

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="font-display font-bold text-2xl text-navy mb-1">Settings</h1>
      <p className="text-sm text-muted font-sans mb-8">
        Manage visa pricing and availability. Changes appear on the public site
        within 60 seconds.
      </p>

      <div className="bg-white rounded-xl border border-line shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-line">
          <h2 className="font-display font-semibold text-navy">Visa Pricing</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-mist text-left">
                <th className="px-5 py-3 font-sans font-semibold text-muted text-xs uppercase tracking-wide">Visa Type</th>
                <th className="px-5 py-3 font-sans font-semibold text-muted text-xs uppercase tracking-wide">Standard Price</th>
                <th className="px-5 py-3 font-sans font-semibold text-muted text-xs uppercase tracking-wide">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {list.map((visa) => (
                <VisaPricingRow key={visa.id} visa={visa} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
