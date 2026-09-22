"use client";

import React, { useState, useMemo } from "react";
import { GAINESVILLE_SHELTER_PROFILES } from "@/data/shelterProfiles";
import { ShelterLifeSupportProfile } from "@/lib/types";
import { solveShelterMicrogrid } from "@/lib/microgridSolver";
import { 
  BatteryCharging, 
  Sun, 
  ShieldCheck, 
  DollarSign, 
  Zap, 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  Sliders, 
  Layers,
  ThermometerSnowflake,
  Cpu,
  Calculator
} from "lucide-react";

export default function ShelterMicrogridSolver() {
  const [selectedShelter, setSelectedShelter] = useState<ShelterLifeSupportProfile>(GAINESVILLE_SHELTER_PROFILES[0]);
  const [cloudCoverFactor, setCloudCoverFactor] = useState<number>(0.75); // 75% sun (post-hurricane overcast)
  const [includeIraBonus, setIncludeIraBonus] = useState<boolean>(true); // 40% direct pay

  // Run mathematical differential solver
  const solution = useMemo(() => {
    return solveShelterMicrogrid(selectedShelter, {
      cloudCoverFactor,
      includeDirectPayBonus: includeIraBonus
    });
  }, [selectedShelter, cloudCoverFactor, includeIraBonus]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <BatteryCharging className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">
              Mathematical 72-Hour Microgrid & Solar-Storage Solver
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/40 font-mono font-semibold">
              Differential SoC Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Computing discrete state-of-charge curves: <span className="font-mono text-cyan-300">SoC(t+1) = SoC(t) + η_ch·P_pv - (1/η_dis)·P_load</span> with hard 20% DoD reserve floor.
          </p>
        </div>

        {/* Guarantees Scorecard */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">Autonomy: <span className="text-emerald-400 font-bold">{solution.survivalHoursGuaranteed} / 72 Hours</span></span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
            <span className="text-slate-400">DoD Reserve Floor:</span>
            <span className="text-cyan-400 font-bold">20% Hard Margin</span>
          </div>
        </div>
      </div>

      {/* Main Solver Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 4 Cols: Shelter Selection & Real Load Profile */}
        <div className="lg:col-span-4 space-y-4">
          {/* Shelter Selector */}
          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2.5">
            <span className="text-xs font-semibold text-slate-300 font-mono block">
              1. Designated Emergency Shelter Facility:
            </span>
            <div className="space-y-1.5 relative z-20">
              {GAINESVILLE_SHELTER_PROFILES.map((shelter) => {
                const isSelected = selectedShelter.id === shelter.id;
                return (
                  <button
                    key={shelter.id}
                    onClick={() => setSelectedShelter(shelter)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all text-xs relative z-20 cursor-pointer ${
                      isSelected
                        ? "bg-emerald-950/40 border-emerald-500/60 text-white shadow-sm"
                        : "bg-slate-950/50 border-slate-800/80 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span>{shelter.name}</span>
                      <span className="font-mono text-emerald-400">{shelter.totalCriticalLoadKw} kW</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{shelter.address}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Environmental Assumptions */}
          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3.5 relative z-20">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 font-mono">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>Gainesville Solar & Policy Parameters:</span>
            </span>

            {/* Cloud Cover Slider */}
            <div className="space-y-1.5 relative z-20">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Post-Storm Solar Insolation:</span>
                <span className="text-amber-400 font-bold">{Math.round(cloudCoverFactor * 100)}% ({(4.8 * cloudCoverFactor).toFixed(1)} PSH)</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.0"
                step="0.05"
                value={cloudCoverFactor}
                onChange={(e) => setCloudCoverFactor(parseFloat(e.target.value))}
                className="w-full accent-amber-400 bg-slate-800 h-2 rounded-lg cursor-pointer relative z-20"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Heavy Cloud (0.50 kW/m²)</span>
                <span>Clear Sky (1.00 kW/m²)</span>
              </div>
            </div>

            {/* IRA Section 48 Direct Pay Toggle */}
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 cursor-pointer relative z-20">
              <div className="text-xs">
                <span className="text-slate-200 font-semibold block">IRA Section 48 Direct Pay</span>
                <span className="text-[10px] text-slate-400">40% Municipal Direct Grant (Energy Community Bonus)</span>
              </div>
              <input
                type="checkbox"
                checked={includeIraBonus}
                onChange={(e) => setIncludeIraBonus(e.target.checked)}
                className="rounded accent-emerald-500 w-4 h-4 cursor-pointer relative z-20"
              />
            </label>
          </div>

          {/* Real Critical Life-Support Sub-loads */}
          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950 space-y-2 font-mono text-xs">
            <span className="text-slate-400 font-bold block border-b border-slate-800 pb-1.5">
              Verified Shelter Critical Loads:
            </span>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400 flex items-center gap-1">
                  <ThermometerSnowflake className="w-3 h-3 text-cyan-400" />
                  Medical Refrigeration (Insulin):
                </span>
                <span className="text-white font-bold">{selectedShelter.criticalLoads.medicalRefrigerationKw} kW</span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-rose-400" />
                  Oxygen / Ventilator Support:
                </span>
                <span className="text-white font-bold">{selectedShelter.criticalLoads.oxygenAndVentilatorsKw} kW</span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400 flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-amber-400" />
                  HVAC Thermal Safety (≤82°F):
                </span>
                <span className="text-white font-bold">{selectedShelter.criticalLoads.emergencyHvacCoolingKw} kW</span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-emerald-400" />
                  Emergency Comms & LED Lighting:
                </span>
                <span className="text-white font-bold">{selectedShelter.criticalLoads.lightingAndCommsKw} kW</span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-blue-400" />
                  Water Booster Pumps & Hygiene:
                </span>
                <span className="text-white font-bold">{selectedShelter.criticalLoads.waterSanitationPumpsKw} kW</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm text-emerald-400">
              <span>Continuous Base Draw:</span>
              <span>{selectedShelter.totalCriticalLoadKw} kW</span>
            </div>
          </div>
        </div>

        {/* Right 8 Cols: Mathematical Sizing & 72-Hour Dispatch */}
        <div className="lg:col-span-8 space-y-4">
          {/* Sizing Results */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 font-mono">
              <span className="text-[10px] text-slate-400 uppercase">Recommended PV</span>
              <div className="text-xl font-bold text-amber-400 mt-0.5">
                {solution.recommendedPvKw} kW
              </div>
              <span className="text-[10px] text-slate-500">{solution.solarArraySqFtRequired.toLocaleString()} sq ft array</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 font-mono">
              <span className="text-[10px] text-slate-400 uppercase">Recommended BESS</span>
              <div className="text-xl font-bold text-emerald-400 mt-0.5">
                {solution.recommendedBessKwh} kWh
              </div>
              <span className="text-[10px] text-slate-500">LFP Chemistry (80% DoD)</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 font-mono">
              <span className="text-[10px] text-slate-400 uppercase">Total Turnkey CAPEX</span>
              <div className="text-xl font-bold text-white mt-0.5">
                ${(solution.totalCapexEstimate / 1000).toFixed(0)}k
              </div>
              <span className="text-[10px] text-slate-500">PV + BESS + Microgrid BOS</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 font-mono">
              <span className="text-[10px] text-slate-400 uppercase">IRA Net Civic Cost</span>
              <div className="text-xl font-bold text-cyan-400 mt-0.5">
                ${(solution.netMunicipalityCost / 1000).toFixed(0)}k
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold">
                -${(solution.iraDirectPayRebate40Pct / 1000).toFixed(0)}k (40% Direct Pay)
              </span>
            </div>
          </div>

          {/* Roof Constraint Check */}
          <div className={`p-3 rounded-xl border text-xs font-mono flex items-center justify-between ${
            solution.fitsOnRoof
              ? "bg-emerald-950/30 border-emerald-800/40 text-emerald-300"
              : "bg-amber-950/30 border-amber-800/40 text-amber-300"
          }`}>
            <div className="flex items-center gap-2">
              {solution.fitsOnRoof ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-amber-400" />}
              <span>
                Rooftop Area Analysis: Requires {solution.solarArraySqFtRequired.toLocaleString()} sq ft / Usable {solution.usableRoofSqFt.toLocaleString()} sq ft
              </span>
            </div>
            <span className="font-bold">
              {solution.fitsOnRoof ? "100% ROOFTOP FIT" : "REQUIRES SOLAR CANOPY CARPORT"}
            </span>
          </div>

          {/* 72-Hour Differential Dispatch Curve Visualizer */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>72-Hour Discrete Battery State-of-Charge Profile (SoC %)</span>
                </h3>
                <span className="text-[11px] text-slate-400">
                  Step-by-step differential simulation over 72 post-landfall hours with 20% DoD safety margin.
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
                  <span className="text-slate-300">Battery SoC %</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-amber-400" />
                  <span className="text-slate-300">Solar Gen</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-rose-500" />
                  <span className="text-slate-300">20% DoD Floor</span>
                </div>
              </div>
            </div>

            {/* Custom 72-Hour Bar Chart */}
            <div className="relative w-full h-56 bg-slate-900/60 rounded-xl p-3 flex items-end gap-[2px] overflow-x-auto select-none border border-slate-800/80">
              {/* Hard 20% DoD Reserve Floor */}
              <div 
                className="absolute left-3 right-3 border-b-2 border-dashed border-rose-500/60 pointer-events-none z-10 flex justify-end"
                style={{ bottom: "24%" }}
              >
                <span className="text-[9px] font-mono text-rose-400 bg-slate-950/80 px-1 rounded -translate-y-3">
                  20% DoD Reserve Floor (Hard Margin)
                </span>
              </div>

              {solution.hourlyProfile.map((hp) => {
                const socHeightPct = hp.batterySoCPct;
                const isDaylight = hp.pvGenerationKw > 0;

                return (
                  <div
                    key={hp.hour}
                    className="flex-1 min-w-[5px] h-full flex flex-col justify-end items-center group relative cursor-pointer"
                  >
                    {/* Hover tooltip */}
                    <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col z-30 bg-slate-950 border border-slate-700 p-2 rounded-lg text-[9.5px] font-mono text-white whitespace-nowrap shadow-xl pointer-events-none">
                      <span className="text-cyan-400 font-bold">Hour {hp.hour} (Day {Math.floor((hp.hour - 1) / 24) + 1})</span>
                      <span>Battery SoC: {hp.batterySoCPct}% ({hp.batterySoCKwh} kWh)</span>
                      <span>Solar Gen: {hp.pvGenerationKw} kW (Insolation: {hp.irradianceKwM2} kW/m²)</span>
                      <span>Critical Load: {hp.shelterCriticalLoadKw} kW</span>
                      {hp.generatorBackupKw > 0 && (
                        <span className="text-rose-400 font-bold">Backup Gen: {hp.generatorBackupKw} kW</span>
                      )}
                    </div>

                    {/* Solar Gen indicator dot */}
                    {isDaylight && (
                      <div 
                        className="w-full bg-amber-400/70 rounded-t-sm mb-[1px]"
                        style={{ height: `${Math.min(40, (hp.pvGenerationKw / solution.recommendedPvKw) * 40)}px` }}
                      />
                    )}

                    {/* Battery SoC Bar */}
                    <div
                      className={`w-full rounded-t-sm transition-all ${
                        socHeightPct < 25
                          ? "bg-rose-500"
                          : socHeightPct < 50
                          ? "bg-amber-400"
                          : "bg-emerald-500"
                      }`}
                      style={{ height: `${socHeightPct * 0.7}%` }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Day Markers */}
            <div className="flex justify-between text-[11px] font-mono text-slate-400 px-2 pt-1 border-t border-slate-800">
              <span>Day 1 (Hurricane Landfall & Overcast)</span>
              <span>Day 2 (Clearing Cloud Cover)</span>
              <span>Day 3 (100% Off-Grid Life-Support Autonomy)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
