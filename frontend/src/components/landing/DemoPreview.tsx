import { useState } from 'react';
import { ShieldCheck, Eye, Layers } from 'lucide-react';
import { cn } from '../../lib/utils';

export function DemoPreview() {
  const [activeTab, setActiveTab] = useState<'annotated' | 'raw'>('annotated');

  // Sample demonstration container image (Unsplash high quality shipping container)
  const sampleImageUrl =
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop';

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 rounded-lg border border-zinc-800 bg-zinc-950/90 shadow-2xl overflow-hidden">
      {/* Window Titlebar */}
      <div className="px-4 py-3 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-zinc-700" />
          <div className="w-3 h-3 rounded-full bg-zinc-800" />
          <div className="w-3 h-3 rounded-full bg-zinc-800" />
          <span className="ml-2 text-xs font-mono text-zinc-400 font-medium">
            aegis_telemetry_preview.png — 416×416 ONNX Pass
          </span>
        </div>

        {/* View Toggle */}
        <div className="bg-zinc-950 p-0.5 rounded border border-zinc-800 flex items-center gap-1">
          <button
            onClick={() => setActiveTab('annotated')}
            className={cn(
              'px-2.5 py-1 text-[11px] font-mono rounded transition-colors flex items-center gap-1.5',
              activeTab === 'annotated'
                ? 'bg-zinc-800 text-zinc-100 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            )}
          >
            <Layers className="w-3 h-3 text-blue-400" />
            Detected Telemetry
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            className={cn(
              'px-2.5 py-1 text-[11px] font-mono rounded transition-colors flex items-center gap-1.5',
              activeTab === 'raw'
                ? 'bg-zinc-800 text-zinc-100 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            )}
          >
            <Eye className="w-3 h-3" />
            Raw Input
          </button>
        </div>
      </div>

      {/* Visual Canvas Area */}
      <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-zinc-950 overflow-hidden flex items-center justify-center">
        <img
          src={sampleImageUrl}
          alt="Container Inspection Live Demo"
          className="w-full h-full object-cover object-center opacity-85"
        />

        {/* Bounding Box Overlays (simulated SVG vector layers for instant hero proof) */}
        {activeTab === 'annotated' && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Box 1: Dent */}
            <div
              className="absolute border-2 border-red-500 bg-red-500/15 rounded-sm transition-all duration-300"
              style={{ top: '28%', left: '32%', width: '18%', height: '24%' }}
            >
              <span className="absolute -top-5 left-0 px-1.5 py-0.5 bg-red-500 text-zinc-950 font-mono text-[10px] font-bold uppercase rounded-sm">
                Dent (88.4%)
              </span>
            </div>

            {/* Box 2: Rust */}
            <div
              className="absolute border-2 border-amber-400 bg-amber-400/15 rounded-sm transition-all duration-300"
              style={{ top: '55%', left: '62%', width: '16%', height: '22%' }}
            >
              <span className="absolute -top-5 left-0 px-1.5 py-0.5 bg-amber-400 text-zinc-950 font-mono text-[10px] font-bold uppercase rounded-sm">
                Rust (76.1%)
              </span>
            </div>

            {/* Box 3: Minor-Dent */}
            <div
              className="absolute border-2 border-amber-400 bg-amber-400/15 rounded-sm transition-all duration-300"
              style={{ top: '40%', left: '15%', width: '12%', height: '18%' }}
            >
              <span className="absolute -top-5 left-0 px-1.5 py-0.5 bg-amber-400 text-zinc-950 font-mono text-[10px] font-bold uppercase rounded-sm">
                Minor-Dent (64.2%)
              </span>
            </div>
          </div>
        )}

        {/* Overlay Telemetry Badge */}
        <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded bg-zinc-950/90 border border-zinc-800 backdrop-blur-md flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>3 ANOMALIES LOCALIZED</span>
          </div>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-400">LATENCY: 5.1ms</span>
        </div>
      </div>
    </div>
  );
}
