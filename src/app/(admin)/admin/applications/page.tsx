import { Suspense } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ApplicationsList } from "@/components/admin/ApplicationsList";
import { NewApplicationButton } from "@/components/admin/NewApplicationButton";

export const metadata = { title: "Applications" };

export default function AdminApplicationsPage() {
  return (
    <>
      <AdminPageHeader
        title="Applications"
        subtitle="142 total · 23 awaiting action"
        action={<NewApplicationButton />}
      />
      <Suspense>
        <ApplicationsList />
      </Suspense>
    </>
  );
}
