import React, { useState, useEffect } from 'react';
import {
  Activity,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Target,
  FileText,
  BarChart2,
  Camera,
  Droplets,
  Flame,
  Sun,
  Maximize2,
  X,
  Layers,
  Thermometer,
  Cpu
} from 'lucide-react';

interface HeroSolarSystemVisualProps {
  className?: string;
}

type ModeType = 'nominal' | 'hotspot' | 'consensus';
type ViewTab = 'photo' | 'specs' | 'ivCurve';

interface ModeDetails {
  id: ModeType;
  title: string;
  badge: string;
  badgeColor: string;
  photoUrl: string;
  photoAlt: string;
  power: string;
  voltage: string;
  current: string;
  cellTemp: string;
  irradiance: string;
  soilingLoss: string;
  statusTag: string;
  summary: string;
  verdict: string;
  actionTaken: string;
  hotspotRisk: string;
}

const MODE_DATA: Record<ModeType, ModeDetails> = {
  nominal: {
    id: 'nominal',
    title: '01 NOMINAL // STC OPTIMAL',
    badge: 'OPTIMAL YIELD',
    badgeColor: 'text-[#00f2fe] bg-cyan-500/20 border-cyan-400/40',
    photoUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=85',
    photoAlt: 'High-Efficiency Clean Monocrystalline Solar Panel Grid Array Operating at STC',
    power: '542 W',
    voltage: '41.2 V',
    current: '13.15 A',
    cellTemp: '42.1 °C',
    irradiance: '980 W/m²',
    soilingLoss: '0.4%',
    statusTag: 'EQUILIBRIUM ACTIVE',
    summary: 'Pristine anti-reflective ARC glass surface with zero particulate shading. Uniform current flow through all 144 half-cells.',
    verdict: 'Multi-array peer consensus confirms uniform fleet irradiance. No intervention required.',
    actionTaken: 'Normal MPPT tracking active. Inverter operating at 98.7% peak conversion efficiency.',
    hotspotRisk: 'NONE (ΔT < 1.5°C across string)',
  },
  hotspot: {
    id: 'hotspot',
    title: '02 HOTSPOT // 87.4°C CELL SHADING',
    badge: 'ANOMALY DETECTED',
    badgeColor: 'text-amber-300 bg-amber-500/20 border-amber-400/50',
    photoUrl: 'https://images.unsplash.com/photo-1545209565-df0e3199ce77?auto=format&fit=crop&w=1200&q=85',
    photoAlt: 'Solar Panel Array with Heavy Particulate Soiling Layer and Thermal Cell Hotspot',
    power: '168 W',
    voltage: '14.2 V',
    current: '2.10 A',
    cellTemp: '87.4 °C',
    irradiance: '980 W/m²',
    soilingLoss: '69.0%',
    statusTag: 'CRITICAL HOTSPOT // CELL #15',
    summary: 'Localized dust layer & avian soiling causing severe optical shading on Cell #15. Current bottleneck forces reverse-bias heating.',
    verdict: 'Neighbor strings confirm full 980 W/m² irradiance—proving acute local defect rather than regional cloud cover.',
    actionTaken: 'Safety Interlock: Water sprinkler HOLD enforced to prevent explosive thermal shock cracking on 87°C tempered glass.',
    hotspotRisk: 'CRITICAL: Cell solder melt risk at >90°C. Delamination imminent if unmitigated.',
  },
  consensus: {
    id: 'consensus',
    title: '03 CONSENSUS // MIST RESTORATION',
    badge: 'AUTONOMOUS RECOVERY',
    badgeColor: 'text-[#00ff88] bg-emerald-500/20 border-emerald-400/50',
    photoUrl: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=1200&q=85',
    photoAlt: 'Solar Panel Array Undergoing Automated Sprinkler Mist Washing and Clean Recovery',
    power: '538 W',
    voltage: '40.8 V',
    current: '13.18 A',
    cellTemp: '34.6 °C',
    irradiance: '980 W/m²',
    soilingLoss: '0.8%',
    statusTag: 'WASH CYCLE RESTORED',
    summary: 'Byzantine spatial consensus verified isolated soiling. Controlled fine-mist pulsed cycle deployed after safe thermal cooldown.',
    verdict: '42ms consensus isolated single-panel fault. Zero diesel technician vehicle dispatches ($0 OpEx).',
    actionTaken: 'Sprinkler Solenoid Valve #SV-04 pulsed 25-second mist rinse at 3.2 Bar. Power yield restored from 168W → 538W (+220%).',
    hotspotRisk: 'RESOLVED: Cell temperature cooled to 34.6°C. Diode conduction normalized.',
  },
};

