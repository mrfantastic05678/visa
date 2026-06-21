import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";
import Link from "next/link";

interface Step5Props {
  applicationId: string;
}

export function Step5Success({ applicationId }: Step5Props) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md rounded-2xl border border-line bg-white p-8 text-center">
        {/* Checkmark icon */}
        <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-success/10 flex items-center justify-center">
          <Check className="h-8 w-8 text-success" strokeWidth={3} />
        </div>

        {/* Heading */}
        <h2 className="font-display font-bold text-3xl text-ink mb-3">
          Application submitted.
        </h2>
        <p className="text-sm font-sans text-muted leading-relaxed mb-6">
          We&apos;ve received your application. You&apos;ll get a confirmation
          email within minutes and WhatsApp updates at every stage.
        </p>

        {/* Application ID box */}
        <div className="rounded-xl bg-mist border border-line px-6 py-5 mb-6">
          <p className="text-[11px] font-sans font-semibold uppercase tracking-wider text-muted mb-2">
            Your Application ID
          </p>
          <p className="font-mono text-xl font-bold text-ink tracking-wider">
            {applicationId}
          </p>
          <p className="text-xs font-sans text-muted mt-2">
            Keep this safe to track your application.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <Link href={`/track?id=${applicationId}`} className="flex-1">
            <Button variant="primary" size="md" className="w-full">
              Track Application
            </Button>
          </Link>
          <Button variant="secondary" size="md" className="flex-1">
            Download Receipt
          </Button>
        </div>

        {/* Expected decision */}
        <p className="text-xs font-sans text-muted">
          Expected decision by{" "}
          <span className="font-medium text-ink">Wed, 29 Feb 2026</span>
        </p>
      </div>
    </div>
  );
}
