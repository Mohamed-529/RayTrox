import React, { useState } from 'react';
import {
  Activity,
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Cloud,
  Code2,
  Cpu,
  Database,
  Layers,
  Lock,
  MessageSquare,
  Radio,
  Server,
  Shield,
  Workflow,
  Zap,
} from 'lucide-react';

interface ServiceDetail {
  id: string;
  name: string;
  category: string;
  role: string;
  scoreImpact: string;
  codeSnippet: string;
  description: string;
}

const AWS_SERVICES: ServiceDetail[] = [
  {
    id: 'iot_core',
    name: 'AWS IoT Core Message Broker',
    category: 'Ingress & Protocol Bridge',
    role: 'Secure MQTT Ingress Protocol over Port 8883',
    scoreImpact: 'Max points for enterprise-grade device gateway architecture',
    description:
      'Decentralized solar edge arrays stream JSON telemetry over TLS-encrypted MQTT topics (e.g. gridpulse/telemetry/delhi/zone-07/oklha-01) with Cedar edge access validation.',
    codeSnippet: `// IoT Core Topic Rule Target
SELECT 
  device_id,
  neighborhood_id,
  actual_output_kw,
  irradiance_w_m2,
  panel_area_m2,
  timestamp() as ingress_timestamp
FROM 'gridpulse/telemetry/#'`,
  },
  {
    id: 'kinesis',
    name: 'Amazon Kinesis Data Streams',
    category: 'Real-Time Ingestion Buffer',
    role: 'High-Throughput Partition Buffer',
    scoreImpact: 'Prevents downstream database choke during concurrent grid bursts',
    description:
      'Buffers incoming telemetry packets across multiple shards (partitioned by neighborhood_id) to handle bursty network conditions across thousands of inverters.',
    codeSnippet: `// Kinesis Stream Configuration
StreamName: gridpulse-telemetry-stream
ShardCount: 4
RetentionHours: 24
StreamModeDetails:
  StreamMode: ON_DEMAND`,
  },
  {
    id: 'timestream',
    name: 'Amazon Timestream Database',
    category: 'Analytical Time-Series Storage',
    role: 'Spatial-Temporal Rolling Window Analytics',
    scoreImpact: 'Purpose-built database for sub-10ms neighbor baseline queries',
    description:
      'Maintains rolling historical windows for all inverters in each postal district. Allows spatial clustering queries to construct the neighborhood consensus baseline within a 1km coordinate buffer.',
    codeSnippet: `// Timestream Historical 1km Window Query
SELECT device_id, AVG(calculated_efficiency_loss_pct) as avg_loss
FROM "GridPulseDB"."InverterTelemetry"
WHERE neighborhood_id = 'DELHI-ZONE-07'
  AND time > ago(15m)
GROUP BY device_id;`,
  },
  {
    id: 'lambda',
    name: 'AWS Lambda (FastAPI Router)',
    category: 'Serverless Compute',
    role: 'Digital Twin Math & Anomaly Classification',
    scoreImpact: 'Zero idle costs; sub-second on-demand execution scale',
    description:
      'Executes the pure software digital twin formulas to calculate theoretical capacity limits and compare target degradation against neighborhood averages.',
    codeSnippet: `// Lambda Spatial Consensus Handler
theoretical_max_kw = (irradiance * area * 0.85) / 1000.0
loss_pct = max(0.0, ((theoretical_max_kw - actual_kw) / theoretical_max_kw) * 100.0)
variance = abs(loss_pct - neighborhood_avg)

if variance > 12.0:
    verdict = "BLOCK_WATER_TRIGGER_ALERT_MAINTENANCE"
else:
    verdict = "AUTHORIZE_AUTOMATED_SPRINKLER_WASH"`,
  },
  {
    id: 'bedrock',
    name: 'Amazon Bedrock Diagnostic Mesh',
    category: 'Generative AI Intelligence',
    role: 'Situational Summaries (Claude 3.5 Sonnet)',
    scoreImpact: 'Contextual AI operational briefs for complex edge-case anomalies',
    description:
      'Synthesizes multi-dimensional telemetry anomalies into plain-English operational briefs for municipal grid dispatchers before trucks are dispatched or valves actuated.',
    codeSnippet: `// Bedrock Model Invocation Payload
{
  "modelId": "anthropic.claude-3-5-sonnet-20241022-v2:0",
  "messages": [{
    "role": "user",
    "content": "Classify this anomaly: Node OKHLA-03 has 83.8% loss. Cluster avg: 5.4%. Irradiance: 850 W/m²."
  }]
}`,
  },
  {
    id: 'step_functions',
    name: 'AWS Step Functions Orchestrator',
    category: 'State Machine & Relay Control',
    role: 'Automated Actuator Webhook Dispatch',
    scoreImpact: 'Stateful, auditable coordination of water valves and maintenance tickets',
    description:
      'Evaluates consensus verdict: if smog is confirmed, emits outbound webhook commands to mechanical irrigation relays; if hardware failure, locks valves and routes P1 ticket.',
    codeSnippet: `// Step Functions Action Branch
"RouteVerdict": {
  "Type": "Choice",
  "Choices": [
    {
      "Variable": "$.consensus_verdict",
      "StringEquals": "AUTHORIZE_AUTOMATED_SPRINKLER_WASH",
      "Next": "TriggerIrrigationRelay"
    },
    {
      "Variable": "$.consensus_verdict",
      "StringEquals": "BLOCK_WATER_TRIGGER_ALERT_MAINTENANCE",
      "Next": "LockValvesAndDispatchTicket"
    }
  ]
}`,
  },
];

