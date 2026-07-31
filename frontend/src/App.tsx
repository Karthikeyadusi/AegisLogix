import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, RefreshCw } from 'lucide-react';

import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/landing/HeroSection';
import { ArchitectureBlueprint } from './components/landing/ArchitectureBlueprint';
import { ModelMetrics } from './components/landing/ModelMetrics';

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

  const workspaceRef = useRef<HTMLDivElement>(null);
  const architectureRef = useRef<HTMLDivElement>(null);

  // Hooks
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

    // Auto-trigger POST /api/v1/analyze
    analysis.analyze(file);

    // Smooth scroll to workspace container
    setTimeout(() => {
      workspaceRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleResetWorkspace = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    analysis.reset();
    workspace.resetWorkspaceState();
  };

  const scrollToWorkspace = () => {
    workspaceRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToArchitecture = () => {
    architectureRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Register hotkeys
  useKeyboardShortcuts({
    onResetWorkspace: handleResetWorkspace,
  });

  const hasResults = analysis.isSuccess && analysis.data !== null;
  const detections = analysis.data?.details || [];

  return (
    <div className="min-h-screen bg-[var(--color-surface-base)] text-zinc-100 flex flex-col font-sans antialiased">
      {/* Top Fixed Navigation Bar */}
      <Header
        isReady={backendStatus.isReady}
        statusText={backendStatus.statusText}
        version={backendStatus.version}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-16">
        {/* Presentation & Hero Framing */}
        <HeroSection
          onLaunchWorkspace={scrollToWorkspace}
          onViewArchitecture={scrollToArchitecture}
        />

        {/* Model Metrics Benchmarks */}
        <ModelMetrics />

        {/* Inspection Workspace Container */}
        <section ref={workspaceRef} className="pt-4 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-zinc-800 pb-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-zinc-100">
                Inspection Workspace
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Stage container imagery to execute neural damage analysis and view SVG telemetry.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
              <span>HOTKEYS:</span>
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px]">
                ESC (Reset)
              </kbd>
            </div>
          </div>

          {/* Error Alert Banner */}
          {analysis.isError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-950/50 border border-red-900/60 rounded-md flex items-start justify-between gap-3 text-xs text-red-300"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-red-200 uppercase tracking-wider mb-1">
                    Inspection Failed [{analysis.errorCode}]
                  </h4>
                  <p className="opacity-90">{analysis.error}</p>
                </div>
              </div>
              <button
                onClick={() => selectedFile && analysis.analyze(selectedFile)}
                className="px-3 py-1 bg-red-900/60 hover:bg-red-900 border border-red-800 text-red-100 rounded text-xs font-mono uppercase transition-colors shrink-0"
              >
                Retry Analysis
              </button>
            </motion.div>
          )}

          {/* Main 2-Pane Dashboard Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left Pane (65% Width): Canvas / Dropzone Viewport */}
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

            {/* Right Pane (35% Width): Telemetry Breakdown & Operations Sidebar */}
            <div className="lg:col-span-5 xl:col-span-4">
              {!previewUrl ? (
                /* Empty Telemetry Placeholder */
                <Card className="p-8 text-center flex flex-col items-center justify-center min-h-[320px] text-zinc-500">
                  <div className="w-12 h-12 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-3 text-zinc-600">
                    <RefreshCw className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-semibold text-zinc-300 mb-1">
                    Awaiting Inspection Imagery
                  </h4>
                  <p className="text-xs max-w-xs text-zinc-500 leading-relaxed">
                    Upload a container photo to view automated damage telemetry and vector bounding boxes.
                  </p>
                </Card>
              ) : (
                /* Active Telemetry Panel */
                <div className="space-y-6">
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
        </section>

        {/* Architecture Blueprint Section */}
        <div ref={architectureRef}>
          <ArchitectureBlueprint />
        </div>
      </main>

      {/* System Telemetry Footer */}
      <Footer />
    </div>
  );
}
