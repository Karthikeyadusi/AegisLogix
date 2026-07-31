import { Card, CardHeader, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';

export function ModelMetrics() {
  return (
    <section className="py-12 border-b border-[var(--color-border-subtle)]">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-zinc-100 tracking-tight">
              Model Performance Benchmarks
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Custom-trained YOLOv5s object detector evaluation telemetry.
            </p>
          </div>
          <Badge variant="mono">MLOps Validation</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="py-3">
              <span className="text-[11px] font-mono text-zinc-400 uppercase">
                Mean Average Precision
              </span>
            </CardHeader>
            <CardContent className="py-4">
              <div className="text-3xl font-bold font-mono text-zinc-100">
                0.92
              </div>
              <span className="text-[11px] text-zinc-500 font-mono mt-1 block">
                mAP@0.5 IoU Threshold
              </span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-3">
              <span className="text-[11px] font-mono text-zinc-400 uppercase">
                Inference Latency
              </span>
            </CardHeader>
            <CardContent className="py-4">
              <div className="text-3xl font-bold font-mono text-emerald-400">
                ~42 ms
              </div>
              <span className="text-[11px] text-zinc-500 font-mono mt-1 block">
                ONNX Runtime Single Execution
              </span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-3">
              <span className="text-[11px] font-mono text-zinc-400 uppercase">
                Input Image Size
              </span>
            </CardHeader>
            <CardContent className="py-4">
              <div className="text-3xl font-bold font-mono text-zinc-100">
                416 × 416
              </div>
              <span className="text-[11px] text-zinc-500 font-mono mt-1 block">
                Letterbox Padding Rescale
              </span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-3">
              <span className="text-[11px] font-mono text-zinc-400 uppercase">
                Confidence Threshold
              </span>
            </CardHeader>
            <CardContent className="py-4">
              <div className="text-3xl font-bold font-mono text-amber-400">
                0.40
              </div>
              <span className="text-[11px] text-zinc-500 font-mono mt-1 block">
                Configurable Target Threshold
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Classes Bar */}
        <div className="p-4 rounded border border-zinc-800 bg-zinc-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="text-xs font-mono text-zinc-300 font-semibold uppercase">
            Supported Damage Classes (5)
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="mono">Dent</Badge>
            <Badge variant="mono">Hole</Badge>
            <Badge variant="mono">Rust</Badge>
            <Badge variant="mono">Crack</Badge>
            <Badge variant="mono">Structural Failure</Badge>
          </div>
        </div>
      </div>
    </section>
  );
}
