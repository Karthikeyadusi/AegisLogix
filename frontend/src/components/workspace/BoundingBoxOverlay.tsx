import { useRef, useState, useEffect } from 'react';
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
  const svgRef = useRef<SVGSVGElement>(null);
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (!svgRef.current) return;
    const updateSize = () => {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };

    updateSize();
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(svgRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  if (
    naturalWidth <= 0 ||
    naturalHeight <= 0 ||
    detections.length === 0 ||
    containerSize.width <= 0 ||
    containerSize.height <= 0
  ) {
    return (
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />
    );
  }

  const C_w = containerSize.width;
  const C_h = containerSize.height;

  const AR_img = naturalWidth / naturalHeight;
  const AR_cnt = C_w / C_h;

  let rendered_w = C_w;
  let rendered_h = C_h;
  let offset_x = 0;
  let offset_y = 0;

  if (AR_img > AR_cnt) {
    // Width-constrained letterboxing
    rendered_w = C_w;
    rendered_h = C_w / AR_img;
    offset_x = 0;
    offset_y = (C_h - rendered_h) / 2;
  } else {
    // Height-constrained pillarboxing
    rendered_h = C_h;
    rendered_w = C_h * AR_img;
    offset_y = 0;
    offset_x = (C_w - rendered_w) / 2;
  }

  const activeIndex = hoveredIndex !== null ? hoveredIndex : selectedIndex;

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      aria-label="Detection Bounding Boxes Vector Overlay"
    >
      {detections.map((detail, idx) => {
        const [x1, y1, x2, y2] = detail.bbox;

        // Calculate exact pixel position on container canvas
        const rx1 = offset_x + (x1 / naturalWidth) * rendered_w;
        const ry1 = offset_y + (y1 / naturalHeight) * rendered_h;
        const rw = Math.max(0, ((x2 - x1) / naturalWidth) * rendered_w);
        const rh = Math.max(0, ((y2 - y1) / naturalHeight) * rendered_h);

        const isSelected = selectedIndex === idx;
        const isHovered = hoveredIndex === idx;
        const isHighlighted = isSelected || isHovered;
        const isAnyActive = activeIndex !== null;
        const isDimmed = isAnyActive && !isHighlighted;

        const isCritical = detail.confidence >= 0.7;
        const strokeColor = isCritical ? '#f87171' : '#fbbf24'; // Red-400 vs Amber-400
        const fillColor = isCritical ? 'rgba(239, 68, 68, 0.18)' : 'rgba(245, 158, 11, 0.18)';

        const opacity = isDimmed ? 0.25 : 1.0;
        const strokeWidth = isHighlighted ? 3 : 2;

        const fontSize = 11;
        const paddingX = 6;
        const paddingY = 3;

        const confPct = (detail.confidence * 100).toFixed(1);
        const labelText = `${detail.class_name.toUpperCase()} (${confPct}%)`;

        const charWidth = fontSize * 0.62;
        const badgeWidth = labelText.length * charWidth + paddingX * 2;
        const badgeHeight = fontSize + paddingY * 2;

        // Position badge above bbox if room allows, else inside
        const badgeY = ry1 - badgeHeight >= offset_y ? ry1 - badgeHeight : ry1;

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
              x={rx1}
              y={ry1}
              width={rw}
              height={rh}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              rx={2}
            />

            {/* Label Background Badge */}
            <rect
              x={rx1}
              y={badgeY}
              width={badgeWidth}
              height={badgeHeight}
              fill={strokeColor}
              rx={2}
            />

            {/* Label Text */}
            <text
              x={rx1 + paddingX}
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
