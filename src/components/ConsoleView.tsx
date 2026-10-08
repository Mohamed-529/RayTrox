import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Bot,
  CheckCircle2,
  CloudFog,
  Compass,
  Cpu,
  Droplets,
  Fuel,
  Info,
  Layers,
  MapPin,
  RefreshCw,
  Send,
  Sliders,
  Sparkles,
  Sun,
  Truck,
  Wind,
  Zap,
} from 'lucide-react';
import { ConsensusEvaluation, ScenarioPreset, SolarNode } from '../types/grid';
import { PRESET_SCENARIOS } from '../data/mockNodes';
import { calculateTheoreticalMaxKw, calculateEfficiencyLoss } from '../utils/consensusEngine';

export interface TelemetryLedgerItem {
  record_id: string;
  timestamp: string;
  device_id: string;
  actual_kw: number;
  efficiency_loss_pct: number;
  neighborhood_avg_loss_pct: number;
  variance_drift: number;
  consensus_verdict: string;
  automation_trigger_wash_relay: boolean;
  alert_note?: string;
}

interface ConsoleViewProps {
  nodes: SolarNode[];
  evaluation: ConsensusEvaluation;
  selectedNodeId: string;
  onSelectNode: (id: string) => void;
  onApplyScenario: (scenario: ScenarioPreset) => void;
  onUpdateNodeParam: (nodeId: string, actualKw: number, irradiance: number) => void;
  activeScenarioId: string;
  onRunConsensus: () => void;
  ledgerLogs: TelemetryLedgerItem[];
  onAddLedgerItem: (item: TelemetryLedgerItem) => void;
}

