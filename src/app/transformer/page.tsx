"use client";

import React from "react";
import { useGrid } from "@/context/GridContext";
import { formatNumber } from "@/lib/utils";
import {
  Layers,
  Thermometer,
  Wind,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Activity,
} from "lucide-react";

export default function TransformerPage() {
  const { ibt, adjustOltcTap, toggleCoolingBank } = useGrid();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            Interbus Transformer (IBT) 500/150 kV 500 MVA Diagnostic Desk
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            {ibt.tag} // On-Load Tap Changer (OLTC) // Dissolved Gas Analysis (DGA) Duval Triangle
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => adjustOltcTap(1)}
            className="px-3 py-1.5 rounded bg-cyan-950 border border-cyan-700/50 text-cyan-300 text-xs font-mono hover:bg-cyan-900 transition-all cursor-pointer"
          >
            TAP +1 (RAISE)
          </button>
          <button
            onClick={() => adjustOltcTap(-1)}
            className="px-3 py-1.5 rounded bg-cyan-950 border border-cyan-700/50 text-cyan-300 text-xs font-mono hover:bg-cyan-900 transition-all cursor-pointer"
          >
            TAP -1 (LOWER)
          </button>
          <button
            onClick={toggleCoolingBank}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono hover:bg-slate-700 transition-all cursor-pointer"
          >
            <Wind className="w-3.5 h-3.5 text-cyan-400" /> COOLING FAN {ibt.coolingBanksRunning}/4
          </button>
        </div>
      </div>

      {/* Transformer Thermal & Load Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-900/40 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span>WINDING HOT-SPOT</span>
            <Thermometer className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">{ibt.windingHotSpotTempC} °C</p>
          <p className="text-[10px] text-slate-500">IEEE C57.91 Limit: &lt; 110 °C</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-900/40 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span>TOP-OIL TEMP</span>
            <Thermometer className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">{ibt.topOilTempC} °C</p>
          <p className="text-[10px] text-slate-500">Alarm Threshold: &gt; 85 °C</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-900/40 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span>MVA LOADING</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-cyan-400 mt-2">{formatNumber(ibt.currentLoadMva, 1)} MVA</p>
          <p className="text-[10px] text-slate-500">{ibt.loadPercentagePct}% of 500 MVA Rated</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-900/40 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span>OLTC TAP POSITION</span>
            <Sliders className="w-4 h-4 text-slate-300" />
          </div>
          <p className="text-2xl font-bold text-slate-100 mt-2">
            TAP {ibt.oltcCurrentTap > 0 ? `+${ibt.oltcCurrentTap}` : ibt.oltcCurrentTap}
          </p>
          <p className="text-[10px] text-slate-500">150 kV Bus: {ibt.secondaryVoltageKv} kV</p>
        </div>
      </div>

      {/* DGA Dissolved Gas Analysis Studio */}
      <div className="p-6 rounded-xl bg-slate-900/80 border border-cyan-900/40 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-mono font-bold text-sm text-slate-100">
                Dissolved Gas Analysis (DGA) - IEC 60599 / Duval Triangle Diagnostic
              </h3>
              <p className="text-xs text-slate-400">
                Konsentrasi gas terlarut dalam minyak trafo (mineral oil) untuk deteksi pelepasan busur api dan degradasi termal
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded bg-emerald-950 border border-emerald-600/40 text-emerald-300 font-mono text-xs font-bold">
            CONDITION 1: NORMAL
          </span>
        </div>

        {/* Gas PPM Breakdown Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Hydrogen (H2):</span>
              <span className="font-bold text-cyan-400">{ibt.dissolvedGasesPpm.hydrogenH2} ppm</span>
            </div>
            <p className="text-[10px] text-slate-500">Corona Partial Discharge Limit: 100 ppm</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Methane (CH4):</span>
              <span className="font-bold text-amber-400">{ibt.dissolvedGasesPpm.methaneCh4} ppm</span>
            </div>
            <p className="text-[10px] text-slate-500">Low Temp Thermal Fault Limit: 120 ppm</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Acetylene (C2H2):</span>
              <span className="font-bold text-emerald-400">{ibt.dissolvedGasesPpm.acetyleneC2h2} ppm</span>
            </div>
            <p className="text-[10px] text-slate-500">Critical High-Energy Arcing Limit: 1.0 ppm</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Ethylene (C2H4):</span>
              <span className="font-bold text-slate-200">{ibt.dissolvedGasesPpm.ethyleneC2h4} ppm</span>
            </div>
            <p className="text-[10px] text-slate-500">Overheating Oil Limit: 50 ppm</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Ethane (C2H6):</span>
              <span className="font-bold text-slate-200">{ibt.dissolvedGasesPpm.ethaneC2h6} ppm</span>
            </div>
            <p className="text-[10px] text-slate-500">Moderate Thermal Fault Limit: 65 ppm</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Carbon Monoxide (CO):</span>
              <span className="font-bold text-slate-200">{ibt.dissolvedGasesPpm.carbonMonoxideCo} ppm</span>
            </div>
            <p className="text-[10px] text-slate-500">Paper Insulation Aging Limit: 350 ppm</p>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs font-mono text-slate-300">
          <strong>Buchholz Relay &amp; Pressure Relief:</strong> Status <strong>NORMAL ARMED</strong>. Oil dielectric breakdown voltage: 72.5 kV / 2.5mm gap (ASTM D877 Compliant).
        </div>
      </div>
    </div>
  );
}
