export type NodeStatus = 'nominal' | 'degraded' | 'fault';

export interface SolarNode {
  id: string;
  name: string;
  facility: string;
  lat: number;
  lng: number;
  capacityKw: number;
  panelAreaM2: number;
  actualKw: number;
  irradianceWM2: number;
  baselineEfficiency: number;
  calculatedLossPct: number;
  theoreticalMaxKw: number;
  status: NodeStatus;
  lastCleanedDaysAgo: number;
}

export type VerdictType =
  | 'HOLD_ACTION'
  | 'BLOCK_WATER_TRIGGER_ALERT_MAINTENANCE'
  | 'AUTHORIZE_AUTOMATED_SPRINKLER_WASH'
  | 'SUPPRESS_TRUCK_DISPATCH_SMOG_CONFIRMED';

export type ClassificationType = 'NOMINAL' | 'HARDWARE_ANOMALY' | 'REGIONAL_SMOG_EVENT';

export interface NeighborRecord {
  id: string;
  name: string;
  lossPct: number;
  actualKw: number;
  theoreticalMaxKw: number;
}

export interface ConsensusEvaluation {
  targetNodeId: string;
  targetNodeName: string;
  actualKw: number;
  theoreticalMaxKw: number;
  targetLossPct: number;
  irradianceWM2: number;
  panelAreaM2: number;
  baselineEfficiency: number;
  neighborhoodNodes: NeighborRecord[];
  neighborhoodAvgLossPct: number;
  variance: number;
  varianceTolerance: number;
  classification: ClassificationType;
  verdict: VerdictType;
  reason: string;
  truckDispatchPrevented: boolean;
  waterTriggerAuthorized: boolean;
  maintenanceAlertRaised: boolean;
  dieselSavedLiters: number;
  carbonPreventedKg: number;
  costSavedUsd: number;
  timestamp: string;
}

export interface ScenarioPreset {
  id: string;
  title: string;
  tagline: string;
  description: string;
  airQualityIndex: number;
  weatherCondition: string;
  targetNodeId: string;
  nodes: SolarNode[];
}

export interface TestCaseResult {
  name: string;
  functionName: string;
  category: string;
  durationMs: number;
  status: 'passed' | 'failed' | 'running';
  logLines: string[];
  assertionSummary: string;
}
