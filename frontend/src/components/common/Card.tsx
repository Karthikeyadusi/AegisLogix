import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

export interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-surface-panel)] text-zinc-200 overflow-hidden',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'p-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)] flex items-center justify-between gap-4',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className }: CardProps) {
  return <div className={cn('p-4', className)}>{children}</div>;
}
