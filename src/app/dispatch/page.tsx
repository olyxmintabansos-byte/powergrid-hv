"use client";

import React from "react";
import { useGrid } from "@/context/GridContext";
import confetti from "canvas-confetti";
import {
  FileText,
  Printer,
  ShieldCheck,
} from "lucide-react";

export default function DispatchSwitchingPage() {
  const { switchingSheet, executeSwitchingStep } = useGrid();

  const handlePrint = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar (Hidden on Print) */}
      <div className="no-print flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-cyan-900/40">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            PLN UIP2B Dispatcher Switching Order &amp; Isolation Sheet Studio
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Formulir Rencana Operasi Manuver Jaringan (ROMJ) 500 kV Sesuai Aturan Penyaluran Grid Code PLN
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-all shadow-lg shadow-cyan-600/30 cursor-pointer"
        >
          <Printer className="w-4 h-4" /> CETAK LEMBAR MANUVER A4 (1-CLICK PRINT)
        </button>
      </div>

      {/* Interactive Step Execution Bar (Hidden on Print) */}
      <div className="no-print p-5 rounded-xl bg-slate-900/80 border border-cyan-900/40 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-200 uppercase">
            Live Substation Switching Sequence Executor
          </span>
          <span className="text-slate-400">Interlock Sequence Safety Check</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {switchingSheet.steps.map((step) => (
            <div
              key={step.stepNo}
              className={`p-3 rounded-lg border space-y-2 ${
                step.isExecuted
                  ? "bg-emerald-950/30 border-emerald-600/50 text-emerald-300"
                  : "bg-slate-950 border-slate-800 text-slate-400"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold">LANGKAH {step.stepNo}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800">
                  {step.isExecuted ? "EXECUTED" : "PENDING"}
                </span>
              </div>
              <p className="text-[11px] text-slate-300">{step.equipmentTag}</p>

              <button
                disabled={step.isExecuted}
                onClick={() => executeSwitchingStep(step.stepNo)}
                className="w-full py-1 rounded bg-cyan-950 border border-cyan-700/50 text-cyan-300 hover:bg-cyan-900 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {step.isExecuted ? "SELESAI ✓" : "EKSEKUSI STEP"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Official A4 Document Container */}
      <div className="max-w-[850px] mx-auto bg-white text-slate-900 shadow-2xl rounded-xl p-8 sm:p-12 border border-slate-300 font-sans print:border-none print:shadow-none print:p-0">
        {/* Header PLN UIP2B */}
        <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl">
              PLN
            </div>
            <div>
              <h1 className="text-base font-black tracking-wide text-slate-900 uppercase">
                PT PLN (PERSERO) // UNIT INDUK PUSAT PENGATUR BEBAN (UIP2B) JAWA BALI
              </h1>
              <h2 className="text-xs font-bold text-slate-600 tracking-wider">
                LEMBAR PERINTAH MANUVER PEMBEBASAN TEGANGAN SALURAN TRANSMISI 500 kV
              </h2>
            </div>
          </div>

          <div className="text-right font-mono text-[10px] text-slate-600">
            <p><strong>DOKUMEN:</strong> SOP-P3B-MAN-042</p>
            <p><strong>EDISI:</strong> 2026.09</p>
            <p><strong>STATUS:</strong> RESMI BERLAKU</p>
          </div>
        </div>

        {/* Title */}
        <div className="mt-4 text-center space-y-1">
          <h2 className="text-lg font-black tracking-wider uppercase underline underline-offset-4">
            SURAT PERINTAH MANUVER PEMBEBASAN &amp; PENORMALAN TEGANGAN
          </h2>
          <p className="text-xs font-mono text-slate-600">
            GARDU INDUK TEGANGAN EKSTRA TINGGI (GITET) 500 kV UNGARAN
          </p>
          <div className="inline-block px-3 py-0.5 rounded bg-slate-100 border border-slate-300 text-xs font-mono font-bold mt-1">
            NOMOR LEMBAR: {switchingSheet.orderSheetNo}
          </div>
        </div>

        {/* Operational Context Table */}
        <div className="mt-6 border border-slate-300 rounded-lg overflow-hidden text-xs">
          <table className="w-full border-collapse">
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="w-1/4 p-2.5 bg-slate-50 font-bold text-slate-700">PENGATUR BEBAN:</td>
                <td className="w-1/4 p-2.5 font-mono">{switchingSheet.dispatchCenter}</td>
                <td className="w-1/4 p-2.5 bg-slate-50 font-bold text-slate-700">LOKASI GITET:</td>
                <td className="w-1/4 p-2.5 font-mono">{switchingSheet.substationName}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2.5 bg-slate-50 font-bold text-slate-700">BAY OPERASIONAL:</td>
                <td className="p-2.5 font-mono font-bold text-cyan-800">{switchingSheet.targetBay}</td>
                <td className="p-2.5 bg-slate-50 font-bold text-slate-700">TANGGAL PELAKSANAAN:</td>
                <td className="p-2.5 font-mono">{switchingSheet.plannedDate}</td>
              </tr>
              <tr>
                <td className="p-2.5 bg-slate-50 font-bold text-slate-700">TUJUAN MANUVER:</td>
                <td colSpan={3} className="p-2.5 font-mono">{switchingSheet.purpose}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Switching Steps Table */}
        <div className="mt-6 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            URUTAN MANUVER PEMBEBASAN TEGANGAN (SAFETY INTERLOCK SEQUENCE)
          </h3>

          <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 font-bold text-left text-slate-700">
                  <th className="p-2.5 w-12 text-center">NO</th>
                  <th className="p-2.5 w-40">PERALATAN</th>
                  <th className="p-2.5">DESKRIPSI TINDAKAN &amp; VERIFIKASI K3</th>
                  <th className="p-2.5 w-28 text-center">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {switchingSheet.steps.map((step) => (
                  <tr key={step.stepNo} className={step.isExecuted ? "bg-emerald-50/50" : ""}>
                    <td className="p-2.5 text-center font-bold">{step.stepNo}</td>
                    <td className="p-2.5 font-bold text-slate-800">{step.equipmentTag}</td>
                    <td className="p-2.5 font-sans">{step.description}</td>
                    <td className="p-2.5 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          step.isExecuted
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {step.isExecuted ? "TERLAKSANA ✓" : "MENUNGGU"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* K3 Statement */}
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-[11px] text-slate-700 leading-relaxed font-sans">
          <strong>PERNYATAAN K3 LISTRIK (GOLDEN RULES PLN):</strong> Semua pekerjaan wajib mematuhi 5 Langkah Keselamatan Bebas Tegangan: (1) Putuskan hubungan dari semua sumber tegangan, (2) Kunci sakelar dengan Lockout-Tagout (LOTO), (3) Pastikan ketiadaan tegangan dengan Voltage Detector 500 kV, (4) Pasang pentanahan lokal (Grounding), dan (5) Pasang rambu pembatas area kerja aman.
        </div>

        {/* 3-Party Signatures Block */}
        <div className="mt-8 pt-4 border-t border-slate-300 grid grid-cols-3 gap-6 text-center text-xs font-sans">
          <div className="space-y-2">
            <p className="font-bold text-slate-700">DISPATCHER SENIOR UIP2B</p>
            <p className="text-[10px] text-slate-500 font-mono">Pemberi Perintah Manuver</p>
            <div className="h-16 flex items-center justify-center">
              <span className="font-serif italic text-base text-cyan-900 border-b border-dotted border-slate-400 px-4">
                Doni Prasetyo
              </span>
            </div>
            <p className="font-bold text-slate-900 font-mono text-[11px]">{switchingSheet.dispatcherName}</p>
            <p className="text-[9px] text-slate-400 font-mono">NIP: 82041209-Z</p>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-slate-700">SUPERVISOR GITET 500 kV</p>
            <p className="text-[10px] text-slate-500 font-mono">Pelaksana Lapangan Manuver</p>
            <div className="h-16 flex items-center justify-center">
              <span className="font-serif italic text-base text-amber-900 border-b border-dotted border-slate-400 px-4">
                Bambang Sudarsono
              </span>
            </div>
            <p className="font-bold text-slate-900 font-mono text-[11px]">{switchingSheet.fieldSupervisorName}</p>
            <p className="text-[9px] text-slate-400 font-mono">NIP: 85112003-P</p>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-slate-700">PENGAWAS K3 LISTRIK</p>
            <p className="text-[10px] text-slate-500 font-mono">Verifikator Golden Rules</p>
            <div className="h-16 flex items-center justify-center">
              <span className="font-serif italic text-base text-emerald-900 border-b border-dotted border-slate-400 px-4">
                Agus Wibowo
              </span>
            </div>
            <p className="font-bold text-slate-900 font-mono text-[11px]">{switchingSheet.safetyOfficerK3Name}</p>
            <p className="text-[9px] text-slate-400 font-mono">SERT: K3-DISNAKER-4482</p>
          </div>
        </div>

        {/* Verification Seal */}
        <div className="mt-8 pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-600" />
            <span>TERVERIFIKASI SISTEM SCADA PLN DISPATCH GANDUL // DIGI-SEAL: PLN-UIP2B-UNG-042-88FA</span>
          </div>
          <span>TIMESTAMP: 25-SEP-2026 13:30 UTC+8</span>
        </div>
      </div>
    </div>
  );
}
