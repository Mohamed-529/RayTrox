import React, { useState } from 'react';
import { ArrowUpRight, Scale, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';

export function MonumentalTypographicNumbers() {
  const [activeStat, setActiveStat] = useState<number>(0);

  const stats = [
    {
      giantNumber: '42ms',
      label: 'CONSENSUS LATENCY',
      title: 'Real-Time Edge Evaluation vs 14-Day Manual Drone Rounds',
      proof: 'AWS Lambda receives 6 MQTT payloads from INA219 sensors, normalizes power loss via the theoretical physics model, and solves spatial variance across the 1.0 km GIS mesh in exactly 42 milliseconds.',
      accent: 'text-cyan-400',
      stroke: 'text-stroke-cyan',
    },
    {
      giantNumber: '84',
      label: 'DIESEL TRUCKS CANCELLED',
      title: 'Averting 1,218 Liters of Wasted Fuel in Northern Smog Corridors',
      proof: 'By proving that the power dip is identical across 6 microgrid assets within 1,000 meters, GridPulse cancels false alarm dispatches, saving ₹3,78,000 in technician dispatch charges.',
      accent: 'text-emerald-400',
      stroke: 'text-stroke-emerald',
    },
    {
      giantNumber: '₹1.42L',
      label: 'MONTHLY CASH PROTECTED',
      title: 'Per 100kW Commercial Microgrid via JEV Arbitrage',
      proof: 'Calculated using Central Electricity Authority (CEA) industrial commercial feed-in tariffs, combining prevented hotspot laminate burns, unrecovered kWh generation, and suppressed logistics.',
      accent: 'text-amber-400',
      stroke: 'text-stroke-amber',
    },
    {
      giantNumber: '100%',
      label: 'ZERO CAPEX SENSORLESS',
      title: 'No $4,500 Pyranometers Required on Rooftops',
      proof: 'Traditional approaches fail because rooftop dust sensors themselves get dirty and break. GridPulse turns neighboring solar panels into virtual sensors with pure software consensus math.',
      accent: 'text-purple-400',
      stroke: 'text-stroke-purple',
    },
  ];

  const current = stats[activeStat];

  return (
    <div className="w-full space-y-12">
      {/* Header with Selector Pills */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-[11px] font-mono font-bold tracking-widest text-emerald-400 uppercase flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Chapter 04 · Monumental Field Impact
          </span>
          <h3 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight mt-1">
            Audited Engineering Scale
          </h3>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 bg-black/80 p-1.5 rounded-xl border border-slate-800 font-mono text-xs">
          {stats.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStat(idx)}
              className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                activeStat === idx
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {s.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* The Giant Number Screen Takeover */}
      <div className="relative py-8 select-none">
        <div className="text-[20vw] sm:text-[18vw] font-black tracking-tighter leading-none text-white/5 absolute -top-10 left-0 pointer-events-none font-mono">
          {current.giantNumber}
        </div>

        <div className="relative z-10 space-y-6">
          <div className="text-[14vw] sm:text-[12vw] font-black tracking-tighter leading-none font-mono drop-shadow-[0_0_50px_rgba(16,185,129,0.3)]">
            <span className={current.accent}>{current.giantNumber}</span>
          </div>

          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
              {current.label}
            </span>
            <h4 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight leading-snug">
              {current.title}
            </h4>
            <p className="text-slate-300 text-sm sm:text-base font-sans leading-relaxed pt-2">
              {current.proof}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
