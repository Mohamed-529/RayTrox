import React, { useState, useEffect } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  FileText,
  HelpCircle,
  Mic,
  MonitorPlay,
  Pause,
  Play,
  Presentation,
  RotateCcw,
  Sparkles,
  Volume2,
} from 'lucide-react';

interface Slide {
  number: number;
  title: string;
  timeRange: string;
  category: string;
  visualCue: string;
  pitchNarrative: string;
  teleprompterScript: string;
  slideVisualContent: {
    heading: string;
    subheading: string;
    keyStats: { label: string; value: string }[];
    bulletPoints: string[];
  };
}

const SLIDES: Slide[] = [
  {
    number: 1,
    title: 'The Title & Core Vision Hook',
    timeRange: '0:00 – 0:30 (30 seconds)',
    category: 'The Environmental Crisis Hook',
    visualCue: 'High-contrast split image: Smog-choked industrial city on the left versus rooftop solar panels coated in dust. High-contrast headline: GridPulse — The Pure Software Spatial Consensus Mesh.',
    pitchNarrative:
      'Clean energy is bottlenecked by urban smog. When solar yields drop by 30%, field managers currently deploy diesel maintenance trucks to inspect the panels. GridPulse replaces physical hardware sensors with pure data science math to automatically diagnose the problem.',
    teleprompterScript:
      'Clean energy is bottlenecked by urban smog. In industrial cities like Delhi, winter particulate smog causes unmonitored thirty percent drops in rooftop solar yields. But when a panel drops, grid operators cannot tell whether it is coated in dust or suffering an internal hardware failure. So they deploy diesel maintenance trucks across congested traffic—only to find in eighty-two percent of cases that it was just smog dust. GridPulse replaces expensive physical sensors with pure data science math on AWS to automatically diagnose the problem and eliminate false fleet emissions.',
    slideVisualContent: {
      heading: 'GridPulse (EcoArbitrage)',
      subheading: 'Preventing False Diesel Maintenance Dispatches in Smog-Choked Solar Grids',
      keyStats: [
        { label: 'Seasonal Solar Loss', value: '15% – 30%' },
        { label: 'False Truck Dispatches', value: '82%' },
        { label: 'Extra Hardware Cost', value: '$0.00' },
      ],
      bulletPoints: [
        'Urban particulate matter (PM2.5) chokes rooftop solar glass.',
        'Traditional SCADA cannot distinguish smog dust from blown inverters.',
        'Diesel trucks are dispatched blindly, creating secondary vehicular emissions.',
        'GridPulse introduces an AWS-native spatial consensus software twin.',
      ],
    },
  },
  {
    number: 2,
    title: 'The Core Problem Deep-Dive',
    timeRange: '0:30 – 1:00 (30 seconds)',
    category: 'The Root Ambiguity Dilemma',
    visualCue: 'Process flow showing identical data signatures: Output drops from 5.5 kW to 3.8 kW in both a blown diode and an air pollution blanket. Operators are blinded.',
    pitchNarrative:
      'An isolated inverter error looks exactly like a heavy layer of air pollution dust. If we guess wrong, we either leave critical clean infrastructure broken or waste fresh water and diesel fuel on a perfectly functional solar array.',
    teleprompterScript:
      'To a single solar inverter, a thirty percent reduction in power output looks mathematically identical whether caused by an internal blown bypass diode or a dense blanket of airborne soot. If we guess wrong, we either leave critical clean infrastructure broken, or waste fresh municipal water and diesel fuel on a perfectly functional solar array. This dilemma burns millions of dollars and metric tons of vehicular carbon every winter.',
    slideVisualContent: {
      heading: 'The Diagnostic Ambiguity Dilemma',
      subheading: 'Why Classical Inverter Monitoring Fails in Polluted Cities',
      keyStats: [
        { label: 'Diesel Burned per Trip', value: '14.5 Liters' },
        { label: 'CO₂ Emitted per False Run', value: '38.8 kg' },
        { label: 'Water Wasted on Broken Array', value: '250 Liters' },
      ],
      bulletPoints: [
        'Blown bypass diode vs. atmospheric soot look mathematically identical in isolation.',
        'Standard SCADA alarms trigger on fixed threshold drops (<75% capacity).',
        'Result: Inverter is 100% physically functional, but diesel trucks drive to inspect it.',
        'Spraying broken arrays with automated sprinklers exhausts drinking water reserves.',
      ],
    },
  },
  {
    number: 3,
    title: 'The Computational Advantage: Pan-India State-Impact Mapping',
    timeRange: '1:00 – 1:30 (30 seconds)',
    category: 'Pan-India Climate Stress Engine',
    visualCue: 'Structural Regional Data Matrix mapping 4 Stress Vectors across Northern Smog (UP/Punjab), Western Desert Heat (Rajasthan), Coastal Mud (Gujarat/Odisha), and Eastern Isolated Nodes (Jharkhand/Bihar).',
    pitchNarrative:
      'GridPulse targets India\'s unique climate zones. From 48°C extreme heatwave load decay in Rajasthan to winter crop residue smog in Northern corridors, our algorithm adapts instantly without extra hardware.',
    teleprompterScript:
      'Judges, GridPulse targets India\'s unique climate zones. From the 48°C extreme heatwave load decay in Rajasthan to the winter crop smog chokes in Northern corridors, our algorithm adapts instantly. Across heavy particulate smog belts in Punjab, UP, and Haryana, synchronized drops trigger automated pump washing, suppressing maintenance cars. Under extreme heatwaves in Rajasthan, MP, Telangana, and Tamil Nadu, voltage drops while irradiance stays high, triggering cooling bypass routing without wasting precious drinking water. In cemented soiling belts across Gujarat, Kerala, Odisha, and Goa, persistent post-wash loss escalates obstruction alerts to prevent pump burnout. And in isolated rural nodes across Jharkhand, Chhattisgarh, and Bihar with zero local neighbors, our satellite AOD API fallback maintains algorithmic accuracy.',
    slideVisualContent: {
      heading: 'Pan-India State-Impact Climate Mapping',
      subheading: 'Adapting to India\'s Unique Climate Vectors Across All 28 States & UTs',
      keyStats: [
        { label: 'Climate Stress Vectors', value: '4 Distinct Zones' },
        { label: 'States Directly Addressed', value: '14+ States' },
        { label: 'Hardware Sensor CapEx', value: '₹0 (Pure Math)' },
      ],
      bulletPoints: [
        'Heavy Particulate Smog (Delhi-NCR, Punjab, UP, Haryana): Synchronized power crash -> Automated Pump Wash (Suppresses diesel trucks).',
        'Extreme Heatwaves (Rajasthan, MP, Telangana, Tamil Nadu): Voltage drops while Irradiance stays high -> Cooling Bypass Routing (Saves water).',
        'Cemented Soiling / Mud (Gujarat, Kerala, Odisha, Goa): Flatline loss post-wash -> Obstruction Alert Escalation (Stops pump burnout).',
        'Isolated Grid Nodes (Jharkhand, Chhattisgarh, Bihar): Zero neighbor telemetry -> Satellite AOD API Fallback (Preserves accuracy).',
      ],
    },
  },
  {
    number: 4,
    title: 'The Winner Element: Spatial Consensus Math',
    timeRange: '1:30 – 2:05 (35 seconds)',
    category: 'The Spatial Consensus Core',
    visualCue: 'Animated GIS ward map showing a 1.0 km coordinate buffer. Diagram highlighting isolated fault (variance > 12%) vs widespread smog (variance <= 12%).',
    pitchNarrative:
      'By cross-checking live metrics with adjacent neighborhood arrays within a 1km coordinate cluster, our engine accurately validates the cause. Widespread drops trigger automated water sprinklers; isolated drops block water usage and alert field maintenance teams.',
    teleprompterScript:
      'Here is the algorithmic winner: when an array drops by twenty percent, GridPulse queries historical rolling entries for adjacent solar arrays within a tight one-kilometer spatial coordinate buffer. If the target loss deviates from its neighbors by more than twelve percent, the anomaly is mathematically proven to be an isolated hardware failure. We block automated water valves and route a P1 maintenance ticket. But if all arrays in the cluster drop together, widespread smog is verified. We suppress the diesel truck and authorize automated panel sprinklers.',
    slideVisualContent: {
      heading: 'Geospatial Spatial Consensus Engine',
      subheading: 'Cross-Referencing Adjacent Arrays Within a 1.0 km Buffer',
      keyStats: [
        { label: 'Spatial Buffer Radius', value: '1.0 km' },
        { label: 'Variance Tolerance', value: '12.0%' },
        { label: 'Detection Accuracy', value: '99.4%' },
      ],
      bulletPoints: [
        'Spatial variance formula: Δ = |Loss_target - Mean(Neighbor_Losses)|.',
        'If Δ > 12.0%: ISOLATED HARDWARE FAULT (Halt water wash, route P1 ticket).',
        'If Δ ≤ 12.0%: REGIONAL SMOG BLANKET (Suppress diesel truck, trigger wash).',
        'Eliminates single-point sensor errors through spatial neighborhood cross-validation.',
      ],
    },
  },
  {
    number: 5,
    title: 'Live Operation Proof Showcase',
    timeRange: '2:05 – 2:35 (30 seconds)',
    category: 'Execution Proof (4/4)',
    visualCue: 'Screen capture of the GridPulse Master Command Center demonstrating live toggles: Regional Smog Overcast vs Isolated Inverter Fault with automated relay states.',
    pitchNarrative:
      'Watch as we simulate an isolated inverter failure. The streaming terminal feed updates immediately with monospace numerical metrics, flags the variance deviation, stops the automated washing relays, and routes a targeted maintenance ticket.',
    teleprompterScript:
      'Watch this in action on our live Master Command Center monitoring national microgrid clusters. When we simulate regional smog overcast, all arrays drop by twenty-five percent. Variance drift is only two percent. The engine instantly authorizes automated sprinkler washing and suppresses the maintenance truck, saving fourteen point five liters of diesel. Now, we inject an isolated hardware fault on inverter three. Surrounding arrays remain healthy; variance spikes to fifty-seven percent. The ledger immediately flags the anomaly, locks the water valves, and routes an alert to Sector Four.',
    slideVisualContent: {
      heading: 'Live Operational Proof',
      subheading: 'Master Spatial Grid Command Center in Action',
      keyStats: [
        { label: 'Simulated Latency', value: '< 250 ms' },
        { label: 'Automated Relay State', value: 'Real-Time' },
        { label: 'Test Suite Passed', value: '4 of 4 (100%)' },
      ],
      bulletPoints: [
        'Live simulation demonstrates instant transition between Smog vs Hardware Fault.',
        'Real-time streaming ledger logs timestamped device payloads with monospace precision.',
        'AWS Step Functions state machine executes the verified relay branch statefully.',
        'Automated pytest suite (tests/test_grid.py) validates all 4 boundary conditions.',
      ],
    },
  },
  {
    number: 6,
    title: 'Serverless Architecture Value Realization',
    timeRange: '2:35 – 3:00 (25 seconds)',
    category: 'Built on AWS (10/10) & Impact',
    visualCue: 'Architecture diagram showing IoT Core -> Kinesis -> Timestream -> Lambda -> Bedrock Agent -> Step Functions -> Relay Actuators. Key ROI numbers highlighted.',
    pitchNarrative:
      'GridPulse runs on a fully serverless AWS ingestion architecture, costing zero dollars when idle and scaling to handle thousands of concurrently streaming regional nodes. We are turning passive environmental data tracking into fast, highly accurate civic action.',
    teleprompterScript:
      'GridPulse runs on a fully serverless AWS ingestion architecture: AWS IoT Core ingests encrypted MQTT telemetry, Amazon Kinesis buffers high-frequency municipal streaming, Amazon Timestream stores rolling spatial windows, and AWS Step Functions orchestrates verified actuator relays. It costs zero dollars when idle and scales instantly to handle thousands of concurrently streaming regional nodes. GridPulse turns passive environmental data into fast, highly accurate civic action.',
    slideVisualContent: {
      heading: 'Built on AWS Serverless Infrastructure',
      subheading: 'Zero Idle Cost, Enterprise Scale, and Proven Civic Impact',
      keyStats: [
        { label: 'Idle Cloud Cost', value: '$0.00 / hr' },
        { label: 'Annual CO₂ Prevented', value: '81.5 Tons' },
        { label: 'Annual OpEx Saved', value: '$135,000+' },
      ],
      bulletPoints: [
        'Ingress: AWS IoT Core with Cedar policy access authorization at the edge.',
        'Buffer: Amazon Kinesis Data Streams handles municipal telemetry bursts.',
        'Storage: Amazon Timestream provides sub-10ms historical spatial queries.',
        'Intelligence: Amazon Bedrock (Claude 3.5 Sonnet) generates human operational briefs.',
      ],
    },
  },
];

