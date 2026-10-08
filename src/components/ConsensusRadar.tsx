import React from 'react';
import { Globe2, Radio, ShieldCheck, AlertCircle } from 'lucide-react';
import { GridScenario } from '../App';

interface Props {
  scenario: GridScenario;
  varianceDrift: number;
}

export function ConsensusRadar({ scenario, varianceDrift }: Props) {
  const isFault = scenario === 'fault';
  const isSmog = scenario === 'smog';

  // Surrounding 5 peer nodes placed at angles around center
  const peers = [
    { id: 'ARRAY-01', angle: 30, dist: 70, name: 'North Punjab Feeder' },
    { id: 'ARRAY-02', angle: 100, dist: 85, name: 'Rajasthan West Farm' },
    { id: 'ARRAY-04', angle: 170, dist: 75, name: 'Tamil Nadu Substation' },
    { id: 'ARRAY-05', angle: 240, dist: 80, name: 'Gujarat Coastal Array' },
    { id: 'ARRAY-06', angle: 310, dist: 90, name: 'Jharkhand Rural Hub' },
  ];

  return (
    <div className="rounded-2xl bg-[#070D1A] border-2 border-cyan-500/40 p-6 space-y-5 shadow-2xl relative overflow-hidden font-mono">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#161B33] pb-3 text-xs">
        <div className="flex items-center gap-2 text-cyan-400">
          <Radio className="w-4 h-4 animate-pulse" />
          <span className="font-bold uppercase tracking-wider">1.0 km Geospatial Consensus Radar</span>
        </div>
        <span className="text-[10px] text-slate-400 bg-black/60 px-2 py-0.5 rounded border border-[#161B33]">
          GIS Ring Buffer: 1,000m
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* The Circular Radar Scope (md:col-span-7) */}
        <div className="md:col-span-7 flex justify-center py-2">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border border-cyan-500/30 bg-black/80 flex items-center justify-center overflow-hidden shadow-inner">
            {/* Concentric distance rings */}
            <div className="absolute inset-4 rounded-full border border-cyan-500/20 pointer-events-none" />
            <div className="absolute inset-14 rounded-full border border-cyan-500/20 pointer-events-none" />
            <div className="absolute inset-24 rounded-full border border-cyan-500/10 pointer-events-none" />

            {/* Crosshairs */}
            <div className="absolute inset-x-0 top-1/2 h-[1px] bg-cyan-500/20 pointer-events-none" />
            <div className="absolute inset-y-0 left-1/2 w-[1px] bg-cyan-500/20 pointer-events-none" />

            {/* Rotating radar beam */}
            <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(6,182,212,0.25)_360deg)] animate-[spin_4s_linear_infinite] pointer-events-none" />

            {/* Target Node at Center (ARRAY-03) */}
            <div className="relative z-10 flex flex-col items-center">
              <span className={`w-4 h-4 rounded-full border-2 transition-all ${
                isFault
                  ? 'bg-rose-500 border-white shadow-lg shadow-rose-500/80 animate-ping'
                  : isSmog
                  ? 'bg-amber-400 border-amber-200 shadow-lg shadow-amber-500/50'
                  : 'bg-emerald-400 border-white shadow-lg shadow-emerald-500/50'
              }`} />
              <span className="text-[9px] font-bold text-white mt-1 px-1 rounded bg-black/80 border border-slate-700">
                ARRAY-03 (Target)
              </span>
            </div>

            {/* 5 Surrounding Peer Nodes */}
            {peers.map((peer, idx) => {
              const rad = (peer.angle * Math.PI) / 180;
              const x = Math.cos(rad) * peer.dist;
              const y = Math.sin(rad) * peer.dist;

              // In smog mode, peers also dim amber in synchrony!
              // In fault mode, peers stay bright healthy green!
              const peerColor = isSmog
                ? 'bg-amber-400 border-amber-300'
                : 'bg-emerald-400 border-emerald-200';

              return (
                <div
                  key={idx}
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                  className="absolute z-10 flex flex-col items-center"
                >
                  <span className={`w-2.5 h-2.5 rounded-full border transition-all ${peerColor}`} />
                  <span className="text-[8px] text-slate-300 px-1 rounded bg-black/80 mt-0.5 scale-90 whitespace-nowrap">
                    {peer.id}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Radar Telemetry & Verdict (md:col-span-5) */}
        <div className="md:col-span-5 space-y-3 text-xs">
          <div className="p-3.5 rounded-xl bg-black/60 border border-[#161B33] space-y-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Spatial Correlation Matrix:
            </span>
            <div className="space-y-1 text-slate-300 text-[11px]">
              <div className="flex justify-between">
                <span>Target Array 03:</span>
                <strong className={isFault ? 'text-rose-400' : isSmog ? 'text-amber-400' : 'text-emerald-400'}>
                  {isFault ? '1.1 kW (-81%)' : isSmog ? '1.2 kW (-79%)' : '5.6 kW (Nominal)'}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Cluster Mean (5 Peers):</span>
                <strong className={isSmog ? 'text-amber-400' : 'text-emerald-400'}>
                  {isSmog ? '1.3 kW (-77%)' : '5.5 kW (Nominal)'}
                </strong>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-1">
                <span>Spatial Variance Drift (Δ):</span>
                <strong className={`text-sm ${isFault ? 'text-rose-400 font-black' : 'text-cyan-400'}`}>
                  {varianceDrift}% {isFault ? '(> 12% THRESHOLD)' : '(≤ 12% SYNCHRONOUS)'}
                </strong>
              </div>
            </div>
          </div>

          {/* Instant Plain-English Mathematical Deduction */}
          <div className={`p-3.5 rounded-xl border text-[11px] leading-relaxed ${
            isFault
              ? 'bg-rose-950/40 border-rose-500 text-rose-300'
              : isSmog
              ? 'bg-amber-950/40 border-amber-500 text-amber-300'
              : 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
          }`}>
            <strong>The Mathematical Proof:</strong>
            <p className="mt-1 font-sans">
              {isFault
                ? 'Only Array 03 crashed while all 5 surrounding nodes within 1.0 km are generating 5.5 kW under identical sunshine. Probability of weather cause: 0.02%. Definite hardware failure.'
                : isSmog
                ? 'All 6 nodes in the 1.0 km radius dropped in exact temporal synchrony (Δ=2.1%). Zero probability of 6 simultaneous hardware breaks. Definite regional smog blanket.'
                : 'All 6 arrays are in spatial consensus equilibrium. Variance drift Δ=0.0%. No operator intervention needed.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
