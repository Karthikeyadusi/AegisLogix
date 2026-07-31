import { Card, CardHeader, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';

export function ModelMetrics() {
  const perClassMetrics = [
    { name: 'Dent', map50: '0.830', precision: '0.701', recall: '0.880' },
    { name: 'Hole', map50: '0.517', precision: '0.884', recall: '0.448' },
    { name: 'Deframe', map50: '0.516', precision: '0.588', recall: '0.385' },
    { name: 'Rust', map50: '0.499', precision: '0.647', recall: '0.445' },
    { name: 'Minor-Dent', map50: '0.442', precision: '0.528', recall: '0.446' },
  ];

  return (
    <section className="py-12 border-b border-zinc-800">
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block">
              04 / Evaluation
            </span>
            <h2 className="text-xl font-bold text-zinc-100 tracking-tight mt-1">
              Model Performance Benchmarks
            </h2>
          </div>
          <Badge variant="mono">Validated Metrics</Badge>
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
                0.561
              </div>
              <span className="text-[11px] text-zinc-500 font-mono mt-1 block">
                mAP50 (mAP50-95: 0.398)
              </span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-3">
              <span className="text-[11px] font-mono text-zinc-400 uppercase">
                GPU Inference Latency
              </span>
            </CardHeader>
            <CardContent className="py-4">
              <div className="text-3xl font-bold font-mono text-emerald-400">
                5.1 ms
              </div>
              <span className="text-[11px] text-zinc-500 font-mono mt-1 block">
                Tesla T4 (Pre: 1.3ms, Post: 2.8ms)
              </span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-3">
              <span className="text-[11px] font-mono text-zinc-400 uppercase">
                Model Footprint
              </span>
            </CardHeader>
            <CardContent className="py-4">
              <div className="text-3xl font-bold font-mono text-zinc-100">
                34.9 MB
              </div>
              <span className="text-[11px] text-zinc-500 font-mono mt-1 block">
                ONNX Opset 20 Format
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

        {/* Per-Class Detailed Telemetry Breakdown Table */}
        <Card className="bg-zinc-900/30">
          <CardHeader className="py-3">
            <span className="text-xs font-mono text-zinc-300 font-semibold uppercase">
              Per-Class Validation Breakdown (Stage 3 Dataset)
            </span>
          </CardHeader>
          <CardContent className="p-4 overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 uppercase">
                  <th className="pb-2">Damage Class</th>
                  <th className="pb-2">mAP50</th>
                  <th className="pb-2">Precision</th>
                  <th className="pb-2">Recall</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
                {perClassMetrics.map((row) => (
                  <tr key={row.name} className="hover:bg-zinc-900/50">
                    <td className="py-2 font-bold text-zinc-100">{row.name}</td>
                    <td className="py-2">{row.map50}</td>
                    <td className="py-2">{row.precision}</td>
                    <td className="py-2">{row.recall}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
