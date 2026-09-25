"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  SubstationBay,
  InterbusTransformer,
  GridKPIs,
  BreakerStatus,
  DistanceRelayConfig,
  PlnSwitchingOrderSheet,
  FaultType,
} from "@/types/grid";

const INITIAL_BAYS: SubstationBay[] = [
  {
    id: "BAY-CIRATA-1",
    name: "Bay 500 kV Cirata Hydro Feeder 1",
    nominalVoltageKv: 500,
    circuitBreakerStatus: "CLOSED_ENERGIZED",
    bus1Disconnect: "CLOSED",
    bus2Disconnect: "OPEN",
    lineDisconnect: "CLOSED",
    activePowerMw: 480,
    reactivePowerMvar: 62,
    currentAmpsPhaseR: 568,
    currentAmpsPhaseS: 565,
    currentAmpsPhaseT: 570,
    voltageKv: 504.2,
    powerFactor: 0.98,
    frequencyHz: 50.02,
  },
  {
    id: "BAY-UNGARAN-2",
    name: "Bay 500 kV Ungaran Interconnection 2",
    nominalVoltageKv: 500,
    circuitBreakerStatus: "CLOSED_ENERGIZED",
    bus1Disconnect: "OPEN",
    bus2Disconnect: "CLOSED",
    lineDisconnect: "CLOSED",
    activePowerMw: 750,
    reactivePowerMvar: 110,
    currentAmpsPhaseR: 885,
    currentAmpsPhaseS: 880,
    currentAmpsPhaseT: 888,
    voltageKv: 502.8,
    powerFactor: 0.97,
    frequencyHz: 50.01,
  },
  {
    id: "BAY-MANDIRANCAN",
    name: "Bay 500 kV Mandirancan Trunkline",
    nominalVoltageKv: 500,
    circuitBreakerStatus: "CLOSED_ENERGIZED",
    bus1Disconnect: "CLOSED",
    bus2Disconnect: "CLOSED",
    lineDisconnect: "CLOSED",
    activePowerMw: 620,
    reactivePowerMvar: 85,
    currentAmpsPhaseR: 730,
    currentAmpsPhaseS: 734,
    currentAmpsPhaseT: 728,
    voltageKv: 503.5,
    powerFactor: 0.98,
    frequencyHz: 50.03,
  },
  {
    id: "BAY-IBT-500",
    name: "Bay 500/150 kV Interbus Transformer 1",
    nominalVoltageKv: 500,
    circuitBreakerStatus: "CLOSED_ENERGIZED",
    bus1Disconnect: "CLOSED",
    bus2Disconnect: "OPEN",
    lineDisconnect: "CLOSED",
    activePowerMw: 410,
    reactivePowerMvar: 48,
    currentAmpsPhaseR: 485,
    currentAmpsPhaseS: 482,
    currentAmpsPhaseT: 488,
    voltageKv: 501.0,
    powerFactor: 0.99,
    frequencyHz: 50.02,
  },
];

const INITIAL_IBT: InterbusTransformer = {
  tag: "IBT-1 500/150 kV 500 MVA",
  ratedPowerMva: 500,
  primaryVoltageKv: 500,
  secondaryVoltageKv: 150,
  topOilTempC: 62.4,
  windingHotSpotTempC: 78.8,
  currentLoadMva: 412.8,
  loadPercentagePct: 82.6,
  coolingBanksRunning: 3,
  oltcCurrentTap: 2,
  buchholzRelayStatus: "NORMAL",
  dissolvedGasesPpm: {
    hydrogenH2: 32,
    methaneCh4: 45,
    acetyleneC2h2: 0.2,
    ethyleneC2h4: 18,
    ethaneC2h6: 24,
    carbonMonoxideCo: 180,
  },
};

