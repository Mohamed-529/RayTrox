import { ScenarioPreset, SolarNode } from '../types/grid';

export const INITIAL_NODES: SolarNode[] = [
  {
    id: 'INVERTER-OKHLA-01',
    name: 'Okhla Phase III - Plant A',
    facility: 'Municipal Logistics Hub',
    lat: 28.5285,
    lng: 77.2718,
    capacityKw: 6.0,
    panelAreaM2: 8.0,
    actualKw: 4.1,
    irradianceWM2: 850,
    baselineEfficiency: 0.85,
    calculatedLossPct: 0,
    theoreticalMaxKw: 5.78,
    status: 'nominal',
    lastCleanedDaysAgo: 4,
  },
  {
    id: 'INVERTER-OKHLA-02',
    name: 'Okhla Phase III - Plant B',
    facility: 'Industrial Depot 14',
    lat: 28.5302,
    lng: 77.2735,
    capacityKw: 6.0,
    panelAreaM2: 8.0,
    actualKw: 4.3,
    irradianceWM2: 850,
    baselineEfficiency: 0.85,
    calculatedLossPct: 25.4,
    theoreticalMaxKw: 5.78,
    status: 'degraded',
    lastCleanedDaysAgo: 5,
  },
  {
    id: 'INVERTER-OKHLA-03',
    name: 'Okhla Phase III - Plant C',
    facility: 'Cold Storage Terminal',
    lat: 28.5271,
    lng: 77.2751,
    capacityKw: 6.0,
    panelAreaM2: 8.0,
    actualKw: 4.4,
    irradianceWM2: 850,
    baselineEfficiency: 0.85,
    calculatedLossPct: 23.1,
    theoreticalMaxKw: 5.78,
    status: 'degraded',
    lastCleanedDaysAgo: 4,
  },
  {
    id: 'INVERTER-OKHLA-04',
    name: 'Okhla Phase III - Plant D',
    facility: 'Substation Rooftop Array',
    lat: 28.5322,
    lng: 77.2695,
    capacityKw: 6.0,
    panelAreaM2: 8.0,
    actualKw: 4.2,
    irradianceWM2: 850,
    baselineEfficiency: 0.85,
    calculatedLossPct: 26.8,
    theoreticalMaxKw: 5.78,
    status: 'degraded',
    lastCleanedDaysAgo: 6,
  },
  {
    id: 'INVERTER-OKHLA-05',
    name: 'Okhla Phase III - Plant E',
    facility: 'Regional Transit Workshop',
    lat: 28.5255,
    lng: 77.2704,
    capacityKw: 6.0,
    panelAreaM2: 8.0,
    actualKw: 4.35,
    irradianceWM2: 850,
    baselineEfficiency: 0.85,
    calculatedLossPct: 24.2,
    theoreticalMaxKw: 5.78,
    status: 'degraded',
    lastCleanedDaysAgo: 3,
  },
  {
    id: 'INVERTER-OKHLA-06',
    name: 'Okhla Phase III - Plant F',
    facility: 'Water Treatment Solar Canopy',
    lat: 28.5341,
    lng: 77.2742,
    capacityKw: 6.0,
    panelAreaM2: 8.0,
    actualKw: 4.25,
    irradianceWM2: 850,
    baselineEfficiency: 0.85,
    calculatedLossPct: 26.0,
    theoreticalMaxKw: 5.78,
    status: 'degraded',
    lastCleanedDaysAgo: 5,
  },
];

