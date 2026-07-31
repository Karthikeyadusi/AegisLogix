import { useState } from 'react';
import { ChevronDown, ChevronUp, Code2 } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../common/Card';

export function TechnicalDetails() {
  const [isOpen, setIsOpen] = useState(false);

  const perClassMetrics = [
    { name: 'Dent', map50: '0.830', precision: '0.701', recall: '0.880' },
    { name: 'Hole', map50: '0.517', precision: '0.884', recall: '0.448' },
    { name: 'Deframe', map50: '0.516', precision: '0.588', recall: '0.385' },
    { name: 'Rust', map50: '0.499', precision: '0.647', recall: '0.445' },
    { name: 'Minor-Dent', map50: '0.442', precision: '0.528', recall: '0.446' },
  ];

  const decisions = [
    {
      title: 'YOLOv5s over YOLOv8m',
      rationale: '3× parameter reduction (9.1M vs 25.8M) enables Jetson Nano edge memory compatibility at 416×416 resolution.',
      tradeoff: 'Negligible recall difference at current dataset scale.',
    },
    {
      title: 'ONNX Runtime over PyTorch',
      rationale: 'Eliminates PyTorch (~2GB dependency) from Docker image, enabling lightweight CPU execution within memory limits.',
      tradeoff: 'CPU execution is slower than TensorRT GPU acceleration.',
    },
    {
      title: 'FastAPI Stream Guards',
      rationale: 'Reads payload in 1MB chunks and checks image dimension bounds (≤8192px) before decoding to prevent OOM / decompression bomb attacks.',
      tradeoff: 'Slightly higher initial upload processing latency.',
    },
    {
      title: '416 × 416 Inference Resolution',
      rationale: 'Fixed input tensor size matches Jetson Nano 4GB shared memory budget, avoiding OOM during batch passes.',
      tradeoff: 'Micro-defects harder to resolve than at 640×640.',
    },
  ];

  return (
    <section id="technical-details" className="py-16 border-b border-zinc-800/80">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Toggle Bar */}
        <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-zinc-100">
                Technical Specifications & Architecture Deep Dive
              </h3>
              <p className="text-xs text-zinc-400">
                Detailed training evaluation metrics, security guards, and design trade-offs for engineers.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200 uppercase transition-colors flex items-center gap-2"
          >
            <span>{isOpen ? 'Collapse Details' : 'Expand Details'}</span>
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Collapsible Content */}
        {isOpen && (
          <div className="space-y-6 pt-2">
            {/* Top Metric Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="py-3">
                  <span className="text-[11px] font-mono text-zinc-400 uppercase">
                    Mean Average Precision
                  </span>
                </CardHeader>
                <CardContent className="py-4">
                  <div className="text-3xl font-bold font-mono text-zinc-100">0.561</div>
                  <span className="text-[11px] text-zinc-500 font-mono mt-1 block">
                    mAP50 (mAP50-95: 0.398)
                  </span>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="py-3">
                  <span className="text-[11px] font-mono text-zinc-400 uppercase">
                    GPU Latency
                  </span>
                </CardHeader>
                <CardContent className="py-4">
                  <div className="text-3xl font-bold font-mono text-emerald-400">5.1 ms</div>
                  <span className="text-[11px] text-zinc-500 font-mono mt-1 block">
                    Tesla T4 Evaluation
                  </span>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="py-3">
                  <span className="text-[11px] font-mono text-zinc-400 uppercase">
                    Model Size
                  </span>
                </CardHeader>
                <CardContent className="py-4">
                  <div className="text-3xl font-bold font-mono text-zinc-100">34.9 MB</div>
                  <span className="text-[11px] text-zinc-500 font-mono mt-1 block">
                    ONNX Opset 20
                  </span>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="py-3">
                  <span className="text-[11px] font-mono text-zinc-400 uppercase">
                    Target Resolution
                  </span>
                </CardHeader>
                <CardContent className="py-4">
                  <div className="text-3xl font-bold font-mono text-amber-400">416 × 416</div>
                  <span className="text-[11px] text-zinc-500 font-mono mt-1 block">
                    Letterbox Padding
                  </span>
                </CardContent>
              </Card>
            </div>

            {/* Per-Class Evaluation Table */}
            <Card className="bg-zinc-900/40">
              <CardHeader className="py-3">
                <span className="text-xs font-mono text-zinc-300 font-semibold uppercase">
                  Per-Class Evaluation Telemetry (Stage 3 Dataset)
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

            {/* Architecture Trade-offs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {decisions.map((dec, idx) => (
                <Card key={idx} className="p-4 space-y-2 bg-zinc-900/30">
                  <h4 className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider">
                    {dec.title}
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    <strong className="text-zinc-300">Rationale:</strong> {dec.rationale}
                  </p>
                  <p className="text-[11px] text-zinc-500 font-mono pt-1 border-t border-zinc-800/60">
                    <span className="text-amber-400 font-semibold">Trade-off:</span> {dec.tradeoff}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
