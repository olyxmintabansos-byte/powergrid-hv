export type BreakerStatus = "CLOSED_ENERGIZED" | "OPEN_ISOLATED" | "TRIPPED_FAULT";
export type DisconnectStatus = "CLOSED" | "OPEN";

export interface SubstationBay {
  id: string;
  name: string;
  nominalVoltageKv: number;
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
  ratedPowerMva: number;
  primaryVoltageKv: number;
  secondaryVoltageKv: number;
  topOilTempC: number;
  windingHotSpotTempC: number;
  currentLoadMva: number;
  loadPercentagePct: number;
  coolingBanksRunning: number;
  oltcCurrentTap: number;
  buchholzRelayStatus: "NORMAL" | "GAS_ALARM" | "SURGE_TRIP";
  dissolvedGasesPpm: {
    hydrogenH2: number;
    methaneCh4: number;
    acetyleneC2h2: number;
    ethyleneC2h4: number;
    ethaneC2h6: number;
    carbonMonoxideCo: number;
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
