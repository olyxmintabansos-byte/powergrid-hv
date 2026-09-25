"use client";

import React, { useEffect, useRef } from "react";

interface GridWaveformCanvasProps {
  frequencyHz: number;
  voltageKv: number;
  isFaultTripped: boolean;
}

export const GridWaveformCanvas: React.FC<GridWaveformCanvasProps> = ({
  frequencyHz,
  voltageKv,
  isFaultTripped,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 700);
      const height = (canvas.height = 170);

      ctx.clearRect(0, 0, width, height);

      // Substation Oscilloscope Grid
      ctx.strokeStyle = "rgba(6, 182, 212, 0.08)";
      ctx.lineWidth = 1;
      const step = 25;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Center Reference Line
      ctx.strokeStyle = "rgba(148, 163, 184, 0.2)";
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      if (isFaultTripped) {
        // High-frequency transient fault burst flatline
        ctx.strokeStyle = "rgba(239, 68, 68, 0.9)";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let x = 0; x < width; x += 2) {
          const noise = (Math.random() - 0.5) * 6;
          const y = height / 2 + noise;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        ctx.fillStyle = "#ef4444";
        ctx.font = "bold 13px monospace";
        ctx.fillText("BUSBAR PROTECTION TRIP: ZERO SEQUENCE CURRENT OVERCURRENT", width / 2 - 230, height / 2 - 25);
        return;
      }

      // 3-Phase Sinusoidal Waveforms (120° phase shifted)
      phase += (frequencyHz / 50.0) * 0.09;
      const amplitude = Math.min(55, (voltageKv / 500) * 50);

      // Phase R (Red/Rose)
      ctx.beginPath();
      ctx.strokeStyle = "#f43f5e";
      ctx.lineWidth = 2;
      for (let x = 0; x < width; x += 2) {
        const y = height / 2 + Math.sin(x * 0.035 + phase) * amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Phase S (Yellow/Amber) - 120° lag
      ctx.beginPath();
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2;
      for (let x = 0; x < width; x += 2) {
        const y = height / 2 + Math.sin(x * 0.035 + phase + (2 * Math.PI) / 3) * amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Phase T (Cyan/Sky) - 240° lag
      ctx.beginPath();
      ctx.strokeStyle = "#06b6d4";
      ctx.lineWidth = 2;
      for (let x = 0; x < width; x += 2) {
        const y = height / 2 + Math.sin(x * 0.035 + phase + (4 * Math.PI) / 3) * amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Telemetry Overlay
      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px monospace";
      ctx.fillText(
        `3-PHASE AC BUS // FREQ: ${frequencyHz.toFixed(2)} Hz // VOLTAGE: ${voltageKv.toFixed(1)} kV // PHASE LAG: 120.0° // THD: 1.2%`,
        12,
        20
      );

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [frequencyHz, voltageKv, isFaultTripped]);

  return (
    <div className="relative w-full h-[170px] bg-slate-950/80 rounded-xl border border-cyan-900/40 p-2 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute top-2 right-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
          60 FPS 3-PHASE PHASOR RADAR
        </span>
      </div>
    </div>
  );
};
