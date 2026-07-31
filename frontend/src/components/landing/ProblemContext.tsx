import { Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

export function ProblemContext() {
  const cards = [
    {
      icon: <Clock className="w-5 h-5 text-amber-400" />,
      title: 'Manual Inspection is Slow',
      description: 'Physical gate checks create bottleneck queues across 14M+ daily container transits.',
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-red-400" />,
      title: 'Defect Detection is Inconsistent',
      description: 'Human inspectors miss structural deframing and fatigue cracks under time pressure.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      title: 'AI Standardizes Telemetry',
      description: 'Sub-second neural vision delivers objective, repeatable damage audit trails.',
    },
  ];

  return (
    <section className="py-16 border-b border-zinc-800/80">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
            Why Computer Vision for Logistics?
          </h2>
          <p className="text-xs text-zinc-400 font-mono uppercase tracking-wider">
            Transforming physical gate inspection into instant visual telemetry
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="p-6 rounded-lg bg-zinc-900/40 border border-zinc-800 flex flex-col justify-between gap-4 transition-colors hover:border-zinc-700"
            >
              <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 w-fit">
                {card.icon}
              </div>
              <div className="space-y-1.5">
                <h3 className="font-semibold text-sm text-zinc-100">
                  {card.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
