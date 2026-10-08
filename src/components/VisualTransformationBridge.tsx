import React from 'react';
import { AlertTriangle, ArrowRight, CheckCircle2, ChevronRight, Eye, Flame, ShieldAlert, Sparkles, Wand2, Zap } from 'lucide-react';

interface Props {
  onExploreProduct?: () => void;
}

export function VisualTransformationBridge({ onExploreProduct }: Props) {
  return (
    <div className="relative w-full rounded-3xl overflow-hidden border-2 border-cyan-500/50 shadow-[0_0_80px_rgba(6,182,212,0.22)]">
      {/* Cinematic Aerial Solar Farm Background Photo with Soft Blur & Vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1509391365360-2e959784a276?q=80&w=2072&auto=format&fit=crop"
          alt="Aerial industrial solar farm at sunrise"
          className="w-full h-full object-cover filter brightness-[0.32] contrast-[1.2] blur-[2px] scale-105"
        />
        {/* Dark filmic gradient vignette overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#040810] via-black/55 to-[#040810]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.15)_0%,transparent_70%)]" />
      </div>

      {/* Main Content Stage Over the Background Photo */}
      <div className="relative z-10 p-8 sm:p-12 space-y-8">
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-slate-700/60">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 font-mono text-xs font-bold uppercase tracking-widest backdrop-blur-md">
              <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>The Architectural Paradigm Shift</span>
            </div>

            <h3 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-tight">
              The Blind Grid <span className="text-slate-400 font-light">vs.</span>{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-cyan-400 to-emerald-400">
                GridPulse Consensus
              </span>
            </h3>

            <p className="text-slate-300 text-sm sm:text-base font-sans leading-relaxed max-w-2xl font-medium">
              A side-by-side engineering breakdown of how conventional centralized monitoring fails during atmospheric anomalies, and how distributed spatial peer consensus solves the multi-million rupee diesel dispatch crisis.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 shrink-0">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>DIRECT ARCHITECTURAL COMPARISON</span>
          </div>
        </div>

        {/* Side-by-Side Static Dual Cards: The Blind Grid vs GridPulse Consensus (NO DRAGGER) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT CONTAINER: THE BLIND GRID */}
          <div className="relative rounded-2xl bg-gradient-to-b from-[#1c080e]/90 via-[#13070b]/90 to-[#0c0406]/95 border-2 border-rose-500/50 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 font-mono">
                <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold text-rose-300 px-2.5 py-1 rounded bg-rose-950/80 border border-rose-600/70">
                  <Flame className="w-3 h-3 text-rose-400" />
                  CONVENTIONAL SCADA (THE BLIND GRID)
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight pt-2">
                  Isolated Inverter Panics
                </h4>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-mono font-bold">
                82% False Alarms
              </span>
            </div>

            <p className="text-xs sm:text-sm text-rose-200/90 font-sans leading-relaxed">
              When winter fog, agricultural stubble smoke, or high-altitude cloud cover reduces string irradiation by 79%, central telemetry has zero spatial context. It interprets uniform atmospheric dimming as simultaneous multi-string failure.
            </p>

            {/* Architectural breakdown bullets */}
            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-3 rounded-lg bg-black/50 border border-rose-900/60 flex items-start gap-3">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-rose-300 font-bold block">No Peer Corroboration:</span>
                  <span className="text-slate-300 text-[11px]">Arrays evaluate power in complete isolation. Cannot distinguish between a microcrack and a cloud shadow.</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-black/50 border border-rose-900/60 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-amber-300 font-bold block">Premature Diesel Truck Dispatch:</span>
                  <span className="text-slate-300 text-[11px]">Automated dispatch sends 4x4 technician vans 60km into the desert to inspect healthy, merely fogged solar panels.</span>
                </div>
              </div>
            </div>

            {/* Financial & Operational Cost Box */}
            <div className="p-4 rounded-xl bg-black/70 border border-rose-800/80 font-mono text-xs space-y-2">
              <div className="flex justify-between items-center text-slate-300">
                <span>Diesel Wasted per False Alarm:</span>
                <span className="text-rose-400 font-bold">14.5 Liters (₹4,500 Burned)</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Mean Time to Resolution (MTTR):</span>
                <span className="text-amber-400 font-bold">4.2 Hours</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Annual Fleet Loss per 50MW:</span>
                <span className="text-rose-400 font-black text-sm">₹8,40,000 / Year</span>
              </div>
            </div>
          </div>

          {/* RIGHT CONTAINER: GRIDPULSE CONSENSUS */}
          <div className="relative rounded-2xl bg-gradient-to-b from-[#061824]/90 via-[#071d2c]/90 to-[#05111b]/95 border-2 border-emerald-500/50 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 font-mono">
                <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold text-emerald-300 px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-600/70">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  GRIDPULSE DISTRIBUTED SPATIAL CONSENSUS
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight pt-2">
                  Peer Ring Resolves in 42ms
                </h4>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono font-bold">
                100% Tru-Alarm Accuracy
              </span>
            </div>

            <p className="text-xs sm:text-sm text-cyan-200/90 font-sans leading-relaxed">
              ESP32 node micro-mesh continuously computes spatial variance <span className="font-mono text-emerald-300 font-bold">Δ = |Loss_node - Mean(Neighbors)|</span>. When a cloud sweeps through, all 6 nodes drop in unison (Δ &lt; 5%), immediately verifying atmospheric causation.
            </p>

            {/* Architectural breakdown bullets */}
            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-3 rounded-lg bg-black/50 border border-emerald-900/60 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-emerald-300 font-bold block">Immediate Atmospheric Smog Immunity:</span>
                  <span className="text-slate-300 text-[11px]">Zero false alarm tickets created. Diesel vans stay parked. Zero unneeded field dispatches.</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-black/50 border border-cyan-900/60 flex items-start gap-3">
                <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-cyan-300 font-bold block">Autonomous Actuator Trigger:</span>
                  <span className="text-slate-300 text-[11px]">If localized dust or hotspot occurs (Δ &gt; 12%), autonomous GPIO triggers the sprinkler solenoid for 45s to clear the debris.</span>
                </div>
              </div>
            </div>

            {/* Operational & Consensus Latency Box */}
            <div className="p-4 rounded-xl bg-black/70 border border-emerald-800/80 font-mono text-xs space-y-2">
              <div className="flex justify-between items-center text-slate-300">
                <span>Consensus Resolution Speed:</span>
                <span className="text-emerald-400 font-bold">42 Milliseconds (Real-Time)</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>False Dispatches Suppressed:</span>
                <span className="text-emerald-400 font-bold">100% (Zero Wasted Fuel)</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Capital Efficiency ROI:</span>
                <span className="text-emerald-300 font-black text-sm">+₹8,40,000 / Fleet Net Savings</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action cue footer into the Highway */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-700/60">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block">
              Continuous Verification Architecture
            </span>
            <h4 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
              See How 6 Nodes Transmit Over 1.0 km in the Physical Highway Below
            </h4>
          </div>

          {onExploreProduct && (
            <button
              onClick={onExploreProduct}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-300 text-black font-black text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-xl shadow-cyan-500/20 flex items-center gap-2 cursor-pointer shrink-0"
            >
              <span>Explore Highway Matrix</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
