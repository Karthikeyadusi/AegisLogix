import { Shield } from 'lucide-react';

export interface HeaderProps {
  isReady: boolean;
  statusText: string;
  version: string | null;
}

export function Header({ isReady, statusText, version }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-zinc-900 border border-zinc-800 rounded">
            <Shield className="w-4 h-4 text-zinc-100" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tight text-zinc-100 text-sm">
              AegisLogix
            </span>
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800">
              {version ? `v${version}` : 'v2.0.0'}
            </span>
            <span className="text-xs text-zinc-400 hidden md:inline">
              • Industrial Inspection Dashboard
            </span>
          </div>
        </div>

        {/* Live Backend Status Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded">
            <div
              className={`w-2 h-2 rounded-full ${
                isReady
                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                  : 'bg-amber-400'
              }`}
            />
            <span className="text-[11px] font-mono font-medium text-zinc-300 uppercase tracking-wider">
              {statusText}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
