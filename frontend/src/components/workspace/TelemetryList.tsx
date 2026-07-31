import { useMemo } from 'react';
import { AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { TelemetryRow } from './TelemetryRow';
import { MetricCard } from '../common/MetricCard';
import type { DetectionDetail } from '../../types/api';
import { cn } from '../../lib/utils';

export interface TelemetryListProps {
  totalIssues: number;
  details: DetectionDetail[];
  selectedIndex: number | null;
  hoveredIndex: number | null;
  activeClassFilter: string | null;
  onSelectAnomaly: (index: number | null) => void;
  onHoverAnomaly: (index: number | null) => void;
  onFilterClass: (className: string | null) => void;
  className?: string;
}

export function TelemetryList({
  totalIssues,
  details,
  selectedIndex,
  hoveredIndex,
  activeClassFilter,
  onSelectAnomaly,
  onHoverAnomaly,
  onFilterClass,
  className,
}: TelemetryListProps) {
  // Class breakdown map
  const classBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    details.forEach((d) => {
      counts[d.class_name] = (counts[d.class_name] || 0) + 1;
    });
    return counts;
  }, [details]);

  const uniqueClasses = useMemo(() => Object.keys(classBreakdown), [classBreakdown]);

  const criticalCount = useMemo(
    () => details.filter((d) => d.confidence >= 0.7).length,
    [details]
  );
  const minorCount = useMemo(
    () => details.filter((d) => d.confidence < 0.7).length,
    [details]
  );

  // Filtered details
  const filteredDetailsWithIndex = useMemo(() => {
    return details
      .map((detail, originalIndex) => ({ detail, originalIndex }))
      .filter(({ detail }) => {
        if (!activeClassFilter) return true;
        return detail.class_name.toLowerCase() === activeClassFilter.toLowerCase();
      });
  }, [details, activeClassFilter]);

  if (details.length === 0) {
    return (
      <div className={cn('p-6 rounded-md border border-emerald-900/50 bg-emerald-950/20 text-center space-y-3', className)}>
        <div className="w-10 h-10 rounded-full bg-emerald-900/40 border border-emerald-700/50 flex items-center justify-center mx-auto text-emerald-400">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-emerald-200">
            No Structural Damage Detected
          </h4>
          <p className="text-xs text-emerald-400/80 max-w-xs mx-auto leading-relaxed">
            Neural inspection pass complete. No structural anomalies met or exceeded the 0.40 confidence threshold.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Metric Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          label="Critical Severity"
          value={criticalCount}
          subtext="Conf ≥ 70%"
          variant={criticalCount > 0 ? 'critical' : 'default'}
          icon={<AlertTriangle className="w-4 h-4 text-red-400" />}
        />
        <MetricCard
          label="Minor Severity"
          value={minorCount}
          subtext="Conf < 70%"
          variant={minorCount > 0 ? 'minor' : 'default'}
          icon={<CheckCircle2 className="w-4 h-4 text-amber-400" />}
        />
      </div>

      {/* Class Filter Control Bar */}
      {uniqueClasses.length > 1 && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
            Filter Damage Type
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => onFilterClass(null)}
              className={cn(
                'px-2.5 py-1 rounded text-xs font-mono transition-colors border',
                activeClassFilter === null
                  ? 'bg-zinc-800 text-zinc-100 border-zinc-600 font-semibold'
                  : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-zinc-200'
              )}
            >
              ALL ({totalIssues})
            </button>
            {uniqueClasses.map((cls) => (
              <button
                key={cls}
                onClick={() => onFilterClass(cls)}
                className={cn(
                  'px-2.5 py-1 rounded text-xs font-mono uppercase transition-colors border',
                  activeClassFilter?.toLowerCase() === cls.toLowerCase()
                    ? 'bg-zinc-800 text-zinc-100 border-zinc-600 font-semibold'
                    : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                )}
              >
                {cls} ({classBreakdown[cls]})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Detections Breakdown List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
            Detections ({filteredDetailsWithIndex.length})
          </span>
          {activeClassFilter && (
            <button
              onClick={() => onFilterClass(null)}
              className="text-[11px] font-mono text-blue-400 hover:underline"
            >
              Clear Filter
            </button>
          )}
        </div>

        {filteredDetailsWithIndex.length === 0 ? (
          <div className="p-6 rounded border border-zinc-800 bg-zinc-900/40 text-center text-xs text-zinc-500 font-mono">
            No detections match the selected filter.
          </div>
        ) : (
          <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
            {filteredDetailsWithIndex.map(({ detail, originalIndex }) => (
              <TelemetryRow
                key={originalIndex}
                detail={detail}
                index={originalIndex}
                isSelected={selectedIndex === originalIndex}
                isHovered={hoveredIndex === originalIndex}
                onSelect={(idx) =>
                  onSelectAnomaly(selectedIndex === idx ? null : idx)
                }
                onHover={onHoverAnomaly}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