const INITIAL_RELAY: DistanceRelayConfig = {
  tag: "SEL-421 NUMERICAL DISTANCE RELAY",
  protectedLineName: "500 kV Mandirancan - Ungaran Ckt 1",
  lineLengthKm: 180,
  lineImpedanceOhmPerKm: 0.32,
  totalLineImpedanceOhm: 57.6,
  simulatedFaultDistanceKm: 45,
  simulatedFaultType: "NORMAL_LOAD",
  measuredResistanceR: 42.5,
  measuredReactanceX: 68.2,
  trippedZone: null,
  tripCommandIssued: false,
  zones: [
    { zoneName: "Zone 1 (Instantaneous 80%)", reachPercentagePct: 80, impedanceReachOhm: 46.08, operatingTimeMs: 20, isTriggered: false },
    { zoneName: "Zone 2 (Overreach 120%)", reachPercentagePct: 120, impedanceReachOhm: 69.12, operatingTimeMs: 300, isTriggered: false },
    { zoneName: "Zone 3 (Remote Backup 150%)", reachPercentagePct: 150, impedanceReachOhm: 86.40, operatingTimeMs: 800, isTriggered: false },
  ],
};

const INITIAL_SWITCHING_SHEET: PlnSwitchingOrderSheet = {
  orderSheetNo: "ROMJ/PLN-UIP2B/UNG/2026/09/042",
  dispatchCenter: "PLN UIP2B JAWA-BALI (GANDUL DISPATCH CENTER)",
  substationName: "GITET 500 kV UNGARAN",
  targetBay: "BAY 500 kV MANDIRANCAN (LINE 1)",
  purpose: "PEMBEBASAN TEGANGAN UNTUK PEMELIHARAAN PREVENTIF BAY & SIKLUS PMT",
  plannedDate: "25 SEPTEMBER 2026",
  dispatcherName: "Ir. Doni Prasetyo (Senior Dispatcher Gandul)",
  fieldSupervisorName: "Bambang Sudarsono, ST (Supervisor Gardu Induk Ungaran)",
  safetyOfficerK3Name: "Agus Wibowo, SKM (Ahli K3 Listrik PLN)",
  steps: [
    {
      stepNo: 1,
      equipmentTag: "52-MND-1 (Circuit Breaker)",
      actionRequired: "OPEN_BREAKER",
      description: "Buka Pemutus Tenaga (PMT) 500 kV Bay Mandirancan. Pastikan arus beban 0 A.",
      interlockVerified: true,
      isExecuted: false,
    },
    {
      stepNo: 2,
      equipmentTag: "89-MND-B1 (Bus Disconnect)",
      actionRequired: "OPEN_DISCONNECT",
      description: "Buka Pemisah (PMS) Busbar 1 Bay Mandirancan setelah PMT terbuka sempurna.",
      interlockVerified: true,
      isExecuted: false,
    },
    {
      stepNo: 3,
      equipmentTag: "89-MND-L (Line Disconnect)",
      actionRequired: "OPEN_DISCONNECT",
      description: "Buka Pemisah (PMS) Saluran Transmisi ke arah GITET Mandirancan.",
      interlockVerified: true,
      isExecuted: false,
    },
    {
      stepNo: 4,
      equipmentTag: "89-MND-ES (Ground Switch)",
      actionRequired: "CLOSE_EARTH_SWITCH",
      description: "Tutup Pemisah Tanah (PMS Tanah / ES) untuk membuang muatan induksi kapasitif line.",
      interlockVerified: true,
      isExecuted: false,
    },
  ],
};

interface GridContextType {
  bays: SubstationBay[];
  ibt: InterbusTransformer;
  kpis: GridKPIs;
  isBusFaultTripped: boolean;
  relay: DistanceRelayConfig;
  switchingSheet: PlnSwitchingOrderSheet;
  toggleBreaker: (bayId: string) => void;
  adjustOltcTap: (delta: number) => void;
  toggleCoolingBank: () => void;
  triggerEmergencyBusTrip: () => void;
  simulateFaultAtDistance: (distanceKm: number, fault: FaultType) => void;
  clearRelayTrip: () => void;
  executeSwitchingStep: (stepNo: number) => void;
  resetGridSystem: () => void;
  resetToDefaults: () => void;
}

const GridContext = createContext<GridContextType | undefined>(undefined);

