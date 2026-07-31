import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, ScanLine, Keyboard, CheckCircle2 } from 'lucide-react';

import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

import { Dropzone } from './components/workspace/Dropzone';
import { ImageCanvas } from './components/workspace/ImageCanvas';
import { TelemetryList } from './components/workspace/TelemetryList';
import { WorkspaceActions } from './components/workspace/WorkspaceActions';
import { Card } from './components/common/Card';

import { useBackendStatus } from './hooks/useBackendStatus';
import { useAnalysis } from './hooks/useAnalysis';
import { useWorkspaceState } from './hooks/useWorkspaceState';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

export default function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Custom Hooks
  const backendStatus = useBackendStatus();
  const analysis = useAnalysis();
  const workspace = useWorkspaceState();

  // Handle file staging & auto-trigger analysis
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    workspace.resetWorkspaceState();

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Auto-trigger analysis request (POST /api/v1/analyze)
    analysis.analyze(file);
  };

  const handleResetWorkspace = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    analysis.reset();
    workspace.resetWorkspaceState();
  };

  // Register hotkeys
  useKeyboardShortcuts({
    onResetWorkspace: handleResetWorkspace,
  });

  const hasResults = analysis.isSuccess && analysis.data !== null;
  const detections = analysis.data?.details || [];

  const supportedDetections = ['Dent', 'Hole', 'Rust', 'Crack', 'Deframe'];

  return (
    <div className="min-h-screen bg-[var(--color-surface-base)] text-zinc-100 flex flex-col font-sans antialiased">
      {/* Top Application Header */}
      <Header
        isReady={backendStatus.isReady}
        statusText={backendStatus.statusText}
        version={backendStatus.version}
      />

      {/* Main Inspection Workspace Environment */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4 flex flex-col">
        {/* Workspace Title Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
          <div>
            <h1 className="text-base font-bold tracking-tight text-zinc-100">
              Container Inspection Workspace
            </h1>
            <p className="text-xs text-zinc-400">
              Automated structural anomaly localization and vector bounding box telemetry.
            </p>
          </div>

          {/* Compact Keyboard Shortcuts Indicator */}
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-zinc-900/80 border border-zinc-800 px-2.5 py-1 rounded-md">
            <Keyboard className="w-3.5 h-3.5 text-zinc-400" />
            <div className="flex items-center gap-2 text-[11px]">
              <span><kbd className="px-1 py-0.5 rounded bg-zinc-800 text-zinc-200 text-[10px]">ESC</kbd> Reset</span>
              <span className="text-zinc-700">|</span>
              <span><kbd className="px-1 py-0.5 rounded bg-zinc-800 text-zinc-200 text-[10px]">⌘/Ctrl+Enter</kbd> Stage</span>
            </div>
          </div>
        </div>

        {/* Error Alert Banner */}
        {analysis.isError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 bg-red-950/50 border border-red-900/60 rounded-md flex items-start justify-between gap-3 text-xs text-red-300 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-red-200 uppercase tracking-wider mb-0.5">
                  Inspection Failed [{analysis.errorCode}]
                </h4>
                <p className="opacity-90">{analysis.error}</p>
              </div>
            </div>
            <button
              onClick={() => selectedFile && analysis.analyze(selectedFile)}
              className="px-2.5 py-1 bg-red-900/60 hover:bg-red-900 border border-red-800 text-red-100 rounded text-xs font-mono uppercase transition-colors shrink-0 cursor-pointer"
            >
              Retry Analysis
            </button>
          </motion.div>
        )}

        {/* 2-Pane Split View Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start flex-1">
          {/* Left Pane (70% Width): Image Viewport */}
          <div className="lg:col-span-7 xl:col-span-8">
            <AnimatePresence mode="wait">
              {!previewUrl ? (
                <motion.div
                  key="dropzone"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Dropzone
                    onFileSelect={handleFileSelect}
                    disabled={analysis.isAnalyzing}
                    isBackendReady={backendStatus.isReady}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="canvas"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ImageCanvas
                    previewUrl={previewUrl}
                    annotatedBase64={analysis.data?.image_data || null}
                    detections={detections}
                    isAnalyzing={analysis.isAnalyzing}
                    viewMode={workspace.viewMode}
                    onViewModeChange={workspace.setViewMode}
                    selectedIndex={workspace.selectedAnomalyIndex}
                    hoveredIndex={workspace.hoveredAnomalyIndex}
                    onSelectAnomaly={workspace.selectAnomaly}
                    onHoverAnomaly={workspace.hoverAnomaly}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Sidebar (30% Width): Telemetry Breakdown */}
          <div className="lg:col-span-5 xl:col-span-4">
            {!previewUrl ? (
              /* Actionable Context Empty State */
              <Card className="p-6 flex flex-col justify-between min-h-[380px] bg-zinc-900/40 border-zinc-800">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
                    <div className="p-2 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300">
                      <ScanLine className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-100">
                        No Analysis Yet
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Upload an image to inspect structural damage.
                      </p>
                    </div>
                  </div>

                  {/* Supported Detections List */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block font-medium">
                      Supported Defect Classes
                    </span>
                    <div className="space-y-1.5">
                      {supportedDetections.map((cls) => (
                        <div key={cls} className="flex items-center gap-2 text-xs text-zinc-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <span>{cls}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800/80 text-[11px] font-mono text-zinc-400">
                  Target Resolution: 416 × 416 (ONNX Opset 20)
                </div>
              </Card>
            ) : (
              /* Active Telemetry Panel */
              <div className="space-y-5">
                {hasResults && analysis.data && (
                  <>
                    <TelemetryList
                      totalIssues={analysis.data.total_issues}
                      details={detections}
                      selectedIndex={workspace.selectedAnomalyIndex}
                      hoveredIndex={workspace.hoveredAnomalyIndex}
                      activeClassFilter={workspace.activeClassFilter}
                      onSelectAnomaly={workspace.selectAnomaly}
                      onHoverAnomaly={workspace.hoverAnomaly}
                      onFilterClass={workspace.filterByClass}
                    />

                    <WorkspaceActions
                      data={analysis.data}
                      fileName={selectedFile?.name || 'container'}
                      onReset={handleResetWorkspace}
                    />
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* System Status Footer */}
      <Footer />
    </div>
  );
}
