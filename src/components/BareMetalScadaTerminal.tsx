import React, { useState, useEffect } from 'react';
import { AlertCircle, Flame, PhoneCall, Power, ShieldAlert, Terminal, Zap } from 'lucide-react';

interface Props {
  scenario: string;
}

export function BareMetalScadaTerminal({ scenario }: Props) {
  const [eStop, setEStop] = useState<boolean>(false);
  const [forceRelay, setForceRelay] = useState<boolean>(false);
  const [thermalBypass, setThermalBypass] = useState<boolean>(false);
  const [voiceLink, setVoiceLink] = useState<boolean>(true);
  const [tick, setTick] = useState<number>(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % 100), 200);
    return () => clearInterval(id);
  }, []);

  const isRelayActive = !eStop && (forceRelay || scenario === 'smog');
  const isBypassActive = thermalBypass || scenario === 'thermal';
  const isTwilioAlert = scenario === 'fault';

  return (
    <div className="w-full rounded-3xl bg-[#020503] border-4 border-[#14331C] p-6 sm:p-10 font-mono text-emerald-400 space-y-8 shadow-[0_0_80px_rgba(16,185,129,0.15)] relative overflow-hidden scanlines">
      {/* Phosphor CRT Scanlines & Screen Glare */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-[#14331C] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs uppercase tracking-widest font-black text-emerald-300">
              SYS_TERMINAL_V4.2 // SCADA SUPERVISORY OVERRIDE CONSOLE
            </span>
          </div>
          <div className="text-xs text-emerald-600">
            BARE-METAL HARDWARE DIRECTORY · ESP32 GPIO REGISTER MAPPING · I2C ADDR: 0x40
          </div>
        </div>

        {/* Live Hex Memory Buffer */}
        <div className="flex items-center gap-3 text-xs bg-black/80 px-4 py-2 rounded-lg border border-[#14331C] text-emerald-500">
          <span>MEM: 0x7FFF{tick < 10 ? `0${tick}` : tick}</span>
          <span className="text-emerald-700">|</span>
          <span className="text-emerald-300 animate-pulse">UART 115200 BAUD</span>
        </div>
      </div>

      {/* Main SCADA Cockpit: Oscilloscope Waveforms + Tactile Toggle Switches */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Real-time Oscilloscope Waveform Display (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-xl bg-black border-2 border-[#14331C] space-y-3">
            <div className="flex justify-between text-[11px] text-emerald-500 uppercase font-bold">
              <span>CH1: AC VOLTAGE SINE WAVE (230V / 50Hz)</span>
              <span>CH2: SHUNT CURRENT RIPPLE</span>
            </div>

            {/* SVG Oscilloscope Grid with Animated Waveform */}
            <div className="relative w-full h-36 bg-[#010803] rounded border border-[#14331C] overflow-hidden flex items-center">
              {/* Reticle grid */}
              <div className="absolute inset-0 bg-[radial-gradient(#14331C_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
              <div className="absolute inset-x-0 top-1/2 h-[1px] bg-[#14331C]" />

              <svg viewBox="0 0 600 120" className="w-full h-full relative z-10">
                {/* Sine wave for voltage */}
                <path
                  d={`M 0 60 Q 75 ${20 + Math.sin(tick) * 5}, 150 60 T 300 60 T 450 60 T 600 60`}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2.5"
                  className="transition-all duration-200"
                />
                {/* Current ripple wave */}
                <path
                  d={`M 0 60 Q 75 ${scenario === 'fault' ? 80 : 40}, 150 60 T 300 60 T 450 60 T 600 60`}
                  fill="none"
                  stroke={scenario === 'fault' ? '#F43F5E' : '#06B6D4'}
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
              </svg>
            </div>

            <div className="flex justify-between text-[10px] text-emerald-600">
              <span>TIMEBASE: 2.5ms/DIV</span>
              <span className="text-emerald-400 font-bold">INA219 16-BIT ADC BUFFER: OK</span>
            </div>
          </div>
        </div>

        {/* 4 Heavy-Duty Physical Toggle Switches (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs uppercase font-bold text-emerald-500 tracking-wider">
            Operator Manual Actuator Interlocks:
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            {/* Toggle 1: E-STOP */}
            <button
              onClick={() => setEStop(!eStop)}
              className={`p-4 rounded-xl border-2 font-black transition-all cursor-pointer flex flex-col items-center gap-2 ${
                eStop
                  ? 'bg-rose-950 border-rose-500 text-rose-300 shadow-lg shadow-rose-500/50'
                  : 'bg-black border-[#14331C] text-emerald-400 hover:border-emerald-600'
              }`}
            >
              <Power className="w-5 h-5" />
              <span>{eStop ? 'E-STOP ENGAGED' : 'SAFETY E-STOP'}</span>
              <span className="text-[9px] opacity-75">{eStop ? 'SYSTEM LOCKED' : 'NORMAL ARMED'}</span>
            </button>

            {/* Toggle 2: 5V Sprinkler Relay */}
            <button
              onClick={() => setForceRelay(!forceRelay)}
              className={`p-4 rounded-xl border-2 font-black transition-all cursor-pointer flex flex-col items-center gap-2 ${
                isRelayActive
                  ? 'bg-amber-950 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/50'
                  : 'bg-black border-[#14331C] text-emerald-400 hover:border-emerald-600'
              }`}
            >
              <Zap className="w-5 h-5" />
              <span>5V RELAY GPIO 18</span>
              <span className="text-[9px] opacity-75">{isRelayActive ? 'HIGH (PUMP RUNNING)' : 'LOW (STANDBY)'}</span>
            </button>

            {/* Toggle 3: Thermal Bypass */}
            <button
              onClick={() => setThermalBypass(!thermalBypass)}
              className={`p-4 rounded-xl border-2 font-black transition-all cursor-pointer flex flex-col items-center gap-2 ${
                isBypassActive
                  ? 'bg-orange-950 border-orange-500 text-orange-300 shadow-lg shadow-orange-500/50'
                  : 'bg-black border-[#14331C] text-emerald-400 hover:border-emerald-600'
              }`}
            >
              <Flame className="w-5 h-5" />
              <span>COOLING BYPASS</span>
              <span className="text-[9px] opacity-75">{isBypassActive ? 'ENGAGED (56°C)' : 'STANDARD MPPT'}</span>
            </button>

            {/* Toggle 4: Twilio Voice Link */}
            <button
              onClick={() => setVoiceLink(!voiceLink)}
              className={`p-4 rounded-xl border-2 font-black transition-all cursor-pointer flex flex-col items-center gap-2 ${
                isTwilioAlert
                  ? 'bg-rose-950 border-rose-500 text-rose-300 animate-bounce'
                  : voiceLink
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                  : 'bg-black border-[#14331C] text-slate-500'
              }`}
            >
              <PhoneCall className="w-5 h-5" />
              <span>TWILIO VOICE BOT</span>
              <span className="text-[9px] opacity-75">{isTwilioAlert ? 'CALLING TECHNICIAN' : voiceLink ? 'LINK ONLINE' : 'MUTED'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
