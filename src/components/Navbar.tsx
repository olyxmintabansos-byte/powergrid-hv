"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGrid } from "@/context/GridContext";
import { formatNumber } from "@/lib/utils";
import {
  Zap,
  Activity,
  Layers,
  FileText,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { kpis, isBusFaultTripped, triggerEmergencyBusTrip, resetGridSystem } = useGrid();

  const navItems = [
    { label: "Substation SLD", href: "/", icon: Zap },
    { label: "IBT Transformer", href: "/transformer/", icon: Layers },
    { label: "Distance Relay", href: "/relay/", icon: Activity },
    { label: "PLN Switching A4", href: "/dispatch/", icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/90 backdrop-blur-md border-b border-cyan-900/40 text-slate-100">
      {/* Top SCADA Grid Frequency Strip */}
      <div className="hidden md:flex items-center justify-between px-6 py-1.5 bg-slate-900/80 border-b border-cyan-950 text-xs font-mono">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-slate-400">PLN P3B JAVA-BALI GRID:</span>
            <span className="text-cyan-300 font-bold">GITET 500 kV UNGARAN</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">GRID FREQ:</span>
            <span className="text-emerald-400 font-bold">{kpis.averageGridFrequencyHz} Hz</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">TOTAL LOAD:</span>
            <span className="text-amber-400 font-bold">{formatNumber(kpis.totalGridThroughputMw, 0)} MW</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">REACTIVE:</span>
            <span className="text-cyan-400 font-bold">{formatNumber(kpis.totalReactivePowerMvar, 0)} MVAR</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">POWER FACTOR:</span>
            <span className="text-slate-200 font-bold">cosφ {kpis.systemPowerFactor}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isBusFaultTripped ? (
            <button
              onClick={resetGridSystem}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-950 border border-emerald-500 text-emerald-300 text-[11px] font-bold uppercase hover:bg-emerald-900 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> RESET BUS FAULT
            </button>
          ) : (
            <button
              onClick={triggerEmergencyBusTrip}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-rose-950/80 border border-rose-600 text-rose-300 text-[11px] font-bold uppercase hover:bg-rose-900 transition-all cursor-pointer animate-pulse"
            >
              <ShieldAlert className="w-3 h-3 text-rose-400" /> TRIP 500 kV BUS 1
            </button>
          )}

          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
              isBusFaultTripped
                ? "bg-rose-900/60 text-rose-300 border border-rose-500"
                : "bg-emerald-950/60 text-emerald-300 border border-emerald-500/40"
            }`}
          >
            {isBusFaultTripped ? (
              <>
                <ShieldAlert className="w-3.5 h-3.5" /> BUSBAR TRIPPED
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5" /> GRID ENERGIZED
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
            <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-wider text-slate-100">POWERGRID</span>
              <span className="px-1.5 py-0.2 text-[10px] font-mono bg-cyan-950 text-cyan-400 rounded border border-cyan-800">
                500 kV HV
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400">High-Voltage Substation SCADA &amp; IBT Transformer ERP</p>
          </div>
        </div>

        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm shadow-cyan-500/10"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
