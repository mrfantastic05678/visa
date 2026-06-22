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
          <button className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-blue text-white text-sm font-semibold font-sans hover:bg-blue-hover transition-colors whitespace-nowrap">
            <Upload className="h-4 w-4" /> Upload
          </button>
        }
      />
      <DocumentsView />
    </>
  );
}
