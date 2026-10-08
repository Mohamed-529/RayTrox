import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Sparkles,
  Sun,
  Flame,
  Cloud,
  CloudFog,
  Wrench,
  Zap,
  CheckCircle2,
  XCircle,
  Droplets,
  Truck,
} from 'lucide-react';

interface VideoScene {
  id: number;
  timeSec: number;
  title: string;
  scenario: 'nominal' | 'dust' | 'fault' | 'heat' | 'cloud';
  subtitlesTanglish: string;
  subtitlesEnglish: string;
  voltage: number;
  current: number;
  watts: number;
  temp: number;
  verdict: string;
  verdictColor: string;
  hardwareAction: string;
}

const SCENES: VideoScene[] = [
  {
    id: 1,
    timeSec: 0,
    title: 'Scene 1: System Calibration & Nominal Baseline',
    scenario: 'nominal',
    subtitlesTanglish:
      'Lab setup ready! Lamp velichathula 12V panel irukku. INA219 sensor 12.4V & 5.5 kW read pannudhu. GridPulse screen-la "SYSTEM NOMINAL" cyan glow kaattudhu.',
    subtitlesEnglish:
      'Hardware bench initialized under 850 W/m² halogen lamp. INA219 reads nominal 12.4V and 5.5 kW. GridPulse verifies cluster equilibrium with cyan beacon.',
    voltage: 12.4,
    current: 0.44,
    watts: 5.5,
    temp: 28,
    verdict: 'SYSTEM NOMINAL — MONITORING CLUSTER',
    verdictColor: 'text-cyan-400 border-cyan-500/50 bg-cyan-950/30',
    hardwareAction: 'Lamp On · Full Sunlight Flux · INA219 Active',
  },
  {
    id: 2,
    timeSec: 15,
    title: 'Scene 2: Physical Dust & Smog Sprinkle Test',
    scenario: 'dust',
    subtitlesTanglish:
      'Ippo panel mela real powder/sand sprinkle panrom. Output 1.2 kW-ku crash aagudhu! Software 1km ward check panni smog nu kandupudichu, automatic water wash-ah on pannudhu. Diesel van cancel!',
    subtitlesEnglish:
      'Sprinkling real powder across the panel. INA219 wattage plummets to 1.2 kW. Software runs spatial consensus: uniform drop detected. Triggers water wash; diesel truck cancelled!',
    voltage: 10.1,
    current: 0.12,
    watts: 1.2,
    temp: 31,
    verdict: 'HOLD ACTION — REGIONAL SMOG DETECTED (AUTHORIZE_SPRINKLER_WASH)',
    verdictColor: 'text-amber-400 border-amber-500/80 bg-amber-950/40 glow-amber',
    hardwareAction: 'Hand sprinkles fine dust powder ➔ Automated sprinkler washes panel',
  },
  {
    id: 3,
    timeSec: 35,
    title: 'Scene 3: Hardware Wire Disconnect & Cell Crack',
    scenario: 'fault',
    subtitlesTanglish:
      'Ippo oru jumper wire-ah unplug panrom (or cell odanjiruchu). Wattage 0 kW! Pakkathu arrays 5.5 kW-la irukkumbodhu ivan mattum crash aana, water valve lock pannitu, repair crew-ku ticket anuppum!',
    subtitlesEnglish:
      'Unplugging positive jumper wire (simulating broken diode / cracked cell). Output drops to 0 kW while neighbors generate 5.5 kW. Locks water valve to prevent shorts; dispatches P1 repair crew!',
    voltage: 1.2,
    current: 0.0,
    watts: 0.0,
    temp: 32,
    verdict: 'DISPATCH MAINTENANCE — ISOLATED HARDWARE FAULT',
    verdictColor: 'text-rose-400 border-rose-500/80 bg-rose-950/40 glow-red',
    hardwareAction: 'Wire Disconnected ➔ Water Valve Locked ➔ P1 Ticket Sent',
  },
  {
    id: 4,
    timeSec: 55,
    title: 'Scene 4: Hair Dryer Heat Wave Simulation',
    scenario: 'heat',
    subtitlesTanglish:
      'Hair dryer vechu panel mela hot air blow panrom (56°C). High temperature-ala voltage 8.2V-ku drop aagudhu. Negative temp coefficient catch panni, system cooling bypass engage pannudhu!',
    subtitlesEnglish:
      'Blowing hot air with a hair dryer (56°C). Voltage drops to 8.2V due to negative temp coefficient (γ = -0.38%/°C) while current stays high. Triggers ENGAGE_COOLING_BYPASS!',
    voltage: 8.2,
    current: 0.41,
    watts: 3.4,
    temp: 56,
    verdict: 'ENGAGE COOLING BYPASS — THERMAL ISLAND HEAT LOSS',
    verdictColor: 'text-orange-400 border-orange-500/80 bg-orange-950/40 glow-orange',
    hardwareAction: 'Hair Dryer Hot Air Blow ➔ Cell Temp 56°C ➔ Bypass Engaged',
  },
  {
    id: 5,
    timeSec: 75,
    title: 'Scene 5: Passing Hand / Cloud Shading Drift',
    scenario: 'cloud',
    subtitlesTanglish:
      'Panel mela fast-ah kayya pass panrom (shadow vilugudhu). Milliseconds variations jumping aagum. Transient dynamic weather nu purinjikittu, actuators-ah hold panni system-ah safe state-la vekkudhu!',
    subtitlesEnglish:
      'Passing hand over panel casting rapid moving shadow. Microsecond wattage jitter logged. Classified as transient dynamic drift; mechanical actuators held in suspension!',
    voltage: 11.2,
    current: 0.19,
    watts: 2.1,
    temp: 26,
    verdict: 'LOG NOMINAL DRIFT — TRANSIENT CLOUD SHADING',
    verdictColor: 'text-sky-400 border-sky-500/80 bg-sky-950/40 glow-sky',
    hardwareAction: 'Moving Hand Shadow ➔ Transient Micro-drift ➔ Actuators Held',
  },
];

