import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ApplicationDetailClient } from "@/components/admin/ApplicationDetailClient";
import { FlagIcon } from "@/components/admin/ui";
import { APPLICATIONS } from "@/lib/admin-sample-data";
import { notFound } from "next/navigation";

export default async function ApplicationDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const app = APPLICATIONS.find((a) => a.id === id);
  if (!app) notFound();

  return (
    <>
      <AdminPageHeader
        title={app.applicant}
        subtitle={`${app.id} · Submitted ${app.submittedTime} GST`}
        action={
          <>
            <FlagIcon country={app.country} className="h-5 w-7 flex-shrink-0 hidden lg:block" />
          </>
        }
      />
      <ApplicationDetailClient app={app} />
    </>
  );
}
