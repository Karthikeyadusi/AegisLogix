import React, { useState, useRef } from 'react';
import { Upload, AlertCircle, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface DropzoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  isBackendReady?: boolean;
  className?: string;
}

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function Dropzone({
  onFileSelect,
  disabled = false,
  isBackendReady = true,
  className,
}: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcess = (file: File) => {
    setValidationError(null);

    if (!file.type.startsWith('image/')) {
      setValidationError('Invalid format. Only JPEG, PNG, or WebP container imagery is accepted.');
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setValidationError(
        `File size (${sizeMb} MB) exceeds maximum allowed limit of ${MAX_FILE_SIZE_MB} MB.`
      );
      return;
    }

    onFileSelect(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndProcess(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndProcess(file);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-label="Upload Container Imagery Dropzone"
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        className={cn(
          'relative aspect-video rounded-md border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center p-8 text-center cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-zinc-400',
          isDragging
            ? 'border-zinc-400 bg-zinc-900/80'
            : 'border-[var(--color-border-medium)] bg-[var(--color-surface-panel)] hover:border-zinc-600 hover:bg-zinc-900/50',
          disabled && 'opacity-50 pointer-events-none cursor-not-allowed'
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          tabIndex={-1}
        />

        {/* Industrial Container SVG Icon */}
        <div className="w-16 h-16 mb-4 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
          <Upload className="w-7 h-7" />
        </div>

        <h3 className="text-base font-semibold text-zinc-100 mb-1">
          Upload Container Inspection Photo
        </h3>

        <p className="text-xs text-zinc-400 max-w-sm leading-relaxed mb-6">
          Drag and drop container inspection imagery or click to select a local file.
        </p>

        <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
          <span>JPG</span>
          <span>•</span>
          <span>PNG</span>
          <span>•</span>
          <span>WEBP</span>
          <span>•</span>
          <span>MAX 10MB</span>
        </div>
      </div>

      {!isBackendReady && (
        <div className="p-3 bg-amber-950/30 border border-amber-900/40 rounded flex items-start gap-2.5 text-xs text-amber-300">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
          <span>
            Backend hosted on free-tier infrastructure. Initial inspection request may take 15-30s if process is waking up from sleep.
          </span>
        </div>
      )}

      {validationError && (
        <div className="p-3 bg-red-950/40 border border-red-900/50 rounded flex items-start gap-2.5 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
          <span>{validationError}</span>
        </div>
      )}
    </div>
  );
}
