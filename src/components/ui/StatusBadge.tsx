import { cn } from "@/lib/utils";
import type { ApplicationStatus } from "@/types/db";

const statusConfig: Record<
  ApplicationStatus,
  { label: string; className: string }
> = {
  draft: {
    label: "Draft",
    className: "bg-mist-2 text-muted border border-line",
  },
  submitted: {
    label: "Submitted",
    className: "bg-mist-2 text-ink border border-line",
  },
  reviewing: {
    label: "Under Review",
    className: "bg-info/10 text-info border border-info/20",
  },
  processing: {
    label: "Processing",
    className: "bg-warning/10 text-warning border border-warning/20",
  },
  approved: {
    label: "Approved",
    className: "bg-success/10 text-success border border-success/20",
  },
  rejected: {
    label: "Rejected",
    className: "bg-danger/10 text-danger border border-danger/20",
  },
};

interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.submitted;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium font-sans",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}

interface ChipProps {
  label: string;
  variant?: "popular" | "entry" | "duration" | "verified";
  className?: string;
}

const chipVariants: Record<NonNullable<ChipProps["variant"]>, string> = {
  popular: "bg-blue text-white",
  entry: "bg-mist-2 text-ink border border-line",
  duration: "bg-mist-2 text-ink border border-line",
  verified: "bg-success/10 text-success border border-success/20",
};

export function Chip({
  label,
  variant = "entry",
  className,
}: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium font-sans",
        chipVariants[variant],
        className
      )}
    >
      {label}
    </span>
  );
}
