import { VisaTypesClient } from "@/components/VisaTypesClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UAE Visa Types & Prices",
  description:
    "Browse all UAE visa types — tourist, transit, multi-entry, and GCC visas. Compare prices and apply online in minutes.",
};

export default function VisaTypesPage() {
  return <VisaTypesClient />;
}
