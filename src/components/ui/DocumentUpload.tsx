"use client";

import { cn } from "@/lib/utils";
import { FileText, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

interface DocumentUploadProps {
  label: string;
  required?: boolean;
  onFile: (file: File | null) => void;
  currentFile?: File | null;
  error?: string;
  className?: string;
}

export function DocumentUpload({
  label,
  required,
  onFile,
  currentFile,
  error,
  className,
}: DocumentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  function validate(file: File): string | null {
    if (!ALLOWED_TYPES.includes(file.type))
      return "Only PDF, JPG, or PNG files are allowed.";
    if (file.size > MAX_SIZE_BYTES)
      return `File is too large. Maximum size is 5 MB.`;
    return null;
  }

  function handleFile(file: File) {
    const err = validate(file);
    if (err) {
      setLocalError(err);
      return;
    }
    setLocalError(null);
    onFile(file);
  }

  const displayError = localError ?? error;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="text-xs font-medium uppercase tracking-[0.06em] text-muted font-sans">
        {label}
        {required && <span className="text-danger ml-1">*</span>}
      </label>

      {currentFile ? (
        <div className="flex items-center gap-3 rounded-lg border border-line bg-mist p-3">
          <FileText className="h-5 w-5 text-blue flex-shrink-0" />
          <span className="flex-1 text-sm text-ink font-sans truncate">
            {currentFile.name}
          </span>
          <span className="text-xs text-muted font-sans">
            {(currentFile.size / 1024).toFixed(0)} KB
          </span>
          <button
            type="button"
            onClick={() => {
              onFile(null);
              setLocalError(null);
            }}
            className="text-muted hover:text-danger transition-colors"
            aria-label="Remove file"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors cursor-pointer",
            dragOver ? "border-blue bg-blue/5" : "border-line hover:border-blue/40",
            displayError && "border-danger"
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className={cn("h-6 w-6", dragOver ? "text-blue" : "text-muted")} />
          <p className="text-sm text-ink font-sans text-center">
            <span className="text-blue font-medium">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-muted font-sans">PDF, JPG, PNG — max 5 MB</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {displayError && (
        <p className="text-xs text-danger font-sans">{displayError}</p>
      )}
    </div>
  );
}
