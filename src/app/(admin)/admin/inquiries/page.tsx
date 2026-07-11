import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { InquiriesList } from "@/components/admin/InquiriesList";

export const metadata = { title: "Inquiries" };

export default function AdminInquiriesPage() {
  return (
    <>
      <AdminPageHeader
        title="Inquiries"
        subtitle="Contact form submissions"
        searchPlaceholder="Search inquiries…"
      />
      <InquiriesList />
    </>
  );
}
