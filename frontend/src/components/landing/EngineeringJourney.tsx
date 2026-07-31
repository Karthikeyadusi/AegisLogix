import { Card, CardHeader, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';

export function EngineeringJourney() {
  return (
    <section className="py-12 border-b border-zinc-800">
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block">
              02 / Model Iteration
            </span>
            <h2 className="text-xl font-bold tracking-tight text-zinc-100 mt-1">
              Engineering & Training Journey
            </h2>
          </div>
          <Badge variant="mono">3-Stage Training Pipeline</Badge>
        </div>

        <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
          Model development evolved through three distinct training iterations. Dataset quality and label formatting interventions yielded significantly higher accuracy gains than framework architecture changes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Stage 1 */}
          <Card className="border-red-900/40 bg-zinc-900/40">
            <CardHeader className="py-2.5 bg-red-950/20 border-red-900/30">
              <span className="text-[10px] font-mono uppercase text-red-400 font-bold">
                Stage 1: Baseline
              </span>
            </CardHeader>
            <CardContent className="p-3.5 space-y-2 text-xs">
              <div className="font-mono font-semibold text-zinc-200">
                YOLOv8m (25.8M)
              </div>
              <div className="text-[11px] font-mono text-red-400">
                mAP50: 0.217
              </div>
              <p className="text-[11px] text-zinc-400 leading-snug">
                Catastrophic recall failure (missed 95% dents, 96% rust). Model too heavy for edge memory.
              </p>
            </CardContent>
          </Card>

          {/* Stage 2 */}
          <Card className="border-amber-900/40 bg-zinc-900/40">
            <CardHeader className="py-2.5 bg-amber-950/20 border-amber-900/30">
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                Stage 2: Retraining
              </span>
            </CardHeader>
            <CardContent className="p-3.5 space-y-2 text-xs">
              <div className="font-mono font-semibold text-zinc-200">
                YOLOv5s (9.1M)
              </div>
              <div className="text-[11px] font-mono text-amber-400">
                mAP50: 0.485
              </div>
              <p className="text-[11px] text-zinc-400 leading-snug">
                Switched to 416×416 edge resolution. Discovered training logs silently ignoring corrupted annotations.
              </p>
            </CardContent>
          </Card>

          {/* Stage 3 */}
          <Card className="border-emerald-900/40 bg-zinc-900/40">
            <CardHeader className="py-2.5 bg-emerald-950/20 border-emerald-900/30">
              <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                Stage 3: Data Surgery
              </span>
            </CardHeader>
            <CardContent className="p-3.5 space-y-2 text-xs">
              <div className="font-mono font-semibold text-zinc-200">
                YOLOv5s (Cleaned)
              </div>
              <div className="text-[11px] font-mono text-emerald-400">
                mAP50: 0.561
              </div>
              <p className="text-[11px] text-zinc-400 leading-snug">
                Repaired directory structures and string labels to integer indices. Significant recall jump across all classes.
              </p>
            </CardContent>
          </Card>

          {/* Stage 4 */}
          <Card className="border-blue-900/40 bg-zinc-900/40">
            <CardHeader className="py-2.5 bg-blue-950/20 border-blue-900/30">
              <span className="text-[10px] font-mono uppercase text-blue-400 font-bold">
                Stage 4: ONNX Export
              </span>
            </CardHeader>
            <CardContent className="p-3.5 space-y-2 text-xs">
              <div className="font-mono font-semibold text-zinc-200">
                aegis_v1.onnx
              </div>
              <div className="text-[11px] font-mono text-blue-400">
                Size: 34.9 MB
              </div>
              <p className="text-[11px] text-zinc-400 leading-snug">
                Exported fixed graph (1,3,416,416). Eliminates PyTorch runtime requirement in production.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
