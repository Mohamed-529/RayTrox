import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Globe2, Radio, Zap, Activity, Info, RefreshCw } from 'lucide-react';

interface Props {
  scenario: string;
  varianceDrift: number;
}

export function HorizontalConsensusHighway({ scenario, varianceDrift }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('ARRAY-03');
  const [telemetryTick, setTelemetryTick] = useState<number>(0);

  // Micro-fluctuation generator to demonstrate live continuous telemetry
  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetryTick((prev) => (prev + 1) % 100);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  const isFault = scenario === 'fault';
  const isSmog = scenario === 'smog';

  // Real-world dynamic baseline + noise generator based on physical farm irradiance
  const getDynamicPower = (baseKw: number, isTarget: boolean) => {
    if (isTarget && isFault) {
      // Burnout / cracked sub-string drop
      const noise = ((telemetryTick % 5) - 2) * 0.02;
      return (1.1 + noise).toFixed(2);
    }
    if (isSmog) {
      // Atmospheric optical extinction (uniform attenuation across all 6 arrays in the 1km ring)
      const noise = ((telemetryTick % 7) - 3) * 0.015;
      return (1.28 + noise).toFixed(2);
    }
    // Nominal clear-sky irradiance (~980 W/m² STC equivalent)
    const jitter = (((telemetryTick + baseKw * 10) % 9) - 4) * 0.03;
    return (baseKw + jitter).toFixed(2);
  };

  const nodes = [
    {
      id: 'ARRAY-01',
      region: 'Array Alpha · 0m – 160m',
      role: 'Peer Node #1',
      baseKw: 5.52,
      irradiance: isSmog ? '214 W/m²' : '982 W/m²',
      cellTemp: '34.2 °C',
      vString: '231.8 V',
      iString: isSmog ? '5.4 A' : '23.8 A',
      status: isSmog ? 'Uniform Smog Drop' : 'Optimal Sync',
      ping: '14ms',
      coordinates: '28.4595° N, 77.0266° E',
    },
    {
      id: 'ARRAY-02',
      region: 'Array Beta · 170m – 330m',
      role: 'Peer Node #2',
      baseKw: 5.46,
      irradiance: isSmog ? '211 W/m²' : '978 W/m²',
      cellTemp: '34.5 °C',
      vString: '230.9 V',
      iString: isSmog ? '5.3 A' : '23.6 A',
      status: isSmog ? 'Uniform Smog Drop' : 'Optimal Sync',
      ping: '18ms',
      coordinates: '28.4601° N, 77.0278° E',
    },
    {
      id: 'ARRAY-03',
      region: 'Array Gamma · 340m – 500m (Target)',
      role: 'EVALUATION TARGET',
      baseKw: 5.58,
      irradiance: isSmog ? '213 W/m²' : '980 W/m²',
      cellTemp: isFault ? '87.4 °C (HOTSPOT)' : '34.3 °C',
      vString: isFault ? '184.2 V (DROP)' : '231.4 V',
      iString: isFault ? '6.0 A (CHOKED)' : isSmog ? '5.3 A' : '23.9 A',
      status: isFault ? 'CRITICAL ISOLATED FAULT' : isSmog ? 'Uniform Smog Drop' : 'Optimal Sync',
      ping: '16ms',
      coordinates: '28.4612° N, 77.0291° E',
    },
    {
      id: 'ARRAY-04',
      region: 'Array Delta · 510m – 670m',
      role: 'Peer Node #3',
      baseKw: 5.49,
      irradiance: isSmog ? '215 W/m²' : '981 W/m²',
      cellTemp: '34.1 °C',
      vString: '231.2 V',
      iString: isSmog ? '5.4 A' : '23.7 A',
      status: isSmog ? 'Uniform Smog Drop' : 'Optimal Sync',
      ping: '21ms',
      coordinates: '28.4620° N, 77.0305° E',
    },
    {
      id: 'ARRAY-05',
      region: 'Array Epsilon · 680m – 840m',
      role: 'Peer Node #4',
      baseKw: 5.44,
      irradiance: isSmog ? '212 W/m²' : '976 W/m²',
      cellTemp: '34.7 °C',
      vString: '230.5 V',
      iString: isSmog ? '5.3 A' : '23.5 A',
      status: isSmog ? 'Uniform Smog Drop' : 'Optimal Sync',
      ping: '19ms',
      coordinates: '28.4629° N, 77.0319° E',
    },
    {
      id: 'ARRAY-06',
      region: 'Array Zeta · 850m – 1000m',
      role: 'Peer Node #5',
      baseKw: 5.51,
      irradiance: isSmog ? '214 W/m²' : '979 W/m²',
      cellTemp: '34.4 °C',
      vString: '231.1 V',
      iString: isSmog ? '5.4 A' : '23.8 A',
      status: isSmog ? 'Uniform Smog Drop' : 'Optimal Sync',
      ping: '24ms',
      coordinates: '28.4638° N, 77.0332° E',
    },
  ];

  const activeNode = nodes.find((n) => n.id === selectedNodeId) || nodes[2];

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Highway Scene Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4">
        <div>
          <div className="text-[11px] font-mono font-bold tracking-widest text-[#00ff88] uppercase flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#00ff88] animate-pulse" />
            1.0 KM Spatial Microgrid Topology · 6 Array Consensus Ring
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Why 6 Continuous Arrays? Peer Consensus Explained
          </h3>
        </div>

        {/* Real-time Indicator & Horizontal Navigation */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-slate-300 bg-[#061220] px-3 py-1.5 rounded-lg border border-cyan-500/30">
            <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-ping" />
            <span>LIVE TELEMETRY TICK #{telemetryTick}</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-xs">
            <button
              onClick={() => scroll('left')}
              className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="Scroll Left"
              aria-label="Scroll left"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-bold transition-colors cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              title="Scroll Right"
              aria-label="Scroll right"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Operational Rationale Box: Why 6 arrays across 1km? */}
      <div className="p-4 rounded-xl bg-[#061220]/90 border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-xs shadow-md">
        <div className="flex items-start gap-3">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-slate-300 leading-relaxed font-sans text-xs">
            <strong className="text-white font-mono uppercase tracking-wide">Why Peer Consensus across 1km? </strong>
            A single inverter only measures its own output. If output drops by 79%, a standalone inverter cannot tell whether a dark cloud/smog covered the sky or if internal silicon cracked. By polling 6 neighboring arrays situated within a 1.0 km radius, the digital twin mathematically computes spatial variance ($\Delta$). If all 6 peers drop equally ($\Delta \le 3.5\%$), it is weather. If only Array-03 drops ($\Delta = 81.0\%$), it is hardware failure.
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-2 text-[11px] font-mono bg-black/60 px-3 py-1.5 rounded-lg border border-white/[0.08]">
          <span className="text-slate-400">Ring Latency:</span>
          <span className="text-[#00ff88] font-bold">18.4 ms avg</span>
        </div>
      </div>

      {/* The Horizontal Panning Track across 1.0 km */}
      <div
        ref={containerRef}
        className="flex gap-5 overflow-x-auto pb-4 pt-1 scroll-smooth no-scrollbar"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {nodes.map((node, idx) => {
          const isTarget = node.id === 'ARRAY-03';
          const isSelected = selectedNodeId === node.id;
          const livePowerKw = getDynamicPower(node.baseKw, isTarget);

          return (
            <div
              key={idx}
              onClick={() => setSelectedNodeId(node.id)}
              style={{ scrollSnapAlign: 'start' }}
              className={`shrink-0 w-80 sm:w-[350px] rounded-2xl p-5 border-2 transition-all space-y-3.5 relative overflow-hidden cursor-pointer select-none ${
                isSelected
                  ? 'ring-2 ring-[#00ff88] scale-[1.01]'
                  : 'hover:border-slate-600'
              } ${
                isTarget
                  ? isFault
                    ? 'bg-[#1a0509]/90 border-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.25)]'
                    : 'bg-[#06182c]/90 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.2)]'
                  : 'bg-[#071322]/85 border-slate-800'
              }`}
            >
              {/* Connector Optical Pulse Line running through the 1km ring */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#00ff88] to-transparent opacity-70" />

              {/* Card Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-white">{node.id}</span>
                  <span className="text-[10px] font-mono text-slate-500">• {idx * 170}m</span>
                </div>
                <span
                  className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    isTarget
                      ? isFault
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-[#00ff88] text-black font-extrabold'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {node.role}
                </span>
              </div>

              {/* Section Spatial Zone */}
              <div>
                <h4 className="text-sm font-bold text-white tracking-wide">{node.region}</h4>
                <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between mt-0.5">
                  <span>GPS: {node.coordinates}</span>
                  <span className="text-cyan-400">{node.ping}</span>
                </div>
              </div>

              {/* Live Shunt Telemetry Specs */}
              <div className="p-3 rounded-xl bg-black/75 border border-white/[0.08] space-y-1.5 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[11px]">Dynamic Output:</span>
                  <strong className="text-white text-sm font-mono tracking-tight flex items-center gap-1">
                    {livePowerKw} kW
                    <span className="text-[9px] text-[#00ff88] font-normal">
                      ({((Number(livePowerKw) / node.baseKw) * 100).toFixed(0)}%)
                    </span>
                  </strong>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span>String Busbar:</span>
                  <span className="text-slate-200 font-bold">{node.vString} / {node.iString}</span>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span>Irradiance:</span>
                  <span className="text-amber-400">{node.irradiance}</span>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-white/[0.06] pt-1">
                  <span>Cluster Consensus:</span>
                  <span
                    className={`font-bold ${
                      isTarget && isFault
                        ? 'text-rose-400 font-black'
                        : isSmog
                        ? 'text-amber-400'
                        : 'text-[#00ff88]'
                    }`}
                  >
                    {node.status}
                  </span>
                </div>
              </div>

              {/* Spatial Drift Delta Badge */}
              {isTarget ? (
                <div className="p-2.5 rounded-lg bg-black/90 border border-cyan-500/40 text-[11px] font-mono space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-300">Spatial Drift (Δ):</span>
                    <span className={isFault ? 'text-rose-400' : 'text-[#00ff88]'}>
                      {varianceDrift}%
                    </span>
                  </div>
                  <span className="text-slate-400 block text-[9px] leading-tight">
                    {isFault
                      ? '➔ Single Array Anomaly Confirmed (|Δ| > 12.0%)'
                      : '➔ Synchronous Weather Attenuation (|Δ| ≤ 3.5%)'}
                  </span>
                </div>
              ) : (
                <div className="text-[10px] font-mono text-slate-500 text-center">
                  Consensus Peer Validator · Weight = 1.00
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Node Detailed Teardown Panel */}
      <div className="p-4 rounded-xl bg-[#061220] border border-white/[0.08] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <Activity className="w-4 h-4 text-[#00ff88]" />
          <span className="text-slate-300">
            Currently Inspecting: <strong className="text-white">{activeNode.id}</strong> ({activeNode.region})
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">Cell Temp: <strong className="text-amber-400">{activeNode.cellTemp}</strong></span>
        </div>

        <div className="text-slate-400 text-[11px]">
          Click any card to cross-compare telemetry across the 1.0 km array line.
        </div>
      </div>
    </div>
  );
}
