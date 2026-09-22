"use client";

import React, { useState, useEffect } from "react";
import { 
  Zap, 
  ShieldAlert, 
  Activity, 
  MapPin, 
  Cpu, 
  Layers, 
  AlertTriangle,
  Printer,
  FileText
} from "lucide-react";

interface HeaderProps {
  onOpenShelterPass?: () => void;
}

export default function Header({ onOpenShelterPass }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [alertBlink, setAlertBlink] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }) + " EST"
      );
    };
    update();
    const interval = setInterval(update, 1000);
    const blinkInterval = setInterval(() => setAlertBlink((b) => !b), 1200);
    return () => {
      clearInterval(interval);
      clearInterval(blinkInterval);
    };
  }, []);

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Identity */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400/20 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                  GridAegis <span className="text-cyan-400 font-mono">GNV</span>
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                  Civic V2.4
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Alachua County Energy Burden & Karst Resilient Grid Telemetry
              </p>
            </div>
          </div>

          {/* Real-time Civic Telemetry Badges & Emergency Shelter Pass Trigger */}
          <div className="flex items-center gap-3 text-xs font-mono">
            {/* Feature 2: Offline Emergency Shelter Pass Trigger Button */}
            {onOpenShelterPass && (
              <button
                onClick={onOpenShelterPass}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600/30 to-emerald-600/30 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 hover:text-white font-bold transition-all shadow-sm relative z-20 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Offline Shelter Pass</span>
                <span className="sm:hidden">Shelter Pass</span>
              </button>
            )}

            {/* GRU Grid Status */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400">GRU Load:</span>
              <span className="text-emerald-400 font-semibold">348 MW / 410 MW</span>
            </div>

            {/* East Gainesville Crisis Alert */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-800/50">
              <span className={`w-2 h-2 rounded-full bg-rose-500 ${alertBlink ? "opacity-100" : "opacity-30"}`} />
              <span className="text-rose-300 font-semibold">East GNV: 14.8%</span>
            </div>

            {/* Clock */}
            <div className="text-slate-400 bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-800 hidden md:block">
              {currentTime || "00:00:00 EST"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
