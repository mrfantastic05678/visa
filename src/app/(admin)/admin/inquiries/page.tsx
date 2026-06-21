import { db } from "@/lib/db";
import { inquiries } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { InquiryCard } from "@/components/admin/InquiryCard";
import type { Inquiry } from "@/types/db";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  const rows = await db
    .select()
    .from(inquiries)
    .orderBy(desc(inquiries.created_at))
    .limit(200);

  const list: Inquiry[] = rows.map((r) => ({
    ...r,
    created_at: r.created_at.toISOString(),
  }));

  const open = list.filter((i) => !i.resolved);
  const resolved = list.filter((i) => i.resolved);

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="font-display font-bold text-2xl text-navy mb-1">Inquiries</h1>
      <p className="text-sm text-muted font-sans mb-8">
        {open.length} open · {resolved.length} resolved
      </p>

      {list.length === 0 ? (
        <div className="bg-white rounded-xl border border-line p-16 text-center">
          <p className="text-muted font-sans text-sm">No inquiries yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {open.length > 0 && (
            <section>
              <h2 className="font-sans font-semibold text-sm text-muted uppercase tracking-widest mb-4">
                Open
              </h2>
              <div className="space-y-4">
                {open.map((i) => (
                  <InquiryCard key={i.id} inquiry={i} />
                ))}
              </div>
            </section>
          )}
          {resolved.length > 0 && (
            <section>
              <h2 className="font-sans font-semibold text-sm text-muted uppercase tracking-widest mb-4">
                Resolved
              </h2>
              <div className="space-y-4 opacity-70">
                {resolved.map((i) => (
                  <InquiryCard key={i.id} inquiry={i} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
