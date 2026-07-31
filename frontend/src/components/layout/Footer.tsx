export function Footer() {
  return (
    <footer className="border-t border-zinc-800 py-3 bg-zinc-950/80 mt-auto">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-zinc-300">AegisLogix v2.0.0</span>
          <span>·</span>
          <span>YOLOv5</span>
          <span>·</span>
          <span>ONNX Runtime</span>
          <span>·</span>
          <span>FastAPI</span>
          <span>·</span>
          <span>React</span>
        </div>

        <div className="text-zinc-400 text-[11px]">
          Industrial Inspection Engine
        </div>
      </div>
    </footer>
  );
}
