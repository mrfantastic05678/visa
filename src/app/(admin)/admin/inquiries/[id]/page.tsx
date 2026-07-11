import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { InquiryThread } from "@/components/admin/InquiryThread";
import { db } from "@/lib/db";
import { inquiries } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export const metadata = { title: "Inquiry" };

export default async function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inquiryId = Number(id);
  if (!Number.isInteger(inquiryId)) notFound();

  const [inquiry] = await db
    .select()
    .from(inquiries)
    .where(eq(inquiries.id, inquiryId))
    .limit(1);

  if (!inquiry) notFound();

  return (
    <>
      <AdminPageHeader title={inquiry.name} subtitle={`Inquiry #${inquiry.id}`} />
      <div className="px-4 lg:px-8 pb-10">
        <InquiryThread
          inquiry={{
            ...inquiry,
            created_at: inquiry.created_at.toISOString(),
          }}
        />
      </div>
    </>
  );
}
