"use client";

import type { VisaType } from "@/types/db";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { inputClasses } from "@/components/ui/FormInput";
import { cn } from "@/lib/utils";

export function VisaPricingRow({ visa }: { visa: VisaType }) {
  const [price, setPrice] = useState(visa.standard_price_aed);
  const [active, setActive] = useState(visa.is_active);
  // Local baseline so saving works optimistically in the UI-first phase.
  const [savedPrice, setSavedPrice] = useState(visa.standard_price_aed);
  const [savedActive, setSavedActive] = useState(visa.is_active);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const dirty = price !== savedPrice || active !== savedActive;

  async function save() {
    setLoading(true);
    setSaved(false);
    // Best-effort persist; succeeds locally even without a backend (UI-first).
    try {
      await fetch(`/api/admin/visa-types/${visa.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ standard_price_aed: price, is_active: active }),
      }).catch(() => null);
    } finally {
      setSavedPrice(price);
      setSavedActive(active);
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  return (
    <tr className="hover:bg-mist transition-colors">
      <td className="px-5 py-3.5">
        <p className="font-sans text-ink font-medium">{visa.name}</p>
        <p className="font-mono text-xs text-muted">{visa.slug}</p>
      </td>
      <td className="px-5 py-3.5 whitespace-nowrap">
        <div className="inline-flex items-center gap-1.5">
          <span className="text-xs text-muted font-sans">AED</span>
          <input
            type="number"
            value={price}
            min={0}
            onChange={(e) => setPrice(Number(e.target.value))}
            className={cn(inputClasses, "w-24 h-9 px-2 text-sm")}
          />
        </div>
      </td>
      <td className="px-5 py-3.5">
        <button
          onClick={() => setActive((a) => !a)}
          className={
            "px-3 py-1.5 rounded-lg text-xs font-sans font-medium whitespace-nowrap transition-colors " +
            (active
              ? "bg-success/10 text-success border border-success/20"
              : "bg-mist-2 text-muted border border-line")
          }
        >
          {active ? "Active" : "Inactive"}
        </button>
      </td>
      <td className="px-5 py-3.5 text-right">
        <button
          onClick={save}
          disabled={!dirty || loading}
          className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-blue text-white text-sm font-sans font-semibold hover:bg-blue-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {saved ? "Saved" : "Save"}
        </button>
      </td>
    </tr>
  );
}
