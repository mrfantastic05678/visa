"use client";

import { useEffect, useState } from "react";

interface NavCounts {
  applications: number | null;
  inquiries: number | null;
  pendingUsers: number | null;
}

/** Real sidebar badge counts, fetched once per admin session. */
export function useNavCounts(): NavCounts {
  const [counts, setCounts] = useState<NavCounts>({
    applications: null,
    inquiries: null,
    pendingUsers: null,
  });

  useEffect(() => {
    fetch("/api/admin/dashboard-stats")
      .then((r) => r.json())
      .then((d) =>
        setCounts({
          applications: d.totalApplications ?? null,
          inquiries: d.totalInquiries ?? null,
          pendingUsers: d.pendingUsers ?? null,
        })
      )
      .catch(() => {});
  }, []);

  return counts;
}
