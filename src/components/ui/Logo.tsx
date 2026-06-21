import { cn } from "@/lib/utils";

interface LogoProps {
  /** "light" for dark backgrounds (white wordmark), "dark" for light backgrounds (navy wordmark). */
  variant?: "light" | "dark";
  /** Show the "Dubai Visas. Simplified." tagline beneath the wordmark. */
  showTagline?: boolean;
  className?: string;
}

/**
 * Visati paper-plane brand mark + "VISATI" wordmark.
 * Geometry and colours come from the design asset (Visati Logo.dc.html):
 * body #0057FF, top facet #3D7BFF, fold tab #0042C4. Wordmark in Montserrat.
 */
function PaperPlane({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 191.5 267"
      className={className}
      style={{ overflow: "visible" }}
      aria-hidden="true"
    >
      {/* light top facet */}
      <path
        d="M 191.5 65 L 0 133.5 L 0.5 56.5 L 118.5 0 L 191.5 0 L 191.5 65 Z"
        fill="#3D7BFF"
      />
      {/* main body */}
      <path
        transform="translate(0,101)"
        d="M 0 166 L 0 32 L 89 0 L 137 10 C 74.6 52.4 19.667 131.667 0 166 Z"
        fill="#0057FF"
      />
      {/* dark fold tab */}
      <path
        transform="translate(0,101)"
        d="M 137 10 L 0 32.5 L 90 0 L 137 10 Z"
        fill="#0042C4"
      />
    </svg>
  );
}

export function Logo({
  variant = "light",
  showTagline = false,
  className,
}: LogoProps) {
  const wordmarkColor = variant === "light" ? "text-white" : "text-navy";

  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <PaperPlane className="h-8 w-auto flex-shrink-0" />

      <span className="flex flex-col leading-none min-w-0">
        <span
          className={cn(
            "font-brand font-bold text-xl tracking-[0.04em] leading-none",
            wordmarkColor
          )}
        >
          VISATI
        </span>
        {showTagline && (
          <span
            className={cn(
              "font-sans font-medium text-[10px] tracking-wide mt-1 whitespace-nowrap",
              variant === "light" ? "text-white/70" : "text-muted"
            )}
          >
            Dubai Visas. Simplified.
          </span>
        )}
      </span>
    </span>
  );
}
