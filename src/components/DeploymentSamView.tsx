import React, { useState } from 'react';
import { Check, Cloud, Code2, Copy, DollarSign, Download, Server, Terminal, Zap } from 'lucide-react';

export const DeploymentSamView: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const SAM_COMMANDS = [
    {
      title: '1. Local Build with SAM Container',
      cmd: 'sam build --use-container',
      desc: 'Compiles Python 3.11 Lambda dependencies and builds the clean serverless zip package inside a containerized sandbox.',
    },
    {
      title: '2. Local FastAPI Testing Emulation',
      cmd: 'sam local start-api --port 8000',
      desc: 'Mounts the local API Gateway emulator on port 8000 to test POST /api/v1/grid/telemetry endpoints before cloud deployment.',
    },
    {
      title: '3. Automated Pytest Verification',
      cmd: 'pytest tests/test_grid.py -v',
      desc: 'Runs the full automated spatial consensus test suite before publishing cloud revisions.',
    },
    {
      title: '4. Zero-Friction AWS Cloud Deployment',
      cmd: 'sam deploy --guided --stack-name gridpulse-core-prod --region ap-south-1',
      desc: 'Provisions the API Gateway, Lambda router, and IAM execution policies automatically onto your live AWS dashboard.',
    },
  ];

  const handleCopy = (cmd: string, idx: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-[#111827] rounded-xl border border-[#1F2937] p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider mb-1">
          <span>Section 14 · Production Deployment</span>
          <span>/</span>
          <span>AWS SAM CLI &amp; CloudFormation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          AWS Serverless Application Model (SAM) Deployment
        </h1>
        <p className="text-sm text-[#94A3B8] mt-2 leading-relaxed">
          How to package and deploy GridPulse to live AWS infrastructure in under 3 minutes with zero idle billing overhead.
        </p>
      </div>

      {/* Zero Cost Rationale Card */}
      <div className="bg-[#111827] rounded-xl border border-[#1F2937] p-6 space-y-3">
        <div className="flex items-center gap-2 text-emerald-400">
          <DollarSign className="w-5 h-5" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Zero Idle-Cost Serverless Pricing Model
          </h2>
        </div>
        <p className="text-xs text-[#94A3B8] leading-relaxed">
          Because GridPulse relies entirely on on-demand serverless primitives (AWS Lambda, Amazon Timestream on-demand queries, and AWS Step Functions Express workflows), the entire infrastructure incurs <strong>$0.00 in idle costs</strong> when solar inverters are offline during nighttime hours. During daylight hours, each telemetry check costs less than <strong>$0.000002</strong>.
        </p>
      </div>

      {/* CLI Command Steps */}
      <div className="bg-[#111827] rounded-xl border border-[#1F2937] p-6 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#1F2937]">
          <Terminal className="w-5 h-5 text-amber-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Step-by-Step SAM CLI Terminal Pipeline
          </h2>
        </div>

        <div className="space-y-3">
          {SAM_COMMANDS.map((item, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-[#070A10] border border-[#1F2937] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">{item.title}</span>
                <button
                  onClick={() => handleCopy(item.cmd, idx)}
                  className="flex items-center gap-1 text-[11px] font-mono text-[#94A3B8] hover:text-white cursor-pointer"
                >
                  {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-2.5 rounded bg-black border border-[#1E293B] text-emerald-400 text-xs font-mono overflow-x-auto">
                <code>{item.cmd}</code>
              </pre>
              <p className="text-[11px] text-[#64748B] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* template.yaml Preview */}
      <div className="bg-[#111827] rounded-xl border border-[#1F2937] p-6 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#1F2937]">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              template.yaml (AWS SAM Infrastructure as Code)
            </h3>
          </div>
          <span className="text-xs font-mono text-[#64748B]">CloudFormation Spec</span>
        </div>
        <pre className="p-4 rounded-lg bg-[#070A10] border border-[#1F2937] text-xs font-mono text-[#94A3B8] overflow-x-auto leading-relaxed max-h-72">
          <code>{`AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: GridPulse Core Spatial Consensus Engine Serverless Infrastructure Stack

Resources:
  SpatialConsensusLambdaRouter:
    Type: AWS::Serverless::Function
    Properties:
      Handler: app.grid_pulse.lambda_handler
      Runtime: python3.11
      CodeUri: ./
      MemorySize: 512
      Timeout: 15
      Policies:
        - AmazonTimestreamFullAccess
        - AWSStepFunctionsFullAccess
      Events:
        ProxyApiIngress:
          Type: Api
          Properties:
            Path: /{proxy+}
            Method: ANY`}</code>
        </pre>
      </div>
    </div>
  );
};
