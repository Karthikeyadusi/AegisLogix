import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Shield, AlertTriangle, CheckCircle2, Loader2, RefreshCw, ChevronRight, FileDown, FileJson } from 'lucide-react';

interface DamageDetail {
  class: string;
  conf: number;
}

interface AnalysisResult {
  status: string;
  total_issues: number;
  details: DamageDetail[];
  image_data: string;
}

export default function Analyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showProcessed, setShowProcessed] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      return;
    }
    setFile(selectedFile);
    setError(null);
    setResult(null);
    setShowProcessed(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:8000/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError('Failed to connect to the analysis engine. Ensure the local backend is running at http://127.0.0.1:8000');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setShowProcessed(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
            <Shield className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">AegisLogix <span className="text-cyan-400">Vision</span></h1>
            <p className="text-slate-400 text-sm">Enterprise Container Damage Analysis System</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded-full border border-slate-800">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-medium text-slate-300 uppercase tracking-wider">System Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Upload & Preview */}
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="sticky top-8 space-y-6">
            {!preview ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative group cursor-pointer aspect-video rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-12 text-center
                ${isDragging 
                  ? 'border-cyan-500 bg-cyan-500/5' 
                  : 'border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-900'
                }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
              <div className="p-4 bg-slate-800 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <Upload className="w-8 h-8 text-slate-400 group-hover:text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Initialize Scan</h3>
              <p className="text-slate-400 max-w-xs">
                Drag and drop container imagery or click to browse local storage
              </p>
              <div className="mt-6 flex gap-4 text-xs text-slate-500 font-mono">
                <span>JPG</span>
                <span>PNG</span>
                <span>MAX 10MB</span>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl"
              >
                {result && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-950/80 backdrop-blur-md p-1 rounded-lg border border-slate-700 flex items-center gap-1 z-20">
                    <button 
                      onClick={() => setShowProcessed(false)} 
                      className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                        !showProcessed ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Original
                    </button>
                    <button 
                      onClick={() => setShowProcessed(true)} 
                      className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                        showProcessed ? 'bg-cyan-500/20 text-cyan-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {showProcessed && <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />}
                      Analyzed
                    </button>
                  </div>
                )}
                
                <AnimatePresence mode="wait">
                  {(!result || !showProcessed) ? (
                    <motion.img 
                      key="original"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      src={preview!} 
                      className="w-full h-auto object-cover"
                      alt="Container Preview"
                    />
                  ) : (
                    <motion.img 
                      key="analyzed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      src={`data:image/jpeg;base64,${result.image_data}`} 
                      className="w-full h-auto object-cover"
                      alt="Analyzed"
                    />
                  )}
                </AnimatePresence>
                
                {loading && (
                  <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex flex-col items-center justify-center overflow-hidden">
                    {/* Scanning Line */}
                    <motion.div 
                      initial={{ top: '-5%' }}
                      animate={{ top: '105%' }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 w-full h-1 bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8),0_0_40px_rgba(34,211,238,0.4)] z-10"
                    />
                    
                    {/* Scanning Gradient Overlay */}
                    <motion.div 
                      initial={{ top: '-50%' }}
                      animate={{ top: '100%' }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 w-full h-[50%] bg-gradient-to-b from-transparent to-cyan-500/10 pointer-events-none"
                    />

                    <div className="relative z-20 flex flex-col items-center">
                      <div className="p-4 bg-slate-950/80 rounded-2xl border border-cyan-500/30 backdrop-blur-md shadow-2xl">
                        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
                      </div>
                      <p className="mt-6 text-cyan-400 font-mono text-xs tracking-[0.3em] uppercase animate-pulse bg-slate-950/50 px-4 py-2 rounded-full border border-cyan-500/20 backdrop-blur-sm">
                        Neural Scan in Progress...
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>

              {!result && !loading && (
                <div className="flex justify-end">
                  <button
                    onClick={handleAnalyze}
                    className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-8 py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] active:scale-95 w-full sm:w-auto"
                  >
                    SCAN CONTAINER
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3"
            >
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="text-sm text-red-200">
                <p className="font-semibold mb-1">Connection Error</p>
                <p className="opacity-80">{error}</p>
              </div>
            </motion.div>
          )}
          </div>
        </div>

        {/* Right Column: Results & Details */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center p-8 border border-slate-800 rounded-2xl bg-slate-900/30 text-center"
              >
                <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-4">
                  <RefreshCw className="w-8 h-8 text-slate-600" />
                </div>
                <h4 className="text-slate-300 font-medium mb-2">Awaiting Telemetry</h4>
                <p className="text-slate-500 text-sm">
                  Upload an image to begin automated structural analysis
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Summary Card */}
                <div className={`p-6 rounded-2xl border transition-all duration-500 ${
                  result.total_issues > 0 
                    ? 'bg-red-500/5 border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.05)]' 
                    : 'bg-green-500/5 border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.05)]'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-mono text-slate-400 uppercase tracking-widest">Analysis Summary</h3>
                    {result.total_issues > 0 ? (
                      <AlertTriangle className="w-6 h-6 text-red-500" />
                    ) : (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    )}
                  </div>
                  
                  <div className="flex gap-6 mb-4">
                    <div className="flex flex-col">
                      <span className={`text-4xl font-bold ${result.total_issues > 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {result.details.filter(d => d.conf >= 0.70).length}
                      </span>
                      <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold flex items-center gap-1 mt-1">
                        <div className="w-2 h-2 rounded-full bg-red-500" /> Critical
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-4xl font-bold text-amber-500">
                        {result.details.filter(d => d.conf < 0.70).length}
                      </span>
                      <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold flex items-center gap-1 mt-1">
                        <div className="w-2 h-2 rounded-full bg-amber-500" /> Minor
                      </span>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-slate-400 leading-relaxed">
                    {result.total_issues > 0 
                      ? `Structural anomalies identified. Immediate inspection recommended for ${result.total_issues} identified points of failure.`
                      : 'No structural damage detected. Container integrity verified within operational parameters.'
                    }
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:border-cyan-500/30 text-slate-300 transition-all group">
                    <FileDown className="w-6 h-6 text-slate-400 group-hover:text-cyan-400" />
                    <span className="text-xs font-bold uppercase tracking-wider">Download Report</span>
                  </button>
                  <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:border-cyan-500/30 text-slate-300 transition-all group">
                    <FileJson className="w-6 h-6 text-slate-400 group-hover:text-cyan-400" />
                    <span className="text-xs font-bold uppercase tracking-wider">Export JSON</span>
                  </button>
                </div>

                <button
                  onClick={reset}
                  className="w-full py-4 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 transition-all text-sm font-medium flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  NEW ANALYSIS
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Section: Detected Anomalies */}
      {result && result.details.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-slate-800 pt-8"
        >
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-cyan-400" />
            Detected Anomalies Breakdown
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {result.details.map((detail, idx) => {
              const isCritical = detail.conf >= 0.70;
              const severityColor = isCritical ? 'text-red-400' : 'text-amber-400';
              const barColor = isCritical ? 'bg-red-500' : 'bg-amber-500';
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-5 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors shadow-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold border border-slate-700 ${severityColor}`}>
                        {idx + 1}
                      </div>
                      <span className="font-semibold text-white capitalize text-lg">{detail.class}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-mono text-slate-400">{(detail.conf * 100).toFixed(1)}% CONF</span>
                      <span className={`text-[10px] uppercase font-bold tracking-wider ${severityColor}`}>
                        {isCritical ? 'Critical' : 'Minor'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${detail.conf * 100}%` }}
                      transition={{ duration: 1, delay: 0.3 + (idx * 0.1) }}
                      className={`h-full rounded-full ${barColor}`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
