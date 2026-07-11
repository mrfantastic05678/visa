import { db } from "@/lib/db";
import { applications, documents } from "@/lib/db/schema";
import { requireAdminApi } from "@/lib/auth-guard";
import { getDocumentSignedUrl } from "@/lib/r2";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const { response } = await requireAdminApi();
  if (response) return response;

  const rows = await db
    .select({
      id: documents.id,
      document_type: documents.document_type,
      filename: documents.filename,
      size_bytes: documents.size_bytes,
      r2_key: documents.r2_key,
      uploaded_at: documents.uploaded_at,
      application_id: applications.id,
      applicant_name: applications.given_name,
      applicant_surname: applications.surname,
    })
    .from(documents)
    .innerJoin(applications, eq(documents.application_id, applications.id))
    .orderBy(desc(documents.uploaded_at))
    .limit(200);

  const withUrls = await Promise.all(
    rows.map(async (d) => ({
      id: d.id,
      document_type: d.document_type,
      filename: d.filename,
      size_bytes: d.size_bytes,
      uploaded_at: d.uploaded_at.toISOString(),
      application_id: d.application_id,
      applicant: `${d.applicant_name} ${d.applicant_surname}`,
      signed_url: await getDocumentSignedUrl(d.r2_key),
    }))
  );

  return NextResponse.json({ documents: withUrls });
}
