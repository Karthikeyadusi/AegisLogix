import { useState, useEffect, type SyntheticEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { BoundingBoxOverlay } from './BoundingBoxOverlay';
import type { DetectionDetail } from '../../types/api';
import type { ViewMode } from '../../hooks/useWorkspaceState';
import { cn } from '../../lib/utils';

export interface ImageCanvasProps {
  previewUrl: string;
  annotatedBase64: string | null;
  detections: DetectionDetail[];
  isAnalyzing: boolean;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  selectedIndex: number | null;
  hoveredIndex: number | null;
  onSelectAnomaly: (index: number | null) => void;
  onHoverAnomaly: (index: number | null) => void;
  className?: string;
}

export function ImageCanvas({
  previewUrl,
  annotatedBase64,
  detections,
  isAnalyzing,
  viewMode,
  onViewModeChange,
  selectedIndex,
  hoveredIndex,
  onSelectAnomaly,
  onHoverAnomaly,
  className,
}: ImageCanvasProps) {
  const [naturalDimensions, setNaturalDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  const [elapsedMs, setElapsedMs] = useState<number>(0);

  useEffect(() => {
    if (!isAnalyzing) {
      setElapsedMs(0);
      return;
    }

    const startTime = Date.now();
    const timer = setInterval(() => {
      setElapsedMs(Date.now() - startTime);
    }, 100);

    return () => clearInterval(timer);
  }, [isAnalyzing]);

  const handleImageLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setNaturalDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight,
    });
  };

  const hasDetections = detections.length > 0;

  return (
    <div className={cn('space-y-3', className)}>
      {/* Top View Mode Control Bar */}
      {annotatedBase64 && (
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
            View Mode
          </span>

          <div className="bg-zinc-900 border border-zinc-800 p-0.5 rounded flex items-center gap-1">
            <button
              onClick={() => onViewModeChange('svg_overlay')}
              className={cn(
                'px-2.5 py-1 text-xs font-mono uppercase rounded transition-colors',
                viewMode === 'svg_overlay'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              )}
            >
              Interactive Vector
            </button>
            <button
              onClick={() => onViewModeChange('annotated')}
              className={cn(
                'px-2.5 py-1 text-xs font-mono uppercase rounded transition-colors',
                viewMode === 'annotated'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              )}
            >
              OpenCV Render
            </button>
            <button
              onClick={() => onViewModeChange('raw')}
              className={cn(
                'px-2.5 py-1 text-xs font-mono uppercase rounded transition-colors',
                viewMode === 'raw'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              )}
            >
              Raw Input
            </button>
          </div>
        </div>
      )}

      {/* Main Image Frame */}
      <div className="relative rounded-md overflow-hidden border border-zinc-800 bg-zinc-950 shadow-inner flex items-center justify-center min-h-[300px]">
        <AnimatePresence mode="wait">
          {viewMode === 'annotated' && annotatedBase64 ? (
            <motion.img
              key="annotated"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              src={`data:image/jpeg;base64,${annotatedBase64}`}
              alt="Annotated Inspection Telemetry"
              className="w-full h-auto max-h-[70vh] object-contain block"
            />
          ) : (
            <div className="relative inline-block max-w-full">
              <motion.img
                key="raw"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                src={previewUrl}
                onLoad={handleImageLoad}
                alt="Container Raw Preview"
                className="w-full h-auto max-h-[70vh] object-contain block"
              />

              {/* Scalable SVG Bounding Box Layer */}
              {viewMode === 'svg_overlay' && hasDetections && (
                <BoundingBoxOverlay
                  detections={detections}
                  naturalWidth={naturalDimensions.width}
                  naturalHeight={naturalDimensions.height}
                  selectedIndex={selectedIndex}
                  hoveredIndex={hoveredIndex}
                  onSelectAnomaly={onSelectAnomaly}
                  onHoverAnomaly={onHoverAnomaly}
                />
              )}
            </div>
          )}
        </AnimatePresence>

        {/* Neural Scanning Animation Overlay */}
        {isAnalyzing && (
          <div
            className="absolute inset-0 bg-zinc-950/70 backdrop-blur-[2px] flex flex-col items-center justify-center overflow-hidden z-20"
            aria-live="polite"
            aria-busy="true"
          >
            <motion.div
              initial={{ top: '-5%' }}
              animate={{ top: '105%' }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
              className="absolute left-0 w-full h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] z-10"
            />

            <div className="relative z-20 flex flex-col items-center p-6 bg-zinc-900/90 border border-zinc-700/80 rounded-md backdrop-blur-md shadow-2xl">
              <Loader2 className="w-9 h-9 text-blue-400 animate-spin mb-3" />
              <p className="text-zinc-200 font-mono text-xs tracking-widest uppercase">
                Neural Scan in Progress...
              </p>
              <span className="text-[11px] font-mono text-blue-400 font-semibold mt-1">
                {(elapsedMs / 1000).toFixed(1)}s elapsed
              </span>
              <span className="text-[10px] font-mono text-zinc-500 mt-0.5">
                YOLOv5 ONNX Runtime Inference
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
