import { Shield } from 'lucide-react';

export interface HeaderProps {
  isReady: boolean;
  statusText: string;
  version: string | null;
}

export function Header({ isReady, statusText }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-md flex items-center justify-center">
            <Shield className="w-4 h-4 text-zinc-100" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tight text-zinc-100 text-sm">
              AegisLogix
            </span>
            <span className="text-xs text-zinc-400 font-medium">
              • Industrial Container Inspection
            </span>
          </div>
        </div>

        {/* Live Backend Status Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-md">
            <div
              className={`w-2 h-2 rounded-full ${
                isReady ? 'bg-emerald-400' : 'bg-amber-400'
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
