import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM_EMAIL ?? "noreply@visati.ae";
const ADMIN_EMAIL =
  process.env.ADMIN_NOTIFICATION_EMAIL ?? "admin@visati.ae";

export async function sendConfirmationEmail(params: {
  to: string;
  applicantName: string;
  applicationId: string;
  visaTypeName: string;
  travelDate: string;
}): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM,
      to: params.to,
      subject: `Visa Application Received — ${params.applicationId}`,
      html: `
        <h2>Thank you, ${params.applicantName}!</h2>
        <p>Your visa application has been received and is under review.</p>
        <p><strong>Application ID:</strong> ${params.applicationId}</p>
        <p><strong>Visa Type:</strong> ${params.visaTypeName}</p>
        <p><strong>Travel Date:</strong> ${params.travelDate}</p>
        <p>Track your application at <a href="${process.env.NEXT_PUBLIC_APP_URL}/track">visati.ae/track</a></p>
      `,
    });
  } catch (err) {
    console.error("[resend] sendConfirmationEmail failed", err);
  }
}

export async function sendStatusUpdateEmail(params: {
  to: string;
  applicantName: string;
  applicationId: string;
  status: string;
  note?: string;
}): Promise<void> {
  try {
    const statusLabel: Record<string, string> = {
      submitted: "Submitted",
      reviewing: "Under Review",
      processing: "Processing",
      approved: "Approved",
      rejected: "Rejected",
    };
    await resend.emails.send({
      from: FROM,
      to: params.to,
      subject: `Application Update — ${params.applicationId} is now ${statusLabel[params.status] ?? params.status}`,
      html: `
        <h2>Application Status Update</h2>
        <p>Dear ${params.applicantName},</p>
        <p>Your application <strong>${params.applicationId}</strong> status has been updated to: <strong>${statusLabel[params.status] ?? params.status}</strong></p>
        ${params.note ? `<p><em>Note from our team: ${params.note}</em></p>` : ""}
        <p>Track your application at <a href="${process.env.NEXT_PUBLIC_APP_URL}/track">visati.ae/track</a></p>
      `,
    });
  } catch (err) {
    console.error("[resend] sendStatusUpdateEmail failed", err);
  }
}

export async function sendAdminNotificationEmail(params: {
  inquiryName: string;
  inquiryEmail: string;
  subject: string;
  message: string;
}): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM,
      to: ADMIN_EMAIL,
      subject: `New Inquiry: ${params.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${params.inquiryName}</p>
        <p><strong>Email:</strong> ${params.inquiryEmail}</p>
        <p><strong>Subject:</strong> ${params.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${params.message}</p>
      `,
    });
  } catch (err) {
    console.error("[resend] sendAdminNotificationEmail failed", err);
  }
}
