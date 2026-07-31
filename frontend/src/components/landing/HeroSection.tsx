import { ArrowDown, Code2 } from 'lucide-react';
import { Button } from '../common/Button';
import { DemoPreview } from './DemoPreview';

export interface HeroSectionProps {
  onLaunchWorkspace: () => void;
  onViewTechSpecs: () => void;
}

export function HeroSection({ onLaunchWorkspace, onViewTechSpecs }: HeroSectionProps) {
  return (
    <section className="pt-16 pb-12 border-b border-zinc-800/80">
      <div className="max-w-5xl mx-auto text-center space-y-6">
        {/* Category Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Industrial Computer Vision Engine</span>
        </div>

        {/* Powerful Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-100 leading-[1.1]">
          Sub-Second Shipping Container <br className="hidden sm:inline" />
          Damage Detection
        </h1>

        {/* Supporting Sentence */}
        <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Automated structural defect localization powered by a custom-trained YOLOv5 neural network and ONNX Runtime execution engine.
        </p>

        {/* CTAs */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={onLaunchWorkspace}
            className="w-full sm:w-auto font-mono text-xs uppercase tracking-wider px-6 py-3"
          >
            Launch Inspection
            <ArrowDown className="w-4 h-4 ml-1.5" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={onViewTechSpecs}
            className="w-full sm:w-auto font-mono text-xs uppercase tracking-wider px-6 py-3"
          >
            View Technical Specs
            <Code2 className="w-4 h-4 ml-1.5" />
          </Button>
        </div>

        {/* Live Visual Demo Preview Box */}
        <DemoPreview />
      </div>
    </section>
  );
}
