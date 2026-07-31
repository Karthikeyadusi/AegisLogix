import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded transition-all focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5 font-semibold',
  };

  const variantStyles = {
    primary:
      'bg-zinc-100 text-zinc-950 hover:bg-white active:bg-zinc-200 border border-transparent shadow-sm',
    secondary:
      'bg-zinc-800 text-zinc-100 hover:bg-zinc-700 active:bg-zinc-800 border border-zinc-700',
    outline:
      'bg-transparent text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700',
    ghost:
      'bg-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 border border-transparent',
    danger:
      'bg-red-950/80 text-red-300 hover:bg-red-900 border border-red-900/60 active:bg-red-950',
  };

  return (
    <button
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
