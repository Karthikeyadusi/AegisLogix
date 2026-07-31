import { Card, CardHeader, CardContent } from '../common/Card';

export function ArchitectureBlueprint() {
  const steps = [
    {
      num: '01',
      stage: 'CLIENT LAYER',
      title: 'React 19 + SVG Overlay',
      detail: 'Parses raw image dimensions and converts bbox coordinates [x1,y1,x2,y2] into percentage-based SVG bounds for resolution-independent scaling.',
    },
    {
      num: '02',
      stage: 'ROUTER GATEWAY',
      title: 'FastAPI Stream Guard',
      detail: 'Validates multipart payload headers. Reads stream in 1MB chunks to enforce strict 10MB limit and prevent server OOM exhaustion.',
    },
    {
      num: '03',
      stage: 'SERVICE DECODER',
      title: 'OpenCV Safety Engine',
      detail: 'Inspects image dimensions before decoding (max 8192px guard) to neutralize decompression bomb exploits before array allocation.',
    },
    {
      num: '04',
      stage: 'ML INFERENCE',
      title: 'ONNX Runtime AegisGuard',
      detail: 'Executes BGR→RGB, 416×416 letterboxing, tensor normalization, forward pass, NMS, and coordinate scaling to original pixel dimensions.',
    },
  ];

  return (
    <section id="architecture" className="py-12 border-b border-zinc-800">
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block">
              05 / Architecture
            </span>
            <h2 className="text-xl font-bold text-zinc-100 tracking-tight mt-1">
              End-to-End Inference Pipeline
            </h2>
          </div>
        </div>

        <Card>
          <CardHeader>
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Request Lifecycle & Security Validation Flow
            </span>
            <span className="text-[11px] font-mono text-zinc-500">
              POST /api/v1/analyze
            </span>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {steps.map((s) => (
                <div
                  key={s.num}
                  className="p-4 rounded border border-zinc-800 bg-zinc-900/60 flex flex-col justify-between gap-3 text-left"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-widest">
                        {s.stage}
                      </span>
                      <span className="text-xs font-mono text-zinc-600 font-bold">
                        {s.num}
                      </span>
                    </div>
                    <h3 className="font-mono font-bold text-xs text-zinc-200 mb-2">
                      {s.title}
                    </h3>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      {s.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
