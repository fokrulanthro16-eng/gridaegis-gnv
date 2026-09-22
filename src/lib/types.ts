// Strict TypeScript Domain Models for GridAegis GNV

export interface AlachuaZipCodeMetric {
  zip: string;
  name: string;
  region: 'East' | 'West' | 'Downtown' | 'North' | 'Southwest' | 'Suburban';
  population: number;
  medianHouseholdIncome: number;
  avgMonthlyKwh: number;
  avgMonthlyGruBill: number;
  energyBurdenPct: number; // (% of income spent on electricity)
  coolingDegreeDays: number;
  treeCanopyDeficitPct: number; // 0-100%
  structuralInefficiencyScore: number; // 0-100 (aging pre-1980 stock, low R-value, envelope leakage)
  nasaLstThermalAnomalyC: number; // NASA ECOSTRESS / Landsat 8/9 Land Surface Temp Anomaly (°C vs rural baseline)
  housingUnits: number;
  pctRenters: number;
  svgPath: string; // SVG path for choropleth rendering
  centroid: { x: number; y: number };
  criticalFacilities: string[];
  vulnerabilityRationale: string;
}

export type GISLayerType = 
  | 'energyBurden'
  | 'canopyDeficit'
  | 'structuralInefficiency'
  | 'coolingDegreeDays'
  | 'nasaThermal';

export interface GridNode {
  id: string;
  name: string;
  type: 'generator' | 'substation' | 'shelter' | 'hazard_zone';
  kvRating?: number; // 230kV, 138kV, 23kV, 12.47kV
  x: number; // SVG canvas coordinate
  y: number;
  floodVulnerability: number; // 0 - 100%
  windThresholdCat: number; // 1, 2, 3, 4
  elevationFt: number;
  capacityMw?: number;
  backupGeneratorKw?: number;
  criticalNeeds?: string[];
  status: 'online' | 'compromised' | 'tripped' | 'islanded';
  description: string;
}

export interface GridEdge {
  id: string;
  source: string;
  target: string;
  kv: number;
  capacityMva: number;
  floodZoneCrossed: boolean;
  status: 'energized' | 'tripped' | 'overloaded';
}

export interface SimulationParams {
  hurricaneCategory: number; // 1, 2, 3, 4
  rainfallInches: number; // 0 to 15
  hogtownCreekSpillover: boolean;
  sweetwaterSinkholeSwarm: boolean;
  hardenedNodes: string[]; // Node IDs with pre-emptive civic hardening
}

export interface RestorationPriorityItem {
  nodeId: string;
  name: string;
  priorityScore: number;
  criticalLoadKw: number;
  servedPopulation: number;
  rationale: string;
}

export interface SimulationStepResult {
  step: number;
  compromisedNodeIds: string[];
  trippedEdgeIds: string[];
  islandedShelterIds: string[];
  blackedOutShelterIds: string[];
  gridGenerationMw: number;
  loadServedPct: number;
  unservedEnergyMwh: number;
  restorationPriority: RestorationPriorityItem[];
  executionTimeMs: number;
  timestamp: string;
  events: string[];
}

export interface GruBillLineItem {
  name: string;
  quantity?: number;
  unit?: string;
  rate?: number;
  amount: number;
  isFuelAdjustment?: boolean;
}

export interface GruSampleBill {
  id: string;
  title: string;
  subtitle: string;
  accountNumber: string;
  serviceAddress: string;
  zipCode: string;
  billingPeriod: string;
  totalKwh: number;
  fuelAdjustmentCost: number;
  baseEnergyCost: number;
  totalElectricBill: number;
  totalUtilityBill: number;
  monthlyHouseholdIncomeEst: number;
  energyBurdenPct: number;
  lineItems: GruBillLineItem[];
  narrative: string;
}

export interface PrefilledLiheapForm {
  applicantName: string;
  serviceAddress: string;
  utilityAccountNumber: string;
  calculatedHardshipRatio: number; // Energy burden percentage
  recommendedAssistanceGrant: number; // In USD
  priorityTier: string;
  formalHardshipLetter: string;
}

export type DualEngineMode = 'cloud_gemini' | 'edge_fallback';

export interface ProductionAuditResponse {
  isMockFallback: boolean;
  engineModeUsed: DualEngineMode;
  fallbackBadgeNotice?: string;
  extractedKwh: number;
  totalBilledAmount: number;
  baseEnergyCharge: number;
  fuelAdjustmentCharge: number;
  calculatedEffectiveRate: number; // Total billed / kWh
  peakHoursPercentage: number;
  tariffAnomalyDetected: boolean;
  anomalyReason: string;
  actionableRecommendations: string[];
  prefilledLiheapForm: PrefilledLiheapForm;
  auditSummary: string;
}

// Backward compatibility alias
export type GeminiAuditResult = ProductionAuditResponse;

export interface ShelterLifeSupportProfile {
  id: string;
  name: string;
  address: string;
  zipCode: string;
  capacityPeople: number;
  sqFootage: number;
  connectedSubstation: string;
  criticalLoads: {
    medicalRefrigerationKw: number;
    oxygenAndVentilatorsKw: number;
    emergencyHvacCoolingKw: number;
    lightingAndCommsKw: number;
    waterSanitationPumpsKw: number;
  };
  totalCriticalLoadKw: number;
}

export interface MicrogridHourlyStep {
  hour: number;
  irradianceKwM2: number; // kW/m² in Gainesville
  pvGenerationKw: number;
  shelterCriticalLoadKw: number;
  batteryChargeKw: number;
  batteryDischargeKw: number;
  batterySoCKwh: number;
  batterySoCPct: number;
  generatorBackupKw: number;
  curtailedSolarKw: number;
}

export interface MicrogridSolverResult {
  recommendedPvKw: number;
  recommendedBessKwh: number;
  solarArraySqFtRequired: number;
  usableRoofSqFt: number;
  fitsOnRoof: boolean;
  totalCapexEstimate: number;
  iraDirectPayRebate40Pct: number;
  netMunicipalityCost: number;
  survivalHoursGuaranteed: number;
  unmetEnergyKwh: number;
  hourlyProfile: MicrogridHourlyStep[];
}
