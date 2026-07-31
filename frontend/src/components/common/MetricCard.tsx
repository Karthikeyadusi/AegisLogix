import type { ReactNode } from 'react';
import { Card } from './Card';
import { cn } from '../../lib/utils';

export interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: ReactNode;
  variant?: 'default' | 'critical' | 'minor' | 'success';
  className?: string;
}

export function MetricCard({
  label,
  value,
  subtext,
  icon,
  variant = 'default',
  className,
}: MetricCardProps) {
  const valueColorStyles = {
    default: 'text-zinc-100',
    critical: 'text-red-400',
    minor: 'text-amber-400',
    success: 'text-emerald-400',
  };

  return (
    <Card className={cn('p-4 flex flex-col justify-between gap-2', className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
          {label}
        </span>
        {icon && <div className="text-zinc-500">{icon}</div>}
      </div>

      <div className="flex items-baseline gap-2">
        <span
          className={cn(
            'text-3xl font-bold font-mono tracking-tight',
            valueColorStyles[variant]
          )}
        >
          {value}
        </span>
      </div>

      {subtext && (
        <span className="text-[11px] text-zinc-500 tracking-wide">
          {subtext}
        </span>
      )}
    </Card>
  );
}
