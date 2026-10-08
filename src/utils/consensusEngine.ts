import { ConsensusEvaluation, NeighborRecord, SolarNode, VerdictType, ClassificationType } from '../types/grid';

export interface EngineConfig {
  varianceTolerance: number; // default 12.0%
  baselineEfficiency: number; // default 0.85 (85%)
  lossThresholdForConsensus: number; // default 20.0%
  dieselPerTruckTripLiters: number; // default 14.5 L
  co2PerDieselLiterKg: number; // default 2.68 kg CO2/L
  truckDispatchCostUsd: number; // default $240
}

export const DEFAULT_ENGINE_CONFIG: EngineConfig = {
  varianceTolerance: 12.0,
  baselineEfficiency: 0.85,
  lossThresholdForConsensus: 20.0,
  dieselPerTruckTripLiters: 14.5,
  co2PerDieselLiterKg: 2.68,
  truckDispatchCostUsd: 240,
};

/**
 * Calculates theoretical maximum output in kW:
 * Theoretical kW = (Irradiance [W/m²] * Panel Area [m²] * Baseline Efficiency) / 1000
 */
export function calculateTheoreticalMaxKw(
  irradianceWM2: number,
  panelAreaM2: number,
  baselineEfficiency: number = 0.85
): number {
  if (irradianceWM2 <= 0 || panelAreaM2 <= 0) return 0;
  return Number(((irradianceWM2 * panelAreaM2 * baselineEfficiency) / 1000.0).toFixed(3));
}

/**
 * Calculates panel performance degradation curve:
 * Loss % = ((Theoretical Max kW - Actual kW) / Theoretical Max kW) * 100
 */
export function calculateEfficiencyLoss(
  actualKw: number,
  irradianceWM2: number,
  panelAreaM2: number,
  baselineEfficiency: number = 0.85
): { theoreticalMaxKw: number; lossPct: number } {
  const theoreticalMaxKw = calculateTheoreticalMaxKw(irradianceWM2, panelAreaM2, baselineEfficiency);
  if (theoreticalMaxKw <= 0) {
    return { theoreticalMaxKw: 0, lossPct: 0 };
  }
  const lossPct = Math.max(0, ((theoreticalMaxKw - actualKw) / theoreticalMaxKw) * 100.0);
  return {
    theoreticalMaxKw,
    lossPct: Number(lossPct.toFixed(2)),
  };
}

/**
 * Pure Spatial Neighborhood Consensus Algorithm.
 * Cross-validates performance anomalies across neighboring installations.
 * Isolates localized hardware errors from widespread atmospheric smog blankets.
 */
