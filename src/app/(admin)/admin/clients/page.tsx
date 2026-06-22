import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Avatar, FlagIcon } from "@/components/admin/ui";
import { APPLICATIONS } from "@/lib/admin-sample-data";

export const metadata = { title: "Clients" };

export default function AdminClientsPage() {
  // Unique clients derived from applications (UI-first sample data)
  const seen = new Set<string>();
  const clients = APPLICATIONS.filter((a) => {
    if (seen.has(a.email)) return false;
    seen.add(a.email);
    return true;
  });

  return (
    <>
      <AdminPageHeader
        title="Clients"
        subtitle={`${clients.length} clients`}
        searchPlaceholder="Search clients…"
      />
      <div className="px-4 lg:px-8 pb-10">
        <div className="bg-white rounded-xl border border-line overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted font-sans border-b border-line">
                  <th className="px-5 py-3 font-semibold">Client</th>
                  <th className="px-5 py-3 font-semibold hidden sm:table-cell">Email</th>
                  <th className="px-5 py-3 font-semibold hidden sm:table-cell">Nationality</th>
                  <th className="px-5 py-3 font-semibold">Latest Visa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {clients.map((c) => (
                  <tr key={c.email} className="hover:bg-mist transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar
                          initials={c.applicant.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          className="h-9 w-9 text-xs flex-shrink-0"
                        />
                        <span className="font-sans font-medium text-ink truncate">{c.applicant}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-sans text-muted hidden sm:table-cell truncate">{c.email}</td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <FlagIcon country={c.country} className="h-4 w-6" />
                        <span className="font-sans text-ink">{c.nationality}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-sans text-muted whitespace-nowrap">{c.visaShort}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
