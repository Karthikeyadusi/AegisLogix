import { ChevronDown, ArrowRight, Cpu, Zap, Target } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export interface HeroSectionProps {
  onLaunchWorkspace: () => void;
  onViewArchitecture: () => void;
}

export function HeroSection({
  onLaunchWorkspace,
  onViewArchitecture,
}: HeroSectionProps) {
  return (
    <section className="py-12 lg:py-20 border-b border-[var(--color-border-subtle)]">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        {/* Category Badge */}
        <div className="flex justify-center">
          <Badge variant="mono" className="py-1 px-3">
            Industrial Computer Vision Platform
          </Badge>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-100 leading-tight">
          Automated Structural Telemetry for Global Logistics
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Sub-second shipping container damage detection powered by a custom-trained YOLOv5 neural network and ONNX Runtime backend.
        </p>

        {/* Call to Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="primary"
            size="lg"
            onClick={onLaunchWorkspace}
            className="w-full sm:w-auto"
          >
            Launch Inspection Workspace
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={onViewArchitecture}
            className="w-full sm:w-auto"
          >
            View Architecture Blueprint
            <ChevronDown className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Highlight Pills */}
        <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-3xl mx-auto">
          <div className="p-4 rounded border border-zinc-800 bg-zinc-900/40 flex items-start gap-3">
            <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-mono font-bold text-zinc-200 uppercase">
                Sub-Second Speed
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5">
                ONNX Runtime execution for real-time inference.
              </div>
            </div>
          </div>

          <div className="p-4 rounded border border-zinc-800 bg-zinc-900/40 flex items-start gap-3">
            <Target className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-mono font-bold text-zinc-200 uppercase">
                5 Anomaly Classes
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5">
                Detects Dents, Holes, Rust, Cracks, and Structural Failure.
              </div>
            </div>
          </div>

          <div className="p-4 rounded border border-zinc-800 bg-zinc-900/40 flex items-start gap-3">
            <Cpu className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-mono font-bold text-zinc-200 uppercase">
                Docker Microservice
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5">
                FastAPI engine managed by Gunicorn process supervisor.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
