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

  // Compute resolution scale factor so stroke and text remain legible at any image size
  const baseDim = Math.min(naturalWidth, naturalHeight);
  const scaleFactor = Math.max(0.8, baseDim / 600);

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      viewBox={`0 0 ${naturalWidth} ${naturalHeight}`}
      preserveAspectRatio="none"
      aria-label="Detection Bounding Boxes Vector Overlay"
    >
      {detections.map((detail, idx) => {
        const [x1, y1, x2, y2] = detail.bbox;
        const width = Math.max(0, x2 - x1);
        const height = Math.max(0, y2 - y1);

        const isSelected = selectedIndex === idx;
        const isHovered = hoveredIndex === idx;
        const isHighlighted = isSelected || isHovered;
        const isAnyActive = activeIndex !== null;
        const isDimmed = isAnyActive && !isHighlighted;

        const isCritical = detail.confidence >= 0.7;
        const strokeColor = isCritical ? '#f87171' : '#fbbf24'; // Red-400 vs Amber-400
        const fillColor = isCritical ? 'rgba(239, 68, 68, 0.18)' : 'rgba(245, 158, 11, 0.18)';

        const opacity = isDimmed ? 0.25 : 1.0;
        const strokeWidth = (isHighlighted ? 3.5 : 2) * scaleFactor;

        const fontSize = Math.max(10, Math.round(11 * scaleFactor));
        const paddingX = Math.round(5 * scaleFactor);
        const paddingY = Math.round(3 * scaleFactor);

        const confPct = (detail.confidence * 100).toFixed(1);
        const labelText = `${detail.class_name.toUpperCase()} (${confPct}%)`;

        const charWidth = fontSize * 0.62;
        const badgeWidth = labelText.length * charWidth + paddingX * 2;
        const badgeHeight = fontSize + paddingY * 2;

        // Position badge above bbox if room allows, else inside
        const badgeY = y1 - badgeHeight >= 0 ? y1 - badgeHeight : y1;

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
              x={x1}
              y={y1}
              width={width}
              height={height}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              rx={2 * scaleFactor}
            />

            {/* Label Background Badge */}
            <rect
              x={x1}
              y={badgeY}
              width={badgeWidth}
              height={badgeHeight}
              fill={strokeColor}
              rx={2 * scaleFactor}
            />

            {/* Label Text */}
            <text
              x={x1 + paddingX}
              y={badgeY + fontSize + paddingY - 1}
              fill="#09090b"
              fontSize={fontSize}
              fontWeight="bold"
              fontFamily="monospace"
            >
              {labelText}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
