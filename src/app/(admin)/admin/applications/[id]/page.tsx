import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ApplicationDetailClient } from "@/components/admin/ApplicationDetailClient";
import { db } from "@/lib/db";
import { applications, documents, statusHistory, visaTypes } from "@/lib/db/schema";
import { getDocumentSignedUrl } from "@/lib/r2";
import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function ApplicationDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [row] = await db
    .select()
    .from(applications)
    .innerJoin(visaTypes, eq(applications.visa_type_id, visaTypes.id))
    .where(eq(applications.id, id))
    .limit(1);

  if (!row) notFound();

  const [history, docs] = await Promise.all([
    db
      .select()
      .from(statusHistory)
      .where(eq(statusHistory.application_id, id))
      .orderBy(asc(statusHistory.created_at)),
    db.select().from(documents).where(eq(documents.application_id, id)),
  ]);

  const docsWithUrls = await Promise.all(
    docs.map(async (doc) => ({
      id: doc.id,
      document_type: doc.document_type,
      filename: doc.filename,
      size_bytes: doc.size_bytes,
      uploaded_at: doc.uploaded_at.toISOString(),
      signed_url: await getDocumentSignedUrl(doc.r2_key),
    }))
  );

  const app = row.applications;
  const visaType = row.visa_types;

  return (
    <>
      <AdminPageHeader
        title={`${app.given_name} ${app.surname}`}
        subtitle={`${app.id} · Submitted ${app.created_at.toLocaleDateString("en-AE", { day: "numeric", month: "short", year: "numeric" })}`}
      />
      <ApplicationDetailClient
        app={{
          ...app,
          created_at: app.created_at.toISOString(),
          updated_at: app.updated_at.toISOString(),
          visa_type_name: visaType.name,
        }}
        history={history.map((h) => ({ ...h, created_at: h.created_at.toISOString() }))}
        documents={docsWithUrls}
      />
    </>
  );
}
