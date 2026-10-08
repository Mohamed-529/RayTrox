import React, { useState } from 'react';
import { Check, Copy, Database, Play, Send, Server, Terminal, Zap } from 'lucide-react';

export const ApiDatabaseView: React.FC = () => {
  const [requestPayload, setRequestPayload] = useState<string>(
    JSON.stringify(
      {
        device_id: 'INVERTER-OKHLA-01',
        neighborhood_id: 'DELHI-ZONE-07',
        actual_output_kw: 1.22,
        irradiance_w_m2: 850.0,
        panel_area_m2: 8.0,
      },
      null,
      2
    )
  );

  const [responsePayload, setResponsePayload] = useState<string | null>(null);
  const [httpStatus, setHttpStatus] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedCurl, setCopiedCurl] = useState<boolean>(false);

  const handleExecuteApiCall = () => {
    setIsLoading(true);
    try {
      const parsed = JSON.parse(requestPayload);
      const theoreticalMax = (parsed.irradiance_w_m2 * (parsed.panel_area_m2 || 8.0) * 0.85) / 1000.0;
      const lossPct = Math.max(0, ((theoreticalMax - parsed.actual_output_kw) / theoreticalMax) * 100);
      const neighborhoodAvg = 24.15;
      const variance = Math.abs(lossPct - neighborhoodAvg);
      const isFault = variance > 12.0 && lossPct >= 20.0;

      setTimeout(() => {
        setHttpStatus(201);
        setResponsePayload(
          JSON.stringify(
            {
              status: 'PROCESSED',
              timestamp: Math.floor(Date.now() / 1000),
              metrics: {
                calculated_efficiency_loss_pct: parseFloat(lossPct.toFixed(2)),
                regional_neighborhood_avg_loss_pct: neighborhoodAvg,
                absolute_variance_deviation: parseFloat(variance.toFixed(2)),
              },
              consensus_action_verdict: isFault
                ? 'BLOCK_WATER_TRIGGER_ALERT_MAINTENANCE'
                : 'AUTHORIZE_AUTOMATED_SPRINKLER_WASH',
              automation_relay_actuator_output: !isFault,
            },
            null,
            2
          )
        );
        setIsLoading(false);
      }, 350);
    } catch (err: any) {
      setTimeout(() => {
        setHttpStatus(400);
        setResponsePayload(JSON.stringify({ error: 'Malformed JSON payload: ' + err.message }, null, 2));
        setIsLoading(false);
      }, 200);
    }
  };

  const curlCommand = `curl -X POST https://api.gridpulse.cloud/v1/grid/telemetry \\
  -H "Content-Type: application/json" \\
  -d '${requestPayload.replace(/\n/g, '').replace(/\s+/g, ' ')}'`;

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-[#111827] rounded-xl border border-[#1F2937] p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider mb-1">
          <span>Section 8 · Database &amp; API Data Contracts</span>
          <span>/</span>
          <span>Amazon Timestream Schema</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Time-Series Database &amp; Ingress API Architecture
        </h1>
        <p className="text-sm text-[#94A3B8] mt-2 leading-relaxed">
          Production data contracts defining how decentralized smart solar arrays ingest telemetry into AWS IoT Core, buffer through Kinesis, and persist to Amazon Timestream.
        </p>
      </div>

      {/* Database Schema Grid */}
      <div className="bg-[#111827] rounded-xl border border-[#1F2937] p-6 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#1F2937]">
          <Database className="w-5 h-5 text-emerald-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Amazon Timestream Database Schema: InverterTelemetry Table
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Dimensions */}
          <div className="p-4 rounded-lg bg-[#070A10] border border-[#1F2937] space-y-2">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase block">
              Dimensions (High-Cardinality Indexed Keys)
            </span>
            <ul className="text-xs font-mono text-[#94A3B8] space-y-1.5">
              <li className="flex justify-between border-b border-[#1F2937]/50 pb-1">
                <span className="text-white">device_id</span>
                <span className="text-[#64748B]">VARCHAR (e.g. INVERTER-OKHLA-01)</span>
              </li>
              <li className="flex justify-between border-b border-[#1F2937]/50 pb-1">
                <span className="text-white">neighborhood_id</span>
                <span className="text-[#64748B]">VARCHAR (e.g. DELHI-ZONE-07)</span>
              </li>
              <li className="flex justify-between pb-1">
                <span className="text-white">geohash_sector</span>
                <span className="text-[#64748B]">VARCHAR (e.g. tt2x7)</span>
              </li>
            </ul>
          </div>

          {/* Measures */}
          <div className="p-4 rounded-lg bg-[#070A10] border border-[#1F2937] space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase block">
              Measures (Time-Series Continuous Variables)
            </span>
            <ul className="text-xs font-mono text-[#94A3B8] space-y-1.5">
              <li className="flex justify-between border-b border-[#1F2937]/50 pb-1">
                <span className="text-white">actual_output_kw</span>
                <span className="text-[#64748B]">DOUBLE (Precision: 2 dec)</span>
              </li>
              <li className="flex justify-between border-b border-[#1F2937]/50 pb-1">
                <span className="text-white">irradiance_w_m2</span>
                <span className="text-[#64748B]">DOUBLE (Solar Flux)</span>
              </li>
              <li className="flex justify-between border-b border-[#1F2937]/50 pb-1">
                <span className="text-white">calculated_efficiency_loss_pct</span>
                <span className="text-[#64748B]">DOUBLE (Degradation curve)</span>
              </li>
              <li className="flex justify-between pb-1">
                <span className="text-white">consensus_verdict</span>
                <span className="text-[#64748B]">VARCHAR (Enum verdict)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Interactive REST API Sandbox */}
      <div className="bg-[#111827] rounded-xl border border-[#1F2937] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1F2937]">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#64748B]">
              Ingress API Endpoint Execution Sandbox
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                POST
              </span>
              <span className="font-mono text-xs font-bold text-white">
                /api/v1/grid/telemetry
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCurl}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-[#94A3B8] hover:text-white bg-[#1E293B] hover:bg-[#283548] rounded-md transition-colors cursor-pointer border border-[#334155]"
            >
              {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCurl ? 'Copied cURL' : 'Copy cURL'}</span>
            </button>
            <button
              onClick={handleExecuteApiCall}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-mono font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{isLoading ? 'Executing...' : 'Send Request'}</span>
            </button>
          </div>
        </div>

        {/* Request & Response Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 font-mono text-xs">
          {/* Request Payload Editor */}
          <div className="space-y-2">
            <div className="flex justify-between text-[#64748B] text-[11px]">
              <span>JSON REQUEST BODY</span>
              <span>Content-Type: application/json</span>
            </div>
            <textarea
              rows={11}
              value={requestPayload}
              onChange={(e) => setRequestPayload(e.target.value)}
              className="w-full p-3.5 rounded-lg bg-[#070A10] border border-[#1F2937] text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
            />
          </div>

          {/* Response Payload Display */}
          <div className="space-y-2">
            <div className="flex justify-between text-[#64748B] text-[11px]">
              <span>PROCESSED RESPONSE</span>
              {httpStatus && (
                <span className={httpStatus === 201 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  HTTP {httpStatus} {httpStatus === 201 ? 'CREATED' : 'BAD REQUEST'}
                </span>
              )}
            </div>
            <div className="h-[238px] p-3.5 rounded-lg bg-[#070A10] border border-[#1F2937] text-emerald-300 overflow-y-auto leading-relaxed">
              {responsePayload ? (
                <pre>
                  <code>{responsePayload}</code>
                </pre>
              ) : (
                <span className="text-[#475569]">
                  Click "Send Request" to trigger backend spatial consensus evaluation and view the API Gateway response payload.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
