"use client";

import { VisaPricingRow } from "./VisaPricingRow";
import { SAMPLE_VISA_TYPES } from "@/lib/sample-visas";
import { useEffect, useState } from "react";
import { Lock } from "lucide-react";

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : undefined;
}

export function VisaPricingSection() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setRole(getCookie("visati-preview-role") ?? "consultant");
  }, []);

  const list = [...SAMPLE_VISA_TYPES].sort((a, b) => a.sort_order - b.sort_order);

  if (role === null) return null; // hydrating

  if (role !== "admin") {
    return (
      <div className="bg-white rounded-xl border border-line shadow-sm p-8 flex flex-col items-center text-center">
        <div className="h-12 w-12 rounded-full bg-mist grid place-items-center mb-3">
          <Lock className="h-5 w-5 text-muted" />
        </div>
        <p className="font-display font-semibold text-navy">Visa Pricing</p>
        <p className="text-sm text-muted font-sans mt-1 max-w-xs">
          Pricing configuration is restricted to the Administrator. Contact Mariam Khalid to update prices.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-line shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-line">
        <h2 className="font-display font-semibold text-navy">Visa Pricing</h2>
        <p className="text-xs text-muted font-sans mt-0.5">Set here (stored in the database) — not in Sanity.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-mist text-left">
              <th className="px-5 py-3 font-sans font-semibold text-muted text-xs uppercase tracking-wide">Visa Type</th>
              <th className="px-5 py-3 font-sans font-semibold text-muted text-xs uppercase tracking-wide">Standard Price</th>
              <th className="px-5 py-3 font-sans font-semibold text-muted text-xs uppercase tracking-wide">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {list.map((visa) => (
              <VisaPricingRow key={visa.id} visa={visa} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
