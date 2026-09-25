"use client";

import React from "react";
import { useGrid } from "@/context/GridContext";
import { GridWaveformCanvas } from "@/components/GridWaveformCanvas";
import { formatNumber } from "@/lib/utils";
import {
  Zap,
  Activity,
  Layers,
  ShieldAlert,
  Power,
  CheckCircle2,
} from "lucide-react";

export default function SubstationSldPage() {
  const { bays, kpis, isBusFaultTripped, toggleBreaker } = useGrid();

  return (
    <div className="space-y-6">
      {isBusFaultTripped && (
        <div className="p-4 rounded-xl bg-rose-950/80 border-2 border-rose-600 text-rose-200 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-rose-400" />
            <div>
              <h2 className="text-base font-bold font-mono uppercase tracking-wide">
                500 kV MAIN BUSBAR 1 DIFFERENTIAL TRIP (ANSI 87B ACTIVE)
              </h2>
              <p className="text-xs text-rose-300">
                Arus hubung singkat terdeteksi. Semua pemutus tenaga (Circuit Breakers) dibuka otomatis untuk melokalisir gangguan.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded bg-rose-900 font-mono text-xs font-bold uppercase">BUSBAR DEAD</span>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-900/40">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Active Power</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-amber-400">{formatNumber(kpis.totalGridThroughputMw, 0)}</span>
            <span className="text-xs font-mono text-slate-400">MW</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 font-mono">Transmission Line Throughput</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-900/40">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>System Frequency</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-emerald-400">{kpis.averageGridFrequencyHz}</span>
            <span className="text-xs font-mono text-slate-400">Hz</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 font-mono">PLN Grid Code: 49.5 - 50.5 Hz</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-900/40">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Busbar Voltage</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-cyan-400">{kpis.averageSystemVoltageKv}</span>
            <span className="text-xs font-mono text-slate-400">kV</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 font-mono">500 kV Nominal Extra High Voltage</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-900/40">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Feeder Bays</span>
            <CheckCircle2 className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-sky-400">{kpis.totalActiveBaysCount} / 4</span>
            <span className="text-xs font-mono text-slate-400">ENERGIZED</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 font-mono">{kpis.trippedBaysCount} Breakers Open / Isolated</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
              500 kV Busbar 3-Phase Sinusoidal Voltage &amp; Current Waveform (60 FPS Telemetry)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Phasors: Phase R (Red), S (Yellow), T (Cyan)</span>
        </div>
        <GridWaveformCanvas frequencyHz={kpis.averageGridFrequencyHz} voltageKv={kpis.averageSystemVoltageKv} isFaultTripped={isBusFaultTripped} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-200">500 kV Substation Bays Single-Line Diagram</h3>
            <p className="text-xs text-slate-400">Operasikan Pemutus Tenaga (CB) dan pantau daya aktif (MW), reaktif (MVAR), arus fasa (A) per bay transmisi</p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 bg-slate-900 border border-cyan-900/40 rounded text-cyan-400">1.5 BREAKER SCHEME SYNOPTIC</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bays.map((bay) => {
            const isClosed = bay.circuitBreakerStatus === "CLOSED_ENERGIZED";
            const isFault = bay.circuitBreakerStatus === "TRIPPED_FAULT";
            return (
              <div key={bay.id} className={`p-5 rounded-xl border transition-all ${isFault ? "bg-rose-950/20 border-rose-600/60" : isClosed ? "bg-slate-900/80 border-cyan-900/40 hover:border-cyan-500/40" : "bg-slate-950/60 border-slate-800 opacity-60"}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-slate-100">{bay.id}</span>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${isFault ? "bg-rose-950 text-rose-300 border border-rose-600" : isClosed ? "bg-emerald-950 text-emerald-300 border border-emerald-600/40" : "bg-slate-800 text-slate-400 border border-slate-700"}`}>
                        {bay.circuitBreakerStatus.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{bay.name}</p>
                  </div>

                  <button onClick={() => toggleBreaker(bay.id)} disabled={isBusFaultTripped} title={isClosed ? "Open Circuit Breaker" : "Close Circuit Breaker"} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-all cursor-pointer disabled:opacity-40 ${isClosed ? "bg-rose-950/80 border-rose-600/60 text-rose-300 hover:bg-rose-900" : "bg-emerald-950 border-emerald-600 text-emerald-300 hover:bg-emerald-900"}`}>
                    <Power className="w-3.5 h-3.5" />
                    {isClosed ? "OPEN CB" : "CLOSE CB"}
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500">ACTIVE MW</span>
                    <p className="font-bold text-amber-400 text-sm">{bay.activePowerMw} MW</p>
                  </div>
                  <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500">REACTIVE MVAR</span>
                    <p className="font-bold text-cyan-400 text-sm">{bay.reactivePowerMvar} MVAR</p>
                  </div>
                  <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500">BUS VOLTAGE</span>
                    <p className="font-bold text-slate-200">{bay.voltageKv} kV</p>
                  </div>
                  <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500">CURRENT IR</span>
                    <p className="font-bold text-emerald-400">{bay.currentAmpsPhaseR} A</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs font-mono py-1.5 border-t border-slate-800/80 text-slate-400">
                  <span>DS1 (Bus 1): <strong className="text-slate-200">{bay.bus1Disconnect}</strong></span>
                  <span>DS2 (Bus 2): <strong className="text-slate-200">{bay.bus2Disconnect}</strong></span>
                  <span>Power Factor: <strong className="text-cyan-400">{bay.powerFactor}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
