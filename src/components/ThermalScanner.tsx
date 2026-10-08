import React, { useState } from 'react';
import { AlertTriangle, Eye, Flame, ShieldAlert, Zap } from 'lucide-react';

export function ThermalScanner() {
  const [hoveredCell, setHoveredCell] = useState<number | null>(15);
  const [viewMode, setViewMode] = useState<'thermal' | 'optical'>('thermal');

  // 24 silicon cells on a commercial half-cut module (6 rows x 4 cols)
  const cells = Array.from({ length: 24 }, (_, i) => i + 1);
  const isHotspotCell = (id: number) => id === 15 || id === 16;

  const currentCell = hoveredCell || 15;
  const isFaulty = isHotspotCell(currentCell);

  return (
    <div className="relative rounded-2xl bg-[#090D18] border-2 border-rose-500/50 p-6 space-y-5 shadow-2xl overflow-hidden group">
      {/* Background thermal ambient glow */}
      <div className={`absolute -right-20 -bottom-20 w-80 h-80 rounded-full blur-[100px] pointer-events-none transition-all duration-700 ${
        isFaulty ? 'bg-rose-500/20' : 'bg-cyan-500/10'
      }`} />

      {/* Header with Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#161B33] pb-3">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${isFaulty ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`} />
          <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            Interactive FLIR Thermal Scanner
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 text-slate-400 border border-[#161B33]">
            Drag cursor over cells
          </span>
        </div>

        <div className="flex items-center gap-1 bg-black/80 p-0.5 rounded-lg border border-[#161B33] text-[11px] font-mono">
          <button
            onClick={() => setViewMode('thermal')}
            className={`px-2.5 py-1 rounded font-bold transition-all cursor-pointer ${
              viewMode === 'thermal' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            🔥 Thermal FLIR
          </button>
          <button
            onClick={() => setViewMode('optical')}
            className={`px-2.5 py-1 rounded font-bold transition-all cursor-pointer ${
              viewMode === 'optical' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3 h-3 inline mr-1" />
            Visible Light
          </button>
        </div>
      </div>

      {/* Main Interactive Stage: 24-Cell Solar Panel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* The Solar Module Matrix (md:col-span-7) */}
        <div className="md:col-span-7 space-y-2">
          <div className="relative p-3 rounded-xl bg-black/90 border border-slate-700/80 shadow-inner">
            {/* Busbar lines across panel */}
            <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 h-[1px] bg-slate-600/40 pointer-events-none" />

            <div className="grid grid-cols-4 gap-1.5 aspect-[4/3]">
              {cells.map((id) => {
                const isHot = isHotspotCell(id);
                const isHovered = hoveredCell === id;

                let cellBg = '';
                if (viewMode === 'thermal') {
                  if (isHot) {
                    cellBg = isHovered
                      ? 'bg-gradient-to-br from-rose-500 via-amber-500 to-yellow-300 animate-pulse border-white'
                      : 'bg-gradient-to-br from-rose-600 via-amber-600 to-orange-700 border-rose-400';
                  } else {
                    cellBg = isHovered
                      ? 'bg-blue-600/60 border-cyan-400'
                      : 'bg-gradient-to-br from-slate-900 to-blue-950/70 border-slate-800';
                  }
                } else {
                  // Optical visible mode: Silicon wafer looks completely uniform to the naked eye!
                  cellBg = isHot && isHovered
                    ? 'bg-slate-800 border-amber-500/80'
                    : 'bg-gradient-to-br from-[#0c1428] to-[#080d1a] border-slate-800/80';
                }

                return (
                  <div
                    key={id}
                    onMouseEnter={() => setHoveredCell(id)}
                    className={`rounded-sm border p-1 flex flex-col justify-between transition-all duration-150 cursor-crosshair relative overflow-hidden ${cellBg} ${
                      isHovered ? 'scale-105 z-10 shadow-lg' : ''
                    }`}
                  >
                    <span className="text-[8px] font-mono text-slate-400/80 font-bold">#{id}</span>
                    {viewMode === 'thermal' && isHot && (
                      <span className="text-[9px] font-mono font-black text-white text-center animate-bounce">
                        87°C
                      </span>
                    )}
                    {viewMode === 'optical' && isHot && isHovered && (
                      <span className="text-[8px] font-mono text-amber-300 text-center">
                        Micro-crack
                      </span>
                    )}
                    <span className="text-[8px] font-mono text-right text-slate-500">
                      {isHot ? '0.11V' : '0.54V'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1">
            <span>Cell Architecture: M10 Monocrystalline 182mm</span>
            <span className="text-amber-400 font-bold">Hotspot Trap: Cells #15-16</span>
          </div>
        </div>

        {/* Live Diagnostics Telemetry Readout (md:col-span-5) */}
        <div className="md:col-span-5 space-y-3 font-mono text-xs">
          <div className={`p-4 rounded-xl border transition-all ${
            isFaulty
              ? 'bg-rose-950/50 border-rose-500 text-rose-200'
              : 'bg-[#0B0F19] border-[#161B33] text-slate-300'
          }`}>
            <div className="flex items-center justify-between pb-2 border-b border-[#161B33]">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Scanned Target: Cell #{currentCell}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                isFaulty
                  ? 'bg-rose-900 text-rose-300 border border-rose-700 animate-pulse'
                  : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
              }`}>
                {isFaulty ? 'THERMAL RUNAWAY' : 'NORMAL FLUX'}
              </span>
            </div>

            <div className="pt-2 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Junction Temp:</span>
                <strong className={`text-sm ${isFaulty ? 'text-rose-400 font-black' : 'text-emerald-400'}`}>
                  {isFaulty ? '87.4 °C (CRITICAL)' : '28.2 °C (NOMINAL)'}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cell Voltage:</span>
                <span className="text-white">{isFaulty ? '0.11 V (Drop: -79%)' : '0.54 V'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Shunt Resistance:</span>
                <span className={isFaulty ? 'text-rose-300 font-bold' : 'text-slate-300'}>
                  {isFaulty ? '48.2 Ω (Short)' : '1,420 Ω (Healthy)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Diode State:</span>
                <span className={isFaulty ? 'text-amber-300 font-bold' : 'text-emerald-400'}>
                  {isFaulty ? 'REVERSE-BIASED' : 'FORWARD ACTIVE'}
                </span>
              </div>
            </div>
          </div>

          {/* Real Consequence Alert */}
          <div className="p-3.5 rounded-xl bg-black/80 border border-[#161B33] space-y-1.5 text-[11px] leading-relaxed">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase text-[10px]">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Why Classical Inverters Fail to Catch This:</span>
            </div>
            <p className="text-slate-300 font-sans">
              To the central string inverter, Cell #15 looks like harmless cloud shading! The string power drops by 18%, but without spatial consensus, the system cannot verify if the whole sky shaded or if this one module is cooking itself to death.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
