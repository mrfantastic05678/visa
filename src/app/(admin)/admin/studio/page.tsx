import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { requireAdminRole } from "@/lib/admin-guard";
import { ExternalLink, PenLine } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sanity Studio" };

const SCHEMAS = [
  { name: "faqItem", label: "FAQ Items", desc: "Questions and answers, grouped by category" },
  { name: "visaTypeContent", label: "Visa Type Content", desc: "Names, descriptions, feature lists, badge text" },
  { name: "homepageCopy", label: "Homepage Copy", desc: "Hero text, trust stats, process steps, testimonials" },
  { name: "pageSeo", label: "Page SEO", desc: "Title, meta description, OG image per page" },
  { name: "contactDetails", label: "Contact Details", desc: "WhatsApp number, email, office address, hours" },
];

export default async function AdminStudioPage() {
  await requireAdminRole();
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const isConfigured = projectId && projectId !== "placeholder";

  return (
    <>
      <AdminPageHeader
        title="Sanity Studio"
        subtitle="CMS for editorial content — FAQs, visa descriptions, homepage copy"
      />
      <div className="px-4 lg:px-8 pb-10 max-w-3xl">
        {isConfigured ? (
          <div className="bg-white rounded-xl border border-line p-8 text-center space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-gold/10 grid place-items-center mx-auto">
              <PenLine className="h-7 w-7 text-gold" />
            </div>
            <div>
              <p className="font-display font-bold text-navy text-xl">Studio ready</p>
              <p className="text-sm text-muted font-sans mt-1">Open the full Sanity Studio in a new tab to manage content.</p>
            </div>
            <a
              href={`https://${projectId}.sanity.studio/`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-gradient-to-r from-gold to-[#F0C864] text-navy text-sm font-semibold font-sans hover:opacity-90 transition-opacity"
            >
              Open Studio <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-line p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-amber-50 grid place-items-center flex-shrink-0">
                  <PenLine className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-display font-semibold text-navy">Sanity not connected yet</p>
                  <p className="text-sm text-muted font-sans mt-1 leading-relaxed">
                    Add <code className="text-xs bg-mist px-1.5 py-0.5 rounded font-mono">NEXT_PUBLIC_SANITY_PROJECT_ID</code> and{" "}
                    <code className="text-xs bg-mist px-1.5 py-0.5 rounded font-mono">NEXT_PUBLIC_SANITY_DATASET</code> to{" "}
                    <code className="text-xs bg-mist px-1.5 py-0.5 rounded font-mono">.env.local</code> to unlock the Studio.
                    Until then, public pages use hardcoded sample content.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-line overflow-hidden">
              <div className="px-5 py-4 border-b border-line">
                <h2 className="font-display font-semibold text-navy">Content schemas</h2>
                <p className="text-xs text-muted font-sans mt-0.5">These document types will be available once Sanity is connected.</p>
              </div>
              <ul className="divide-y divide-line">
                {SCHEMAS.map((s) => (
                  <li key={s.name} className="flex items-center gap-4 px-5 py-4">
                    <code className="text-xs font-mono text-gold bg-gold/5 px-2 py-1 rounded w-44 flex-shrink-0 truncate">{s.name}</code>
                    <div className="min-w-0">
                      <p className="text-sm font-sans font-medium text-ink">{s.label}</p>
                      <p className="text-xs text-muted font-sans">{s.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 bg-mist rounded-xl border border-line p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted font-sans mb-3">Setup steps</p>
              <ol className="space-y-2 text-sm font-sans text-ink">
                <li className="flex gap-2.5"><span className="font-mono text-gold font-bold">1.</span> Run <code className="text-xs bg-white border border-line px-1.5 py-0.5 rounded font-mono">npx sanity@latest init</code> in the project root</li>
                <li className="flex gap-2.5"><span className="font-mono text-gold font-bold">2.</span> Add the project ID and dataset to <code className="text-xs bg-white border border-line px-1.5 py-0.5 rounded font-mono">.env.local</code></li>
                <li className="flex gap-2.5"><span className="font-mono text-gold font-bold">3.</span> Run <code className="text-xs bg-white border border-line px-1.5 py-0.5 rounded font-mono">/sp.adr sanity-setup</code> to document the CMS integration decision</li>
                <li className="flex gap-2.5"><span className="font-mono text-gold font-bold">4.</span> Restart dev server — this page will switch to the "Studio ready" view</li>
              </ol>
            </div>
          </>
        )}
      </div>
    </>
  );
}
