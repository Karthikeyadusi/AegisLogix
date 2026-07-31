/**
 * Geometry calculation utilities for scaling bounding boxes.
 */

export interface NormalizedBounds {
  leftPct: number;
  topPct: number;
  widthPct: number;
  heightPct: number;
}

/**
 * Converts pixel bounding box [x1, y1, x2, y2] relative to original image dimensions
 * into percentage coordinates (0-100%) for scalable SVG overlay rendering.
 */
export function calculateNormalizedBounds(
  bbox: [number, number, number, number],
  origWidth: number,
  origHeight: number
): NormalizedBounds {
  if (origWidth <= 0 || origHeight <= 0) {
    return { leftPct: 0, topPct: 0, widthPct: 0, heightPct: 0 };
  }

  const [x1, y1, x2, y2] = bbox;
  const leftPct = (x1 / origWidth) * 100;
  const topPct = (y1 / origHeight) * 100;
  const widthPct = Math.max(0, ((x2 - x1) / origWidth) * 100);
  const heightPct = Math.max(0, ((y2 - y1) / origHeight) * 100);

  return {
    leftPct,
    topPct,
    widthPct,
    heightPct,
  };
}
