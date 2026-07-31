import { Card } from '../common/Card';

export function TechnologyDecisions() {
  const decisions = [
    {
      title: 'YOLOv5s over YOLOv8m',
      rationale: '3× parameter reduction (9.1M vs 25.8M) enables Jetson Nano edge memory compatibility at 416×416 resolution.',
      tradeoff: 'Slightly older detection head design; negligible difference at current dataset scale.',
    },
    {
      title: 'ONNX Runtime over PyTorch',
      rationale: 'Eliminates PyTorch (~2GB dependency) from runtime Docker container, enabling lightweight CPU execution within memory limits.',
      tradeoff: 'CPU execution is slower than TensorRT GPU acceleration, but zero hardware lock-in.',
    },
    {
      title: 'FastAPI over Flask / Django',
      rationale: 'Native UploadFile parsing, automatic OpenAPI docs, and thread pool delegation for CPU-bound ONNX inference.',
      tradeoff: 'Slightly higher initial scaffolding complexity than Flask, but built-in schema validation.',
    },
    {
      title: '416 × 416 Inference Resolution',
      rationale: 'Fixed input tensor size matches Jetson Nano 4GB shared memory budget, avoiding OOM during batch passes.',
      tradeoff: 'Reduced resolution makes micro-defects harder to resolve than at 640×640.',
    },
  ];

  return (
    <section className="py-12 border-b border-zinc-800">
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block">
            03 / System Rationale
          </span>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100 mt-1">
            Engineering Decisions & Trade-Offs
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {decisions.map((dec, idx) => (
            <Card key={idx} className="p-4 space-y-2 bg-zinc-900/30">
              <h3 className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider">
                {dec.title}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                <strong className="text-zinc-300">Why:</strong> {dec.rationale}
              </p>
              <p className="text-[11px] text-zinc-500 font-mono pt-1 border-t border-zinc-800/60">
                <span className="text-amber-400/90 font-semibold">Trade-off:</span> {dec.tradeoff}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
