import { Card, CardHeader, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';

export function ArchitectureBlueprint() {
  return (
    <section id="architecture" className="py-12 border-b border-[var(--color-border-subtle)]">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-zinc-100 tracking-tight">
              System Architecture Blueprint
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              End-to-end telemetry pipeline from browser upload to neural inference.
            </p>
          </div>
          <Badge variant="mono">Clean Architecture Pipeline</Badge>
        </div>

        <Card>
          <CardHeader>
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Data Processing Pipeline Flow
            </span>
            <span className="text-[11px] font-mono text-zinc-500">
              HTTP/2 multipart/form-data
            </span>
          </CardHeader>

          <CardContent className="p-6 space-y-8">
            {/* Visual Vector Pipeline Diagram */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded border border-zinc-800 bg-zinc-900/60 flex flex-col items-center justify-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                  Client Layer
                </span>
                <span className="font-mono font-bold text-sm text-zinc-200">
                  React 19 + TypeScript
                </span>
                <span className="text-[11px] text-zinc-400">
                  SVG Vector Canvas Overlay & Bidirectional Highlight
                </span>
              </div>

              <div className="p-4 rounded border border-zinc-800 bg-zinc-900/60 flex flex-col items-center justify-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                  API Router
                </span>
                <span className="font-mono font-bold text-sm text-zinc-200">
                  FastAPI v1.1.0
                </span>
                <span className="text-[11px] text-zinc-400">
                  Streamed Upload Size Guard (10MB Chunks)
                </span>
              </div>

              <div className="p-4 rounded border border-zinc-800 bg-zinc-900/60 flex flex-col items-center justify-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                  Service Layer
                </span>
                <span className="font-mono font-bold text-sm text-zinc-200">
                  Analyzer Service
                </span>
                <span className="text-[11px] text-zinc-400">
                  Decompression Bomb Guard & Image Decoding
                </span>
              </div>

              <div className="p-4 rounded border border-zinc-800 bg-zinc-900/60 flex flex-col items-center justify-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                  ML Inference Engine
                </span>
                <span className="font-mono font-bold text-sm text-zinc-200">
                  ONNX Runtime
                </span>
                <span className="text-[11px] text-zinc-400">
                  AegisGuard YOLOv5 Neural Network Weights
                </span>
              </div>
            </div>

            {/* Technical Bullet Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-zinc-400 pt-4 border-t border-zinc-800">
              <div>
                <h4 className="font-mono font-bold text-zinc-200 uppercase mb-1">
                  1. Streamed Memory Safety
                </h4>
                <p className="leading-relaxed">
                  Uploads are streamed in 1MB chunks to prevent memory exhaustion attacks. Decoding is rejected before processing if image dimensions exceed maximum limits.
                </p>
              </div>

              <div>
                <h4 className="font-mono font-bold text-zinc-200 uppercase mb-1">
                  2. Scalable SVG Vector Projections
                </h4>
                <p className="leading-relaxed">
                  Backend prediction bounding boxes <code className="text-zinc-300 font-mono">[x1,y1,x2,y2]</code> are normalized to percentage coordinates on the frontend, ensuring crisp 60fps interaction during viewport resizes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
