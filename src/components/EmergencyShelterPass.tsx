"use client";

import React, { useState } from "react";
import { 
  Printer, 
  X, 
  ShieldAlert, 
  MapPin, 
  Phone, 
  Radio, 
  HeartPulse, 
  Droplet, 
  BatteryCharging,
  FileDown
} from "lucide-react";

interface EmergencyShelterPassProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmergencyShelterPass({ isOpen, onClose }: EmergencyShelterPassProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl border border-cyan-500/40 bg-slate-900 text-slate-100 shadow-2xl p-6 sm:p-8 space-y-6 print:border-none print:shadow-none print:bg-white print:text-black print:p-2">
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Alachua County Emergency Shelter Pass</h2>
              <p className="text-xs text-slate-400">Offline Disaster Survival Card & Medical Oxygen Registry</p>
            </div>
          </div>

          <div className="flex items-center gap-2 relative z-20">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md relative z-20 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF Pass</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors relative z-20 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Pass Body */}
        <div className="space-y-5 print:space-y-4 font-sans text-xs">
          {/* Header Card for Print */}
          <div className="p-4 rounded-xl border border-cyan-800/60 bg-slate-950 print:bg-white print:border-black print:p-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 print:text-black font-bold">
                OFFICIAL ALACHUA COUNTY EMERGENCY MANAGEMENT DIRECTIVE
              </div>
              <h1 className="text-lg font-extrabold text-white print:text-black">
                GAINESVILLE DISASTER SHELTER & LIFE-SUPPORT FIELD PASS
              </h1>
              <p className="text-[11px] text-slate-400 print:text-slate-700">
                Validated during Hurricane / Karst Grid Collapse incidents. Carry this physical card if cellular data and electricity fail.
              </p>
            </div>

            <div className="text-right font-mono text-[10px] text-slate-400 print:text-black">
              <div>Serial: <span className="font-bold text-white print:text-black">GNV-EM-2026</span></div>
              <div>Issue Date: {new Date().toLocaleDateString('en-US')}</div>
            </div>
          </div>

          {/* Active Backup Shelters Table */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-cyan-300 print:text-black flex items-center gap-1.5 font-mono">
              <MapPin className="w-3.5 h-3.5" />
              <span>DESIGNATED LIFELINE COOLING & STORM SHELTERS (WITH ACTIVE BACKUP POWER):</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 print:grid-cols-2 print:gap-2">
              {/* Shands */}
              <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/80 print:border-black print:bg-white space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white print:text-black">1. UF Health Shands Hospital</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 print:border print:text-black font-mono font-bold">LEVEL 1 TRAUMA</span>
                </div>
                <div className="text-slate-400 print:text-slate-800 text-[11px]">1600 SW Archer Rd, Gainesville, FL 32608</div>
                <div className="text-[10px] text-cyan-300 print:text-black font-mono">
                  Capabilities: Ventilators, Dialysis, Surgical ICUs, 4.8 MW Diesel Reserve
                </div>
              </div>

              {/* MLK Center */}
              <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/80 print:border-black print:bg-white space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white print:text-black">2. MLK Jr. Multipurpose Center</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 print:border print:text-black font-mono font-bold">EAST GNV SHELTER</span>
                </div>
                <div className="text-slate-400 print:text-slate-800 text-[11px]">1028 NE 14th St, Gainesville, FL 32601</div>
                <div className="text-[10px] text-cyan-300 print:text-black font-mono">
                  Capabilities: Insulin Preservation, Oxygen Recharge, Evacuee Cots (550 cap)
                </div>
              </div>

              {/* Reitz Union */}
              <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/80 print:border-black print:bg-white space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white print:text-black">3. J. Wayne Reitz Student Union</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 print:border print:text-black font-mono font-bold">RED CROSS PRIMARY</span>
                </div>
                <div className="text-slate-400 print:text-slate-800 text-[11px]">655 Reitz Union Dr, UF Campus, Gainesville, FL 32611</div>
                <div className="text-[10px] text-cyan-300 print:text-black font-mono">
                  Capabilities: General Population (1,250 cap), Mobile Device Charging, Food Hub
                </div>
              </div>

              {/* GRACE Marketplace */}
              <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/80 print:border-black print:bg-white space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white print:text-black">4. GRACE Marketplace</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 print:border print:text-black font-mono font-bold">LOW-BARRIER SHELTER</span>
                </div>
                <div className="text-slate-400 print:text-slate-800 text-[11px]">3055 NE 28th Dr, Gainesville, FL 32609</div>
                <div className="text-[10px] text-cyan-300 print:text-black font-mono">
                  Capabilities: Unhoused Evacuees, Hydration Cistern, Community Dining (450 cap)
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Communications & Water Points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 print:grid-cols-2">
            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950 print:bg-white print:border-black space-y-1.5">
              <div className="font-bold text-amber-300 print:text-black flex items-center gap-1.5 font-mono text-[11px]">
                <Radio className="w-3.5 h-3.5" />
                <span>EMERGENCY AM/FM BROADCAST FREQUENCIES:</span>
              </div>
              <div className="text-[11px] text-slate-300 print:text-slate-800 space-y-0.5 font-mono">
                <div>• WUFT 89.1 FM (Primary Alachua EOC Broadcaster)</div>
                <div>• WRUF 103.7 FM (ESPN Gainesville Emergency Alert)</div>
                <div>• NOAA Weather Radio: 162.475 MHz (Gainesville Transmitter)</div>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950 print:bg-white print:border-black space-y-1.5">
              <div className="font-bold text-blue-300 print:text-black flex items-center gap-1.5 font-mono text-[11px]">
                <Droplet className="w-3.5 h-3.5" />
                <span>POTABLE WATER & MEDICAL ICE DISTRIBUTION:</span>
              </div>
              <div className="text-[11px] text-slate-300 print:text-slate-800 space-y-0.5 font-mono">
                <div>• Depot Park Pavilion (874 SE 4th St) — 10-gal/household max</div>
                <div>• Fred Cone Park (2801 E University Ave) — Ice & potable tanks</div>
                <div>• Oaks Mall Staging Area (6419 W Newberry Rd) — FEMA Point of Pod</div>
              </div>
            </div>
          </div>

          {/* Life-Support Attestation Box */}
          <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40 print:border-black print:bg-white text-[10.5px] text-slate-300 print:text-black font-mono">
            <span className="font-bold text-cyan-300 print:text-black">EMERGENCY ADMISSION INSTRUCTION:</span> Present this physical card at any designated shelter staging checkpoint for expedited medical oxygen intake, pediatric cooling triage, or priority emergency refrigeration access.
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-[10px] text-slate-500 print:text-black font-mono">
          <span>Gainesville Regional Utilities & Alachua County Division of Emergency Management</span>
          <span>CityCamp GNV Civic Resilience Directive</span>
        </div>
      </div>
    </div>
  );
}
