import { calculateNormalizedBounds } from '../../lib/geometry';
import type { DetectionDetail } from '../../types/api';

export interface BoundingBoxOverlayProps {
  detections: DetectionDetail[];
  naturalWidth: number;
  naturalHeight: number;
  selectedIndex: number | null;
  hoveredIndex: number | null;
  onSelectAnomaly: (index: number | null) => void;
  onHoverAnomaly: (index: number | null) => void;
}

export function BoundingBoxOverlay({
  detections,
  naturalWidth,
  naturalHeight,
  selectedIndex,
  hoveredIndex,
  onSelectAnomaly,
  onHoverAnomaly,
}: BoundingBoxOverlayProps) {
  if (naturalWidth <= 0 || naturalHeight <= 0 || detections.length === 0) {
    return null;
  }

  const activeIndex = hoveredIndex !== null ? hoveredIndex : selectedIndex;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      preserveAspectRatio="none"
      aria-label="Detection Bounding Boxes Vector Overlay"
    >
      {detections.map((detail, idx) => {
        const bounds = calculateNormalizedBounds(
          detail.bbox,
          naturalWidth,
          naturalHeight
        );

        const isSelected = selectedIndex === idx;
        const isHovered = hoveredIndex === idx;
        const isHighlighted = isSelected || isHovered;
        const isAnyActive = activeIndex !== null;
        const isDimmed = isAnyActive && !isHighlighted;

        const isCritical = detail.confidence >= 0.7;
        const strokeColor = isCritical ? '#f87171' : '#fbbf24'; // Red-400 vs Amber-400
        const fillColor = isCritical ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)';

        const opacity = isDimmed ? 0.25 : 1.0;
        const strokeWidth = isHighlighted ? 3 : 2;

        const confPct = (detail.confidence * 100).toFixed(1);
        const labelText = `${detail.class_name} (${confPct}%)`;

        return (
          <g
            key={idx}
            className="pointer-events-auto cursor-pointer transition-opacity duration-150"
            style={{ opacity }}
            onMouseEnter={() => onHoverAnomaly(idx)}
            onMouseLeave={() => onHoverAnomaly(null)}
            onClick={(e) => {
              e.stopPropagation();
              onSelectAnomaly(isSelected ? null : idx);
            }}
          >
            {/* Vector Rectangle */}
            <rect
              x={`${bounds.leftPct}%`}
              y={`${bounds.topPct}%`}
              width={`${bounds.widthPct}%`}
              height={`${bounds.heightPct}%`}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              rx={2}
            />

            {/* Class Label Badge */}
            <foreignObject
              x={`${bounds.leftPct}%`}
              y={`${Math.max(0, bounds.topPct - 4)}%`}
              width="200"
              height="30"
              className="overflow-visible"
            >
              <div
                className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-950 shadow-sm transition-transform duration-150"
                style={{
                  backgroundColor: strokeColor,
                  transform: isHighlighted ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                {labelText}
              </div>
            </foreignObject>
          </g>
        );
      })}
    </svg>
  );
}