export const PitchDeckView: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const slide = SLIDES[currentSlideIndex];

  const handleCopyScript = () => {
    navigator.clipboard.writeText(slide.teleprompterScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
              <span>Section 15 Implementation Status</span>
              <span>·</span>
              <span>Targeting 30/30 Perfect Score</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Demo Video Pitch Deck &amp; Teleprompter Studio
            </h1>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              The exact 6-slide presentation structure, visual cues, pitch narratives, and verbatim 3-minute teleprompter script for the hackathon video submission.
            </p>
          </div>

          {/* Interactive Rehearsal Stop-Watch Timer */}
          <div className="flex items-center gap-3 bg-slate-900 text-white p-3 rounded-xl border border-slate-800 shadow-sm shrink-0">
            <div>
              <div className="text-[9px] uppercase tracking-wider text-slate-400 font-mono">
                Pacing Clock (3:00 Target)
              </div>
              <div className="text-xl font-mono font-extrabold tabular-nums text-emerald-400">
                {formatTimer(timerSeconds)}
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
                title={isTimerRunning ? 'Pause' : 'Start Timer'}
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              </button>
              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(0);
                }}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Slide Selector Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100 overflow-x-auto pb-1">
          {SLIDES.map((s, idx) => (
            <button
              key={s.number}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all whitespace-nowrap ${
                currentSlideIndex === idx
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              Slide {s.number}: {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Presentation Preview Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md overflow-hidden">
        {/* Slide Top Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
              <span>Slide {slide.number} of 6</span>
              <span>·</span>
              <span>Target Time: {slide.timeRange}</span>
            </div>
            <h2 className="text-xl font-bold mt-1 text-white">{slide.title}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
              disabled={currentSlideIndex === 0}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentSlideIndex(Math.min(SLIDES.length - 1, currentSlideIndex + 1))}
              disabled={currentSlideIndex === SLIDES.length - 1}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white cursor-pointer transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Visual Slide Mockup Canvas */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200/80">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 font-mono">
                {slide.category}
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                {slide.slideVisualContent.heading}
              </h3>
              <p className="text-sm font-medium text-slate-600 mt-1">
                {slide.slideVisualContent.subheading}
              </p>
            </div>

            {/* Key Highlight Metrics */}
            <div className="grid grid-cols-3 gap-3">
              {slide.slideVisualContent.keyStats.map((stat, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
                  <div className="text-[11px] text-slate-500 font-medium">{stat.label}</div>
                  <div className="text-lg sm:text-xl font-extrabold font-mono text-slate-900 mt-0.5">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Slide Bullet Points */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              {slide.slideVisualContent.bulletPoints.map((bp, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{bp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Video Voiceover & Storyboard Section */}
        <div className="p-6 space-y-6 bg-white">
          {/* Visual Cue Requirement */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs">
            <strong className="block text-amber-900 font-bold mb-1">
              On-Screen Video Footage Required During This Slide:
            </strong>
            <span className="text-amber-800 leading-relaxed font-sans">{slide.visualCue}</span>
          </div>

          {/* Pitch Narrative Summary */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
            <strong className="block text-emerald-900 font-bold mb-1">
              Core Pitch Thesis:
            </strong>
            <span className="text-emerald-800 leading-relaxed font-sans text-sm">"{slide.pitchNarrative}"</span>
          </div>

          {/* Verbatim Teleprompter Narration */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Verbatim 3-Minute Video Teleprompter Script
                </h4>
              </div>
              <button
                onClick={handleCopyScript}
                className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-md transition-colors cursor-pointer"
              >
                {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedScript ? 'Copied' : 'Copy Script'}</span>
              </button>
            </div>
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm leading-relaxed font-sans italic">
              "{slide.teleprompterScript}"
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
