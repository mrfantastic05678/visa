import { cn } from "@/lib/utils";
import { AE, AU, CA, CN, DE, FR, GB, IN, IT, JP, KR, SA, SG, US } from "country-flag-icons/react/3x2";
import {
  STATUS_LABEL,
  INQUIRY_STATUS_LABEL,
  DOC_STATUS_LABEL,
  type AdminAppStatus,
  type InquiryStatus,
  type DocStatus,
} from "@/lib/admin-sample-data";

/* Explicit flag map — avoids star-importing 250+ components into the bundle
   (the barrel import was the source of the Turbopack runtime error). */
const FLAGS: Record<string, React.ComponentType<{ className?: string; title?: string }>> = {
  AE, AU, CA, CN, DE, FR, GB, IN, IT, JP, KR, SA, SG, US,
};

export function FlagIcon({ country, className }: { country: string; className?: string }) {
  const Flag = FLAGS[country.toUpperCase()];
  if (!Flag) {
    return <span className={cn("inline-block rounded-[2px] bg-mist-2", className)} />;
  }
  return <Flag className={cn("rounded-[2px] ring-1 ring-black/5", className)} title={country} />;
}

export function Avatar({
  initials,
  src,
  color = "bg-navy",
  className,
}: {
  initials: string;
  src?: string | null;
  color?: string;
  className?: string;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={initials}
        className={cn("inline-block rounded-full object-cover", className)}
      />
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full text-white font-semibold font-sans",
        color,
        className
      )}
    >
      {initials}
    </span>
  );
}

const appStatusStyles: Record<AdminAppStatus, string> = {
  submitted: "bg-mist-2 text-ink",
  reviewing: "bg-amber-50 text-amber-600",
  processing: "bg-gold/10 text-gold",
  approved: "bg-emerald-50 text-emerald-600",
  rejected: "bg-red-50 text-red-500",
};

export function AppStatusBadge({ status, className }: { status: AdminAppStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium font-sans whitespace-nowrap",
        appStatusStyles[status],
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {STATUS_LABEL[status]}
    </span>
  );
}

const inquiryStyles: Record<InquiryStatus, string> = {
  new: "bg-gold/10 text-gold",
  replied: "bg-emerald-50 text-emerald-600",
  closed: "bg-mist-2 text-muted",
};

export function InquiryBadge({ status }: { status: InquiryStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium font-sans whitespace-nowrap",
        inquiryStyles[status]
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {INQUIRY_STATUS_LABEL[status]}
    </span>
  );
}

const docStyles: Record<DocStatus, string> = {
  verified: "bg-emerald-50 text-emerald-600",
  pending: "bg-gold/10 text-gold",
  rejected: "bg-red-50 text-red-500",
};

export function DocBadge({ status }: { status: DocStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium font-sans whitespace-nowrap",
        docStyles[status]
      )}
    >
      {DOC_STATUS_LABEL[status]}
    </span>
  );
}
