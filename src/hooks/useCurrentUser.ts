"use client";

import { usePreviewRole } from "./usePreviewRole";
import { ADMINISTRATOR, STAFF_USERS } from "@/lib/admin-users";

const USERS_BY_ROLE = {
  admin: { name: "Mariam Khalid", role: "Administrator", initials: "MK", email: "mariam@visati.ae" },
  consultant: { name: "Aisha Bahar", role: "Senior Consultant", initials: "AB", email: "aisha@visati.ae" },
};

/**
 * Returns the current user profile based on the demo account role.
 * Falls back to consultant (Aisha) if role is not set.
 */
export function useCurrentUser() {
  const role = usePreviewRole();
  return USERS_BY_ROLE[role ?? "consultant"];
}
