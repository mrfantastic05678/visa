"use client";

import { Avatar } from "./ui";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Camera, Check, Trash2, Upload } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const ROLES = ["Visa Consultant", "Senior Consultant", "Team Lead", "Administrator"];
const STORAGE_KEY = "visati-admin-avatar";

function getSavedAvatar(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function ProfileSettings() {
  const currentUser = useCurrentUser();
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [role, setRole] = useState(currentUser.role);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [saved, setSaved] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [ uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAvatarSrc(getSavedAvatar());
  }, []);

  const input =
    "w-full h-10 px-3 rounded-lg border border-line bg-white text-sm font-sans text-navy focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue";
  const label = "block text-sm font-sans font-semibold text-ink mb-1.5";

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setAvatarSrc(result);
      try {
        localStorage.setItem(STORAGE_KEY, result);
      } catch {
        // localStorage full — silently ignore
      }
      setUploading(false);
    };
    reader.readAsDataURL(file);

    // Reset input so the same file can be re-selected
    e.target.value = "";
  }

  function removeAvatar() {
    setAvatarSrc(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

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
        {/* Avatar upload */}
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Avatar
              initials={currentUser.initials}
              src={avatarSrc}
              className="h-16 w-16 text-xl flex-shrink-0"
            />
            {/* Overlay on hover */}
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute inset-0 rounded-full bg-navy/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:opacity-50"
            >
              {uploading ? (
                <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera className="h-5 w-5 text-white" />
              )}
            </button>
          </div>

          <div className="min-w-0">
            <p className="font-sans font-semibold text-ink">{name}</p>
            <p className="text-sm text-muted font-sans">{role}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-blue hover:underline cursor-pointer disabled:opacity-50"
              >
                <Upload className="h-3 w-3" />
                {avatarSrc ? "Change photo" : "Upload photo"}
              </button>
              {avatarSrc && (
                <button
                  onClick={removeAvatar}
                  className="inline-flex items-center gap-1 text-xs font-sans font-medium text-red-500 hover:underline cursor-pointer"
                >
                  <Trash2 className="h-3 w-3" />
                  Remove
                </button>
              )}
            </div>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
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
