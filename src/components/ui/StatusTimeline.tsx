import { cn } from "@/lib/utils";
import type { ApplicationStatus, StatusHistory } from "@/types/db";
import { CheckCircle, Circle, Clock, XCircle } from "lucide-react";

const STEPS: { status: ApplicationStatus; label: string }[] = [
  { status: "submitted", label: "Submitted" },
  { status: "reviewing", label: "Under Review" },
  { status: "processing", label: "Processing" },
  { status: "approved", label: "Decision" },
];

const STATUS_ORDER: Record<ApplicationStatus, number> = {
  draft: -1,
  submitted: 0,
  reviewing: 1,
  processing: 2,
  approved: 3,
  rejected: 3,
};

function StepIcon({
  currentStatus,
  stepStatus,
  isFinal,
  isRejected,
}: {
  currentStatus: ApplicationStatus;
  stepStatus: ApplicationStatus;
  isFinal: boolean;
  isRejected: boolean;
}) {
  const currentOrder = STATUS_ORDER[currentStatus];
  const stepOrder = STATUS_ORDER[stepStatus];

  if (isFinal && isRejected && currentOrder >= stepOrder) {
    return <XCircle className="h-5 w-5 text-danger" />;
  }
  if (currentOrder > stepOrder) {
    return <CheckCircle className="h-5 w-5 text-success" />;
  }
  if (currentOrder === stepOrder) {
    return <Clock className="h-5 w-5 text-gold" />;
  }
  return <Circle className="h-5 w-5 text-line" />;
}

interface StatusTimelineProps {
  currentStatus: ApplicationStatus;
  history?: StatusHistory[];
  className?: string;
}

export function StatusTimeline({
  currentStatus,
  history = [],
  className,
}: StatusTimelineProps) {
  const isRejected = currentStatus === "rejected";
  const currentOrder = STATUS_ORDER[currentStatus];

  return (
    <div className={cn("w-full", className)}>
      {/* Desktop — horizontal */}
      <div className="hidden md:flex items-start justify-between relative">
        <div className="absolute top-5 left-0 right-0 h-px bg-line" />
        {STEPS.map((step, i) => {
          const stepOrder = STATUS_ORDER[step.status];
          const isPast = currentOrder > stepOrder;
          const isActive = currentOrder === stepOrder;
          const isFinal = i === STEPS.length - 1;
          return (
            <div
              key={step.status}
              className="flex flex-col items-center gap-2 relative z-10"
            >
              <div
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center bg-white border-2",
                  isPast && "border-success",
                  isActive && "border-gold",
                  !isPast && !isActive && "border-line"
                )}
              >
                <StepIcon
                  currentStatus={currentStatus}
                  stepStatus={step.status}
                  isFinal={isFinal}
                  isRejected={isRejected}
                />
              </div>
              <span
                className={cn(
                  "text-sm font-sans font-medium whitespace-nowrap",
                  isActive && "text-gold",
                  isPast && "text-ink",
                  !isPast && !isActive && "text-muted"
                )}
              >
                {isFinal && isRejected ? "Rejected" : step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile — vertical */}
      <div className="flex md:hidden flex-col gap-0">
        {STEPS.map((step, i) => {
          const stepOrder = STATUS_ORDER[step.status];
          const isPast = currentOrder > stepOrder;
          const isActive = currentOrder === stepOrder;
          const isFinal = i === STEPS.length - 1;
          const historyEntry = history.find(
            (h) =>
              h.status === step.status ||
              (isFinal &&
                isRejected &&
                h.status === "rejected")
          );
          return (
            <div key={step.status} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center bg-white border-2",
                    isPast && "border-success",
                    isActive && "border-gold",
                    !isPast && !isActive && "border-line"
                  )}
                >
                  <StepIcon
                    currentStatus={currentStatus}
                    stepStatus={step.status}
                    isFinal={isFinal}
                    isRejected={isRejected}
                  />
                </div>
                {!isFinal && (
                  <div
                    className={cn(
                      "w-px flex-1 min-h-[32px]",
                      isPast ? "bg-success" : "bg-line"
                    )}
                  />
                )}
              </div>
              <div className="pb-6">
                <p
                  className={cn(
                    "font-sans font-medium text-sm",
                    isActive && "text-gold",
                    isPast && "text-ink",
                    !isPast && !isActive && "text-muted"
                  )}
                >
                  {isFinal && isRejected ? "Rejected" : step.label}
                </p>
                {historyEntry && (
                  <p className="text-xs text-muted font-sans mt-0.5">
                    {new Date(historyEntry.created_at).toLocaleDateString(
                      "en-AE",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                    {historyEntry.note && (
                      <span className="block mt-0.5 italic">
                        {historyEntry.note}
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
