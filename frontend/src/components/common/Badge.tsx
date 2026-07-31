import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'critical' | 'minor' | 'online' | 'mono';
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  className,
}: BadgeProps) {
  const variantStyles = {
    default: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    critical:
      'bg-[var(--color-severity-critical-bg)] text-[var(--color-severity-critical-text)] border-[var(--color-severity-critical-border)]',
    minor:
      'bg-[var(--color-severity-minor-bg)] text-[var(--color-severity-minor-text)] border-[var(--color-severity-minor-border)]',
    online:
      'bg-[var(--color-status-online-bg)] text-[var(--color-status-online-text)] border-emerald-900/50',
    mono: 'bg-zinc-900 text-zinc-400 border-zinc-800 font-mono text-[11px]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium border transition-colors',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
