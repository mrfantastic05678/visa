import { db } from "@/lib/db";
import { applications, documents, statusHistory, visaTypes } from "@/lib/db/schema";
import { getDocumentSignedUrl } from "@/lib/r2";
import { eq, asc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const [app] = await db
    .select()
    .from(applications)
    .innerJoin(visaTypes, eq(applications.visa_type_id, visaTypes.id))
    .where(eq(applications.id, id))
    .limit(1);

  if (!app) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const [history, docs] = await Promise.all([
    db
      .select()
      .from(statusHistory)
      .where(eq(statusHistory.application_id, id))
      .orderBy(asc(statusHistory.created_at)),
    db
      .select()
      .from(documents)
      .where(eq(documents.application_id, id)),
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

  return NextResponse.json({
    ...app.applications,
    visa_type: app.visa_types,
    status_history: history,
    documents: docsWithUrls,
  });
}
