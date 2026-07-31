import { useState, useCallback } from 'react';

export type ViewMode = 'annotated' | 'raw' | 'svg_overlay';

export interface WorkspaceState {
  selectedAnomalyIndex: number | null;
  hoveredAnomalyIndex: number | null;
  activeClassFilter: string | null;
  viewMode: ViewMode;
}

/**
 * Custom React hook for managing workspace UI interaction state
 * (cross-highlighting, view modes, damage filtering).
 */
export function useWorkspaceState() {
  const [selectedAnomalyIndex, setSelectedAnomalyIndex] = useState<number | null>(null);
  const [hoveredAnomalyIndex, setHoveredAnomalyIndex] = useState<number | null>(null);
  const [activeClassFilter, setActiveClassFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('annotated');

  const selectAnomaly = useCallback((index: number | null) => {
    setSelectedAnomalyIndex(index);
  }, []);

  const hoverAnomaly = useCallback((index: number | null) => {
    setHoveredAnomalyIndex(index);
  }, []);

  const filterByClass = useCallback((className: string | null) => {
    setActiveClassFilter(className);
    setSelectedAnomalyIndex(null);
  }, []);

  const resetWorkspaceState = useCallback(() => {
    setSelectedAnomalyIndex(null);
    setHoveredAnomalyIndex(null);
    setActiveClassFilter(null);
    setViewMode('annotated');
  }, []);

  return {
    selectedAnomalyIndex,
    hoveredAnomalyIndex,
    activeClassFilter,
    viewMode,
    selectAnomaly,
    hoverAnomaly,
    filterByClass,
    setViewMode,
    resetWorkspaceState,
  };
}
