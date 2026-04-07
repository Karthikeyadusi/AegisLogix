import Analyzer from './components/Analyzer';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/30">
      {/* Background Grid Effect */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-20" />
      
      <main className="relative pt-8 pb-24">
        <Analyzer />
      </main>

      {/* Footer */}
      <footer className="relative border-t border-slate-900 py-8 bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-mono uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            AegisLogix v4.2.0-STABLE
          </div>
          <div className="text-slate-600 text-[10px] font-mono uppercase tracking-widest">
            Secure Neural Link Established • 128-bit Encryption
          </div>
        </div>
      </footer>
    </div>
  );
}
