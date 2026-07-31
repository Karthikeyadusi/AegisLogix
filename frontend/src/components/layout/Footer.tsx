export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border-subtle)] py-8 bg-zinc-950/60 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500 uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>AegisLogix v2.0.0 • Industrial Telemetry Standard</span>
        </div>

        <div>
          <span>YOLOv5 • ONNX Runtime • FastAPI • React 19</span>
        </div>
      </div>
    </footer>
  );
}