export function HardwareVideoSimulator() {
  const [currentSceneIdx, setCurrentSceneIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [language, setLanguage] = useState<'tanglish' | 'english'>('tanglish');
  const [progressSec, setProgressSec] = useState<number>(0);

  const activeScene = SCENES[currentSceneIdx];

  // Video autoplay timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgressSec((prev) => {
          const next = prev + 1;
          // Check if we should advance scene
          const nextSceneIdx = SCENES.findIndex(
            (s, idx) => next >= s.timeSec && (idx === SCENES.length - 1 || next < SCENES[idx + 1].timeSec)
          );
          if (nextSceneIdx !== -1 && nextSceneIdx !== currentSceneIdx) {
            setCurrentSceneIdx(nextSceneIdx);
          }
          if (next >= 95) {
            // Loop back or pause
            return 0;
          }
          return next;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, currentSceneIdx]);

  const selectScene = (idx: number) => {
    setCurrentSceneIdx(idx);
    setProgressSec(SCENES[idx].timeSec);
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Video Viewport Stage */}
      <div className="relative w-full aspect-[16/9] max-h-[460px] bg-gradient-to-b from-[#090D18] via-[#05070D] to-[#020306] rounded-2xl border-2 border-slate-800 overflow-hidden shadow-2xl flex flex-col justify-between p-4 sm:p-6 select-none">
        {/* Top Video HUD Header */}
        <div className="flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="text-[11px] font-bold tracking-wider text-rose-400 uppercase bg-rose-950/60 border border-rose-800/80 px-2 py-0.5 rounded">
              REC · LIVE HARDWARE BENCH CAM 01
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 bg-black/60 px-2.5 py-1 rounded border border-slate-800">
              {String(Math.floor(progressSec / 60)).padStart(2, '0')}:
              {String(progressSec % 60).padStart(2, '0')} / 01:35
            </span>
            <div className="flex items-center gap-1 bg-black/60 p-0.5 rounded border border-slate-800">
              <button
                onClick={() => setLanguage('tanglish')}
                className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-all ${
                  language === 'tanglish' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400'
                }`}
              >
                Tanglish
              </button>
              <button
                onClick={() => setLanguage('english')}
                className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-all ${
                  language === 'english' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400'
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>

        {/* Animated Center Stage Graphic (Physical Lab + Digital Twin Split) */}
        <div className="relative w-full h-[220px] sm:h-[260px] flex items-center justify-center z-10 overflow-hidden">
          {/* SVG Animated Canvas */}
          <svg className="w-full h-full" viewBox="0 0 800 320" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Lab Bench Table Surface */}
            <rect x="50" y="240" width="700" height="24" rx="4" fill="#131B2E" stroke="#1E293B" strokeWidth="2" />
            <rect x="70" y="264" width="20" height="50" fill="#0E1626" />
            <rect x="710" y="264" width="20" height="50" fill="#0E1626" />

            {/* Halogen Lamp overhead */}
            <g transform="translate(180, 20)">
              <polygon points="40,0 80,0 95,45 25,45" fill="#334155" stroke="#475569" strokeWidth="2" />
              <circle cx="60" cy="45" r="14" fill="#FDE047" className="animate-pulse" />
              {/* Light rays cone */}
              <polygon
                points="30,55 90,55 190,220 -10,220"
                fill="url(#lampBeam)"
                opacity={activeScene.scenario === 'fault' ? 0.3 : activeScene.scenario === 'heat' ? 0.9 : 0.6}
              />
            </g>

            {/* 12V Solar Panel Assembly */}
            <g transform="translate(120, 180)">
              {/* Panel Frame */}
              <rect x="0" y="0" width="160" height="60" rx="3" fill="#0C1527" stroke="#38BDF8" strokeWidth="2" />
              {/* Solar Cells Grid */}
              <line x1="40" y1="0" x2="40" y2="60" stroke="#1E3A5F" strokeWidth="2" />
              <line x1="80" y1="0" x2="80" y2="60" stroke="#1E3A5F" strokeWidth="2" />
              <line x1="120" y1="0" x2="120" y2="60" stroke="#1E3A5F" strokeWidth="2" />
              <line x1="0" y1="30" x2="160" y2="30" stroke="#1E3A5F" strokeWidth="2" />

              {/* DUST PARTICLES ANIMATION (SCENE 2) */}
              {activeScene.scenario === 'dust' && (
                <g>
                  {/* Dust layer overlay */}
                  <rect x="2" y="2" width="156" height="56" fill="#D97706" opacity="0.65" rx="2" />
                  {/* Falling dust specks */}
                  <circle cx="30" cy="15" r="3" fill="#FBBF24" className="animate-bounce" />
                  <circle cx="70" cy="25" r="2.5" fill="#FBBF24" className="animate-bounce" />
                  <circle cx="110" cy="18" r="3" fill="#FBBF24" className="animate-bounce" />
                  <circle cx="140" cy="35" r="2" fill="#FBBF24" className="animate-bounce" />
                  {/* Water wash nozzle spray */}
                  <g transform="translate(80, -25)">
                    <rect x="-10" y="0" width="20" height="12" fill="#0284C7" rx="2" />
                    <circle cx="0" cy="18" r="3" fill="#38BDF8" className="animate-ping" />
                    <path d="M-30,30 L0,15 L30,30" stroke="#38BDF8" strokeWidth="2" strokeDasharray="3 3" />
                  </g>
                </g>
              )}

              {/* WIRE FAULT SPARK ANIMATION (SCENE 3) */}
              {activeScene.scenario === 'fault' && (
                <g transform="translate(150, 25)">
                  {/* Broken wire end */}
                  <path d="M0,0 Q15,-15 25,5" stroke="#EF4444" strokeWidth="3" fill="none" strokeDasharray="4 2" />
                  <circle cx="28" cy="7" r="5" fill="#EF4444" className="animate-ping" />
                  {/* Spark icon */}
                  <polygon points="32,2 35,-6 38,0 44,-2 40,6 45,12 37,8 35,16 32,7" fill="#F59E0B" />
                  {/* Broken diode crack line on cell */}
                  <path d="M-60,-15 L-45,15 L-30,-5 L-15,25" stroke="#F43F5E" strokeWidth="2.5" />
                </g>
              )}

              {/* THERMAL HEAT WAVES (SCENE 4) */}
              {activeScene.scenario === 'heat' && (
                <g transform="translate(0, -40)">
                  {/* Heat gun nozzle */}
                  <rect x="-50" y="10" width="40" height="20" rx="3" fill="#DC2626" />
                  <polygon points="-10,12 10,5 10,35 -10,28" fill="#991B1B" />
                  {/* Wavy Heat lines */}
                  <path d="M20,20 Q40,5 60,20 T100,20 T140,20" stroke="#F97316" strokeWidth="3" fill="none" className="animate-pulse" />
                  <path d="M20,35 Q40,20 60,35 T100,35 T140,35" stroke="#EA580C" strokeWidth="2" fill="none" className="animate-pulse" />
                  {/* Temperature readout badge */}
                  <rect x="40" y="-15" width="80" height="20" rx="4" fill="#7C2D12" stroke="#EA580C" />
                  <text x="50" y="-1" fill="#FDBA74" fontSize="12" fontWeight="bold">TEMP: 56°C</text>
                </g>
              )}

              {/* CLOUD SHADOW DRIFT (SCENE 5) */}
              {activeScene.scenario === 'cloud' && (
                <g transform="translate(-10, -50)">
                  {/* Moving cloud silhouette */}
                  <path
                    d="M30,30 Q30,10 50,10 Q65,0 85,15 Q100,5 115,20 Q130,20 130,35 Q130,50 110,50 L40,50 Q30,50 30,30 Z"
                    fill="#475569"
                    opacity="0.85"
                  />
                  {/* Soft cast shadow over panel */}
                  <rect x="25" y="55" width="95" height="55" fill="#000000" opacity="0.65" rx="3" />
                </g>
              )}
            </g>

            {/* INA219 Sensor Breakout Board */}
            <g transform="translate(340, 195)">
              <rect x="0" y="0" width="55" height="40" rx="3" fill="#1E3A8A" stroke="#3B82F6" strokeWidth="1.5" />
              <text x="6" y="16" fill="#93C5FD" fontSize="8" fontWeight="bold">INA219</text>
              <circle cx="12" cy="28" r="3" fill="#10B981" className="animate-pulse" />
              <rect x="25" y="10" width="22" height="20" fill="#0F172A" />
              <text x="28" y="24" fill="#38BDF8" fontSize="9">I2C</text>
              {/* Jumper Wires connecting panel to INA219 */}
              <path d="M-60,15 C-20,10 -20,20 0,20" stroke="#EF4444" strokeWidth="2" fill="none" />
              <path d="M-60,25 C-20,25 -20,30 0,30" stroke="#000000" strokeWidth="2" fill="none" />
            </g>

            {/* ESP32 / Arduino Microcontroller */}
            <g transform="translate(435, 185)">
              <rect x="0" y="0" width="75" height="50" rx="4" fill="#064E3B" stroke="#10B981" strokeWidth="1.5" />
              <rect x="15" y="12" width="25" height="25" fill="#0F172A" rx="2" />
              <text x="18" y="28" fill="#6EE7B7" fontSize="8" fontWeight="bold">ESP32</text>
              {/* Wi-Fi Antenna trace */}
              <path d="M50,15 Q60,15 60,35" stroke="#EAB308" strokeWidth="2" fill="none" />
              {/* Status TX/RX Blinking LEDs */}
              <circle cx="65" cy="18" r="2.5" fill="#38BDF8" className="animate-ping" />
              <circle cx="65" cy="26" r="2.5" fill="#F59E0B" className="animate-pulse" />
              {/* Wires connecting INA219 to ESP32 */}
              <path d="M-40,20 Q-15,10 0,20" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
              <path d="M-40,30 Q-15,25 0,30" stroke="#10B981" strokeWidth="1.5" fill="none" />
            </g>

            {/* Laptop Running GridPulse Software (Right Side) */}
            <g transform="translate(560, 150)">
              {/* Laptop Screen Body */}
              <rect x="0" y="0" width="180" height="110" rx="6" fill="#07090E" stroke="#475569" strokeWidth="2" />
              {/* Laptop Display Bezel */}
              <rect x="6" y="6" width="168" height="98" fill="#0A0E1A" rx="3" />
              {/* Laptop Base/Keyboard */}
              <polygon points="-15,115 195,115 180,110 0,110" fill="#334155" />
              {/* Trackpad */}
              <rect x="65" y="112" width="50" height="3" fill="#1E293B" rx="1" />

              {/* GridPulse Live Screen Simulation */}
              <text x="12" y="20" fill="#38BDF8" fontSize="9" fontWeight="bold">GRIDPULSE · DELHI-07</text>
              <rect
                x="12"
                y="26"
                width="156"
                height="32"
                rx="3"
                fill={
                  activeScene.scenario === 'dust'
                    ? '#451A03'
                    : activeScene.scenario === 'fault'
                    ? '#4C0519'
                    : activeScene.scenario === 'heat'
                    ? '#431407'
                    : activeScene.scenario === 'cloud'
                    ? '#082F49'
                    : '#0C1B2E'
                }
                stroke={
                  activeScene.scenario === 'dust'
                    ? '#F59E0B'
                    : activeScene.scenario === 'fault'
                    ? '#EF4444'
                    : activeScene.scenario === 'heat'
                    ? '#F97316'
                    : activeScene.scenario === 'cloud'
                    ? '#38BDF8'
                    : '#06B6D4'
                }
                strokeWidth="1.5"
              />
              <text
                x="16"
                y="46"
                fill={
                  activeScene.scenario === 'dust'
                    ? '#FBBF24'
                    : activeScene.scenario === 'fault'
                    ? '#F87171'
                    : activeScene.scenario === 'heat'
                    ? '#FB923C'
                    : activeScene.scenario === 'cloud'
                    ? '#7DD3FC'
                    : '#22D3EE'
                }
                fontSize="8"
                fontWeight="bold"
              >
                {activeScene.scenario === 'dust'
                  ? 'HOLD: SMOG DETECTED'
                  : activeScene.scenario === 'fault'
                  ? 'DISPATCH: HARDWARE FAULT'
                  : activeScene.scenario === 'heat'
                  ? 'COOLING BYPASS ENGAGED'
                  : activeScene.scenario === 'cloud'
                  ? 'CLOUD DRIFT: SUSPEND'
                  : 'SYSTEM NOMINAL'}
              </text>

              {/* 6 Mini Solar Node Matrix on Laptop */}
              <g transform="translate(12, 64)">
                {[0, 1, 2, 3, 4, 5].map((idx) => {
                  const col = idx % 3;
                  const row = Math.floor(idx / 3);
                  const isAnomaly = idx === 2 && activeScene.scenario === 'fault';
                  const isSmog = activeScene.scenario === 'dust';
                  const isThermal = activeScene.scenario === 'heat';
                  const isCloud = activeScene.scenario === 'cloud';

                  return (
                    <rect
                      key={idx}
                      x={col * 52}
                      y={row * 16}
                      width="48"
                      height="13"
                      rx="2"
                      fill={
                        isAnomaly
                          ? '#EF4444'
                          : isSmog
                          ? '#F59E0B'
                          : isThermal
                          ? '#F97316'
                          : isCloud
                          ? '#38BDF8'
                          : '#06B6D4'
                      }
                      opacity={isAnomaly ? 0.95 : 0.8}
                    />
                  );
                })}
              </g>

              {/* USB Cable from ESP32 to Laptop */}
              <path d="M-50,45 C-20,45 -20,60 0,60" stroke="#64748B" strokeWidth="2.5" fill="none" />
            </g>

            {/* Gradient definition for lamp light beam */}
            <defs>
              <linearGradient id="lampBeam" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#FEF08A" stopOpacity="0.0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Dynamic Telemetry Overlay & Live Subtitle Banner */}
        <div className="z-20 space-y-2">
          {/* Live Sensor Telemetry Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-black/75 backdrop-blur-md border border-slate-800 text-[11px]">
            <div className="flex items-center gap-3">
              <span className="text-amber-400 font-bold">⚡ INA219: {activeScene.voltage}V · {activeScene.current}A</span>
              <span className="text-cyan-400 font-bold">📈 POWER: {activeScene.watts} kW</span>
              <span className="text-orange-400 font-bold">🌡️ TEMP: {activeScene.temp}°C</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 uppercase">Hardware State:</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 text-[10px] font-bold">
                {activeScene.hardwareAction}
              </span>
            </div>
          </div>

          {/* Subtitles Bar (English / Tanglish) */}
          <div className="p-3 rounded-xl bg-[#090D18]/90 border border-cyan-800/50 backdrop-blur-md">
            <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider mb-0.5">
              🎙️ Narration Subtitle ({language.toUpperCase()}):
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans font-medium">
              {language === 'tanglish' ? activeScene.subtitlesTanglish : activeScene.subtitlesEnglish}
            </p>
          </div>
        </div>
      </div>

      {/* Video Player Controls Deck */}
      <div className="p-4 rounded-xl bg-[#0B0F19] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => selectScene(Math.max(0, currentSceneIdx - 1))}
            disabled={currentSceneIdx === 0}
            className="p-2 rounded-lg bg-[#07090E] border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
            title="Previous Scene"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold flex items-center gap-2 cursor-pointer transition-all shadow-md"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black" />}
            <span>{isPlaying ? 'Pause Demo' : 'Play Demo'}</span>
          </button>

          <button
            onClick={() => selectScene(Math.min(SCENES.length - 1, currentSceneIdx + 1))}
            disabled={currentSceneIdx === SCENES.length - 1}
            className="p-2 rounded-lg bg-[#07090E] border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
            title="Next Scene"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setProgressSec(0);
              setCurrentSceneIdx(0);
              setIsPlaying(true);
            }}
            className="p-2 rounded-lg bg-[#07090E] border border-slate-800 text-slate-400 hover:text-white cursor-pointer ml-1"
            title="Restart Video"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span>Speed:</span>
          {[0.5, 1, 1.5, 2].map((spd) => (
            <button
              key={spd}
              onClick={() => setPlaybackSpeed(spd)}
              className={`px-2 py-1 rounded cursor-pointer ${
                playbackSpeed === spd
                  ? 'bg-slate-700 text-white font-bold'
                  : 'bg-[#07090E] text-slate-400 hover:text-slate-200'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>

      {/* Chapter Track Timeline (Clickable Scenes) */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Step-by-Step Chapters (Click any scene to jump):
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {SCENES.map((scene, idx) => {
            const isActive = currentSceneIdx === idx;
            return (
              <button
                key={scene.id}
                onClick={() => selectScene(idx)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[85px] ${
                  isActive
                    ? 'bg-cyan-950/40 border-cyan-500 shadow-md ring-1 ring-cyan-500/50'
                    : 'bg-[#0E131F] border-slate-800/80 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-bold uppercase text-slate-500">
                    Step 0{scene.id}
                  </span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
                </div>
                <div className={`text-xs font-bold font-sans mt-1 ${isActive ? 'text-white' : 'text-slate-300'}`}>
                  {scene.title.split(':')[1] || scene.title}
                </div>
                <div className="text-[10px] text-slate-500 mt-1 font-mono">
                  {scene.watts} kW · {scene.voltage}V
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
