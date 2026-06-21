"use client";

import { cn } from "@/lib/utils";
import { forwardRef, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

/** Shared input field classes — reuse across all forms for consistency. */
export const inputClasses = cn(
  "h-11 w-full rounded-lg border px-4 text-ink font-sans text-sm transition-colors",
  "bg-white border-line",
  "placeholder:text-muted/60",
  "focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/20",
  "disabled:opacity-50 disabled:cursor-not-allowed"
);

export const selectClasses = cn(
  inputClasses,
  "appearance-none pr-10",
  "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')]",
  "bg-[length:20px] bg-[right_12px_center] bg-no-repeat"
);

export const textareaClasses = cn(
  "w-full rounded-lg border px-4 py-3 text-ink font-sans text-sm transition-colors resize-none",
  "bg-white border-line",
  "placeholder:text-muted/60",
  "focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/20",
  "disabled:opacity-50 disabled:cursor-not-allowed"
);

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-xs font-medium uppercase tracking-[0.06em] text-muted font-sans"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={cn(
            inputClasses,
            error && "border-danger focus:border-danger focus:ring-danger/20",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-danger font-sans">{error}</p>
        )}
        {!error && hint && (
          <p className="text-xs text-muted font-sans">{hint}</p>
        )}
      </div>
    );
  }
);
FormInput.displayName = "FormInput";

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const FormTextarea = forwardRef<
  HTMLTextAreaElement,
  FormTextareaProps
>(({ label, error, hint, className, id, ...props }, ref) => {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-xs font-medium uppercase tracking-[0.06em] text-muted font-sans"
      >
        {label}
      </label>
      <textarea
        ref={ref}
        id={inputId}
        className={cn(
          textareaClasses,
          error && "border-danger focus:border-danger focus:ring-danger/20",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-danger font-sans">{error}</p>}
      {!error && hint && <p className="text-xs text-muted font-sans">{hint}</p>}
    </div>
  );
});
FormTextarea.displayName = "FormTextarea";

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, hint, options, className, id, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-xs font-medium uppercase tracking-[0.06em] text-muted font-sans"
        >
          {label}
        </label>
        <select
          ref={ref}
          id={inputId}
          className={cn(
            selectClasses,
            error && "border-danger focus:border-danger focus:ring-danger/20",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-danger font-sans">{error}</p>}
        {!error && hint && <p className="text-xs text-muted font-sans">{hint}</p>}
      </div>
    );
  }
);
FormSelect.displayName = "FormSelect";