export const GridProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bays, setBays] = useState<SubstationBay[]>(INITIAL_BAYS);
  const [ibt, setIbt] = useState<InterbusTransformer>(INITIAL_IBT);
  const [isBusFaultTripped, setIsBusFaultTripped] = useState<boolean>(false);
  const [relay, setRelay] = useState<DistanceRelayConfig>(INITIAL_RELAY);
  const [switchingSheet, setSwitchingSheet] = useState<PlnSwitchingOrderSheet>(INITIAL_SWITCHING_SHEET);

  // Sync from LocalStorage
  useEffect(() => {
    try {
      const savedBays = localStorage.getItem("grid_bays_v1");
      const savedIbt = localStorage.getItem("grid_ibt_v1");
      const savedRelay = localStorage.getItem("grid_relay_v1");
      const savedSheet = localStorage.getItem("grid_sheet_v1");
      if (savedBays) setBays(JSON.parse(savedBays));
      if (savedIbt) setIbt(JSON.parse(savedIbt));
      if (savedRelay) setRelay(JSON.parse(savedRelay));
      if (savedSheet) setSwitchingSheet(JSON.parse(savedSheet));
    } catch {
      console.warn("Storage sync fallback");
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem("grid_bays_v1", JSON.stringify(bays));
    localStorage.setItem("grid_ibt_v1", JSON.stringify(ibt));
    localStorage.setItem("grid_relay_v1", JSON.stringify(relay));
    localStorage.setItem("grid_sheet_v1", JSON.stringify(switchingSheet));
  }, [bays, ibt, relay, switchingSheet]);

  // Recalculate Grid KPIs
  const activeBays = isBusFaultTripped ? [] : bays.filter((b) => b.circuitBreakerStatus === "CLOSED_ENERGIZED");
  const totalMw = activeBays.reduce((acc, b) => acc + b.activePowerMw, 0);
  const totalMvar = activeBays.reduce((acc, b) => acc + b.reactivePowerMvar, 0);
  const avgFreq = activeBays.length > 0 ? activeBays.reduce((acc, b) => acc + b.frequencyHz, 0) / activeBays.length : 50.0;
  const avgVolt = activeBays.length > 0 ? activeBays.reduce((acc, b) => acc + b.voltageKv, 0) / activeBays.length : 0.0;

  const kpis: GridKPIs = {
    totalGridThroughputMw: totalMw,
    totalReactivePowerMvar: totalMvar,
    averageGridFrequencyHz: parseFloat(avgFreq.toFixed(2)),
    averageSystemVoltageKv: parseFloat(avgVolt.toFixed(1)),
    systemPowerFactor: 0.98,
    totalActiveBaysCount: activeBays.length,
    trippedBaysCount: isBusFaultTripped ? bays.length : bays.length - activeBays.length,
    transformerLoadingPct: isBusFaultTripped ? 0 : ibt.loadPercentagePct,
  };

  const toggleBreaker = (bayId: string) => {
    if (isBusFaultTripped) return;
    setBays((prev) =>
      prev.map((bay) => {
        if (bay.id === bayId) {
          const isClosed = bay.circuitBreakerStatus === "CLOSED_ENERGIZED";
          const newStatus: BreakerStatus = isClosed ? "OPEN_ISOLATED" : "CLOSED_ENERGIZED";
          return {
            ...bay,
            circuitBreakerStatus: newStatus,
            activePowerMw: newStatus === "CLOSED_ENERGIZED" ? 520 : 0,
            reactivePowerMvar: newStatus === "CLOSED_ENERGIZED" ? 65 : 0,
            currentAmpsPhaseR: newStatus === "CLOSED_ENERGIZED" ? 610 : 0,
          };
        }
        return bay;
      })
    );
  };

  const adjustOltcTap = (delta: number) => {
    setIbt((prev) => {
      const nextTap = Math.max(-16, Math.min(16, prev.oltcCurrentTap + delta));
      const voltAdjust = 150 + nextTap * 1.25;
      return {
        ...prev,
        oltcCurrentTap: nextTap,
        secondaryVoltageKv: parseFloat(voltAdjust.toFixed(1)),
      };
    });
  };

  const toggleCoolingBank = () => {
    setIbt((prev) => ({
      ...prev,
      coolingBanksRunning: prev.coolingBanksRunning >= 4 ? 1 : prev.coolingBanksRunning + 1,
      topOilTempC: prev.coolingBanksRunning >= 4 ? 68.2 : 59.4,
    }));
  };

  const triggerEmergencyBusTrip = () => {
    setIsBusFaultTripped(true);
    setBays((prev) =>
      prev.map((b) => ({
        ...b,
        circuitBreakerStatus: "TRIPPED_FAULT",
        activePowerMw: 0,
        reactivePowerMvar: 0,
      }))
    );
  };

  // Sprint 3: Numerical Distance Relay Logic
  const simulateFaultAtDistance = (distanceKm: number, fault: FaultType) => {
    if (fault === "NORMAL_LOAD") {
      setRelay((prev) => ({
        ...prev,
        simulatedFaultDistanceKm: distanceKm,
        simulatedFaultType: "NORMAL_LOAD",
        measuredResistanceR: 42.5,
        measuredReactanceX: 68.2,
        trippedZone: null,
        tripCommandIssued: false,
        zones: prev.zones.map((z) => ({ ...z, isTriggered: false })),
      }));
      return;
    }

    // Fault calculations: Z = distanceKm * 0.32 Ohm/km
    const faultZ = distanceKm * 0.32;
    const r = parseFloat((faultZ * 0.15).toFixed(2));
    const x = parseFloat((faultZ * 0.98).toFixed(2));

    let triggered: string | null = null;
    let zone1 = false;
    let zone2 = false;
    let zone3 = false;

    if (faultZ <= 46.08) {
      triggered = "ZONE 1 (INSTANT TRIP 20ms)";
      zone1 = true;
    } else if (faultZ <= 69.12) {
      triggered = "ZONE 2 (TIME DELAY 300ms)";
      zone2 = true;
    } else if (faultZ <= 86.40) {
      triggered = "ZONE 3 (BACKUP 800ms)";
      zone3 = true;
    }

    setRelay((prev) => ({
      ...prev,
      simulatedFaultDistanceKm: distanceKm,
      simulatedFaultType: fault,
      measuredResistanceR: r,
      measuredReactanceX: x,
      trippedZone: triggered,
      tripCommandIssued: triggered !== null,
      zones: [
        { ...prev.zones[0], isTriggered: zone1 },
        { ...prev.zones[1], isTriggered: zone2 },
        { ...prev.zones[2], isTriggered: zone3 },
      ],
    }));

    // If trip commanded, trip the Mandirancan Bay CB
    if (triggered) {
      setBays((prev) =>
        prev.map((b) =>
          b.id === "BAY-MANDIRANCAN"
            ? { ...b, circuitBreakerStatus: "TRIPPED_FAULT", activePowerMw: 0 }
            : b
        )
      );
    }
  };

  const clearRelayTrip = () => {
    simulateFaultAtDistance(45, "NORMAL_LOAD");
  };

  // Sprint 4: Switching Order Step Execution
  const executeSwitchingStep = (stepNo: number) => {
    setSwitchingSheet((prev) => ({
      ...prev,
      steps: prev.steps.map((s) => (s.stepNo === stepNo ? { ...s, isExecuted: true } : s)),
    }));
  };

  const resetGridSystem = () => {
    setIsBusFaultTripped(false);
    setBays(INITIAL_BAYS);
    setIbt(INITIAL_IBT);
    setRelay(INITIAL_RELAY);
    setSwitchingSheet(INITIAL_SWITCHING_SHEET);
  };

  const resetToDefaults = () => {
    setBays(INITIAL_BAYS);
    setIbt(INITIAL_IBT);
    setRelay(INITIAL_RELAY);
    setSwitchingSheet(INITIAL_SWITCHING_SHEET);
    setIsBusFaultTripped(false);
    localStorage.clear();
  };

  return (
    <GridContext.Provider
      value={{
        bays,
        ibt,
        kpis,
        isBusFaultTripped,
        relay,
        switchingSheet,
        toggleBreaker,
        adjustOltcTap,
        toggleCoolingBank,
        triggerEmergencyBusTrip,
        simulateFaultAtDistance,
        clearRelayTrip,
        executeSwitchingStep,
        resetGridSystem,
        resetToDefaults,
      }}
    >
      {children}
    </GridContext.Provider>
  );
};

export const useGrid = () => {
  const context = useContext(GridContext);
  if (!context) throw new Error("useGrid must be used within GridProvider");
  return context;
};
