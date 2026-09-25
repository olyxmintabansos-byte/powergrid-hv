"use client";

import React from "react";
import { useGrid } from "@/context/GridContext";
import { FaultType } from "@/types/grid";
import {
  Activity,
  RotateCcw,
  ShieldAlert,
  Sliders,
  Zap,
} from "lucide-react";

export default function DistanceRelayPage() {
  const { relay, simulateFaultAtDistance, clearRelayTrip } = useGrid();

  const faultOptions: { label: string; value: FaultType }[] = [
    { label: "Normal Load (No Fault)", value: "NORMAL_LOAD" },
    { label: "1-Phase to Ground (A-G)", value: "PHASE_TO_GROUND_AG" },
    { label: "2-Phase Short Circuit (B-C)", value: "PHASE_TO_PHASE_BC" },
    { label: "3-Phase Bolted Fault (A-B-C)", value: "THREE_PHASE_ABC" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            Numerical Distance Protection Relay (ANSI 21) &amp; R-X Impedance Plane
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            {relay.tag} // {relay.protectedLineName} ({relay.lineLengthKm} km)
          </p>
        </div>

        <button
          onClick={clearRelayTrip}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono hover:bg-slate-700 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> RESET RELAY TRIP
        </button>
      </div>

      {/* Relay Trip Alert Banner */}
      {relay.tripCommandIssued && (
        <div className="p-4 rounded-xl bg-rose-950/90 border-2 border-rose-600 text-rose-200 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-rose-400 flex-shrink-0" />
            <div>
              <h3 className="font-mono font-bold text-sm uppercase tracking-wider text-rose-100">
                ANSI 21 TRIP ISSUED: {relay.trippedZone}
              </h3>
              <p className="text-xs text-rose-300 font-mono mt-0.5">
                Impedansi terukur Z = {relay.measuredResistanceR} + j{relay.measuredReactanceX} Ω jatuh di dalam karakteristik relay mho. Sinyal TRIP dikirim ke PMT Bay Mandirancan.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded bg-rose-900 font-mono text-xs font-bold uppercase text-white">
            CB TRIP OPEN
          </span>
        </div>
      )}

      {/* Fault Injection Simulator Controls */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-cyan-900/40 space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-200 uppercase">
              Transmission Line Fault Injection Simulator
            </span>
          </div>
          <span className="text-slate-400">Total Impedance: {relay.totalLineImpedanceOhm} Ω</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Fault Distance from Substation:</span>
              <span className="font-bold text-amber-400">{relay.simulatedFaultDistanceKm} km ({((relay.simulatedFaultDistanceKm / relay.lineLengthKm) * 100).toFixed(0)}% Line)</span>
            </div>
            <input
              type="range"
              min="5"
              max="240"
              step="5"
              value={relay.simulatedFaultDistanceKm}
              onChange={(e) => simulateFaultAtDistance(parseInt(e.target.value), relay.simulatedFaultType)}
              className="w-full accent-amber-400 bg-slate-800 h-2 rounded cursor-pointer"
            />
          </div>

          <div>
            <span className="text-slate-300 block mb-1">Simulated Fault Type:</span>
            <select
              value={relay.simulatedFaultType}
              onChange={(e) => simulateFaultAtDistance(relay.simulatedFaultDistanceKm, e.target.value as FaultType)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {faultOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* R-X Impedance Plane & Zone Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Measured Impedance Values */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-cyan-900/40 space-y-4 font-mono text-xs">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-slate-200">Apparent Impedance Vector</h3>
          </div>

          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Resistance (R):</span>
              <span className="font-bold text-amber-400 text-sm">{relay.measuredResistanceR} Ω</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Reactance (X):</span>
              <span className="font-bold text-cyan-400 text-sm">{relay.measuredReactanceX} Ω</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-800">
              <span className="text-slate-400">Magnitude |Z|:</span>
              <span className="font-bold text-slate-100 text-sm">
                {Math.sqrt(relay.measuredResistanceR ** 2 + relay.measuredReactanceX ** 2).toFixed(2)} Ω
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Impedance Angle:</span>
              <span className="font-bold text-emerald-400">
                {(Math.atan2(relay.measuredReactanceX, relay.measuredResistanceR) * (180 / Math.PI)).toFixed(1)}°
              </span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400">
            Karakteristik mho relay beroperasi ketika vektor impedansi terukur berada di dalam lingkaran batas zona jangkauan.
          </div>
        </div>

        {/* 3 Protection Zones */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900/80 border border-cyan-900/40 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-200">Three-Zone Protection Coordination</h3>
            <span className="text-slate-400">IEEE C37.113 Line Protection</span>
          </div>

          <div className="space-y-3">
            {relay.zones.map((zone, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-lg border transition-all ${
                  zone.isTriggered
                    ? "bg-rose-950/30 border-rose-500 text-rose-300"
                    : "bg-slate-950/70 border-slate-800 text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100">{zone.zoneName}</span>
                    <span className="text-[10px] text-slate-400">({zone.reachPercentagePct}% Reach)</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      zone.isTriggered
                        ? "bg-rose-900 text-white animate-pulse"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {zone.isTriggered ? "TRIPPED" : "ARMED"}
                  </span>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                  <div>Reach Threshold: <strong className="text-cyan-400">{zone.impedanceReachOhm} Ω</strong></div>
                  <div>Operating Time: <strong className="text-amber-400">{zone.operatingTimeMs} ms</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
