import { Shield } from 'lucide-react';

export interface HeaderProps {
  isReady: boolean;
  statusText: string;
  version: string | null;
}

export function Header({ isReady, statusText, version }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-border-subtle)] bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-900 border border-zinc-800 rounded">
            <Shield className="w-5 h-5 text-zinc-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-zinc-100 text-base">
                AegisLogix
              </span>
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                {version ? `v${version}` : 'v2.0.0'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              Industrial Container Inspection Platform
            </p>
          </div>
        </div>

        {/* Live Backend Readiness Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded">
            <div
              className={`w-2 h-2 rounded-full ${
                isReady
                  ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                  : 'bg-amber-400'
              }`}
            />
            <span className="text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider">
              {statusText}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