export const ConsoleView: React.FC<ConsoleViewProps> = ({
  nodes,
  evaluation,
  selectedNodeId,
  onSelectNode,
  onApplyScenario,
  onUpdateNodeParam,
  activeScenarioId,
  onRunConsensus,
  ledgerLogs,
  onAddLedgerItem,
}) => {
  const [showBedrockBrief, setShowBedrockBrief] = useState<boolean>(false);
  const [isHazeVisualEnabled, setIsHazeVisualEnabled] = useState<boolean>(activeScenarioId === 'regional_smog');
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  const handleSimulateCustomIngress = () => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newItem: TelemetryLedgerItem = {
      record_id: Math.random().toString(36).substring(7),
      timestamp: timeStr,
      device_id: selectedNode.id,
      actual_kw: selectedNode.actualKw,
      efficiency_loss_pct: evaluation.targetLossPct,
      neighborhood_avg_loss_pct: evaluation.neighborhoodAvgLossPct,
      variance_drift: evaluation.variance,
      consensus_verdict: evaluation.verdict,
      automation_trigger_wash_relay:
        evaluation.verdict === 'AUTHORIZE_AUTOMATED_SPRINKLER_WASH' ||
        evaluation.verdict === 'SUPPRESS_TRUCK_DISPATCH_SMOG_CONFIRMED',
      alert_note:
        evaluation.classification === 'HARDWARE_ANOMALY'
          ? '>> ALERT: Isolated hardware drop detected! Valve: BLOCKED · P1 Ticket Dispatched'
          : evaluation.classification === 'REGIONAL_SMOG_EVENT'
          ? '>> SMOG VERIFIED: Proportional drop across ward. Truck dispatch held (14.5L diesel saved)'
          : undefined,
    };
    onAddLedgerItem(newItem);
  };

  return (
    <div className="space-y-8">
      {/* Row A: Header Area & Action Toolbars (Spaced cleanly with border divider) */}
      <section className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-[#161B33]/60 pb-6 gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Live Ward Cluster
            </span>
            <span>·</span>
            <span>Delhi South / Zone 07</span>
            <span>·</span>
            <span>1.0 km Buffer Mesh</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Solar Spatial Consensus Command Center
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            Cross-referencing telemetry mesh coordinates to isolate local hardware failures from regional smog events.
          </p>
        </div>

        {/* Action Controls Matrix (Cleanly separated from titles) */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              const sc = PRESET_SCENARIOS.find((s) => s.id === 'regional_smog');
              if (sc) {
                onApplyScenario(sc);
                setIsHazeVisualEnabled(true);
              }
            }}
            className={`px-4 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer shadow-xs border ${
              activeScenarioId === 'regional_smog'
                ? 'bg-amber-600 text-white border-amber-500 ring-2 ring-amber-400/30'
                : 'bg-[#161B33] text-amber-300 hover:bg-[#1E2548] border-[#22294F]'
            }`}
          >
            Simulate Regional Smog
          </button>
          <button
            onClick={() => {
              const sc = PRESET_SCENARIOS.find((s) => s.id === 'hardware_failure');
              if (sc) {
                onApplyScenario(sc);
                setIsHazeVisualEnabled(false);
              }
            }}
            className={`px-4 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer shadow-xs border ${
              activeScenarioId === 'hardware_failure'
                ? 'bg-rose-600 text-white border-rose-500 ring-2 ring-rose-400/30'
                : 'bg-[#161B33] text-rose-300 hover:bg-[#1E2548] border-[#22294F]'
            }`}
          >
            Inject Inverter Fault
          </button>
          <button
            onClick={() => {
              const sc = PRESET_SCENARIOS.find((s) => s.id === 'nominal_sunny');
              if (sc) {
                onApplyScenario(sc);
                setIsHazeVisualEnabled(false);
              }
            }}
            className={`px-4 py-2.5 text-xs font-medium rounded-lg transition-all cursor-pointer border ${
              activeScenarioId === 'nominal_sunny'
                ? 'bg-slate-700 text-white border-slate-600'
                : 'bg-[#0B0F19] text-[#94A3B8] hover:text-white border-[#161B33]'
            }`}
          >
            Reset Sunny Day
          </button>
          <button
            onClick={() => setShowBedrockBrief(!showBedrockBrief)}
            className="px-4 py-2.5 text-xs font-bold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Bot className="w-4 h-4 text-emerald-400" />
            <span>{showBedrockBrief ? 'Hide Bedrock AI' : 'Bedrock AI Brief'}</span>
          </button>
        </div>
      </section>

      {/* Row B: Static Telemetry Micro-Data Strip */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-[#0B0F19]/60 p-5 border border-[#161B33] rounded-xl text-xs font-mono text-[#94A3B8]">
        <div className="space-y-1">
          <span className="text-[#64748B] uppercase tracking-wider text-[10px] block">Solar Irradiance Flux</span>
          <span className="text-base font-bold text-white flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-amber-400" />
            <span>{selectedNode.irradianceWM2} W/m²</span>
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-[#64748B] uppercase tracking-wider text-[10px] block">Atmospheric AQI</span>
          <span className="text-base font-bold text-amber-400 flex items-center gap-1.5">
            <Wind className="w-4 h-4" />
            <span>{activeScenarioId === 'regional_smog' ? '382 (Smog Blanket)' : '52 (Nominal)'}</span>
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-[#64748B] uppercase tracking-wider text-[10px] block">Spatial Buffer Zone</span>
          <span className="text-base font-bold text-emerald-400 flex items-center gap-1.5">
            <Compass className="w-4 h-4" />
            <span>1,000 m (1.0 km)</span>
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-[#64748B] uppercase tracking-wider text-[10px] block">Variance Anomaly Boundary</span>
          <span className="text-base font-bold text-white flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>&gt; 12.0% Tolerance</span>
          </span>
        </div>
      </section>

      {/* Row C: Main Visual Control Panels Grid (Heavy space allotment with gap-8) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: GIS Map Grid / Coordinate Clusters (7 cols) */}
        <div className="lg:col-span-7 bg-[#0B0F19] border border-[#161B33] rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block mb-1">
                Zone B · Geospatial Telemetry Matrix
              </span>
              <h2 className="text-base font-bold text-white tracking-tight uppercase">
                Geospatial Neighborhood Cluster (1.0 km Buffer)
              </h2>
            </div>
            <button
              onClick={() => setIsHazeVisualEnabled(!isHazeVisualEnabled)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer font-medium flex items-center gap-1.5 ${
                isHazeVisualEnabled
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                  : 'bg-[#161B33] text-[#94A3B8] border-[#22294F] hover:text-white'
              }`}
            >
              <CloudFog className="w-3.5 h-3.5" />
              <span>Smog Overlay: {isHazeVisualEnabled ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          {/* Large Visual Coordinate GIS Canvas */}
          <div className="relative h-80 w-full bg-[#060814] rounded-xl overflow-hidden border border-[#161B33] p-5 flex flex-col justify-between shadow-inner">
            {/* Radar Background Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(#1E2548_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

            {/* Visual Atmospheric Smog Haze Overlay */}
            {isHazeVisualEnabled && (
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/20 via-slate-900/40 to-amber-900/30 backdrop-blur-[1px] pointer-events-none z-10 flex items-start justify-end p-4">
                <span className="text-[10px] font-mono text-amber-300 bg-amber-950/90 px-2.5 py-1 rounded border border-amber-500/40 font-bold shadow-sm">
                  ATMOSPHERIC PARTICULATE HAZE ACTIVE (PM2.5)
                </span>
              </div>
            )}

            {/* 1.0 km Spatial Consensus Buffer Circle */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <circle
                cx="50%"
                cy="50%"
                r="130"
                fill="none"
                stroke="#10B981"
                strokeWidth="1.5"
                strokeDasharray="5 5"
                className="opacity-30 animate-spin"
                style={{ animationDuration: '90s' }}
              />
              <circle
                cx="50%"
                cy="50%"
                r="130"
                fill="#10B981"
                className="opacity-5"
              />
            </svg>

            {/* Geographical Location Tags */}
            <div className="relative z-20 flex justify-between items-start text-xs font-mono text-[#94A3B8]">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold bg-[#0B0F19]/90 px-3 py-1.5 rounded-lg border border-[#161B33]">
                <MapPin className="w-3.5 h-3.5" />
                <span>Ward Delhi-Zone-07 (Okhla Industrial Corridor)</span>
              </div>
              <span className="text-[#94A3B8] bg-[#0B0F19]/90 px-2.5 py-1 rounded border border-[#161B33] text-[11px]">
                1.0 km Radius Active
              </span>
            </div>

            {/* Spacious Inverter Array Cards (p-5 min-h-[110px] space-y-3) */}
            <div className="relative z-20 grid grid-cols-1 sm:grid-cols-3 gap-4 my-auto">
              {nodes.map((node, i) => {
                const isTarget = node.id === selectedNodeId;
                const { lossPct } = calculateEfficiencyLoss(
                  node.actualKw,
                  node.irradianceWM2,
                  node.panelAreaM2,
                  node.baselineEfficiency
                );
                const isSevereDrop = lossPct >= 20;
                const isFault = lossPct > 32;

                return (
                  <div
                    key={node.id}
                    onClick={() => onSelectNode(node.id)}
                    className={`p-5 min-h-[110px] space-y-3 rounded-xl text-left transition-all cursor-pointer font-mono border shadow-sm ${
                      isTarget
                        ? 'bg-[#161B33] border-2 border-emerald-400 ring-2 ring-emerald-500/20 text-white'
                        : 'bg-[#0B0F19]/90 border-[#161B33] hover:border-[#28325E] hover:bg-[#161B33]/60 text-[#F8FAFC]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white text-xs">
                        Array 0{i + 1}
                      </span>
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          isFault
                            ? 'bg-rose-500 animate-pulse'
                            : isSevereDrop
                            ? 'bg-amber-400'
                            : 'bg-emerald-400'
                        }`}
                      />
                    </div>

                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-lg font-extrabold text-white tabular-nums">
                        {node.actualKw} <span className="text-xs text-[#64748B] font-normal">kW</span>
                      </span>
                      <span
                        className={`text-sm font-extrabold tabular-nums ${
                          isFault
                            ? 'text-rose-400'
                            : isSevereDrop
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        -{lossPct}%
                      </span>
                    </div>

                    <div className="text-[10px] text-[#64748B] truncate">
                      {node.facility}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Map Legend */}
            <div className="relative z-20 flex items-center justify-between text-xs font-mono text-[#94A3B8] pt-3 border-t border-[#161B33]/80">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Nominal (&lt;20%)
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Uniform Smog (20-30%)
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Inverter Breakdown (&gt;30%)
              </span>
            </div>
          </div>

          {/* Spacious Telemetry Parameter Tuner (p-6 space-y-4) */}
          <div className="p-6 rounded-xl bg-[#060814] border border-[#161B33] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#161B33]/60">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Target Array Inverter Calibration: {selectedNode.id}
                </h3>
              </div>
              <span className="text-xs text-[#64748B] font-mono">Dynamic software recalculation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-mono">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[#94A3B8]">
                  <span>Actual Wattage Output:</span>
                  <span className="font-bold text-white">{selectedNode.actualKw} kW</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="5.8"
                  step="0.05"
                  value={selectedNode.actualKw}
                  onChange={(e) =>
                    onUpdateNodeParam(
                      selectedNode.id,
                      parseFloat(e.target.value),
                      selectedNode.irradianceWM2
                    )
                  }
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#64748B]">
                  <span>0.5 kW (Fault)</span>
                  <span>5.8 kW (Full Sun)</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[#94A3B8]">
                  <span>Solar Flux Irradiance:</span>
                  <span className="font-bold text-white">{selectedNode.irradianceWM2} W/m²</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="1000"
                  step="10"
                  value={selectedNode.irradianceWM2}
                  onChange={(e) =>
                    onUpdateNodeParam(
                      selectedNode.id,
                      selectedNode.actualKw,
                      parseFloat(e.target.value)
                    )
                  }
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#64748B]">
                  <span>200 W/m² (Dusk)</span>
                  <span>1000 W/m² (Peak Noon)</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleSimulateCustomIngress}
                className="px-4 py-2 text-xs font-mono font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Stream Ingress Packet to Ledger</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Automated Dispatch Decision Engine (Takes 5/12 cols) */}
        <div className="lg:col-span-5 bg-[#0B0F19] border border-[#161B33] rounded-xl p-6 sm:p-8 space-y-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block mb-1">
              Automated Decision Pipeline
            </span>
            <h2 className="text-base font-bold text-white tracking-tight uppercase">
              Automated Dispatch Decision Engine
            </h2>
          </div>

          {/* High-Impact Verdict Card (p-6 internal padding) */}
          <div className="space-y-4">
            {evaluation.verdict === 'SUPPRESS_TRUCK_DISPATCH_SMOG_CONFIRMED' ||
            evaluation.verdict === 'AUTHORIZE_AUTOMATED_SPRINKLER_WASH' ? (
              <div className="p-6 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                      WIDESPREAD SMOG VERIFIED · CLUSTER ALIGNED
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1 leading-snug">
                      Diesel Truck Dispatch Canceled
                    </h3>
                    <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">
                      All arrays across the 1.0 km buffer dropped uniformly ({evaluation.targetLossPct}% vs {evaluation.neighborhoodAvgLossPct}% avg). Variance drift ({evaluation.variance}%) &le; 12.0%. Hardware is intact; atmospheric soot layer confirmed.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-emerald-500/20 text-center font-mono">
                  <div className="bg-[#060814] p-3 rounded-lg border border-emerald-500/20">
                    <div className="text-[10px] text-[#64748B]">Diesel Saved</div>
                    <div className="text-sm font-bold text-emerald-400 mt-0.5">14.5 Liters</div>
                  </div>
                  <div className="bg-[#060814] p-3 rounded-lg border border-emerald-500/20">
                    <div className="text-[10px] text-[#64748B]">CO₂ Prevented</div>
                    <div className="text-sm font-bold text-emerald-400 mt-0.5">38.8 kg</div>
                  </div>
                  <div className="bg-[#060814] p-3 rounded-lg border border-emerald-500/20">
                    <div className="text-[10px] text-[#64748B]">Sprinkler Relay</div>
                    <div className="text-sm font-bold text-emerald-400 mt-0.5">TRIGGERED</div>
                  </div>
                </div>
              </div>
            ) : evaluation.verdict === 'BLOCK_WATER_TRIGGER_ALERT_MAINTENANCE' ? (
              <div className="p-6 rounded-xl bg-rose-950/40 border border-rose-500/40 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/40 shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider block">
                      ISOLATED HARDWARE MALFUNCTION ISOLATED
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1 leading-snug">
                      Field Inspection Ticket Required
                    </h3>
                    <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">
                      Target array suffered severe degradation ({evaluation.targetLossPct}%) while surrounding 1km arrays operate normally ({evaluation.neighborhoodAvgLossPct}%). Variance drift ({evaluation.variance}%) &gt; 12.0%. Water wash blocked to prevent resource waste.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-rose-500/20 text-center font-mono">
                  <div className="bg-[#060814] p-3 rounded-lg border border-rose-500/20">
                    <div className="text-[10px] text-[#64748B]">Sprinkler Valve Relay</div>
                    <div className="text-xs font-bold text-rose-400 mt-0.5">BLOCKED (0L Wasted)</div>
                  </div>
                  <div className="bg-[#060814] p-3 rounded-lg border border-rose-500/20">
                    <div className="text-[10px] text-[#64748B]">Maintenance Ticket</div>
                    <div className="text-xs font-bold text-amber-400 mt-0.5">ROUTED TO SECTOR 4</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-[#060814] border border-[#161B33]">
                <div className="flex items-center gap-3">
                  <Sun className="w-5 h-5 text-amber-400" />
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase font-mono">
                      Nominal Solar Generation · No Action Required
                    </h4>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      Efficiency loss is under 20.0% threshold. Operating within nominal sunshine variances.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Spatial Variance Comparison Bars */}
            <div className="p-4 rounded-xl bg-[#060814] border border-[#161B33] space-y-3 text-xs font-mono">
              <div className="flex justify-between text-[#94A3B8]">
                <span>Target Array Loss ({evaluation.targetNodeId})</span>
                <span className="font-bold text-white">{evaluation.targetLossPct}%</span>
              </div>
              <div className="w-full h-2 bg-[#161B33] rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, evaluation.targetLossPct * 2)}%` }}
                />
              </div>

              <div className="flex justify-between text-[#94A3B8]">
                <span>1.0 km Cluster Average (5 Neighbors)</span>
                <span className="font-bold text-white">{evaluation.neighborhoodAvgLossPct}%</span>
              </div>
              <div className="w-full h-2 bg-[#161B33] rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, evaluation.neighborhoodAvgLossPct * 2)}%` }}
                />
              </div>

              <div className="pt-2 border-t border-[#161B33] flex justify-between text-[11px]">
                <span className="text-[#64748B]">Absolute Variance Drift:</span>
                <span className="font-bold text-amber-400">{evaluation.variance}% (Tolerance: &le;12.0%)</span>
              </div>
            </div>

            {/* Digital Twin Math Derivation */}
            <div className="p-4 rounded-xl bg-[#060814] border border-[#161B33] text-xs font-mono space-y-2">
              <span className="text-[10px] text-[#64748B] uppercase font-bold block">
                Digital Twin Math Formulation:
              </span>
              <div className="text-slate-300">
                1. Theoretical Max = ({evaluation.irradianceWM2} × 8.0 × 0.85) ÷ 1000 = <strong className="text-white">{evaluation.theoreticalMaxKw} kW</strong>
              </div>
              <div className="text-slate-300">
                2. Efficiency Loss = (({evaluation.theoreticalMaxKw} - {evaluation.actualKw}) ÷ {evaluation.theoreticalMaxKw}) × 100 = <strong className="text-white">{evaluation.targetLossPct}%</strong>
              </div>
              <div className="text-slate-300">
                3. Spatial Variance = |{evaluation.targetLossPct}% - {evaluation.neighborhoodAvgLossPct}%| = <strong className="text-amber-400">{evaluation.variance}%</strong>
              </div>
            </div>
          </div>

          {/* Streaming Telemetry Ledger Terminal */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#161B33]/60">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Streaming Telemetry Ledger
              </h3>
              <span className="text-[11px] font-mono text-emerald-400">Live Buffer</span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-[#161B33] bg-[#060814]">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-[#0B0F19] text-[#64748B] border-b border-[#161B33]">
                  <tr>
                    <th className="py-2.5 px-3">Time</th>
                    <th className="py-2.5 px-3">Device</th>
                    <th className="py-2.5 px-3 text-right">Loss %</th>
                    <th className="py-2.5 px-3 text-right">Cluster</th>
                    <th className="py-2.5 px-3 text-right">Verdict</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#161B33]/50 tabular-nums">
                  {ledgerLogs.slice(0, 5).map((log) => {
                    const isWash = log.consensus_verdict.includes('WASH') || log.consensus_verdict.includes('SMOG');
                    const isFault = log.consensus_verdict.includes('MAINTENANCE') || log.consensus_verdict.includes('BLOCK');
                    return (
                      <tr key={log.record_id} className="hover:bg-[#161B33]/30">
                        <td className="py-2 px-3 text-[#64748B]">{log.timestamp}</td>
                        <td className="py-2 px-3 font-bold text-white">{log.device_id}</td>
                        <td className="py-2 px-3 text-right text-white">{log.efficiency_loss_pct}%</td>
                        <td className="py-2 px-3 text-right text-[#94A3B8]">{log.neighborhood_avg_loss_pct}%</td>
                        <td
                          className={`py-2 px-3 text-right font-bold ${
                            isWash ? 'text-emerald-400' : isFault ? 'text-rose-400' : 'text-[#64748B]'
                          }`}
                        >
                          {isWash ? 'WASH (SMOG)' : isFault ? 'FAULT' : 'NOMINAL'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Bedrock AI Diagnostic Brief Modal Section */}
      {showBedrockBrief && (
        <section className="bg-[#0B0F19] border border-[#161B33] rounded-xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#161B33]">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white font-mono">
                Amazon Bedrock Generative AI Operational Briefing
              </h3>
            </div>
            <button
              onClick={() => setShowBedrockBrief(false)}
              className="text-[#64748B] hover:text-white font-mono text-xs cursor-pointer"
            >
              ✕ Close Brief
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
            <div className="p-4 rounded-xl bg-[#060814] border border-[#161B33] space-y-2">
              <span className="text-amber-400 font-bold block">
                Model: anthropic.claude-3-5-sonnet-20241022-v2:0
              </span>
              <div className="text-[#94A3B8] leading-relaxed">
                <strong>Ingested Telemetry Context:</strong>
                <br />
                Target: {selectedNode.id} · Output: {selectedNode.actualKw} kW · Loss: {evaluation.targetLossPct}% · Cluster Baseline: {evaluation.neighborhoodAvgLossPct}% · Solar Flux: {selectedNode.irradianceWM2} W/m².
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#060814] border border-emerald-500/40 text-emerald-300 space-y-2 leading-relaxed">
              <strong className="text-white block font-bold">Bedrock Diagnostic Synthesis:</strong>
              {evaluation.classification === 'HARDWARE_ANOMALY' ? (
                <span>
                  <strong>CRITICAL HARDWARE FAULT:</strong> Isolated deviation of {evaluation.variance}% strongly deviates from 1km baseline. Atmospheric smog is rejected. Recommended protocol: Halt water spray valve immediately; dispatch electrical technician with replacement diode/capacitor.
                </span>
              ) : evaluation.classification === 'REGIONAL_SMOG_EVENT' ? (
                <span>
                  <strong>WIDESPREAD SMOG FOOTPRINT:</strong> Proportional cluster degradation ({evaluation.targetLossPct}% vs {evaluation.neighborhoodAvgLossPct}% avg). Hardware integrity validated. Cancel fleet diesel truck; authorize automated panel wash relays.
                </span>
              ) : (
                <span>
                  <strong>NOMINAL STATUS:</strong> Clean panels operating within normal limits. No action required.
                </span>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
