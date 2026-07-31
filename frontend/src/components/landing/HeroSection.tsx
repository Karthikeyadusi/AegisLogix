import { ArrowDown, Cpu, Zap, Target } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export interface HeroSectionProps {
  onLaunchWorkspace: () => void;
}

export function HeroSection({ onLaunchWorkspace }: HeroSectionProps) {
  return (
    <section className="py-12 lg:py-16 border-b border-zinc-800">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        {/* Category Badge */}
        <div className="flex justify-center">
          <Badge variant="mono" className="py-1 px-3">
            Industrial Computer Vision Platform
          </Badge>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-100 leading-tight">
          AI-Powered Shipping Container Damage Detection
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Sub-second structural damage detection powered by a fine-tuned YOLOv5 model compiled to ONNX Runtime for edge and cloud deployment.
        </p>

        {/* Action Button */}
        <div className="pt-2 flex justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={onLaunchWorkspace}
            className="w-full sm:w-auto font-mono text-sm uppercase"
          >
            Try Inspection Workspace
            <ArrowDown className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Three Value Proposition Cards */}
        <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-3xl mx-auto">
          <div className="p-4 rounded border border-zinc-800 bg-zinc-900/40 flex items-start gap-3">
            <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-mono font-bold text-zinc-200 uppercase">
                ONNX Inference
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5">
                5.1ms GPU latency with lightweight ONNX Runtime engine.
              </div>
            </div>
          </div>

          <div className="p-4 rounded border border-zinc-800 bg-zinc-900/40 flex items-start gap-3">
            <Target className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-mono font-bold text-zinc-200 uppercase">
                5 Damage Classes
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5">
                Detects Dent, Hole, Rust, Deframe, and Minor-Dent.
              </div>
            </div>
          </div>

          <div className="p-4 rounded border border-zinc-800 bg-zinc-900/40 flex items-start gap-3">
            <Cpu className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-mono font-bold text-zinc-200 uppercase">
                Hardened Backend
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5">
                FastAPI with streamed size & dimension security guards.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
