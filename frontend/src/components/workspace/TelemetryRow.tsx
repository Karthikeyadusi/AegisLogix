import { Badge } from '../common/Badge';
import type { DetectionDetail } from '../../types/api';
import { cn } from '../../lib/utils';

export interface TelemetryRowProps {
  detail: DetectionDetail;
  index: number;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (index: number) => void;
  onHover: (index: number | null) => void;
}

export function TelemetryRow({
  detail,
  index,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}: TelemetryRowProps) {
  const isCritical = detail.confidence >= 0.7;
  const confPct = (detail.confidence * 100).toFixed(1);
  const [x1, y1, x2, y2] = detail.bbox;

  const isActive = isSelected || isHovered;

  return (
    <div
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onSelect(index)}
      tabIndex={0}
      role="button"
      aria-label={`Anomaly ${index + 1}: ${detail.class_name}, ${confPct}% confidence`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(index);
        }
      }}
      className={cn(
        'p-3 rounded border transition-all cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-zinc-400',
        isActive
          ? 'bg-zinc-800/90 border-zinc-500 shadow-sm'
          : 'bg-zinc-900/50 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900'
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2.5">
          <span className="w-5 h-5 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-mono font-bold text-zinc-300">
            {index + 1}
          </span>
          <span className="font-semibold text-sm text-zinc-100 capitalize">
            {detail.class_name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-medium text-zinc-300">
            {confPct}% CONF
          </span>
          <Badge variant={isCritical ? 'critical' : 'minor'}>
            {isCritical ? 'CRITICAL' : 'MINOR'}
          </Badge>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-1 border-t border-zinc-800/50">
        <span>BBOX COORDINATES</span>
        <span>
          [{x1}, {y1}, {x2}, {y2}]
        </span>
      </div>
    </div>
  );
}
