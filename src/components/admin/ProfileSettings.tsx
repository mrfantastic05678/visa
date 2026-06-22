"use client";

import { CURRENT_USER } from "@/lib/admin-sample-data";
import { Avatar } from "./ui";
import { Check } from "lucide-react";
import { useState } from "react";

const ROLES = ["Visa Consultant", "Senior Consultant", "Team Lead", "Administrator"];

export function ProfileSettings() {
  const [name, setName] = useState(CURRENT_USER.name);
  const [email, setEmail] = useState(CURRENT_USER.email);
  const [role, setRole] = useState(CURRENT_USER.role);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const input =
    "w-full h-10 px-3 rounded-lg border border-line bg-white text-sm font-sans text-navy focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue";
  const label = "block text-sm font-sans font-semibold text-ink mb-1.5";

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="bg-white rounded-xl border border-line shadow-sm overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-line">
        <h2 className="font-display font-semibold text-navy">Profile</h2>
      </div>
      <div className="p-6 space-y-5">
        <div className="flex items-center gap-4">
          <Avatar initials={CURRENT_USER.initials} className="h-14 w-14 text-lg flex-shrink-0" />
          <div>
            <p className="font-sans font-semibold text-ink">{name}</p>
            <p className="text-sm text-muted font-sans">{role}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>Full Name</label>
            <input className={input} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className={label}>Work Email</label>
            <input className={input} value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className={label}>Role</label>
            <select className={`${input} appearance-none`} value={role} onChange={(e) => setRole(e.target.value)}>
              {ROLES.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <p className="text-sm font-sans font-semibold text-ink">Notifications</p>
          <label className="flex items-center justify-between gap-3 py-2">
            <span className="text-sm font-sans text-ink">Email alerts for new applications</span>
            <input type="checkbox" checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} className="h-4 w-4 rounded border-line accent-blue" />
          </label>
          <label className="flex items-center justify-between gap-3 py-2">
            <span className="text-sm font-sans text-ink">WhatsApp alerts for client replies</span>
            <input type="checkbox" checked={whatsappAlerts} onChange={(e) => setWhatsappAlerts(e.target.checked)} className="h-4 w-4 rounded border-line accent-blue" />
          </label>
        </div>

        <button
          onClick={save}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-blue text-white text-sm font-semibold font-sans hover:bg-blue-hover transition-colors"
        >
          {saved && <Check className="h-4 w-4" />}
          {saved ? "Saved" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
