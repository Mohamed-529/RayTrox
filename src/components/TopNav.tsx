import React from 'react';
import { Presentation, ShieldCheck, Sparkles, Terminal, Tv, Zap } from 'lucide-react';

export type ActiveTab =
  | 'command_center'
  | 'audit_matrix'
  | 'slide_deck'
  | 'architecture'
  | 'algorithm_math'
  | 'pytest_runner'
  | 'sam_deployment';

interface TopNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onTriggerQuickSmog: () => void;
  onTriggerQuickFault: () => void;
  suppressedDispatchesCount: number;
  regionalLossAvg: number;
  activeNodesCount: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  onSelectTab,
  onTriggerQuickSmog,
  onTriggerQuickFault,
  suppressedDispatchesCount,
  regionalLossAvg,
  activeNodesCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0B0F19]/95 backdrop-blur-md border-b border-[#161B33]">
      {/* Top Global Status & Metric Strip */}
      <div className="border-b border-[#161B33]/80 bg-[#060814] text-xs font-mono text-[#94A3B8] px-8 py-2 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            GRID TELEMETRY MESH: ONLINE
          </span>
          <span className="text-[#334155]">/</span>
          <span>WARD: DELHI-ZONE-07</span>
          <span className="text-[#334155]">/</span>
          <span>COORDINATE BUFFER: 1.0 KM</span>
        </div>

        <div className="flex items-center gap-4 text-xs tabular-nums">
          <span>
            Active Inverters: <strong className="text-white">{activeNodesCount.toLocaleString()}</strong>
          </span>
          <span className="text-[#334155]">·</span>
          <span>
            Ward Avg Loss: <strong className="text-amber-400">{regionalLossAvg}%</strong>
          </span>
          <span className="text-[#334155]">·</span>
          <span>
            Suppressed Fleet Dispatches: <strong className="text-emerald-400">{suppressedDispatchesCount} Diesel Vans</strong>
          </span>
        </div>
      </div>

      {/* Main High-Density Navigation Bar */}
      <div className="max-w-[1600px] mx-auto px-8 h-16 flex items-center justify-between">
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
            <Zap className="w-5 h-5 fill-emerald-400" />
          </div>
          <div>
            <button
              onClick={() => onSelectTab('command_center')}
              className="text-left group cursor-pointer focus-visible:outline-none"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  GridPulse
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Spatial Consensus Mesh
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Clean Center Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-[#94A3B8]">
          <button
            onClick={() => onSelectTab('command_center')}
            className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'command_center'
                ? 'bg-[#161B33] text-white font-bold'
                : 'hover:text-white hover:bg-[#161B33]/50'
            }`}
          >
            Live Command Center
          </button>
          <button
            onClick={() => onSelectTab('audit_matrix')}
            className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'audit_matrix'
                ? 'bg-emerald-950/60 text-emerald-400 font-bold border border-emerald-500/40'
                : 'hover:text-white hover:bg-[#161B33]/50 text-emerald-400'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>15-Stage Audit (15/15 Done)</span>
          </button>
          <button
            onClick={() => onSelectTab('slide_deck')}
            className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'slide_deck'
                ? 'bg-[#161B33] text-white font-bold'
                : 'hover:text-white hover:bg-[#161B33]/50'
            }`}
          >
            <Presentation className="w-3.5 h-3.5 text-emerald-400" />
            <span>3-Min Demo Deck (Item 15)</span>
          </button>
          <button
            onClick={() => onSelectTab('architecture')}
            className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'architecture'
                ? 'bg-[#161B33] text-white font-bold'
                : 'hover:text-white hover:bg-[#161B33]/50'
            }`}
          >
            Serverless Topology
          </button>
          <button
            onClick={() => onSelectTab('algorithm_math')}
            className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'algorithm_math'
                ? 'bg-[#161B33] text-white font-bold'
                : 'hover:text-white hover:bg-[#161B33]/50'
            }`}
          >
            Digital Twin &amp; Math
          </button>
          <button
            onClick={() => onSelectTab('pytest_runner')}
            className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'pytest_runner'
                ? 'bg-[#161B33] text-white font-bold'
                : 'hover:text-white hover:bg-[#161B33]/50'
            }`}
          >
            Pytest Suite
          </button>
          <button
            onClick={() => onSelectTab('sam_deployment')}
            className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'sam_deployment'
                ? 'bg-[#161B33] text-white font-bold'
                : 'hover:text-white hover:bg-[#161B33]/50'
            }`}
          >
            SAM Deployment
          </button>
        </nav>

        {/* Global Action Triggers */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onTriggerQuickSmog}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-md transition-colors cursor-pointer whitespace-nowrap shadow-xs"
            title="Simulate regional winter PM2.5 smog overcast"
          >
            Simulate Smog
          </button>
          <button
            onClick={onTriggerQuickFault}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-md transition-colors cursor-pointer whitespace-nowrap shadow-xs"
            title="Inject isolated inverter breakdown"
          >
            Simulate Fault
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto px-6 py-2.5 border-t border-[#161B33] text-xs">
        <button
          onClick={() => onSelectTab('command_center')}
          className={`px-3 py-1 rounded whitespace-nowrap ${
            activeTab === 'command_center' ? 'bg-[#161B33] text-white' : 'text-[#94A3B8]'
          }`}
        >
          Command Center
        </button>
        <button
          onClick={() => onSelectTab('audit_matrix')}
          className={`px-3 py-1 rounded whitespace-nowrap ${
            activeTab === 'audit_matrix' ? 'bg-emerald-600 text-white font-bold' : 'text-emerald-400'
          }`}
        >
          15-Stage Audit
        </button>
        <button
          onClick={() => onSelectTab('slide_deck')}
          className={`px-3 py-1 rounded whitespace-nowrap ${
            activeTab === 'slide_deck' ? 'bg-[#161B33] text-white' : 'text-[#94A3B8]'
          }`}
        >
          Item 15 Demo Deck
        </button>
        <button
          onClick={() => onSelectTab('architecture')}
          className={`px-3 py-1 rounded whitespace-nowrap ${
            activeTab === 'architecture' ? 'bg-[#161B33] text-white' : 'text-[#94A3B8]'
          }`}
        >
          Topology
        </button>
        <button
          onClick={() => onSelectTab('pytest_runner')}
          className={`px-3 py-1 rounded whitespace-nowrap ${
            activeTab === 'pytest_runner' ? 'bg-[#161B33] text-white' : 'text-[#94A3B8]'
          }`}
        >
          Pytest
        </button>
      </div>
    </header>
  );
};
