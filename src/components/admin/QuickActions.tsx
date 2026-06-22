"use client";

import { QUICK_ACTIONS } from "@/lib/admin-sample-data";
import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";

export function QuickActions() {
  const [toast, setToast] = useState<string | null>(null);

  function run(action: string) {
    setToast(action);
    window.clearTimeout((run as unknown as { _t?: number })._t);
    (run as unknown as { _t?: number })._t = window.setTimeout(() => setToast(null), 2200);
  }

  return (
    <div className="bg-white rounded-xl border border-line p-5 relative">
      <h3 className="font-display font-bold text-navy mb-3">Quick actions</h3>
      <div className="space-y-1">
        {QUICK_ACTIONS.map((q) => (
          <button
            key={q}
            onClick={() => run(q)}
            className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-sans text-ink hover:bg-mist transition-colors text-left"
          >
            {q}
            <ArrowRight className="h-4 w-4 text-muted flex-shrink-0" />
          </button>
        ))}
      </div>

      {toast && (
        <div className="absolute left-4 right-4 -bottom-3 translate-y-full z-10 flex items-center gap-2 rounded-lg bg-navy text-white px-4 py-2.5 shadow-lg text-sm font-sans">
          <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
          <span className="truncate">{toast} — done</span>
        </div>
      )}
    </div>
  );
}