export const PRESET_SCENARIOS: ScenarioPreset[] = [
  {
    id: 'regional_smog',
    title: 'Regional Winter Smog Blanket (PM2.5)',
    tagline: 'Uniform 25%–30% drop across entire sector. High AQI.',
    description:
      'A dense atmospheric thermal inversion blanket covers South Delhi. All 6 rooftop solar arrays suffer a proportional 24%–29% drop in output. Spatial variance is minimal (2.2%), proving the drop is environmental. System SUPPRESSES diesel truck dispatches.',
    airQualityIndex: 382,
    weatherCondition: 'Dense Smog / Low Visibility (1.2 km)',
    targetNodeId: 'INVERTER-OKHLA-01',
    nodes: [
      { ...INITIAL_NODES[0], actualKw: 4.1, calculatedLossPct: 29.07, status: 'degraded' }, // ~29.1% loss
      { ...INITIAL_NODES[1], actualKw: 4.3, calculatedLossPct: 25.61, status: 'degraded' }, // ~25.6% loss
      { ...INITIAL_NODES[2], actualKw: 4.4, calculatedLossPct: 23.88, status: 'degraded' }, // ~23.9% loss
      { ...INITIAL_NODES[3], actualKw: 4.2, calculatedLossPct: 27.34, status: 'degraded' }, // ~27.3% loss
      { ...INITIAL_NODES[4], actualKw: 4.35, calculatedLossPct: 24.74, status: 'degraded' }, // ~24.7% loss
      { ...INITIAL_NODES[5], actualKw: 4.25, calculatedLossPct: 26.47, status: 'degraded' }, // ~26.5% loss
    ],
  },
  {
    id: 'hardware_failure',
    title: 'Isolated Inverter Hardware Fault',
    tagline: 'Target node drops 34.2%, but all neighbors are healthy (~5%).',
    description:
      'Array INVERTER-OKHLA-01 suffers an internal bypass diode breakdown / string inverter capacitor failure. Output drops sharply. Neighboring arrays produce nominal high power (>5.4 kW). Spatial variance is 29.1% (>12% tolerance). System flags HARDWARE FAULT and halts wasteful water wash.',
    airQualityIndex: 65,
    weatherCondition: 'Clear Blue Sky / High Solar Irradiance',
    targetNodeId: 'INVERTER-OKHLA-01',
    nodes: [
      { ...INITIAL_NODES[0], actualKw: 3.8, calculatedLossPct: 34.26, status: 'fault' }, // ~34.3% loss
      { ...INITIAL_NODES[1], actualKw: 5.5, calculatedLossPct: 4.84, status: 'nominal' }, // ~4.8% loss
      { ...INITIAL_NODES[2], actualKw: 5.48, calculatedLossPct: 5.19, status: 'nominal' }, // ~5.2% loss
      { ...INITIAL_NODES[3], actualKw: 5.52, calculatedLossPct: 4.5, status: 'nominal' }, // ~4.5% loss
      { ...INITIAL_NODES[4], actualKw: 5.46, calculatedLossPct: 5.54, status: 'nominal' }, // ~5.5% loss
      { ...INITIAL_NODES[5], actualKw: 5.55, calculatedLossPct: 3.98, status: 'nominal' }, // ~4.0% loss
    ],
  },
  {
    id: 'nominal_sunny',
    title: 'Nominal Sunny Clear Day',
    tagline: 'All arrays operating within 3%–6% loss tolerance.',
    description:
      'Clean panels operating under bright sunshine (850 W/m²). Efficiency loss is below 10% on every installation. No alerts or dispatch actions are triggered.',
    airQualityIndex: 48,
    weatherCondition: 'Clear Sky / Unrestricted Irradiance',
    targetNodeId: 'INVERTER-OKHLA-01',
    nodes: [
      { ...INITIAL_NODES[0], actualKw: 5.5, calculatedLossPct: 4.84, status: 'nominal' },
      { ...INITIAL_NODES[1], actualKw: 5.55, calculatedLossPct: 3.98, status: 'nominal' },
      { ...INITIAL_NODES[2], actualKw: 5.48, calculatedLossPct: 5.19, status: 'nominal' },
      { ...INITIAL_NODES[3], actualKw: 5.52, calculatedLossPct: 4.5, status: 'nominal' },
      { ...INITIAL_NODES[4], actualKw: 5.45, calculatedLossPct: 5.71, status: 'nominal' },
      { ...INITIAL_NODES[5], actualKw: 5.58, calculatedLossPct: 3.46, status: 'nominal' },
    ],
  },
];
