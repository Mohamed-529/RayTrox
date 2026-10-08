import React, { useState } from 'react';
import {
  Flame,
  AlertOctagon,
  Scan,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  Maximize2,
  ChevronRight,
  TrendingDown,
  Activity,
  Layers,
  Sparkles,
  Zap
} from 'lucide-react';

interface DiagnosticMode {
  id: number;
  label: string;
  badge: string;
  heading: string;
  mathematicalEquation: string;
  equationDescription: string;
  cellDegradationDesc: string;
  cell15Resistance: string;
  financialImpact: string;
  financialImpactSub: string;
  lossVector: string;
  inverterStatus: string;
  aiDiagnosticVerdict: string;
  flirTemp: string;
  powerYield: string;
  accentColor: string;
  cell15ElClass: string;
  hotspotIntensity: number; // 0 to 1
  crackState: 'none' | 'hairline' | 'severe' | 'burnout';
  soilingPattern: 'none' | 'uniform_smog' | 'localized';
}

export function PhysicalFailureEvolution() {
  const [selectedMode, setSelectedMode] = useState<number>(1); // Default to micro-fracture / hotspot
  const [hoveredCell, setHoveredCell] = useState<number | null>(15);
  const [scanBeamActive, setScanBeamActive] = useState<boolean>(true);
  const [showEquationInspector, setShowEquationInspector] = useState<boolean>(false);

  const modes: DiagnosticMode[] = [
    {
      id: 0,
      label: '01. Pristine Baseline',
      badge: 'STC REFERENCE: 0.0% DEGRADATION',
      heading: 'Uniform Luminescence & Isotropic Charge Carrier Density',
      mathematicalEquation: 'P_STC = G/1000 · A · η_module · [1 - γ(T_cell - 25°C)]',
      equationDescription: 'Ideal Shockley-Queisser photon conversion. Zero shunt conductance across all 144 half-cut cells.',
      cellDegradationDesc: 'Uniform photon emission under electroluminescence. Recombination lifetime τ_eff > 120µs. Shunt resistance R_sh > 100,000 Ω.',
      cell15Resistance: '12.4 mΩ (Nominal Busbar Contact)',
      financialImpact: '₹0 / day (Zero Revenue Loss)',
      financialImpactSub: 'Expected Daily Generation: 31.2 kWh / string',
      lossVector: '0.00% Operational Loss',
      inverterStatus: 'MPPT Tracking: 232V @ 23.7A (Nominal Global Peak)',
      aiDiagnosticVerdict: 'AUTONOMOUS CONSENSUS: STABLE BASELINE · NO DISPATCH',
      flirTemp: '28.2 °C',
      powerYield: '5.8 kW (100% P_STC)',
      accentColor: '#00ff88',
      cell15ElClass: 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400',
      hotspotIntensity: 0,
      crackState: 'none',
      soilingPattern: 'none',
    },
    {
      id: 1,
      label: '02. Physical Micro-Fracture',
      badge: 'MICRO-CRACK INGRESS · CELL #15',
      heading: 'Localized Grain Boundary Cleavage & Carrier Choking',
      mathematicalEquation: 'R_shunt = (V_cell - I·R_s) / I_sh ↓ [From >100kΩ to 48Ω]',
      equationDescription: 'Thermal mechanical fatigue or hail shock cleaves monocrystalline wafer. Parallel leakage path shunts current away from load.',
      cellDegradationDesc: 'EL image reveals dark inactive boundary cleavage on Cell #15. Current bottleneck causes localized resistive heating (P_loss = I_str² · R_defect).',
      cell15Resistance: '48.2 Ω (Severe Shunt Leakage)',
      financialImpact: '₹2,400 / day (Degradation + Lost Gen)',
      financialImpactSub: 'Compounding cell burn rate over 14 operational days',
      lossVector: '-20.7% Sub-string Mismatch Loss',
      inverterStatus: 'MPPT Blindness: Reads generic string drop; assumes passing cloud',
      aiDiagnosticVerdict: 'SPATIAL MESH: ISOLATED CELL ANOMALY DETECTED (Δ = 18.6σ)',
      flirTemp: '42.6 °C',
      powerYield: '4.6 kW (-20.7%)',
      accentColor: '#ffaa00',
      cell15ElClass: 'bg-amber-950/40 border-amber-500/50 text-amber-300',
      hotspotIntensity: 0.45,
      crackState: 'hairline',
      soilingPattern: 'none',
    },
    {
      id: 2,
      label: '03. Thermal Hotspot Runaway',
      badge: 'REVERSE-BIAS DIODE BREAKDOWN: 87.4°C',
      heading: 'Current Dissipation Bottleneck & Polymer Backsheet Charring',
      mathematicalEquation: 'P_dissipated = I_string · V_reverse ≈ 23.7A · 12.8V = 303.4W',
      equationDescription: 'Defective Cell #15 is forced into reverse bias by the 23.7A string current, converting generated electricity into fatal thermal energy.',
      cellDegradationDesc: 'Electroluminescence turns completely black (zero radiative recombination). Silicon temperature spikes to 87.4°C. EVA encapsulant delamination and backsheet scorch underway.',
      cell15Resistance: '1,480 Ω (Complete Diode Choke)',
      financialImpact: '₹2,840 / day + ₹48,000 Module Replacement',
      financialImpactSub: 'Risk of fire outbreak and permanent module rupture',
      lossVector: '-81.0% String Collapse',
      inverterStatus: 'String Inverter: Locked in sub-optimal local MPPT trap',
      aiDiagnosticVerdict: 'CRITICAL ALERT: IMMEDIATE STRING RELAY BYPASS REQUIRED',
      flirTemp: '87.4 °C (CRITICAL RUNAWAY)',
      powerYield: '1.1 kW (-81.0%)',
      accentColor: '#ff4141',
      cell15ElClass: 'bg-rose-950/60 border-rose-500/80 text-rose-300',
      hotspotIntensity: 1.0,
      crackState: 'severe',
      soilingPattern: 'none',
    },
    {
      id: 3,
      label: '04. Smog / Soiling Inversion Mask',
      badge: 'REGIONAL ATMOSPHERIC INTERFERENCE',
      heading: 'Isotropic Optical Attenuation (PM2.5 / PM10 Soot)',
      mathematicalEquation: 'G_effective = G_0 · e^(-k_ext · z_airmass) [Uniform 78% Drop]',
      equationDescription: 'Uniform particulate blanket attenuates solar irradiance identically across every neighboring panel in the 1km farm array.',
      cellDegradationDesc: 'EL scan shows uniform diminished luminescence across ALL cells. No single cell is reverse-biased or cracked. Zero thermal gradient (ΔT < 1.2°C).',
      cell15Resistance: '14.1 mΩ (Normal Wafer Integrity)',
      financialImpact: '₹2,400 / day (Soiling Deficit across array)',
      financialImpactSub: 'Reversible instantly upon automated wash cycle trigger',
      lossVector: '-79.3% Array-wide Attenuation',
      inverterStatus: 'Standard Inverter Confusion: Flags error as string failure',
      aiDiagnosticVerdict: 'SPATIAL CONSENSUS: REGIONAL SMOG DETECTED (NO HARDWARE REPLACEMENT)',
      flirTemp: '31.0 °C (Uniform Field)',
      powerYield: '1.2 kW (-79.3% Regional)',
      accentColor: '#38bdf8',
      cell15ElClass: 'bg-sky-950/30 border-sky-500/30 text-sky-300',
      hotspotIntensity: 0.1,
      crackState: 'none',
      soilingPattern: 'uniform_smog',
    },
    {
      id: 4,
      label: '05. The Fatal Misdiagnosis',
      badge: 'CONVENTIONAL SCADA FAILURE DISASTER',
      heading: 'Thermal Shock Fracture · Cold Sprinkler on 87°C Glass',
      mathematicalEquation: 'σ_thermal = E · α · ΔT / (1 - ν) > 120 MPa (Glass Yield Limit)',
      equationDescription: 'Cold water spray on boiling glass exceeds monocrystalline tempered tensile yield strength, fracturing the front sheet and voiding factory warranty.',
      cellDegradationDesc: 'Irreversible spiderweb shattering of solar front glass. Moisture ingress triggers instant ground fault (R_iso < 0.1 MΩ). Full warranty claim rejected by manufacturer.',
      cell15Resistance: '∞ Open Circuit / Ground Short Fault',
      financialImpact: '₹62,400 Total Loss (Asset Write-Off)',
      financialImpactSub: '₹2,400 diesel truck dispatch + ₹60,000 panel replacement',
      lossVector: '-100% Complete Bus Dropout',
      inverterStatus: 'Trip: Earth Leakage / Insulation Resistance Error',
      aiDiagnosticVerdict: 'PREVENTED BY GRIDPULSE: THERMAL LOCKOUT BLOCKED SPRINKLERS',
      flirTemp: 'THERMAL SHOCK',
      powerYield: '0.0 kW (TOTAL FAILURE)',
      accentColor: '#e11d48',
      cell15ElClass: 'bg-rose-950/80 border-rose-500 text-rose-200 animate-pulse',
      hotspotIntensity: 1.0,
      crackState: 'burnout',
      soilingPattern: 'none',
    },
  ];

  const current = modes[selectedMode];

  return (
    <div className="relative w-full space-y-8 text-slate-100 font-sans">
      {/* ========================================================================= */}
      {/* 1. TOP NAVIGATION MATRIX: ENTERPRISE STATUS RIBBON LAYOUT                  */}
      {/* Micro-spaced industrial status badges with subtle retro-neon dot pulses    */}
      {/* ========================================================================= */}
      <div className="w-full bg-[#0a1728]/90 border border-white/[0.08] rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] shadow-lg">
        <div className="flex items-center gap-2 text-slate-400">
          <Scan className="w-3.5 h-3.5 text-[#00ff88]" />
          <span className="font-bold text-white tracking-wider">DIAGNOSTIC MATRIX:</span>
        </div>

        {/* Discrete Enterprise Status Streams (Zero pill candy badges, crisp monospace structure) */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff88] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff88]" />
            </span>
            <span className="text-slate-300 tracking-wide font-medium">
              [ SYS_ANALYTICS: <span className="text-[#00ff88] font-bold">PASS</span> ]
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffaa00] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ffaa00]" />
            </span>
            <span className="text-slate-300 tracking-wide font-medium">
              [ EDGE_MESH: <span className="text-[#ffaa00] font-bold">ROUTING</span> ]
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff88] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff88]" />
            </span>
            <span className="text-slate-300 tracking-wide font-medium">
              [ SPA_CONSENSUS: <span className="text-[#00ff88] font-bold">STABLE</span> ]
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
            <span className="text-slate-300 tracking-wide font-medium">
              [ COMPLIANCE: <span className="text-cyan-400 font-bold">AUDITED</span> ]
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DISASTER STAGE SELECTOR (TAB CONTROLS)                                  */}
      {/* Clean industrial segmented selector with state indicators                 */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="text-[11px] font-mono font-bold tracking-widest text-[#ffaa00] uppercase flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-[#ffaa00]" />
            Physical Wafer Degradation Evolution
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Micro-Fracture Progression vs. Smog Inversion
          </h3>
        </div>

        {/* Industrial Mode Segment Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#050c16] border border-white/[0.08] rounded-xl font-mono text-xs">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMode(m.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedMode === m.id
                  ? 'bg-[#0f243d] text-white border border-[#00ff88]/50 shadow-[0_0_12px_rgba(0,255,136,0.2)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: selectedMode === m.id ? m.accentColor : '#64748b' }}
              />
              <span>0{m.id + 1}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. CORE TWO-COLUMN STAGE: SCIENTIFIC EL SCANNER (LEFT) & DEEP INTEL (RIGHT)*/}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ======================================================================= */}
        {/* LEFT COLUMN: ELECTROLUMINESCENCE (EL) SOLAR CELL SCANNING GRID          */}
        {/* High-precision digital X-Ray scan of physical monocrystalline cells     */}
        {/* ======================================================================= */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-2xl bg-[#050c16] border border-white/[0.12] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.6)] overflow-hidden">
            {/* Ambient Diagnostic Glow according to current stage */}
            <div
              className="absolute -top-24 -left-24 w-80 h-80 rounded-full blur-[100px] pointer-events-none transition-all duration-700"
              style={{
                backgroundColor: current.accentColor,
                opacity: selectedMode === 0 ? 0.08 : 0.16,
              }}
            />

            {/* Header info strip above EL Grid */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-3 mb-4 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[#00ff88] font-bold">EL-SCANNER v4.2</span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-400">Wavelength: 1,150 nm Near-IR</span>
              </div>
              <button
                onClick={() => setScanBeamActive(!scanBeamActive)}
                className={`px-2.5 py-1 rounded text-[11px] border transition-all cursor-pointer ${
                  scanBeamActive
                    ? 'bg-[#00ff88]/10 border-[#00ff88]/40 text-[#00ff88]'
                    : 'bg-slate-800/50 border-slate-700 text-slate-400'
                }`}
              >
                Scan Beam: {scanBeamActive ? 'ACTIVE' : 'PAUSED'}
              </button>
            </div>

            {/* High-Definition EL Solar Scanning Grid (6 Columns x 4 Rows = 24 High-Density Monocrystalline Cells) */}
            <div className="relative aspect-[4/3] w-full rounded-xl bg-[#03070e] border border-white/[0.1] p-3 overflow-hidden select-none">
              {/* Atmospheric Smog Overlay (Active in Mode 3) */}
              {current.soilingPattern === 'uniform_smog' && (
                <div className="absolute inset-0 z-30 bg-gradient-to-b from-amber-950/40 via-amber-900/30 to-amber-950/40 backdrop-blur-[0.5px] pointer-events-none transition-opacity duration-700">
                  <div className="absolute top-3 left-3 bg-black/80 border border-amber-500/40 px-2 py-1 rounded text-[10px] font-mono text-amber-300">
                    AIRMASS RESIDUAL: PM2.5 = 284 µg/m³ · ISOTROPIC SHADOW
                  </div>
                </div>
              )}

              {/* Looping Scanning Laser Line */}
              {scanBeamActive && (
                <div
                  className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00ff88] to-transparent z-40 pointer-events-none shadow-[0_0_12px_#00ff88]"
                  style={{
                    animation: 'laserScan 3.5s ease-in-out infinite',
                  }}
                />
              )}

              {/* Grid Layout of Monocrystalline Silicon Cells */}
              <div className="grid grid-cols-6 grid-rows-4 gap-2 w-full h-full relative z-10">
                {Array.from({ length: 24 }).map((_, index) => {
                  const isCell15 = index === 15;
                  const isNeighborOf15 = [14, 16, 9, 21].includes(index);
                  const isHovered = hoveredCell === index;

                  // Compute visual EL appearance for cell
                  let cellBg = 'bg-[#0a182b]/80 border-slate-700/60';
                  let carrierGlow = 'rgba(0, 255, 136, 0.05)';
                  let cellText = 'text-slate-500';

                  if (selectedMode === 0) {
                    // Nominal: pristine uniform electroluminescence
                    cellBg = 'bg-[#0a223a] border-cyan-500/30 hover:border-[#00ff88]/60';
                    carrierGlow = 'rgba(0, 255, 136, 0.12)';
                    cellText = 'text-cyan-400';
                  } else if (isCell15) {
                    // Cell #15 undergoes severe progression
                    if (selectedMode === 1) {
                      cellBg = 'bg-[#2a1e0b] border-amber-500 shadow-[inset_0_0_15px_rgba(245,158,11,0.4)]';
                      carrierGlow = 'rgba(245, 158, 11, 0.3)';
                      cellText = 'text-amber-400 font-bold';
                    } else if (selectedMode === 2) {
                      cellBg = 'bg-[#3b0b14] border-rose-500 shadow-[inset_0_0_20px_rgba(239,68,68,0.7)] animate-pulse';
                      carrierGlow = 'rgba(239, 68, 68, 0.5)';
                      cellText = 'text-rose-400 font-black';
                    } else if (selectedMode === 3) {
                      cellBg = 'bg-[#1b1c20] border-amber-600/40';
                      cellText = 'text-amber-300';
                    } else if (selectedMode === 4) {
                      cellBg = 'bg-[#1a0509] border-rose-600 shadow-[inset_0_0_25px_rgba(225,29,72,0.9)]';
                      cellText = 'text-rose-500 font-black';
                    }
                  } else if (isNeighborOf15 && (selectedMode === 1 || selectedMode === 2)) {
                    // Neighboring cells absorb current strain
                    cellBg = 'bg-[#0e1d2e] border-slate-700';
                    cellText = 'text-slate-400';
                  } else if (selectedMode === 3) {
                    // Uniform smog: attenuated luminescence across all cells
                    cellBg = 'bg-[#0c1420] border-amber-900/40';
                    cellText = 'text-slate-500';
                  }

                  return (
                    <div
                      key={index}
                      onMouseEnter={() => setHoveredCell(index)}
                      className={`relative rounded-md border flex flex-col justify-between p-1.5 transition-all duration-300 cursor-pointer overflow-hidden ${cellBg} ${
                        isHovered ? 'ring-1 ring-white/60 scale-[1.02]' : ''
                      }`}
                      style={{
                        boxShadow: `0 0 10px ${carrierGlow}`,
                      }}
                    >
                      {/* Monocrystalline Diamond Wafer Chamfer Cutouts (Visual Authentic Micro-detail) */}
                      <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-[#03070e] rotate-45 -translate-x-1 -translate-y-1" />
                      <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#03070e] rotate-45 translate-x-1 -translate-y-1" />
                      <div className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-[#03070e] rotate-45 -translate-x-1 translate-y-1" />
                      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-[#03070e] rotate-45 translate-x-1 translate-y-1" />

                      {/* Micro-Busbars (5-BB pattern across every cell) */}
                      <div className="absolute inset-0 flex justify-around pointer-events-none opacity-20">
                        <div className="w-[0.5px] h-full bg-slate-300" />
                        <div className="w-[0.5px] h-full bg-slate-300" />
                        <div className="w-[0.5px] h-full bg-slate-300" />
                      </div>

                      {/* Cell ID & Carrier State */}
                      <div className="flex items-center justify-between text-[9px] font-mono relative z-10 leading-none">
                        <span className={cellText}>#{index < 9 ? `0${index + 1}` : index + 1}</span>
                        {isCell15 && (
                          <span className="text-[8px] font-bold text-rose-400 animate-pulse">
                            {selectedMode === 0 ? 'NOM' : selectedMode === 1 ? 'CRACK' : 'HOTSPOT'}
                          </span>
                        )}
                      </div>

                      {/* Cell #15 Interactive Visual Anomaly: Hairline Micro-Crack & Molten Hotspot */}
                      {isCell15 && current.crackState !== 'none' && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                          {/* Cracked SVG lightning fracture path */}
                          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 60 60">
                            <path
                              d="M 12 10 L 28 26 L 24 34 L 46 52"
                              stroke={current.crackState === 'burnout' ? '#ffffff' : '#fbbf24'}
                              strokeWidth={current.crackState === 'severe' ? '3' : '1.8'}
                              fill="none"
                              strokeDasharray={current.crackState === 'burnout' ? '2 1' : 'none'}
                              className={current.crackState === 'burnout' ? 'animate-pulse' : ''}
                            />
                            {current.crackState === 'burnout' && (
                              <path
                                d="M 40 12 L 28 26 L 36 38 L 18 50"
                                stroke="#f43f5e"
                                strokeWidth="2"
                                fill="none"
                              />
                            )}
                          </svg>

                          {/* Radiant Hotspot Core */}
                          {current.hotspotIntensity > 0 && (
                            <div
                              className="w-7 h-7 rounded-full bg-gradient-to-r from-yellow-300 via-orange-500 to-red-600 blur-[2px] animate-pulse"
                              style={{
                                transform: `scale(${0.8 + current.hotspotIntensity * 0.6})`,
                                opacity: current.hotspotIntensity,
                              }}
                            />
                          )}
                        </div>
                      )}

                      {/* Cell Bottom Stats */}
                      <div className="text-[8px] font-mono text-slate-400 relative z-10 flex items-center justify-between">
                        <span>
                          {isCell15
                            ? selectedMode === 0
                              ? '28°C'
                              : current.flirTemp
                            : selectedMode === 3
                            ? '31°C'
                            : '29°C'}
                        </span>
                        <span className="text-slate-500">
                          {isCell15 && selectedMode >= 1 ? 'FAULT' : 'STC'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Live Scan Telemetry Footnote on Canvas */}
              <div className="absolute bottom-2 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">FLIR INFRARED:</span>
                  <span className="text-rose-400 font-bold">{current.flirTemp}</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-slate-400">CELL #15 FLUX:</span>
                  <span className="text-white font-bold">{selectedMode === 0 ? 'NOMINAL' : 'ANOMALY DETECTED'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">STRING YIELD:</span>
                  <span className="text-[#00ff88] font-bold">{current.powerYield}</span>
                </div>
              </div>
            </div>

            {/* Cell Inspection Detail Strip (Hovered / Target Cell Data) */}
            <div className="mt-3 p-3 rounded-xl bg-[#03070e] border border-white/[0.06] flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
              <div className="flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-[#00ff88]" />
                <span className="text-slate-300">
                  Inspecting Wafer <strong className="text-white">Cell #{hoveredCell !== null ? (hoveredCell < 9 ? `0${hoveredCell + 1}` : hoveredCell + 1) : '15'}</strong>:
                </span>
                <span className="text-slate-400 text-[11px]">
                  {hoveredCell === 15
                    ? 'Target Critical Bottleneck Junction'
                    : 'Adjacent Normal Monocrystalline Cell'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Carrier Lifetime: <span className="text-white font-bold">{hoveredCell === 15 && selectedMode >= 1 ? '1.8 µs (Quenched)' : '142.5 µs'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* RIGHT COLUMN: MATHEMATICAL FORMULA SANDBOX & PRECISE IMPACT CARDS        */}
        {/* Crisp, glowing border frames in Cosmic Indigo (#07111e) theme            */}
        {/* ======================================================================= */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Stage Heading and Tag */}
          <div className="p-5 rounded-2xl bg-[#050c16] border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] font-bold tracking-wider uppercase text-[#00ff88] flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#00ff88]" />
                {current.badge}
              </span>
              <span className="text-[10px] font-mono text-slate-500">PHASE 0{current.id + 1} / 05</span>
            </div>

            <h4 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
              {current.heading}
            </h4>

            <p className="text-slate-300 text-xs sm:text-sm font-sans leading-relaxed">
              {current.cellDegradationDesc}
            </p>
          </div>

          {/* 3. MATHEMATICAL FORMULA SANDBOX (Clickable Variable Derivation) */}
          <div className="p-5 rounded-2xl bg-[#050c16] border border-cyan-500/30 space-y-3 shadow-[0_0_20px_rgba(6,182,212,0.08)]">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 font-mono text-xs">
              <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                MATHEMATICAL GOVERNING EQUATION
              </span>
              <button
                onClick={() => setShowEquationInspector(!showEquationInspector)}
                className="text-[10px] text-cyan-400 hover:text-white transition-colors cursor-pointer"
              >
                {showEquationInspector ? '[ Hide Derivation ]' : '[ Expand Derivation ]'}
              </button>
            </div>

            {/* Clickable Equation Bar */}
            <div
              onClick={() => setShowEquationInspector(!showEquationInspector)}
              className="p-3.5 rounded-xl bg-[#03070e] border border-cyan-500/40 text-center font-mono text-sm sm:text-base font-bold text-cyan-200 tracking-wide cursor-pointer hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all select-none"
            >
              {current.mathematicalEquation}
            </div>

            <p className="text-[11px] font-sans text-slate-400 leading-normal">
              {current.equationDescription}
            </p>

            {/* Collapsible Deep Derivation View */}
            {showEquationInspector && (
              <div className="p-3.5 rounded-xl bg-[#03070e] border border-white/[0.08] space-y-2 text-[11px] font-mono text-slate-300 transition-all">
                <div className="text-[#00ff88] font-bold">Physics Derivation & Hardware Connection:</div>
                <div className="text-slate-400 space-y-1">
                  <div>• <strong>Current Shunt Bottleneck:</strong> When cell micro-fractures split the silicon wafer, R_sh plunges. Current I_string (23.7A) cannot pass through the p-n junction and is forced through R_shunt bottleneck.</div>
                  <div>• <strong>Joule Dissipation:</strong> P = I² · R causes localized hotspots over 85°C within 18 minutes of unmitigated clear-sky irradiance.</div>
                  <div>• <strong>Pure-Software Detection:</strong> INA219 hardware shunt sensor streams busbar telemetry to the ESP32 Gateway. Digital Twin runs spatial consensus without requiring dedicated per-panel optical sensors.</div>
                </div>
              </div>
            )}
          </div>

          {/* 4. PRECISE OPERATIONAL & FINANCIAL IMPACT CARDS (Crisp Glowing Borders, Cosmic Indigo Base) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Resistance & Diode Shunt Breakdown */}
            <div className="p-4 rounded-xl bg-[#050c16] border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.12)] space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                Cell #15 Shunt Resistance
              </span>
              <div className="text-base sm:text-lg font-mono font-bold text-amber-300">
                {current.cell15Resistance}
              </div>
              <div className="text-[10px] font-mono text-slate-500">
                Loss Vector: <span className="text-rose-400 font-bold">{current.lossVector}</span>
              </div>
            </div>

            {/* Financial Impact Breakdown */}
            <div className="p-4 rounded-xl bg-[#050c16] border border-[#ff4141]/50 shadow-[0_0_15px_rgba(255,65,65,0.15)] space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                Financial Impact (Lost Rev + Risk)
              </span>
              <div className="text-base sm:text-lg font-mono font-bold text-[#ff4141]">
                {current.financialImpact}
              </div>
              <div className="text-[10px] font-mono text-slate-500">
                {current.financialImpactSub}
              </div>
            </div>
          </div>

          {/* 5. CONVENTIONAL SCADA VS GRIDPULSE CONSENSUS COMPARISON */}
          <div className="p-4 rounded-xl bg-[#050c16] border border-white/[0.08] space-y-2.5 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-[11px]">
              <span className="text-slate-400">Conventional Central SCADA:</span>
              <span className={selectedMode >= 3 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                {current.inverterStatus}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#00ff88] font-bold">GridPulse Edge Consensus:</span>
              <span className="text-white font-bold">{current.aiDiagnosticVerdict}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
