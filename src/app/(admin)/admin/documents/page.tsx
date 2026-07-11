import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DocumentsView } from "@/components/admin/DocumentsView";

export const metadata = { title: "Documents" };

export default function AdminDocumentsPage() {
  return (
    <>
      <AdminPageHeader
        title="Documents"
        subtitle="All files uploaded across applications"
        searchPlaceholder="Search documents…"
      />
      <DocumentsView />
    </>
  );
}