export function HeroSolarSystemVisual({ className = '' }: HeroSolarSystemVisualProps) {
  const [activeMode, setActiveMode] = useState<ModeType>('nominal');
  const [activeTab, setActiveTab] = useState<ViewTab>('photo');
  const [autoCycle, setAutoCycle] = useState<boolean>(true);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [showSpecModal, setShowSpecModal] = useState<boolean>(false);
  const [selectedPin, setSelectedPin] = useState<'cell15' | 'diode' | 'valve' | null>(null);

  const currentMode = MODE_DATA[activeMode];

  // Auto cycle telemetry demonstration every 7s unless user paused
  useEffect(() => {
    if (!autoCycle) return;
    const timer = setInterval(() => {
      setActiveMode((prev) => {
        if (prev === 'nominal') return 'hotspot';
        if (prev === 'hotspot') return 'consensus';
        return 'nominal';
      });
      setImageLoaded(false);
    }, 7000);
    return () => clearInterval(timer);
  }, [autoCycle]);

  const handleModeChange = (mode: ModeType) => {
    setActiveMode(mode);
    setImageLoaded(false);
    setAutoCycle(false); // Pause auto-cycle when user manually clicks to inspect
  };

  return (
    <div className={`relative w-full max-w-2xl mx-auto flex flex-col select-none group ${className}`}>
      {/* Ambient Radial Back-Glow dynamically aligned with the mode */}
      <div
        className="absolute -inset-1 rounded-2xl blur-2xl opacity-40 transition-all duration-700 pointer-events-none"
        style={{
          background:
            activeMode === 'nominal'
              ? 'radial-gradient(circle, rgba(0, 242, 254, 0.35) 0%, rgba(0, 255, 136, 0.15) 50%, transparent 80%)'
              : activeMode === 'hotspot'
              ? 'radial-gradient(circle, rgba(255, 170, 0, 0.45) 0%, rgba(255, 65, 65, 0.3) 50%, transparent 80%)'
              : 'radial-gradient(circle, rgba(0, 255, 136, 0.45) 0%, rgba(0, 242, 254, 0.25) 50%, transparent 80%)',
        }}
      />

      {/* Main Structural Frame */}
      <div className="relative w-full rounded-2xl bg-[#07111e] border border-cyan-500/30 overflow-hidden shadow-2xl flex flex-col">
        {/* ========================================================================= */}
        {/* TOP BAR: ASSET IDENTIFIER + VIEW TABS (Photo / Specs / I-V Curve)          */}
        {/* ========================================================================= */}
        <div className="px-4 py-2.5 sm:px-5 sm:py-3 border-b border-cyan-500/20 bg-[#07111e]/95 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full transition-colors duration-500 ${
                activeMode === 'nominal'
                  ? 'bg-[#00f2fe] shadow-[0_0_8px_#00f2fe]'
                  : activeMode === 'hotspot'
                  ? 'bg-amber-400 shadow-[0_0_12px_#f59e0b] animate-ping'
                  : 'bg-[#00ff88] shadow-[0_0_8px_#00ff88]'
              }`}
            />
            <span className="text-white font-bold tracking-wider text-[11px] flex items-center gap-1.5 uppercase">
              <Activity className="w-3.5 h-3.5 text-[#00f2fe]" />
              <span>ARRAY 04 // Hi-Ku 550W MONO-PERC</span>
            </span>
          </div>

          {/* View Mode Tabs: [ Photo Twin ] | [ Spec Sheet ] | [ I-V Curve ] */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-black/60 border border-cyan-500/30 text-[10px]">
            <button
              onClick={() => setActiveTab('photo')}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'photo'
                  ? 'bg-cyan-500/30 text-[#00f2fe] font-bold border border-cyan-400/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Camera className="w-3 h-3" />
              <span>Panel Twin</span>
            </button>

            <button
              onClick={() => setActiveTab('specs')}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'specs'
                  ? 'bg-cyan-500/30 text-[#00f2fe] font-bold border border-cyan-400/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3 h-3" />
              <span>Spec Sheet</span>
            </button>

            <button
              onClick={() => setActiveTab('ivCurve')}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'ivCurve'
                  ? 'bg-cyan-500/30 text-[#00f2fe] font-bold border border-cyan-400/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart2 className="w-3 h-3" />
              <span>I-V Curve</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MAIN DISPLAY AREA: TAB CONTENT                                            */}
        {/* ========================================================================= */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9.5] min-h-[310px] overflow-hidden bg-[#07111e]">
          {/* TAB 1: ACTUAL PANEL PHOTOGRAPHIC TWIN WITH REAL LASER SCAN OVERLAY */}
          {activeTab === 'photo' && (
            <div className="relative w-full h-full">
              {/* Actual High-Definition Photograph for current mode */}
              <img
                key={currentMode.photoUrl}
                src={currentMode.photoUrl}
                alt={currentMode.photoAlt}
                referrerPolicy="no-referrer"
                onLoad={() => setImageLoaded(true)}
                className={`w-full h-full object-cover object-center filter transition-all duration-700 ${
                  activeMode === 'nominal'
                    ? 'brightness-[0.88] contrast-[1.12]'
                    : activeMode === 'hotspot'
                    ? 'brightness-[0.78] contrast-[1.25] saturate-[1.15]'
                    : 'brightness-[0.92] contrast-[1.1]'
                } ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
              />

              {/* Loading Shimmer */}
              {!imageLoaded && (
                <div className="absolute inset-0 bg-[#0a192f] flex flex-col items-center justify-center gap-2">
                  <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-[11px] font-mono text-cyan-300">
                    Loading Monocrystalline Panel Asset...
                  </span>
                </div>
              )}

              {/* Industrial Vignette Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#07111e] via-[#07111e]/30 to-[#07111e]/60" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(7,17,30,0.85)_100%)]" />

              {/* Silicon Half-Cut Cell Matrix Grid Line Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,242,254,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,242,254,0.08)_1px,transparent_1px)] bg-[size:38px_38px] pointer-events-none" />

              {/* Active Looping Laser Scan-Line Animation */}
              <div className="laser-scan-line z-10" />

              {/* MODE SPECIFIC VISUAL OVERLAYS */}
              {/* Anomaly: Infrared Thermal Hotspot Ring on Cell #15 */}
              {activeMode === 'hotspot' && (
                <div className="absolute top-[38%] left-[48%] -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto">
                  <button
                    onClick={() => setSelectedPin(selectedPin === 'cell15' ? null : 'cell15')}
                    className="relative flex items-center justify-center cursor-pointer group/pin"
                    title="Click to inspect Cell #15 Hotspot"
                  >
                    <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-red-500 opacity-75" />
                    <span className="absolute inline-flex h-8 w-8 rounded-full bg-amber-500/80 blur-sm" />
                    <span className="relative inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-600 border border-white text-white shadow-[0_0_15px_#ff4141]">
                      <Flame className="w-4 h-4 text-amber-200 animate-pulse" />
                    </span>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 rounded bg-black/90 border border-red-500 text-[9px] font-mono text-red-300 font-bold shadow-lg">
                      87.4°C HOTSPOT
                    </span>
                  </button>
                </div>
              )}

              {/* Consensus: Sprinkler Mist Droplets Overlay Indicator */}
              {activeMode === 'consensus' && (
                <div className="absolute top-[28%] right-[22%] z-20 pointer-events-auto">
                  <button
                    onClick={() => setSelectedPin(selectedPin === 'valve' ? null : 'valve')}
                    className="relative flex items-center justify-center cursor-pointer"
                    title="Click to inspect Sprinkler Valve SV-04"
                  >
                    <span className="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-[#00ff88] opacity-60" />
                    <span className="relative inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-600/90 border border-white text-white shadow-[0_0_15px_#00ff88]">
                      <Droplets className="w-4 h-4 text-cyan-200 animate-bounce" />
                    </span>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 rounded bg-black/90 border border-emerald-500 text-[9px] font-mono text-emerald-300 font-bold shadow-lg">
                      VALVE SV-04 ACTIVE
                    </span>
                  </button>
                </div>
              )}

              {/* Nominal: Clean Optical Sensor Target Pin */}
              {activeMode === 'nominal' && (
                <div className="absolute top-[35%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto">
                  <button
                    onClick={() => setSelectedPin(selectedPin === 'diode' ? null : 'diode')}
                    className="relative flex items-center justify-center cursor-pointer"
                    title="Click to inspect Bypass Diode Matrix"
                  >
                    <span className="relative inline-flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/40 border border-cyan-300 text-cyan-200 shadow-[0_0_12px_#00f2fe]">
                      <Target className="w-3.5 h-3.5 animate-spin" />
                    </span>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 rounded bg-black/90 border border-cyan-500 text-[9px] font-mono text-cyan-300 font-bold shadow-lg">
                      STC CELL EQUILIBRIUM
                    </span>
                  </button>
                </div>
              )}

              {/* Interactive Pin Details Tooltip Popover */}
              {selectedPin && (
                <div className="absolute bottom-4 left-4 right-4 z-30 p-3 rounded-xl bg-slate-950/95 border border-cyan-400/50 backdrop-blur-md shadow-2xl text-xs font-mono flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[#00ff88] font-bold">
                        {selectedPin === 'cell15' && 'HARDWARE INSPECTOR: CELL #15 (182mm MONO WAFER)'}
                        {selectedPin === 'diode' && 'HARDWARE INSPECTOR: SCHOTTKY BYPASS DIODE #02'}
                        {selectedPin === 'valve' && 'HARDWARE INSPECTOR: MIST ACTUATOR SOLENOID #SV-04'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-sans">
                      {selectedPin === 'cell15' &&
                        'Severe optical shading causes this cell to become reverse-biased. Instead of generating power, it consumes 42W from series cells, heating silicon to 87.4°C.'}
                      {selectedPin === 'diode' &&
                        'Connected across 24 half-cells in Junction Box IP68. Forward drop 0.45V, rated for 15A continuous surge protection.'}
                      {selectedPin === 'valve' &&
                        'Connected via industrial 24V relay output. Operating at 3.2 Bar pressure with 4.2 L/min fine atomized mist to prevent glass thermal fracture.'}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedPin(null)}
                    className="text-slate-400 hover:text-white p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Dynamic Telemetry HUD Box Overlay */}
              <div className="absolute top-3 left-3 right-3 z-10 pointer-events-none">
                <div
                  className={`p-3 rounded-xl backdrop-blur-md border transition-all duration-500 ${
                    activeMode === 'nominal'
                      ? 'bg-[#07111e]/85 border-cyan-400/40 shadow-[0_0_20px_rgba(0,242,254,0.18)]'
                      : activeMode === 'hotspot'
                      ? 'bg-[#1a0f07]/90 border-amber-400/70 shadow-[0_0_25px_rgba(245,158,11,0.35)]'
                      : 'bg-[#071a12]/90 border-emerald-400/60 shadow-[0_0_20px_rgba(0,255,136,0.25)]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono pb-1.5 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Target
                        className={`w-3.5 h-3.5 ${
                          activeMode === 'hotspot' ? 'text-amber-400 animate-spin' : 'text-[#00f2fe]'
                        }`}
                      />
                      <span className="font-bold text-white uppercase tracking-wider">
                        {currentMode.title}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${currentMode.badgeColor}`}
                    >
                      {currentMode.badge}
                    </span>
                  </div>

                  {/* 4-Metric Grid */}
                  <div className="grid grid-cols-4 gap-2 pt-2 text-xs font-mono">
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">Power Output</span>
                      <strong
                        className={`text-sm font-bold ${
                          activeMode === 'hotspot'
                            ? 'text-amber-400'
                            : activeMode === 'consensus'
                            ? 'text-[#00ff88]'
                            : 'text-white'
                        }`}
                      >
                        {currentMode.power}
                      </strong>
                    </div>

                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">Voltage (Vmp)</span>
                      <strong className="text-white text-sm font-semibold">{currentMode.voltage}</strong>
                    </div>

                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">Current (Imp)</span>
                      <strong className="text-white text-sm font-semibold">{currentMode.current}</strong>
                    </div>

                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">Cell Temp</span>
                      <strong
                        className={`text-sm font-bold ${
                          activeMode === 'hotspot' ? 'text-rose-400 animate-pulse' : 'text-slate-200'
                        }`}
                      >
                        {currentMode.cellTemp}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACTUAL PHYSICAL PANEL SPECIFICATIONS SHEET */}
          {activeTab === 'specs' && (
            <div className="relative w-full h-full p-4 sm:p-5 overflow-y-auto font-mono text-xs bg-[#081220]/95 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-cyan-500/30">
                <div>
                  <h4 className="text-white font-bold text-sm tracking-wide">
                    CANADIAN SOLAR HiKu6 / TRINA VERTEX 550W
                  </h4>
                  <p className="text-[10px] text-cyan-400">
                    Tier-1 Monocrystalline PERC Half-Cut Architecture (ALMM Approved)
                  </p>
                </div>
                <button
                  onClick={() => setShowSpecModal(true)}
                  className="px-2 py-1 rounded bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[10px] hover:bg-cyan-500/30 cursor-pointer flex items-center gap-1"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Full Datasheet</span>
                </button>
              </div>

              {/* Physical Architecture Specifications */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[11px]">
                <div className="p-2 rounded bg-black/40 border border-white/10">
                  <span className="text-[9px] text-slate-400 uppercase block">Cell Matrix</span>
                  <span className="text-white font-semibold">144 Half-cut (182mm M10)</span>
                </div>
                <div className="p-2 rounded bg-black/40 border border-white/10">
                  <span className="text-[9px] text-slate-400 uppercase block">Dimensions</span>
                  <span className="text-white font-semibold">2278 × 1134 × 35 mm</span>
                </div>
                <div className="p-2 rounded bg-black/40 border border-white/10">
                  <span className="text-[9px] text-slate-400 uppercase block">Weight / Glass</span>
                  <span className="text-white font-semibold">28.6 kg / 3.2mm ARC Tempered</span>
                </div>
                <div className="p-2 rounded bg-black/40 border border-white/10">
                  <span className="text-[9px] text-slate-400 uppercase block">Rated Pmax (STC)</span>
                  <span className="text-[#00ff88] font-bold">550 W (+0 ~ +5W)</span>
                </div>
                <div className="p-2 rounded bg-black/40 border border-white/10">
                  <span className="text-[9px] text-slate-400 uppercase block">Voc / Isc</span>
                  <span className="text-white font-semibold">49.8 V / 14.05 A</span>
                </div>
                <div className="p-2 rounded bg-black/40 border border-white/10">
                  <span className="text-[9px] text-slate-400 uppercase block">Module Efficiency</span>
                  <span className="text-cyan-300 font-bold">21.3% (NOCT 42°C)</span>
                </div>
              </div>

              {/* Mode Comparison Table */}
              <div className="pt-2 border-t border-white/10">
                <span className="text-[10px] text-slate-400 uppercase block pb-1.5 font-bold">
                  Active Real-World Operating Point vs Datasheet:
                </span>
                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <div
                    className={`p-2 rounded border ${
                      activeMode === 'nominal'
                        ? 'bg-cyan-950/60 border-cyan-400 text-cyan-200'
                        : 'bg-black/30 border-white/5 text-slate-400'
                    }`}
                  >
                    <div className="font-bold pb-0.5">01 NOMINAL</div>
                    <div>P: 542W (98.5% STC)</div>
                    <div>T: 42.1°C (Safe)</div>
                  </div>
                  <div
                    className={`p-2 rounded border ${
                      activeMode === 'hotspot'
                        ? 'bg-amber-950/60 border-amber-400 text-amber-200'
                        : 'bg-black/30 border-white/5 text-slate-400'
                    }`}
                  >
                    <div className="font-bold pb-0.5">02 HOTSPOT</div>
                    <div>P: 168W (-69.0%)</div>
                    <div>T: 87.4°C (Burn Risk)</div>
                  </div>
                  <div
                    className={`p-2 rounded border ${
                      activeMode === 'consensus'
                        ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200'
                        : 'bg-black/30 border-white/5 text-slate-400'
                    }`}
                  >
                    <div className="font-bold pb-0.5">03 CONSENSUS</div>
                    <div>P: 538W (Recovered)</div>
                    <div>T: 34.6°C (Cooled)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DYNAMIC I-V & P-V CURVE GRAPH */}
          {activeTab === 'ivCurve' && (
            <div className="relative w-full h-full p-4 sm:p-5 flex flex-col justify-between font-mono bg-[#07111e]/95 text-xs">
              <div className="flex items-center justify-between pb-1 border-b border-cyan-500/30">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-cyan-400" />
                  <span className="text-white font-bold text-xs uppercase">
                    Dynamic I-V &amp; P-V Curve Telemetry
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  Current (A) vs Voltage (V) Characteristics
                </span>
              </div>

              {/* SVG I-V Curve Visualizer */}
              <div className="relative flex-1 my-2 flex items-center justify-center">
                <svg viewBox="0 0 400 160" className="w-full h-full max-h-[160px] overflow-visible">
                  {/* Grid Lines */}
                  <line x1="40" y1="20" x2="380" y2="20" stroke="#1e293b" strokeDasharray="3 3" />
                  <line x1="40" y1="60" x2="380" y2="60" stroke="#1e293b" strokeDasharray="3 3" />
                  <line x1="40" y1="100" x2="380" y2="100" stroke="#1e293b" strokeDasharray="3 3" />
                  <line x1="40" y1="140" x2="380" y2="140" stroke="#334155" />
                  <line x1="40" y1="20" x2="40" y2="140" stroke="#334155" />

                  {/* Y-axis Labels: Current (A) */}
                  <text x="10" y="24" fill="#64748b" fontSize="9">14A</text>
                  <text x="10" y="64" fill="#64748b" fontSize="9">10A</text>
                  <text x="10" y="104" fill="#64748b" fontSize="9">5A</text>
                  <text x="10" y="143" fill="#64748b" fontSize="9">0A</text>

                  {/* X-axis Labels: Voltage (V) */}
                  <text x="40" y="154" fill="#64748b" fontSize="9">0V</text>
                  <text x="150" y="154" fill="#64748b" fontSize="9">15V</text>
                  <text x="260" y="154" fill="#64748b" fontSize="9">35V</text>
                  <text x="360" y="154" fill="#64748b" fontSize="9">50V</text>

                  {/* Curve 1: Nominal STC Curve (Cyan / Blue) */}
                  <path
                    d="M 40,24 Q 280,26 310,40 T 365,140"
                    fill="none"
                    stroke="#00f2fe"
                    strokeWidth={activeMode === 'nominal' ? '3' : '1.5'}
                    strokeOpacity={activeMode === 'nominal' ? '1' : '0.35'}
                  />

                  {/* Curve 2: Hotspot Stepped Shading Curve (Amber / Red) */}
                  {/* Stepped notch caused by bypass diode activation */}
                  <path
                    d="M 40,24 Q 130,26 150,110 T 310,135 T 350,140"
                    fill="none"
                    stroke="#ffaa00"
                    strokeWidth={activeMode === 'hotspot' ? '3' : '1.5'}
                    strokeOpacity={activeMode === 'hotspot' ? '1' : '0.35'}
                  />

                  {/* Curve 3: Restored Post-Wash Curve (Mint Green) */}
                  <path
                    d="M 40,25 Q 275,27 308,42 T 362,140"
                    fill="none"
                    stroke="#00ff88"
                    strokeWidth={activeMode === 'consensus' ? '3' : '1.5'}
                    strokeOpacity={activeMode === 'consensus' ? '1' : '0.35'}
                  />

                  {/* Active Operating Point Pulse Marker */}
                  {activeMode === 'nominal' && (
                    <g>
                      <circle cx="305" cy="40" r="5" fill="#00f2fe" className="animate-ping opacity-75" />
                      <circle cx="305" cy="40" r="4" fill="#00f2fe" stroke="#fff" strokeWidth="1.5" />
                      <text x="250" y="32" fill="#00f2fe" fontSize="9" fontWeight="bold">
                        MPP: 41.2V / 13.1A (542W)
                      </text>
                    </g>
                  )}

                  {activeMode === 'hotspot' && (
                    <g>
                      <circle cx="150" cy="110" r="6" fill="#ff4141" className="animate-ping opacity-75" />
                      <circle cx="150" cy="110" r="4" fill="#ffaa00" stroke="#fff" strokeWidth="1.5" />
                      <text x="160" y="105" fill="#ffaa00" fontSize="9" fontWeight="bold">
                        Knee Collapse: 14.2V / 2.1A (168W)
                      </text>
                    </g>
                  )}

                  {activeMode === 'consensus' && (
                    <g>
                      <circle cx="303" cy="42" r="5" fill="#00ff88" className="animate-ping opacity-75" />
                      <circle cx="303" cy="42" r="4" fill="#00ff88" stroke="#fff" strokeWidth="1.5" />
                      <text x="245" y="34" fill="#00ff88" fontSize="9" fontWeight="bold">
                        Restored MPP: 40.8V / 13.2A (538W)
                      </text>
                    </g>
                  )}
                </svg>
              </div>

              {/* Curve Explanatory Footnote */}
              <div className="p-2 rounded bg-black/50 border border-white/10 text-[10px] text-slate-300 flex items-center justify-between">
                <span>
                  {activeMode === 'nominal' && 'Standard full-square curve. Ideal maximum power point.'}
                  {activeMode === 'hotspot' && '⚠️ Severe multi-knee curve: Shaded Cell #15 diode cuts string, dropping 69% power.'}
                  {activeMode === 'consensus' && '✅ Water mist cleaning smoothed curve back to 98% STC standard envelope.'}
                </span>
                <span className="text-[#00ff88] font-bold whitespace-nowrap pl-2">
                  ΔGain: +370W
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* LOWER SECTION: REAL-WORLD DETAILS & CONSENSUS REASONING                    */}
        {/* ========================================================================= */}
        <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-t border-cyan-500/20 bg-[#07111e]/95 backdrop-blur-md space-y-2.5">
          {/* Engineering Decision Rationale */}
          <div className="flex items-start gap-2.5 text-xs">
            <div className="mt-0.5">
              {activeMode === 'nominal' ? (
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
              ) : activeMode === 'hotspot' ? (
                <AlertTriangle className="w-4 h-4 text-amber-400 animate-pulse" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-[#00ff88]" />
              )}
            </div>
            <div className="space-y-0.5 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-white font-mono font-semibold text-[11px] uppercase">
                  Spatial Diagnostic Verdict
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {activeMode === 'hotspot' ? 'Thermal Shock Guard: ENGAGED' : 'Bypass Diode: PASS'}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                {currentMode.verdict}
              </p>
              <p className="text-[10px] font-mono text-cyan-300/90 pt-0.5">
                ⚡ Action: {currentMode.actionTaken}
              </p>
            </div>
          </div>

          {/* Three Mode Selector Buttons with Live Power Indicator */}
          <div className="pt-2 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Select Mode:</span>
              <button
                onClick={() => setAutoCycle(!autoCycle)}
                className={`ml-1 px-1.5 py-0.5 rounded text-[9px] border cursor-pointer ${
                  autoCycle
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-[#00ff88]'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
                title="Toggle automated 7-second demo cycle"
              >
                Auto: {autoCycle ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-[10px]">
              <button
                onClick={() => handleModeChange('nominal')}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeMode === 'nominal'
                    ? 'bg-cyan-500/30 text-[#00f2fe] font-bold border border-cyan-400/60 shadow-[0_0_10px_rgba(0,242,254,0.3)]'
                    : 'bg-black/40 border border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>01 NOMINAL (542W)</span>
              </button>

              <button
                onClick={() => handleModeChange('hotspot')}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeMode === 'hotspot'
                    ? 'bg-amber-500/30 text-amber-300 font-bold border border-amber-400/70 shadow-[0_0_12px_rgba(245,158,11,0.35)]'
                    : 'bg-black/40 border border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                <span>02 HOTSPOT (87°C)</span>
              </button>

              <button
                onClick={() => handleModeChange('consensus')}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeMode === 'consensus'
                    ? 'bg-emerald-500/30 text-[#00ff88] font-bold border border-emerald-400/60 shadow-[0_0_10px_rgba(0,255,136,0.3)]'
                    : 'bg-black/40 border border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>03 WASH (538W)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DETAILED PANEL SPECIFICATIONS MODAL                                       */}
      {/* ========================================================================= */}
      {showSpecModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-2xl bg-[#07111e] border border-cyan-500/40 p-6 shadow-2xl max-h-[90vh] overflow-y-auto font-mono text-xs">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <Cpu className="w-5 h-5 text-[#00ff88]" />
                <div>
                  <h3 className="text-white font-bold text-base">
                    Monocrystalline PV Module Specification Sheet
                  </h3>
                  <p className="text-[10px] text-slate-400 font-sans">
                    Engineering Blueprints &amp; Physical Sensor Telemetry Interconnect
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSpecModal(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Spec Sections */}
            <div className="space-y-4 pt-4">
              {/* Section 1: Mechanical Data */}
              <div>
                <h4 className="text-[#00f2fe] font-bold text-xs uppercase tracking-wider mb-2">
                  1. Mechanical Architecture &amp; Materials
                </h4>
                <div className="grid grid-cols-2 gap-2 bg-black/40 p-3 rounded-xl border border-white/5 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Model:</span>
                    <span className="text-white font-semibold">CS6W-550MS (HiKu6 Mono-PERC)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Cell Count:</span>
                    <span className="text-white font-semibold">144 Half-cut Cells [2 × (12 × 6)]</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Dimensions:</span>
                    <span className="text-white font-semibold">2278 × 1134 × 35 mm</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Weight:</span>
                    <span className="text-white font-semibold">28.6 kg (63.1 lbs)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Front Glass:</span>
                    <span className="text-white font-semibold">3.2mm AR-Coated Tempered Glass</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Junction Box:</span>
                    <span className="text-white font-semibold">IP68 Rated (3 Bypass Diodes)</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Electrical Parameters (STC) */}
              <div>
                <h4 className="text-[#00ff88] font-bold text-xs uppercase tracking-wider mb-2">
                  2. Electrical Ratings (STC: 1000 W/m², AM 1.5, Cell 25°C)
                </h4>
                <div className="grid grid-cols-3 gap-2 bg-black/40 p-3 rounded-xl border border-white/5 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Max Power (Pmax):</span>
                    <span className="text-[#00ff88] font-bold text-sm">550 W</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Opt. Voltage (Vmp):</span>
                    <span className="text-white font-semibold">41.5 V</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Opt. Current (Imp):</span>
                    <span className="text-white font-semibold">13.25 A</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Open Circuit (Voc):</span>
                    <span className="text-white font-semibold">49.8 V</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Short Circuit (Isc):</span>
                    <span className="text-white font-semibold">14.05 A</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Module Efficiency:</span>
                    <span className="text-[#00f2fe] font-bold">21.3%</span>
                  </div>
                </div>
              </div>

              {/* Section 3: Physical Sensor Tap & Twin Integration */}
              <div>
                <h4 className="text-amber-300 font-bold text-xs uppercase tracking-wider mb-2">
                  3. Digital Twin Sensor &amp; Actuator Interconnect
                </h4>
                <div className="bg-black/40 p-3 rounded-xl border border-white/5 text-[11px] space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-[#00ff88] font-bold">INA219 In-Line Shunt:</span>
                    <span className="text-slate-300">
                      High-precision I2C voltage &amp; bidirectional current sensor sampling string metrics at 100Hz into edge node firmware.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-cyan-300 font-bold">Thermal Infrared Sensor:</span>
                    <span className="text-slate-300">
                      Non-contact thermal array sensing localized cell ΔT. Triggers safety lockout when cell temperature exceeds 55°C.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-300 font-bold">Sprinkler Actuation Logic:</span>
                    <span className="text-slate-300">
                      Autonomous solenoid valve SV-04 controlled via ESP32 GPIO18 with thermal shock guard delay preventing glass micro-fractures.
                    </span>
                  </div>
                </div>
              </div>

              {/* Regulatory ALMM Status */}
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">
                    Ministry of New &amp; Renewable Energy (India)
                  </span>
                  <span className="text-white font-bold">ALMM Certified: Reg. Ref #ALMM-2024-550W</span>
                </div>
                <span className="px-2 py-1 rounded bg-emerald-500/20 text-[#00ff88] text-[10px] font-bold border border-emerald-500/50">
                  VERIFIED COMPLIANT
                </span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setShowSpecModal(false)}
                className="px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 text-cyan-300 font-semibold cursor-pointer"
              >
                Close Spec Sheet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
