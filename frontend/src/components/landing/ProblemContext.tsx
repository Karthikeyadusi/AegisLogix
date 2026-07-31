export function ProblemContext() {
  return (
    <section className="py-12 border-b border-zinc-800">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block">
            01 / Problem Context
          </span>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100">
            The Industrial Inspection Challenge
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-zinc-400 leading-relaxed">
          <div className="p-4 rounded bg-zinc-900/40 border border-zinc-800 space-y-2">
            <h3 className="text-xs font-mono font-bold text-zinc-200 uppercase">
              1. Intermodal Bottlenecks
            </h3>
            <p className="text-xs text-zinc-400">
              Over 14 million shipping containers transit global port gates daily. Manual physical inspection creates severe throughput delays and queue congestion.
            </p>
          </div>

          <div className="p-4 rounded bg-zinc-900/40 border border-zinc-800 space-y-2">
            <h3 className="text-xs font-mono font-bold text-zinc-200 uppercase">
              2. Human Inconsistency
            </h3>
            <p className="text-xs text-zinc-400">
              Inspectors working under tight gate schedules routinely miss subtle deframing, fatigue cracks, and rust patches that degrade structural integrity over ocean transit.
            </p>
          </div>

          <div className="p-4 rounded bg-zinc-900/40 border border-zinc-800 space-y-2">
            <h3 className="text-xs font-mono font-bold text-zinc-200 uppercase">
              3. Automated Telemetry
            </h3>
            <p className="text-xs text-zinc-400">
              Sub-second neural computer vision standardizes damage detection, generating immediate structured telemetry reports for logistics management platforms.
            </p>
          </div>
        </div>

        <div className="pt-2 text-center text-xs font-mono text-zinc-500">
          <span>~1,150 Annotated Images</span>
          <span className="mx-2">•</span>
          <span>5 Structural Damage Classes</span>
          <span className="mx-2">•</span>
          <span>416 × 416 Inference Resolution</span>
        </div>
      </div>
    </section>
  );
}
