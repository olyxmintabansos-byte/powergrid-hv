"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  SubstationBay,
  InterbusTransformer,
  GridKPIs,
  BreakerStatus,
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

interface GridContextType {
  bays: SubstationBay[];
  ibt: InterbusTransformer;
  kpis: GridKPIs;
  isBusFaultTripped: boolean;
  toggleBreaker: (bayId: string) => void;
  adjustOltcTap: (delta: number) => void;
  toggleCoolingBank: () => void;
  triggerEmergencyBusTrip: () => void;
  resetGridSystem: () => void;
  resetToDefaults: () => void;
}

const GridContext = createContext<GridContextType | undefined>(undefined);

export const GridProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bays, setBays] = useState<SubstationBay[]>(INITIAL_BAYS);
  const [ibt, setIbt] = useState<InterbusTransformer>(INITIAL_IBT);
  const [isBusFaultTripped, setIsBusFaultTripped] = useState<boolean>(false);

  // Sync from LocalStorage
  useEffect(() => {
    try {
      const savedBays = localStorage.getItem("grid_bays_v1");
      const savedIbt = localStorage.getItem("grid_ibt_v1");
      if (savedBays) setBays(JSON.parse(savedBays));
      if (savedIbt) setIbt(JSON.parse(savedIbt));
    } catch {
      console.warn("Storage sync fallback");
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem("grid_bays_v1", JSON.stringify(bays));
    localStorage.setItem("grid_ibt_v1", JSON.stringify(ibt));
  }, [bays, ibt]);

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

  const resetGridSystem = () => {
    setIsBusFaultTripped(false);
    setBays(INITIAL_BAYS);
    setIbt(INITIAL_IBT);
  };

  const resetToDefaults = () => {
    setBays(INITIAL_BAYS);
    setIbt(INITIAL_IBT);
    setIsBusFaultTripped(false);
    localStorage.removeItem("grid_bays_v1");
    localStorage.removeItem("grid_ibt_v1");
  };

  return (
    <GridContext.Provider
      value={{
        bays,
        ibt,
        kpis,
        isBusFaultTripped,
        toggleBreaker,
        adjustOltcTap,
        toggleCoolingBank,
        triggerEmergencyBusTrip,
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
