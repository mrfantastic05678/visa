"use client";

import { useEffect, useState } from "react";

/**
 * Reads the `visati-preview-role` cookie (set by LoginForm's demo mode).
 * Returns "admin" | "consultant" | null.
 */
export function usePreviewRole() {
  const [role, setRole] = useState<"admin" | "consultant" | null>(null);

  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)visati-preview-role=(admin|consultant)/);
    setRole(match ? (match[1] as "admin" | "consultant") : null);
  }, []);

  return role;
}
