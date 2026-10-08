import React, { useState, useEffect, useMemo } from 'react';
import {
  Calculator,
  Cloud,
  CloudRain,
  Cpu,
  Droplets,
  Flame,
  Globe2,
  Layers,
  LineChart,
  Plug,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Sun,
  TrendingDown,
  Wind,
  Zap,
} from 'lucide-react';
import { useHardware } from '../context/HardwareContext';


export interface SolarNodeData {
  id: number;
  stringId: number;
  row: number;
  col: number;
  zone: 'Alpha' | 'Beta' | 'Gamma' | 'Delta';
  isPhysicalMaster: boolean;
  voltage: number; // Volts
  current: number; // Amps
  power: number; // Watts
  temp: number; // Celsius
  soilingPct: number; // 0 - 100% dust
  efficiency: number; // %
  status: 'nominal' | 'soiled' | 'rain_hold' | 'fault' | 'washing';
  hotspotCell?: number;
}

interface WeatherForecast {
  condition: 'sunny' | 'rain_impending' | 'smog' | 'cloudy';
  rainProbability: number;
  timeToRainHours: number;
  ambientTemp: number;
  humidity: number;
  solarIrradiance: number; // W/m2
}

export function DigitalTwinFleetMap() {
  // Weather state
  const [weather, setWeather] = useState<WeatherForecast>({
    condition: 'rain_impending',
    rainProbability: 82,
    timeToRainHours: 2.5,
    ambientTemp: 31,
    humidity: 78,
    solarIrradiance: 760,
  });

  // Selected node
  const [selectedNodeId, setSelectedNodeId] = useState<number>(1);
  const [filterMode, setFilterMode] = useState<'all' | 'faults' | 'soiled' | 'master'>('all');
  const [waterSavedLiters, setWaterSavedLiters] = useState<number>(14280);
  const [costSavedInr, setCostSavedInr] = useState<number>(4284);
  const [autoSimulate, setAutoSimulate] = useState<boolean>(true);

  // Generate 500 nodes (20 rows x 25 columns)
  const initialNodes = useMemo(() => {
    const list: SolarNodeData[] = [];
    let id = 1;
    for (let r = 0; r < 20; r++) {
      for (let c = 0; c < 25; c++) {
        const isMaster = id === 1;
        const zone: 'Alpha' | 'Beta' | 'Gamma' | 'Delta' =
          r < 10 ? (c < 12 ? 'Alpha' : 'Beta') : (c < 12 ? 'Gamma' : 'Delta');
        
        // Inject realistic variations
        let status: SolarNodeData['status'] = 'nominal';
        let soilingPct = 4 + (r * 1.5 + c * 0.8) % 18;
        let voltage = 38.2 + ((id * 7) % 15) * 0.1;
        let current = 10.4 + ((id * 11) % 10) * 0.08;
        let temp = 42.5 + ((id * 13) % 12) * 0.5;

        // Specific injected anomalies for demonstration
        if (id === 142) {
          status = 'fault';
          voltage = 14.2; // severely degraded
          current = 2.1;
          temp = 84.6; // hotspot
        } else if (id === 289 || id === 290 || id === 314 || id === 315) {
          status = 'soiled';
          soilingPct = 34.5;
          current = 7.1;
        }

        list.push({
          id,
          stringId: Math.floor(id / 10) + 1,
          row: r,
          col: c,
          zone,
          isPhysicalMaster: isMaster,
          voltage: Number(voltage.toFixed(1)),
          current: Number(current.toFixed(1)),
          power: Math.round(voltage * current),
          temp: Number(temp.toFixed(1)),
          soilingPct: Number(soilingPct.toFixed(1)),
          efficiency: Number((100 - soilingPct - (status === 'fault' ? 60 : 0)).toFixed(1)),
          status,
          hotspotCell: id === 142 ? 15 : undefined,
        });
        id++;
      }
    }
    return list;
  }, []);

  const { isConnected, telemetry } = useHardware();
  const [nodes, setNodes] = useState<SolarNodeData[]>(initialNodes);

  // Sync real hardware telemetry into Node 1 when connected
  useEffect(() => {
    if (!isConnected) return;
    setNodes((prev) =>
      prev.map((node) => {
        if (node.isPhysicalMaster) {
          const v = telemetry.voltage;
          const i = telemetry.current / 1000.0; // convert mA to A
          const p = telemetry.power;
          // Determine status based on live hardware values
          const isFault = v < 1.0 && i < 0.05;
          const isSoiled = v > 1.0 && v < 4.0;
          return {
            ...node,
            voltage: Number(v.toFixed(1)),
            current: Number(i.toFixed(2)),
            power: Math.round(p * 1000) > 0 ? Math.round(p * 1000) : Math.round(v * i),
            status: isFault ? 'fault' : isSoiled ? 'soiled' : 'nominal',
            efficiency: Number(Math.min(100, Math.max(10, (v / 6.0) * 100)).toFixed(1)),
          };
        }
        return node;
      })
    );
  }, [isConnected, telemetry]);

  // Live simulation tick for peers when autoSimulate is enabled
  useEffect(() => {
    if (!autoSimulate) return;
    const interval = setInterval(() => {
      setNodes((prev) =>
        prev.map((node) => {
          if (node.isPhysicalMaster && isConnected) {
            // Keep real hardware data, do not overwrite with simulated jitter
            return node;
          }
          if (node.isPhysicalMaster) {
            // Simulated micro-jitter when physical hardware is not connected
            const jitterV = Number((38.4 + (Math.random() - 0.5) * 0.4).toFixed(1));
            const jitterI = Number((10.5 + (Math.random() - 0.5) * 0.3).toFixed(1));
            return {
              ...node,
              voltage: jitterV,
              current: jitterI,
              power: Math.round(jitterV * jitterI),
            };
          }
          return node;
        })
      );
    }, 2000);
    return () => clearInterval(interval);
  }, [autoSimulate, isConnected]);


  // Selected node details
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  // Nearest peer nodes for Spatial Variance Consensus
  const peerNodes = useMemo(() => {
    const peers: SolarNodeData[] = [];
    const targetRow = selectedNode.row;
    const targetCol = selectedNode.col;

    for (const n of nodes) {
      if (n.id === selectedNode.id) continue;
      const dist = Math.abs(n.row - targetRow) + Math.abs(n.col - targetCol);
      if (dist <= 2) {
        peers.push(n);
        if (peers.length >= 6) break;
      }
    }
    return peers;
  }, [nodes, selectedNode]);

  // Consensus calculations
  const targetLossPct = 100 - selectedNode.efficiency;
  const meanPeerLossPct = peerNodes.length
    ? Number((peerNodes.reduce((acc, p) => acc + (100 - p.efficiency), 0) / peerNodes.length).toFixed(1))
    : 5.0;
  const spatialVarianceDelta = Number(Math.abs(targetLossPct - meanPeerLossPct).toFixed(1));
  const isConsensusFault = spatialVarianceDelta > 12.0;

  const [lastSimulationEvent, setLastSimulationEvent] = useState<string>(
    '🌧️ Default Scenario: Rain impending (82% prob in 2.5h) — Sprinklers automatically held to conserve 14,280L groundwater.'
  );

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    if (filterMode === 'faults') return nodes.filter((n) => n.status === 'fault');
    if (filterMode === 'soiled') return nodes.filter((n) => n.status === 'soiled' || n.status === 'rain_hold');
    if (filterMode === 'master') return nodes.filter((n) => n.isPhysicalMaster);
    return nodes;
  }, [nodes, filterMode]);

  const handleFilterChange = (mode: 'all' | 'faults' | 'soiled' | 'master') => {
    setFilterMode(mode);
    if (mode === 'faults') {
      setSelectedNodeId(142);
      setLastSimulationEvent('⚠️ Filter: Isolated Faults Active ➔ Selected Hotspot Node #142 (84.6°C, bypass failure). 499 normal nodes dimmed.');
    } else if (mode === 'master') {
      setSelectedNodeId(1);
      setLastSimulationEvent('★ Filter: Master Hardware Active ➔ Selected Physical ESP32 Node #1 (192.168.1.104). Virtual nodes dimmed.');
    } else if (mode === 'soiled') {
      setSelectedNodeId(289);
      setLastSimulationEvent('Filter: Dust Soiled Active ➔ Highlighted 4 soiled string nodes (#289, #290, #314, #315). Clean panels dimmed.');
    } else {
      setLastSimulationEvent('🌐 Filter: All Nodes Active ➔ Full 500-node utility fleet visible across all 4 quadrants.');
    }
  };

  // Weather scenario triggers
  const triggerWeatherPreset = (preset: 'rain' | 'arid' | 'smog') => {
    if (preset === 'rain') {
      setWeather({
        condition: 'rain_impending',
        rainProbability: 92,
        timeToRainHours: 1.8,
        ambientTemp: 28,
        humidity: 86,
        solarIrradiance: 580,
      });
      // Set soiled panels to rain_hold
      setNodes((prev) =>
        prev.map((n) => (n.status === 'soiled' ? { ...n, status: 'rain_hold' } : n))
      );
      setWaterSavedLiters((v) => v + 3500);
      setCostSavedInr((v) => v + 1050);
      setLastSimulationEvent(
        '🌧️ Weather Triggered: Rain forecast at 92% (1.8h away). Sprinklers HELD across all zones. Water conserved increased by +3,500L!'
      );
    } else if (preset === 'arid') {
      setWeather({
        condition: 'sunny',
        rainProbability: 5,
        timeToRainHours: 96,
        ambientTemp: 44,
        humidity: 18,
        solarIrradiance: 980,
      });
      // Return rain_hold to soiled
      setNodes((prev) =>
        prev.map((n) => (n.status === 'rain_hold' ? { ...n, status: 'soiled' } : n))
      );
      setLastSimulationEvent(
        '☀️ Weather Triggered: Arid dry season (44°C, 980 W/m²). Rain hold released; pre-dawn precision wash scheduled for dusty panels.'
      );
    } else if (preset === 'smog') {
      setWeather({
        condition: 'smog',
        rainProbability: 10,
        timeToRainHours: 72,
        ambientTemp: 22,
        humidity: 65,
        solarIrradiance: 320,
      });
      // Degrade all nodes uniformly to show consensus suppressing false alarms
      setNodes((prev) =>
        prev.map((n) => ({
          ...n,
          efficiency: Math.max(20, n.efficiency - 45),
          power: Math.round(n.power * 0.4),
        }))
      );
      setLastSimulationEvent(
        '🌫️ Weather Triggered: Heavy smog inversion. All 500 panels dropped power by 45% uniformly. Peer consensus drift Δ ≤ 12% ➔ False alarm suppressed!'
      );
    }
  };

  return (
    <div className="w-full rounded-3xl bg-[#090D16] border border-white/10 p-6 sm:p-10 space-y-8 text-slate-200 font-sans shadow-2xl">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & TELEMETRY SUMMARY                                          */}
      {/* ========================================================================= */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-semibold uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI-Driven Digital Twin &amp; Edge-Mesh Architecture</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-normal text-white tracking-tight">
            500-Node Solar Farm Fleet &amp; Physical ESP32 Bridge
          </h3>
          <p className="text-slate-400 text-sm max-w-2xl font-light">
            Real-time digital twin synchronizing 1 physical hardware edge node (ESP32 Gateway) with 499 virtual simulated string nodes across a 50 MW utility array.
          </p>
        </div>

        {/* Live Farm KPIs */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div className="px-4 py-3 rounded-xl bg-black/60 border border-white/10 space-y-1">
            <span className="text-slate-500 block text-[10px] uppercase">Fleet Size</span>
            <strong className="text-white text-sm">500 Nodes (50 MW)</strong>
          </div>
          <div className="px-4 py-3 rounded-xl bg-black/60 border border-emerald-500/30 space-y-1">
            <span className="text-emerald-400 block text-[10px] uppercase flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Master Node #001
            </span>
            <strong className="text-emerald-300 text-sm">ESP32 (192.168.1.104)</strong>
          </div>
          <div className="px-4 py-3 rounded-xl bg-black/60 border border-cyan-500/30 space-y-1">
            <span className="text-cyan-400 block text-[10px] uppercase flex items-center gap-1">
              <Droplets className="w-3 h-3 text-cyan-400" />
              Water Conserved
            </span>
            <strong className="text-cyan-300 text-sm">{waterSavedLiters.toLocaleString()} Liters</strong>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. THE 4 INNOVATION FEATURE PANELS                                        */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Feature 1: Spatial Variance Consensus */}
        <div className="p-5 rounded-2xl bg-[#0F1523]/80 border border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between text-cyan-400">
            <span className="font-mono text-xs font-bold uppercase tracking-wider">Feature 1</span>
            <Cpu className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-semibold text-white">Spatial Variance Consensus</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Cross-validates 6 adjacent string peers. Eliminates 82% false maintenance dispatches during uniform atmospheric smog.
          </p>
          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-500">Active Drift Δ</span>
            <span className={`font-bold ${isConsensusFault ? 'text-rose-400' : 'text-emerald-400'}`}>
              {spatialVarianceDelta}% {isConsensusFault ? '(Isolated Fault)' : '(Consensus Safe)'}
            </span>
          </div>
        </div>

        {/* Feature 2: Degradation & Dust Predictor */}
        <div className="p-5 rounded-2xl bg-[#0F1523]/80 border border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between text-amber-400">
            <span className="font-mono text-xs font-bold uppercase tracking-wider">Feature 2</span>
            <TrendingDown className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-semibold text-white">Degradation &amp; Dust Predictor</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            AI regression correlates irradiance ($G$) with current decay to predict soiling accumulation and optimal pre-dawn wash cycles.
          </p>
          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-500">Node #1 Soiling</span>
            <span className="text-amber-300 font-bold">{selectedNode.soilingPct}% (Clean in 3.2d)</span>
          </div>
        </div>

        {/* Feature 3: Smart Water-Resource Optimizer */}
        <div className="p-5 rounded-2xl bg-[#0F1523]/80 border border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between text-sky-400">
            <span className="font-mono text-xs font-bold uppercase tracking-wider">Feature 3</span>
            <CloudRain className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-semibold text-white">Smart Water Optimizer</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Integrates weather API. If rain is predicted within 3 hours, automated pump wash is suppressed, saving groundwater.
          </p>
          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-500">Rain Prob. (2.5h)</span>
            <span className="text-sky-300 font-bold">{weather.rainProbability}% (Hold Active)</span>
          </div>
        </div>

        {/* Feature 4: Interactive GIS Digital Twin */}
        <div className="p-5 rounded-2xl bg-[#0F1523]/80 border border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="font-mono text-xs font-bold uppercase tracking-wider">Feature 4</span>
            <Globe2 className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-semibold text-white">GIS Digital Twin Map</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            2D/3D interactive spatial array grid. Click any node below to inspect live electrical telemetry, hotspot risk, and waveform.
          </p>
          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-500">Selected Node</span>
            <span className="text-emerald-300 font-bold">Node #{selectedNode.id} ({selectedNode.zone})</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE SIMULATION & SCENARIO CONTROL BAR                           */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        {/* Dynamic Event Notification Bar (Tells user exactly what changed) */}
        <div className="px-4 py-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-cyan-200">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
            <span className="text-slate-400 text-[10px] uppercase tracking-wider font-bold shrink-0">Live Simulation Event:</span>
            <span className="text-white font-medium">{lastSimulationEvent}</span>
          </div>
          <span className="text-[10px] text-cyan-400/80 shrink-0 hidden sm:inline">
            Active Filter: <strong className="uppercase text-cyan-300">{filterMode} ({filteredNodes.length} nodes)</strong>
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-black/50 border border-white/[0.08] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 uppercase tracking-wider text-[11px]">Weather Simulation Injector:</span>
            <button
              onClick={() => triggerWeatherPreset('rain')}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                weather.condition === 'rain_impending'
                  ? 'bg-sky-950 text-sky-300 border-sky-500 ring-2 ring-sky-500/40 font-bold shadow-[0_0_15px_rgba(14,165,233,0.3)]'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              🌧️ Rain Predicted (Hold Wash &amp; Save Water)
            </button>
            <button
              onClick={() => triggerWeatherPreset('arid')}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                weather.condition === 'sunny'
                  ? 'bg-amber-950 text-amber-300 border-amber-500 ring-2 ring-amber-500/40 font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              ☀️ Arid / Desert (Dry Season Cleaning)
            </button>
            <button
              onClick={() => triggerWeatherPreset('smog')}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                weather.condition === 'smog'
                  ? 'bg-yellow-950 text-yellow-300 border-yellow-500 ring-2 ring-yellow-500/40 font-bold shadow-[0_0_15px_rgba(234,179,8,0.3)]'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              🌫️ Winter Smog Inversion (Consensus Test)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">Filter Nodes:</span>
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                filterMode === 'all' ? 'bg-white/20 text-white font-bold ring-1 ring-white/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              All (500)
            </button>
            <button
              onClick={() => handleFilterChange('master')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                filterMode === 'master' ? 'bg-amber-500/30 text-amber-300 font-bold border border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]' : 'text-slate-400 hover:text-white'
              }`}
            >
              ★ Master ESP32
            </button>
            <button
              onClick={() => handleFilterChange('faults')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                filterMode === 'faults' ? 'bg-rose-500/30 text-rose-300 font-bold border border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]' : 'text-slate-400 hover:text-white'
              }`}
            >
              ⚠️ Faults (#142)
            </button>
            <button
              onClick={() => handleFilterChange('soiled')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                filterMode === 'soiled' ? 'bg-yellow-500/30 text-yellow-300 font-bold border border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]' : 'text-slate-400 hover:text-white'
              }`}
            >
              Dust Soiled (4)
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MAIN MAP CANVAS (500-NODE SPATIAL ARRAY) & DETAIL TELEMETRY CARD        */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: 500-Node Interactive GIS Grid (8 Columns) */}
        <div className="lg:col-span-7 bg-black/60 rounded-2xl border border-white/[0.08] p-6 space-y-4">
          <div className="flex items-center justify-between font-mono text-xs text-slate-400 border-b border-white/[0.06] pb-3">
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>SPATIAL FLEET MATRIX (20 ROWS × 25 COLUMNS = 500 NODES)</span>
            </span>
            <span className="text-[11px] text-cyan-300">
              Showing <strong>{filteredNodes.length}</strong> of 500 · Click any dot to inspect
            </span>
          </div>

          {/* Dot Grid Map Container */}
          <div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(25, minmax(0, 1fr))' }}
            className="gap-1.5 p-3 bg-[#070A12] rounded-xl border border-white/[0.04] overflow-x-auto min-w-[500px]"
          >
            {nodes.map((node) => {
              const isSelected = node.id === selectedNode.id;
              const isPeer = peerNodes.some((p) => p.id === node.id);
              const isFilteredOut = filterMode !== 'all' && !filteredNodes.some((fn) => fn.id === node.id);

              let dotColor = 'bg-emerald-500/70 hover:bg-emerald-400';
              if (node.isPhysicalMaster) {
                dotColor = 'bg-amber-400 ring-2 ring-amber-300 shadow-[0_0_10px_#f59e0b] animate-pulse';
              } else if (node.status === 'fault') {
                dotColor = 'bg-rose-500 ring-2 ring-rose-400 shadow-[0_0_10px_#ef4444] animate-ping';
              } else if (node.status === 'rain_hold') {
                dotColor = 'bg-sky-400 ring-1 ring-sky-300';
              } else if (node.status === 'soiled') {
                dotColor = 'bg-yellow-500/80 hover:bg-yellow-400';
              }

              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  title={`Node #${node.id} | ${node.power}W | ${node.temp}°C | Status: ${node.status}`}
                  className={`w-3.5 h-3.5 rounded-sm transition-all cursor-pointer relative ${dotColor} ${
                    isSelected ? 'ring-2 ring-white scale-125 z-10' : ''
                  } ${isPeer ? 'ring-1 ring-cyan-400/80' : ''} ${
                    isFilteredOut ? 'opacity-15 grayscale scale-75 hover:opacity-80 hover:grayscale-0' : ''
                  }`}
                />
              );
            })}
          </div>

          {/* Map Legend */}
          <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] text-slate-400 pt-2 border-t border-white/[0.06]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 ring-1 ring-amber-300" />
              <span>Physical Master (ESP32)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              <span>Nominal Array (&gt;95%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-yellow-500" />
              <span>Dust Accumulated</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-sky-400" />
              <span>Rain Hold (Conserving Water)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
              <span>Isolated Fault</span>
            </div>
          </div>
        </div>

        {/* Right: Selected Node Digital Twin Telemetry Cockpit (4 Columns) */}
        <div className="lg:col-span-5 bg-[#0D121F] rounded-2xl border border-white/[0.08] p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                DIGITAL TWIN INSPECTION
              </span>
              <h4 className="text-xl font-bold text-white flex items-center gap-2">
                <span>Node #{selectedNode.id}</span>
                {selectedNode.isPhysicalMaster && (
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                    ★ PHYSICAL ESP32
                  </span>
                )}
              </h4>
            </div>

            <span
              className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase ${
                selectedNode.status === 'nominal'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                  : selectedNode.status === 'fault'
                  ? 'bg-rose-950 text-rose-300 border border-rose-700 animate-pulse'
                  : selectedNode.status === 'rain_hold'
                  ? 'bg-sky-950 text-sky-300 border border-sky-700'
                  : 'bg-yellow-950 text-yellow-300 border border-yellow-700'
              }`}
            >
              {selectedNode.status}
            </span>
          </div>

          {/* Real-Time Telemetry Quadrant */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-black/50 border border-white/[0.06] space-y-1">
              <span className="text-slate-500 text-[10px] block uppercase">Voltage (V_bus)</span>
              <strong className="text-white text-base font-semibold">{selectedNode.voltage} V</strong>
              <span className="text-[10px] text-slate-400 block">Nominal: 38.4 V</span>
            </div>
            <div className="p-3 rounded-xl bg-black/50 border border-white/[0.06] space-y-1">
              <span className="text-slate-500 text-[10px] block uppercase">Current (I_shunt)</span>
              <strong className="text-white text-base font-semibold">{selectedNode.current} A</strong>
              <span className="text-[10px] text-slate-400 block">Nominal: 10.5 A</span>
            </div>
            <div className="p-3 rounded-xl bg-black/50 border border-white/[0.06] space-y-1">
              <span className="text-slate-500 text-[10px] block uppercase">Power Output</span>
              <strong className="text-white text-base font-semibold">{selectedNode.power} W</strong>
              <span className="text-[10px] text-slate-400 block">Efficiency: {selectedNode.efficiency}%</span>
            </div>
            <div className="p-3 rounded-xl bg-black/50 border border-white/[0.06] space-y-1">
              <span className="text-slate-500 text-[10px] block uppercase">Silicon Temp</span>
              <strong
                className={`text-base font-semibold ${
                  selectedNode.temp > 75 ? 'text-rose-400' : 'text-slate-200'
                }`}
              >
                {selectedNode.temp} °C
              </strong>
              <span className="text-[10px] text-slate-400 block">
                {selectedNode.temp > 75 ? '⚠️ Thermal Hotspot' : 'Thermal: Normal'}
              </span>
            </div>
          </div>

          {/* Spatial Consensus Diagnostics against 6 Neighbors */}
          <div className="p-4 rounded-xl bg-black/60 border border-white/[0.06] space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-300 font-bold border-b border-white/[0.06] pb-2">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Spatial Consensus vs 6 Peers</span>
              </span>
              <span className="text-[10px] text-slate-400">42ms Latency</span>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Target Node Power Loss:</span>
                <span className="text-white font-bold">{targetLossPct}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Peer Cluster Mean Loss:</span>
                <span className="text-cyan-300 font-bold">{meanPeerLossPct}%</span>
              </div>
              <div className="flex justify-between border-t border-white/[0.06] pt-1">
                <span className="text-slate-400">Spatial Variance Drift Δ:</span>
                <strong className={`font-bold ${isConsensusFault ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {spatialVarianceDelta}% {isConsensusFault ? '> 12.0%' : '≤ 12.0%'}
                </strong>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04] text-[11px] font-sans">
              {isConsensusFault ? (
                <div className="text-rose-300 flex items-start gap-1.5">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>
                    <strong>Isolated Physical Breakdown:</strong> Target dropped alone while 6 neighbors generated nominal power. Water pump suppressed; technician repair ticket issued.
                  </span>
                </div>
              ) : (
                <div className="text-emerald-300 flex items-start gap-1.5">
                  <Sparkles className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>
                    <strong>Spatial Consensus Confirmed:</strong> Node loss is consistent across regional peer string. No false hardware alarms generated.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* JOINT EXPECTED VALUE (JEV) DECISION MATRIX ENGINE                         */}
          {/* ========================================================================= */}
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-amber-300 font-bold border-b border-amber-500/20 pb-2">
              <span className="flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-amber-400" />
                <span>JEV Decision Engine: argmax JEV(a)</span>
              </span>
              <span className="text-[10px] bg-amber-900/50 px-2 py-0.5 rounded text-amber-200">
                Live Payoff Matrix
              </span>
            </div>

            <div className="text-[11px] text-slate-300 font-sans leading-relaxed">
              <strong>Objective Function:</strong> <span className="font-mono text-amber-300 text-[10px] block sm:inline">JEV(a) = P(Smog)·U(Wash) + P(Fault)·U(Truck) - Cost - Risk</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className={`p-2.5 rounded-lg border ${!isConsensusFault ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300 font-bold' : 'bg-black/40 border-white/10 text-slate-400'}`}>
                <div className="flex justify-between text-[10px]">
                  <span>Action 1: Auto Wash</span>
                  <span>{!isConsensusFault ? 'OPTIMAL' : 'REJECT'}</span>
                </div>
                <div className="text-sm font-bold pt-1">
                  {!isConsensusFault ? '+₹18,400 Payoff' : '-₹850 Wasted'}
                </div>
                <span className="text-[9px] block text-slate-400 font-normal">
                  P(Smog) = {Math.max(10, 100 - spatialVarianceDelta).toFixed(0)}% · Zero Diesel
                </span>
              </div>

              <div className={`p-2.5 rounded-lg border ${isConsensusFault ? 'bg-rose-950/60 border-rose-500/60 text-rose-300 font-bold' : 'bg-black/40 border-white/10 text-slate-400'}`}>
                <div className="flex justify-between text-[10px]">
                  <span>Action 2: Field Van</span>
                  <span>{isConsensusFault ? 'OPTIMAL' : 'SUPPRESSED'}</span>
                </div>
                <div className="text-sm font-bold pt-1">
                  {isConsensusFault ? '+₹42,000 Recovered' : '-₹4,500 False Alarm'}
                </div>
                <span className="text-[9px] block text-slate-400 font-normal">
                  P(Fault) = {isConsensusFault ? '94%' : '6%'} · Van Dispatch
                </span>
              </div>
            </div>

            <div className="text-[10px] font-sans text-slate-400 italic">
              {isConsensusFault
                ? '⚡ JEV Result: Dispatching field team with replacement diode for Node #142 (Prevents catastrophic array burnout).'
                : '✅ JEV Result: Suppressing ₹4,500 field van dispatch. Autonomous 5V wash authorized.'}
            </div>
          </div>

          {/* Sustainable Water Management Action Card */}
          <div className="p-4 rounded-xl bg-sky-950/40 border border-sky-500/30 space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between text-sky-300 font-bold">
              <span className="flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-sky-400" />
                <span>Water Resource Optimizer Status</span>
              </span>
              <span className="text-[10px] bg-sky-900/60 px-2 py-0.5 rounded text-sky-200">
                Rain In 2.5h
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              {weather.condition === 'rain_impending'
                ? '🌧️ Rain forecast (82% probability in 2.5 hours). Automated 5V sprinkler wash is HELD. Natural precipitation will restore module efficiency, conserving 180L of ground water per string.'
                : '☀️ Arid dry season active. Precision pulsed micro-jet wash scheduled at pre-dawn (04:30 AM) to minimize thermal shock.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