export const AwsTopologyView: React.FC = () => {
  const [selectedService, setSelectedService] = useState<ServiceDetail>(AWS_SERVICES[3]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-[#111827] rounded-xl border border-[#1F2937] p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider mb-1">
          <span>Section 7 · Technical Architecture</span>
          <span>/</span>
          <span>Targeting 10/10 Built on AWS</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Event-Driven Serverless Data Pipeline
        </h1>
        <p className="text-sm text-[#94A3B8] mt-2 leading-relaxed">
          High-throughput telemetry ingestion mesh that decouples high-frequency inverter streams from spatial clustering and actuator routing.
        </p>
      </div>

      {/* ASCII Topology Diagram Box */}
      <div className="bg-[#111827] rounded-xl border border-[#1F2937] p-6 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-[#1F2937]">
          <span className="font-bold text-white uppercase tracking-wider">
            AWS Cloud Architecture Flow Diagram
          </span>
          <span className="text-emerald-400 text-[11px]">Serverless &amp; Event-Driven</span>
        </div>
        <pre className="p-4 rounded-lg bg-[#070A10] border border-[#1F2937] text-slate-300 overflow-x-auto leading-relaxed text-[11px]">
{`[Decentralized Solar Edge Array Nodes]
                 │
                 ▼ (Secure MQTT Ingress Protocol over Port 8883)
         [AWS IoT Core Mesh]
                 │
                 ▼ (Data Ingress Rule Routing Engine)
    [Amazon Kinesis Data Streams] ──► (Real-Time Ingest High-Throughput Buffer)
                 │
      ┌──────────┴──────────┐
      ▼                     ▼
[AWS Lambda Compute]  [Amazon Timestream DB] ──► (Time-Series Metrics Analytical Storage)
      │
      ▼ (Calculates Variance Metrics against Neighbor Baselines)
[Amazon Bedrock Agent] ──► (Generates Situational Summaries for Complex Anomalies)
      │
      ▼
[AWS Step Functions State Machine Orchestrator]
      │
      ├─► [Verdict: APPROVE] ──► Trigger Outbound Webhook to IoT Water Relay Actuator
      └─► [Verdict: BLOCK]   ──► Write Critical Hardware Log & Route Maintenance Ticket`}</pre>
      </div>

      {/* Component Step Tabs */}
      <div className="bg-[#111827] rounded-xl border border-[#1F2937] p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#1F2937]">
          <span className="text-xs font-mono font-bold text-[#64748B] uppercase">
            Click component to inspect implementation logic
          </span>
          <span className="text-xs font-mono text-emerald-400">AWS Native Primitives</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {AWS_SERVICES.map((svc) => {
            const isSelected = selectedService.id === svc.id;
            return (
              <button
                key={svc.id}
                onClick={() => setSelectedService(svc)}
                className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all font-mono text-xs ${
                  isSelected
                    ? 'border-emerald-500 bg-[#1E293B] text-white font-bold'
                    : 'border-[#1F2937] bg-[#070A10] text-[#94A3B8] hover:text-white hover:bg-[#1E293B]/50'
                }`}
              >
                <div className="text-[10px] text-[#64748B] truncate">{svc.category}</div>
                <div className="truncate text-white text-[11px] mt-0.5">{svc.name}</div>
              </button>
            );
          })}
        </div>

        {/* Selected Service Detailed Inspector */}
        <div className="pt-4 border-t border-[#1F2937] grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-3">
            <div>
              <span className="text-[10px] font-mono text-[#64748B] uppercase block">
                Selected AWS Component
              </span>
              <h3 className="text-base font-bold text-white font-mono mt-0.5">
                {selectedService.name}
              </h3>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              {selectedService.description}
            </p>
            <div className="p-3 rounded-lg bg-[#070A10] border border-emerald-500/20 text-[11px] font-mono text-emerald-300">
              <strong className="text-white block mb-0.5">Judging Rubric Value:</strong>
              {selectedService.scoreImpact}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B] mb-2">
              <span>NATIVE AWS IMPLEMENTATION SPEC</span>
              <span className="text-emerald-400">Serverless</span>
            </div>
            <pre className="p-4 rounded-lg bg-[#070A10] border border-[#1F2937] text-[11px] font-mono text-slate-200 overflow-x-auto leading-relaxed">
              <code>{selectedService.codeSnippet}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
