import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { InquiriesList } from "@/components/admin/InquiriesList";

export const metadata = { title: "Inquiries" };

export default function AdminInquiriesPage() {
  return (
    <>
      <AdminPageHeader
        title="Inquiries"
        subtitle="38 total · 6 new"
        searchPlaceholder="Search inquiries…"
      />
      <InquiriesList />
    </>
  );
}
