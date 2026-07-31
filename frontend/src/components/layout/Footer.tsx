export function Footer() {
  return (
    <footer className="border-t border-zinc-800 py-4 bg-zinc-950/60 mt-auto">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>AegisLogix v2.0.0 • Industrial Container Inspection Engine</span>
        </div>

        <div>
          <span>YOLOv5 • ONNX Runtime • FastAPI • React 19</span>
        </div>
      </div>
    </footer>
  );
}
