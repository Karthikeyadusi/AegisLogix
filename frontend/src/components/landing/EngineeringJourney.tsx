export function EngineeringJourney() {
  const stages = [
    {
      step: '01',
      title: 'Failed Baseline',
      metric: 'mAP50: 0.217',
      model: 'YOLOv8m (25.8M)',
      desc: 'Catastrophic recall failure (missed 95% dents, 96% rust). Model too heavy for edge RAM.',
      status: 'failed',
    },
    {
      step: '02',
      title: 'Dataset Debugging',
      metric: 'Corrupted Labels',
      model: 'Roboflow Dataset',
      desc: 'Discovered YOLO training silently ignoring malformed string annotations & stale caches.',
      status: 'warning',
    },
    {
      step: '03',
      title: 'Data Surgery',
      metric: 'mAP50: 0.561',
      model: 'YOLOv5s (Cleaned)',
      desc: 'Wrote script to map label strings to integer indices. Recall jumped across all 5 classes.',
      status: 'success',
    },
    {
      step: '04',
      title: 'ONNX Deployment',
      metric: 'Size: 34.9 MB',
      model: 'aegis_v1.onnx',
      desc: 'Exported fixed 416×416 graph. Zero PyTorch dependency in production FastAPI Docker container.',
      status: 'deployed',
    },
  ];

  const statusColors = {
    failed: 'border-red-900/60 bg-red-950/20 text-red-400',
    warning: 'border-amber-900/60 bg-amber-950/20 text-amber-400',
    success: 'border-emerald-900/60 bg-emerald-950/20 text-emerald-400',
    deployed: 'border-blue-900/60 bg-blue-950/20 text-blue-400',
  };

  return (
    <section className="py-16 border-b border-zinc-800/80">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
            Model Iteration & Engineering Story
          </h2>
          <p className="text-xs text-zinc-400 font-mono uppercase tracking-wider">
            How dataset surgery and architecture selection unlocked mAP 0.561 precision
          </p>
        </div>

        {/* Horizontal Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {stages.map((st, idx) => (
            <div
              key={idx}
              className="p-5 rounded-lg bg-zinc-900/40 border border-zinc-800 flex flex-col justify-between gap-3 relative group hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-zinc-500">
                  STAGE {st.step}
                </span>
                <span
                  className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
                    statusColors[st.status as keyof typeof statusColors]
                  }`}
                >
                  {st.metric}
                </span>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-zinc-100">
                  {st.title}
                </h3>
                <span className="text-[11px] font-mono text-zinc-400 block mt-0.5">
                  {st.model}
                </span>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed pt-2 border-t border-zinc-800/80">
                {st.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
