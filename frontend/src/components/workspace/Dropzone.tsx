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
      setValidationError('Invalid format. Accepted types: JPEG, PNG, or WebP.');
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
        aria-label="Upload Container Image Dropzone"
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        className={cn(
          'relative aspect-video rounded-lg border-2 border-dashed transition-all duration-150 flex flex-col items-center justify-center p-8 text-center cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-zinc-400',
          isDragging
            ? 'border-zinc-400 bg-zinc-900/80'
            : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/60',
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

        {/* Industrial Upload Wireframe Icon */}
        <div className="w-12 h-12 mb-3 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
          <Upload className="w-5 h-5" />
        </div>

        <h3 className="text-sm font-semibold text-zinc-100 mb-1">
          Drop image here <span className="text-zinc-400 font-normal">or</span> <span className="underline underline-offset-2 text-zinc-200">click to browse</span>
        </h3>

        <div className="flex items-center gap-2.5 text-[11px] font-mono text-zinc-400 uppercase tracking-wider mt-2">
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
        <div className="p-3 bg-amber-950/30 border border-amber-900/40 rounded-md flex items-start gap-2.5 text-xs text-amber-300">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
          <span>
            Backend initializing. Initial request may take 15-30s if process is waking up from sleep.
          </span>
        </div>
      )}

      {validationError && (
        <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-md flex items-start gap-2.5 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
          <span>{validationError}</span>
        </div>
      )}
    </div>
  );
}