export function evaluateSpatialConsensus(
  targetNodeId: string,
  nodes: SolarNode[],
  config: EngineConfig = DEFAULT_ENGINE_CONFIG
): ConsensusEvaluation {
  const targetNode = nodes.find((n) => n.id === targetNodeId) || nodes[0];
  const { theoreticalMaxKw, lossPct: targetLoss } = calculateEfficiencyLoss(
    targetNode.actualKw,
    targetNode.irradianceWM2,
    targetNode.panelAreaM2,
    targetNode.baselineEfficiency
  );

  const neighbors = nodes.filter((n) => n.id !== targetNode.id);
  const neighborhoodNodes: NeighborRecord[] = neighbors.map((node) => {
    const { theoreticalMaxKw: tMax, lossPct } = calculateEfficiencyLoss(
      node.actualKw,
      node.irradianceWM2,
      node.panelAreaM2,
      node.baselineEfficiency
    );
    return {
      id: node.id,
      name: node.name,
      lossPct,
      actualKw: node.actualKw,
      theoreticalMaxKw: tMax,
    };
  });

  const timestamp = new Date().toISOString();

  // 1. Nominal / Normal Fluctuation Check
  if (targetLoss < config.lossThresholdForConsensus) {
    return {
      targetNodeId: targetNode.id,
      targetNodeName: targetNode.name,
      actualKw: targetNode.actualKw,
      theoreticalMaxKw,
      targetLossPct: targetLoss,
      irradianceWM2: targetNode.irradianceWM2,
      panelAreaM2: targetNode.panelAreaM2,
      baselineEfficiency: targetNode.baselineEfficiency,
      neighborhoodNodes,
      neighborhoodAvgLossPct:
        neighborhoodNodes.length > 0
          ? Number((neighborhoodNodes.reduce((acc, curr) => acc + curr.lossPct, 0) / neighborhoodNodes.length).toFixed(2))
          : 0,
      variance: 0,
      varianceTolerance: config.varianceTolerance,
      classification: 'NOMINAL',
      verdict: 'HOLD_ACTION',
      reason: `Efficiency drop of ${targetLoss}% is within normal operating bounds (<${config.lossThresholdForConsensus}%). Array is performing nominally.`,
      truckDispatchPrevented: false,
      waterTriggerAuthorized: false,
      maintenanceAlertRaised: false,
      dieselSavedLiters: 0,
      carbonPreventedKg: 0,
      costSavedUsd: 0,
      timestamp,
    };
  }

  // If no adjacent neighbors exist in cluster
  if (neighborhoodNodes.length === 0) {
    return {
      targetNodeId: targetNode.id,
      targetNodeName: targetNode.name,
      actualKw: targetNode.actualKw,
      theoreticalMaxKw,
      targetLossPct: targetLoss,
      irradianceWM2: targetNode.irradianceWM2,
      panelAreaM2: targetNode.panelAreaM2,
      baselineEfficiency: targetNode.baselineEfficiency,
      neighborhoodNodes: [],
      neighborhoodAvgLossPct: 0,
      variance: 0,
      varianceTolerance: config.varianceTolerance,
      classification: 'NOMINAL',
      verdict: 'HOLD_ACTION',
      reason: 'Insufficient regional cluster metrics to calculate neighborhood consensus baseline.',
      truckDispatchPrevented: false,
      waterTriggerAuthorized: false,
      maintenanceAlertRaised: false,
      dieselSavedLiters: 0,
      carbonPreventedKg: 0,
      costSavedUsd: 0,
      timestamp,
    };
  }

  // Calculate neighborhood average loss
  const sumNeighborLoss = neighborhoodNodes.reduce((acc, curr) => acc + curr.lossPct, 0);
  const neighborhoodAvg = Number((sumNeighborLoss / neighborhoodNodes.length).toFixed(2));
  const variance = Number(Math.abs(targetLoss - neighborhoodAvg).toFixed(2));

  // Anomaly Isolation Decision:
  // If variance > tolerance: Target node dropped while neighbors remain healthy -> Hardware Failure!
  if (variance > config.varianceTolerance) {
    return {
      targetNodeId: targetNode.id,
      targetNodeName: targetNode.name,
      actualKw: targetNode.actualKw,
      theoreticalMaxKw,
      targetLossPct: targetLoss,
      irradianceWM2: targetNode.irradianceWM2,
      panelAreaM2: targetNode.panelAreaM2,
      baselineEfficiency: targetNode.baselineEfficiency,
      neighborhoodNodes,
      neighborhoodAvgLossPct: neighborhoodAvg,
      variance,
      varianceTolerance: config.varianceTolerance,
      classification: 'HARDWARE_ANOMALY',
      verdict: 'BLOCK_WATER_TRIGGER_ALERT_MAINTENANCE',
      reason: `Isolated drop detected (${targetLoss}%). Neighborhood average is ${neighborhoodAvg}%. High variance (${variance}% > ${config.varianceTolerance}%) confirms an isolated hardware/inverter fault. Spraying water blocked to avoid wastage. Technician dispatch flagged.`,
      truckDispatchPrevented: false,
      waterTriggerAuthorized: false,
      maintenanceAlertRaised: true,
      dieselSavedLiters: 0,
      carbonPreventedKg: 0,
      costSavedUsd: 0,
      timestamp,
    };
  }

  // Otherwise: Proportional drop across entire cluster -> Regional Smog / Thermal Inversion Event!
  const dieselSaved = config.dieselPerTruckTripLiters;
  const carbonPrevented = Number((dieselSaved * config.co2PerDieselLiterKg).toFixed(2));
  const costSaved = config.truckDispatchCostUsd;

  return {
    targetNodeId: targetNode.id,
    targetNodeName: targetNode.name,
    actualKw: targetNode.actualKw,
    theoreticalMaxKw,
    targetLossPct: targetLoss,
    irradianceWM2: targetNode.irradianceWM2,
    panelAreaM2: targetNode.panelAreaM2,
    baselineEfficiency: targetNode.baselineEfficiency,
    neighborhoodNodes,
    neighborhoodAvgLossPct: neighborhoodAvg,
    variance,
    varianceTolerance: config.varianceTolerance,
    classification: 'REGIONAL_SMOG_EVENT',
    verdict: 'SUPPRESS_TRUCK_DISPATCH_SMOG_CONFIRMED',
    reason: `Uniform efficiency drop (${targetLoss}%) confirmed across regional cluster (cluster avg: ${neighborhoodAvg}%, variance: ${variance}% ≤ ${config.varianceTolerance}%). Atmospheric smog/PM2.5 blanket verified. False diesel maintenance truck dispatch successfully suppressed!`,
    truckDispatchPrevented: true,
    waterTriggerAuthorized: true,
    maintenanceAlertRaised: false,
    dieselSavedLiters: dieselSaved,
    carbonPreventedKg: carbonPrevented,
    costSavedUsd: costSaved,
    timestamp,
  };
}
