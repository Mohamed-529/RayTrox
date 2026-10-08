import React, { useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  Cpu,
  Droplet,
  Fuel,
  HelpCircle,
  Layers,
  Lightbulb,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  Truck,
  Wind,
  X,
  Zap,
} from 'lucide-react';

export const ProblemExplanationView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'crisis' | 'workflow' | 'digital_twin' | 'flow'>('crisis');

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-[#111827] rounded-xl border border-[#1F2937] p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider mb-1">
          <span>Section 1 &amp; 2 · Definitive Problem Blueprint</span>
          <span>/</span>
          <span>Pure Software Digital Twin Mesh</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          The Hidden Environmental Crisis &amp; Spatial Consensus
        </h1>
        <p className="text-sm text-[#94A3B8] mt-2 leading-relaxed">
          How particulate matter chokes urban solar arrays, blinds classical SCADA thresholds, and triggers false diesel fleet dispatches in 82% of incidents.
        </p>

        {/* Sub-Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-[#1F2937]">
          <button
            onClick={() => setActiveTab('crisis')}
            className={`px-3.5 py-1.5 text-xs font-mono font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'crisis'
                ? 'bg-emerald-600 text-white'
                : 'bg-[#070A10] text-[#94A3B8] hover:text-white border border-[#1F2937]'
            }`}
          >
            1. The Compounding Crisis
          </button>
          <button
            onClick={() => setActiveTab('workflow')}
            className={`px-3.5 py-1.5 text-xs font-mono font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'workflow'
                ? 'bg-emerald-600 text-white'
                : 'bg-[#070A10] text-[#94A3B8] hover:text-white border border-[#1F2937]'
            }`}
          >
            2. The Broken Workflow
          </button>
          <button
            onClick={() => setActiveTab('digital_twin')}
            className={`px-3.5 py-1.5 text-xs font-mono font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'digital_twin'
                ? 'bg-emerald-600 text-white'
                : 'bg-[#070A10] text-[#94A3B8] hover:text-white border border-[#1F2937]'
            }`}
          >
            3. Digital Twin Math
          </button>
          <button
            onClick={() => setActiveTab('flow')}
            className={`px-3.5 py-1.5 text-xs font-mono font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'flow'
                ? 'bg-emerald-600 text-white'
                : 'bg-[#070A10] text-[#94A3B8] hover:text-white border border-[#1F2937]'
            }`}
          >
            4. User Journey &amp; Logic Flow
          </button>
        </div>
      </div>

      {/* TAB 1: THE CRISIS */}
      {activeTab === 'crisis' && (
        <div className="space-y-6">
          <div className="bg-[#111827] rounded-xl border border-[#1F2937] p-6 space-y-4">
            <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono">
              The Compounding Solar-Smog Paradox
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              In metropolitan industrial zones like Delhi-NCR, heavy winter particulate smog (PM2.5 / PM10) creates two compounding environmental and financial crises for solar grids:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 font-mono text-xs">
              <div className="p-4 rounded-lg bg-[#070A10] border border-amber-500/30 text-left space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <Wind className="w-4 h-4" />
                  <span>Crisis 1: The Efficiency Choke</span>
                </div>
                <p className="text-[#94A3B8] text-[11px] leading-relaxed">
                  Particulate dust settling onto photovoltaic surfaces blocks direct solar irradiance, causing an unmonitored <strong>15% to 30%+ drop</strong> in clean energy generation across entire districts.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#070A10] border border-rose-500/30 text-left space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold">
                  <Truck className="w-4 h-4" />
                  <span>Crisis 2: The Maintenance Emission Loop</span>
                </div>
                <p className="text-[#94A3B8] text-[11px] leading-relaxed">
                  When power suddenly drops, operators cannot distinguish between a highly soiled panel layer and physical hardware defects (blown inverter, broken string diode, cracked cell).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BROKEN CURRENT WORKFLOW */}
      {activeTab === 'workflow' && (
        <div className="space-y-6">
          <div className="bg-[#111827] rounded-xl border border-[#1F2937] p-6 space-y-4">
            <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono">
              The Broken Current Workflow (The 82% Trap)
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              To prevent long-term array degradation, grid operations managers currently deploy field maintenance teams in diesel trucks to manually inspect arrays:
            </p>

            {/* ASCII / Graphical Flow */}
            <div className="p-4 rounded-lg bg-[#070A10] border border-[#1F2937] font-mono text-xs text-slate-300 space-y-2 overflow-x-auto">
              <div className="text-emerald-400 font-bold">CURRENT FLEET DISPATCH CYCLE:</div>
              <pre className="text-[11px] text-slate-300 leading-relaxed">
{`[Raw Power Drops] ──► [Ambiguity Alert] ──► [Deploy Diesel Field Fleet] ──► [82% Found to be Just Smog Dust]
                                                                            └─► Wasted Carbon Footprint!`}</pre>
            </div>

            <div className="p-4 rounded-lg bg-[#070A10] border border-rose-500/30 font-mono text-xs text-[#94A3B8] space-y-2">
              <span className="font-bold text-rose-400 block uppercase">
                The Secondary Environmental Damage:
              </span>
              <ul className="space-y-1.5 text-[11px]">
                <li>• In 82% of dispatches, technicians arrive only to discover clean hardware choked by atmospheric soot.</li>
                <li>• Each wasted round-trip burns ~14.5 Liters of diesel, releasing 38.8 kg of CO₂ and particulate exhaust into an already polluted city.</li>
                <li>• Blindly triggering automated wash sprinklers during isolated hardware faults exhausts hundreds of liters of treated municipal water.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DIGITAL TWIN MATH */}
      {activeTab === 'digital_twin' && (
        <div className="space-y-6">
          <div className="bg-[#111827] rounded-xl border border-[#1F2937] p-6 space-y-5">
            <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono">
              Pure Software Digital Twin Formulation
            </h2>

            {/* Step 1 */}
            <div className="p-4 rounded-lg bg-[#070A10] border border-[#1F2937] font-mono text-xs space-y-2">
              <div className="text-emerald-400 font-bold">
                1. Theoretical Capacity Limit Computation
              </div>
              <div className="text-sm text-white font-bold bg-[#111827] p-3 rounded border border-[#1F2937]">
                P_theoretical = (G × A × 0.85) ÷ 1000.0
              </div>
              <div className="text-[11px] text-[#94A3B8]">
                Where <strong>G</strong> is solar flux (W/m²), <strong>A</strong> is panel area (m²), and conversion efficiency is locked at 85%.
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-lg bg-[#070A10] border border-[#1F2937] font-mono text-xs space-y-2">
              <div className="text-emerald-400 font-bold">
                2. Degradation Percentage Boundary Trigger (&ge; 20.0%)
              </div>
              <div className="text-sm text-white font-bold bg-[#111827] p-3 rounded border border-[#1F2937]">
                Loss_% = max(0.0, ((P_theoretical - P_actual) ÷ P_theoretical) × 100.0)
              </div>
              <div className="text-[11px] text-[#94A3B8]">
                If Loss_% &lt; 20%, status is nominal (<em>HOLD_ACTION</em>). If Loss_% &ge; 20%, trigger spatial consensus query.
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-lg bg-[#070A10] border border-[#1F2937] font-mono text-xs space-y-2">
              <div className="text-emerald-400 font-bold">
                3. Spatial Coordinate Buffer Query (1.0 km Baseline)
              </div>
              <div className="text-sm text-white font-bold bg-[#111827] p-3 rounded border border-[#1F2937]">
                Variance_Drift = |Loss_%_target - Neighborhood_Avg_%|
              </div>
              <div className="text-[11px] text-[#94A3B8] space-y-1">
                <div>
                  • <strong>Variance &gt; 12.0%:</strong> Isolated drop while neighbors are stable &rarr; <em>BLOCK_WATER_TRIGGER_ALERT_MAINTENANCE</em>.
                </div>
                <div>
                  • <strong>Variance &le; 12.0%:</strong> District-wide uniform drop &rarr; <em>AUTHORIZE_AUTOMATED_SPRINKLER_WASH</em> (Truck canceled).
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: USER JOURNEY & FLOW */}
      {activeTab === 'flow' && (
        <div className="space-y-6">
          <div className="bg-[#111827] rounded-xl border border-[#1F2937] p-6 space-y-4">
            <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono">
              End-to-End Operational Decision Flow
            </h2>
            <div className="p-4 rounded-lg bg-[#070A10] border border-[#1F2937] font-mono text-xs text-slate-300 overflow-x-auto">
              <pre className="text-[11px] leading-relaxed">
{`[Edge Telemetry Packet Ingested via MQTT]
               │
               ▼
   [Calculate Software Loss % via Digital Twin]
               │
               ▼
   [Is Efficiency Loss ≥ 20%?] ──(No)──► [Log Nominal State to Timestream]
               │ Yes
               ▼
[Query Neighborhood Arrays (1km Buffer)]
               │
               ▼
 [Does Target Loss Deviate from Neighbors by >12%?]
       │                                  │
    (Yes)                              (No)
       ▼                                  ▼
[Hardware Fault Suspected]         [Widespread Smog Verified]
  - Block automated water valves     - Authorize automated washing
  - Route maintenance ticket         - Push local cleaning trigger`}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
