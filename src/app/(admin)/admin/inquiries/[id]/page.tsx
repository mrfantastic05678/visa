import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { InquiryThread } from "@/components/admin/InquiryThread";
import { INQUIRIES } from "@/lib/admin-sample-data";
import { notFound } from "next/navigation";

export const metadata = { title: "Inquiry" };

export default async function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inquiry = INQUIRIES.find((i) => i.id === id);
  if (!inquiry) notFound();

  return (
    <>
      <AdminPageHeader title={inquiry.name} subtitle={`Inquiry #${inquiry.id}`} />
      <div className="px-4 lg:px-8 pb-10">
        <InquiryThread inquiry={inquiry} />
      </div>
    </>
  );
}
