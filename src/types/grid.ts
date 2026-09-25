export type BreakerStatus = "CLOSED_ENERGIZED" | "OPEN_ISOLATED" | "TRIPPED_FAULT";
export type DisconnectStatus = "CLOSED" | "OPEN";

export interface SubstationBay {
  id: string;
  name: string;
  nominalVoltageKv: number; // 500 kV or 150 kV
  circuitBreakerStatus: BreakerStatus;
  bus1Disconnect: DisconnectStatus;
  bus2Disconnect: DisconnectStatus;
  lineDisconnect: DisconnectStatus;
  activePowerMw: number;
  reactivePowerMvar: number;
  currentAmpsPhaseR: number;
  currentAmpsPhaseS: number;
  currentAmpsPhaseT: number;
  voltageKv: number;
  powerFactor: number;
  frequencyHz: number;
}

export interface InterbusTransformer {
  tag: string;
  ratedPowerMva: number;        // 500 MVA
  primaryVoltageKv: number;     // 500 kV
  secondaryVoltageKv: number;   // 150 kV
  topOilTempC: number;          // Normal: < 75°C, Alarm: > 85°C
  windingHotSpotTempC: number;  // Normal: < 95°C, Alarm: > 115°C
  currentLoadMva: number;
  loadPercentagePct: number;
  coolingBanksRunning: number;  // 0 - 4 fan/pump banks (OFAF)
  oltcCurrentTap: number;       // Tap step (-16 to +16, nominal 0)
  buchholzRelayStatus: "NORMAL" | "GAS_ALARM" | "SURGE_TRIP";
  dissolvedGasesPpm: {
    hydrogenH2: number;        // < 100 ppm
    methaneCh4: number;        // < 120 ppm
    acetyleneC2h2: number;     // < 1 ppm (Critical arc indicator)
    ethyleneC2h4: number;      // < 50 ppm
    ethaneC2h6: number;        // < 65 ppm
    carbonMonoxideCo: number;  // < 350 ppm
  };
}

export interface GridKPIs {
  totalGridThroughputMw: number;
  totalReactivePowerMvar: number;
  averageGridFrequencyHz: number;
  averageSystemVoltageKv: number;
  systemPowerFactor: number;
  totalActiveBaysCount: number;
  trippedBaysCount: number;
  transformerLoadingPct: number;
}

// Sprint 3 & 4 Types
export type FaultType = "NORMAL_LOAD" | "PHASE_TO_GROUND_AG" | "PHASE_TO_PHASE_BC" | "THREE_PHASE_ABC";

export interface DistanceRelayZone {
  zoneName: string;
  reachPercentagePct: number;   // Zone 1: 80%, Zone 2: 120%, Zone 3: 150%
  impedanceReachOhm: number;
  operatingTimeMs: number;
  isTriggered: boolean;
}

export interface DistanceRelayConfig {
  tag: string;
  protectedLineName: string;
  lineLengthKm: number;
  lineImpedanceOhmPerKm: number; // e.g. 0.03 + j0.32 Ohm/km
  totalLineImpedanceOhm: number;
  simulatedFaultDistanceKm: number;
  simulatedFaultType: FaultType;
  measuredResistanceR: number;
  measuredReactanceX: number;
  trippedZone: string | null;
  tripCommandIssued: boolean;
  zones: DistanceRelayZone[];
}

export interface SwitchingStep {
  stepNo: number;
  equipmentTag: string;
  actionRequired: "OPEN_BREAKER" | "OPEN_DISCONNECT" | "CLOSE_EARTH_SWITCH" | "CLOSE_BREAKER";
  description: string;
  interlockVerified: boolean;
  isExecuted: boolean;
}

export interface PlnSwitchingOrderSheet {
  orderSheetNo: string;
  dispatchCenter: string;        // PLN UIP2B Jawa Bali - Gandul
  substationName: string;        // GITET 500 kV Ungaran
  targetBay: string;             // Bay 500 kV Mandirancan
  purpose: string;               // Pemeliharaan Tahunan Bay & Uji Tahanan Isolasi
  plannedDate: string;
  dispatcherName: string;
  fieldSupervisorName: string;
  safetyOfficerK3Name: string;
  steps: SwitchingStep[];
}
