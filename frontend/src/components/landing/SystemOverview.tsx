import { ArrowRight, Image as ImageIcon, Server, Cpu, Layers, LayoutDashboard } from 'lucide-react';

export function SystemOverview() {
  const steps = [
    {
      icon: <ImageIcon className="w-5 h-5 text-blue-400" />,
      name: 'Container Imagery',
      detail: 'JPEG / PNG / WebP Input',
    },
    {
      icon: <Server className="w-5 h-5 text-zinc-300" />,
      name: 'FastAPI Gateway',
      detail: 'Streamed Size Guard',
    },
    {
      icon: <Cpu className="w-5 h-5 text-emerald-400" />,
      name: 'ONNX Execution',
      detail: 'YOLOv5 Inference (5.1ms)',
    },
    {
      icon: <Layers className="w-5 h-5 text-amber-400" />,
      name: 'SVG Normalization',
      detail: 'Percentage Coordinates',
    },
    {
      icon: <LayoutDashboard className="w-5 h-5 text-zinc-100" />,
      name: 'Interactive Dashboard',
      detail: 'Vector Overlay & Telemetry',
    },
  ];

  return (
    <section className="py-16 border-b border-zinc-800/80">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
            System Pipeline Overview
          </h2>
          <p className="text-xs text-zinc-400 font-mono uppercase tracking-wider">
            End-to-end data flow from client upload to vector telemetry projection
          </p>
        </div>

        {/* Animated Horizontal Pipeline */}
        <div className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            {steps.map((st, idx) => (
              <div key={idx} className="flex flex-col items-center text-center space-y-2 relative">
                <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 shadow-md flex items-center justify-center">
                  {st.icon}
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold text-zinc-200 uppercase">
                    {st.name}
                  </h4>
                  <span className="text-[11px] font-mono text-zinc-500 block mt-0.5">
                    {st.detail}
                  </span>
                </div>

                {/* Flow Arrow (Hidden on mobile, visible on desktop) */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-4 top-4 text-zinc-700">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
