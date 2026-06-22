import { Logo } from "@/components/ui/Logo";
import { Check } from "lucide-react";

interface AuthShellProps {
  /** Left-panel eyebrow, e.g. "INTERNAL" or "JOIN THE TEAM". */
  eyebrow: string;
  /** Large left-panel heading (can include line breaks via \n). */
  heading: string;
  /** Supporting paragraph under the heading. */
  blurb: string;
  /** Optional checklist bullets (sign-up). */
  bullets?: string[];
  /** Mobile navy-header title + subtitle. */
  mobileTitle: string;
  mobileSubtitle: string;
  /** Heading shown above the form card. */
  formTitle: string;
  formSubtitle: string;
  children: React.ReactNode;
}

export function AuthShell({
  eyebrow,
  heading,
  blurb,
  bullets,
  mobileTitle,
  mobileSubtitle,
  formTitle,
  formSubtitle,
  children,
}: AuthShellProps) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2 bg-mist">
      {/* Left panel (desktop) */}
      <div className="hidden lg:flex relative flex-col justify-between bg-navy px-14 py-12 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(ellipse at 20% 20%, #0057FF33 0%, transparent 60%)",
          }}
        />
        <div className="relative">
          <Logo variant="light" showTagline />
        </div>
        <div className="relative max-w-md">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue font-sans mb-4">
            {eyebrow}
          </p>
          <h1 className="font-display font-bold text-5xl text-white leading-[1.05] whitespace-pre-line">
            {heading}
          </h1>
          <p className="mt-5 text-white/60 font-sans leading-relaxed">{blurb}</p>
          {bullets && (
            <ul className="mt-7 space-y-3">
              {bullets.map((b) => (
                <li key={b} className="flex items-center gap-3 text-sm text-white/80 font-sans">
                  <span className="h-5 w-5 rounded-full bg-blue grid place-items-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          )}
        </div>
        <p className="relative text-xs text-white/30 font-sans">
          © {new Date().getFullYear()} Visati Visa Services · v3.18.2
        </p>
      </div>

      {/* Mobile navy header */}
      <div className="lg:hidden bg-navy px-6 pt-10 pb-8 text-center">
        <div className="flex justify-center mb-3">
          <Logo variant="light" />
        </div>
        <h1 className="font-display font-bold text-2xl text-white">{mobileTitle}</h1>
        <p className="text-sm text-white/50 font-sans mt-1">{mobileSubtitle}</p>
      </div>

      {/* Right / form panel */}
      <div className="flex items-start lg:items-center justify-center px-5 lg:px-14 -mt-6 lg:mt-0 pb-12">
        <div className="w-full max-w-md bg-white rounded-2xl border border-line shadow-xl p-7 lg:p-9">
          <h2 className="font-display font-bold text-2xl text-navy">{formTitle}</h2>
          <p className="text-sm text-muted font-sans mt-1 mb-6">{formSubtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
