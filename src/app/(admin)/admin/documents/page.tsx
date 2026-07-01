import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DocumentsView } from "@/components/admin/DocumentsView";
import { Upload } from "lucide-react";

export const metadata = { title: "Documents" };

export default function AdminDocumentsPage() {
  return (
    <>
      <AdminPageHeader
        title="Documents"
        subtitle="14,228 files · 12 awaiting verification"
        searchPlaceholder="Search documents…"
        action={
          <button className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-gradient-to-r from-gold to-[#F0C864] text-navy text-sm font-semibold font-sans hover:opacity-90 transition-opacity whitespace-nowrap">
            <Upload className="h-4 w-4" /> Upload
          </button>
        }
      />
      <DocumentsView />
    </>
  );
}
