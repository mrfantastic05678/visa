import { db } from "@/lib/db";
import { inquiries } from "@/lib/db/schema";
import { requireAdminApi } from "@/lib/auth-guard";
import { sendInquiryReplyEmail } from "@/lib/resend";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const BodySchema = z.object({
  message: z.string().min(1).max(5000),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response } = await requireAdminApi();
  if (response) return response;

  const { id } = await params;
  const inquiryId = Number(id);
  if (!Number.isInteger(inquiryId)) {
    return NextResponse.json({ error: "Invalid inquiry id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Reply message is required" }, { status: 422 });
  }

  const [inquiry] = await db
    .select()
    .from(inquiries)
    .where(eq(inquiries.id, inquiryId))
    .limit(1);

  if (!inquiry) {
    return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
  }

  try {
    await sendInquiryReplyEmail({
      to: inquiry.email,
      inquiryName: inquiry.name,
      subject: inquiry.subject,
      message: parsed.data.message,
    });
  } catch {
    return NextResponse.json(
      { error: "Could not send email. Please try again or use WhatsApp instead." },
      { status: 502 }
    );
  }

  await db.update(inquiries).set({ resolved: true }).where(eq(inquiries.id, inquiryId));

  return NextResponse.json({ sent: true });
}
