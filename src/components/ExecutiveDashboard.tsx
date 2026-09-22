"use client";

import React from "react";
import { 
  Zap, 
  AlertTriangle, 
  Map, 
  Network, 
  Sparkles, 
  BatteryCharging, 
  ArrowUpRight, 
  Layers, 
  ShieldCheck, 
  Building2 
} from "lucide-react";
import { NavTab } from "./Navigation";

interface ExecutiveDashboardProps {
  onNavigate: (tab: NavTab) => void;
}

export default function ExecutiveDashboard({ onNavigate }: ExecutiveDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Hero Civic Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-900/90 to-cyan-950/40 p-6 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5" /> CityCamp Gainesville 2026 — General Civic Tech
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Autonomous Spatial Energy Burden Optimizer & Karst-Resilient Grid Simulator
          </h1>
          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
            Bridging Alachua County’s stark <span className="text-rose-400 font-semibold font-mono">14.8% East Gainesville energy burden crisis</span> against 
            West Gainesville (4.6%), modeling cascading Florida karst sinkhole & storm electrical failures in sub-20ms, and deploying Google Gemini for automated GRU tariff triage and official Florida LIHEAP hardship relief.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 relative z-20">
            <button
              onClick={() => onNavigate("gis")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs sm:text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] relative z-20 cursor-pointer"
            >
              <Map className="w-4 h-4" />
              <span>Explore Spatial GIS Map</span>
            </button>
            <button
              onClick={() => onNavigate("karst")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-semibold text-xs sm:text-sm transition-all relative z-20 cursor-pointer"
            >
              <Network className="w-4 h-4" />
              <span>Simulate Karst Grid Cascade</span>
            </button>
            <button
              onClick={() => onNavigate("gemini")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-700/50 font-semibold text-xs sm:text-sm transition-all relative z-20 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Audit GRU Bills with Gemini</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core Pillars Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-20">
        {/* Pillar 1: Spatial GIS */}
        <div 
          onClick={() => onNavigate("gis")}
          className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800/60 hover:border-cyan-500/40 p-5 transition-all duration-200 relative z-20 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">14.8% vs 4.6%</div>
          <div className="text-xs font-medium text-slate-300 mt-1">Spatial Energy Burden Disparity</div>
          <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
            East Gainesville 32641 families pay 3.2x more of their household income on electricity than SW 32608.
          </p>
        </div>

        {/* Pillar 2: Karst DAG */}
        <div 
          onClick={() => onNavigate("karst")}
          className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800/60 hover:border-cyan-500/40 p-5 transition-all duration-200 relative z-20 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Network className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">&lt; 20 ms</div>
          <div className="text-xs font-medium text-slate-300 mt-1">Karst Failure DAG Propagation</div>
          <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
            Simulates Hogtown Creek flooding and Sweetwater sinkhole ground shifts tripping Sugarfoot, Kanapaha, and Springhill substations.
          </p>
        </div>

        {/* Pillar 3: Gemini Auditor */}
        <div 
          onClick={() => onNavigate("gemini")}
          className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800/60 hover:border-purple-500/40 p-5 transition-all duration-200 relative z-20 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">$850 Relief</div>
          <div className="text-xs font-medium text-slate-300 mt-1">Gemini LIHEAP Hardship Drafts</div>
          <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
            Dissects GRU Fuel Adjustment Clause (FAC) surcharges and pre-fills official Florida emergency assistance letters.
          </p>
        </div>

        {/* Pillar 4: Shelter Microgrid */}
        <div 
          onClick={() => onNavigate("microgrid")}
          className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800/60 hover:border-emerald-500/40 p-5 transition-all duration-200 relative z-20 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <BatteryCharging className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">72-Hour DoD</div>
          <div className="text-xs font-medium text-slate-300 mt-1">Deterministic Islanding Solver</div>
          <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
            Sizes PV and BESS storage ensuring Reitz Union, Eastside Center, and GRACE Marketplace maintain continuous life-support.
          </p>
        </div>
      </div>

      {/* Real-time Systemic Context & Alachua County Field Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Geographic & Policy Insight */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              The Gainesville Regional Utilities (GRU) Energy Affordability Matrix
            </h3>
            <span className="text-xs text-slate-400 font-mono">Alachua County Census & Utility Intersect</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            In Gainesville, energy burden is not merely an economic metric—it is a climate survival crisis. 
            East of Waldo Road and Hawthorne Road (ZIP 32641), over 64% of residents rent pre-1980 uninsulated homes. During Florida’s 
            humid summer months with Cooling Degree Days (CDD) exceeding 2,400, older heat pumps run continuously, causing bills to exceed 
            <span className="text-rose-400 font-mono font-semibold"> $420/month</span> against a median monthly income of $2,285.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
              <div className="text-[11px] text-slate-400 uppercase font-mono">East Gainesville (32641)</div>
              <div className="text-lg font-bold text-rose-400 font-mono mt-0.5">14.8% Burden</div>
              <div className="text-[10px] text-slate-400 mt-1">Avg Bill: $350.25 / $2,366 mo inc</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
              <div className="text-[11px] text-slate-400 uppercase font-mono">Downtown / Duckpond (32601)</div>
              <div className="text-lg font-bold text-amber-400 font-mono mt-0.5">9.1% Burden</div>
              <div className="text-[10px] text-slate-400 mt-1">Avg Bill: $274.50 / $3,016 mo inc</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
              <div className="text-[11px] text-slate-400 uppercase font-mono">SW Gainesville (32608)</div>
              <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">4.6% Burden</div>
              <div className="text-[10px] text-slate-400 mt-1">Avg Bill: $207.00 / $4,500 mo inc</div>
            </div>
          </div>
        </div>

        {/* Right Col: Karst Geology & Hogtown Basin Hazard */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              Limestone Karst Topology
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-mono">
              Active Basin
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Alachua County sits atop Florida’s porous Ocala limestone formation. 
            During severe tropical downpours, Hogtown Creek and Sweetwater Branch surge into subterranean sinkhole conduits, 
            undermining transmission footings and flooding key substations.
          </p>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between items-center p-2 rounded bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400">Sugarfoot Substation:</span>
              <span className="text-rose-400 font-semibold">Hogtown Flood (84 ft)</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400">Springhill Substation:</span>
              <span className="text-amber-400 font-semibold">Sweetwater Karst Flow</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400">Deerhaven Station:</span>
              <span className="text-emerald-400 font-semibold">Resilient 168 ft Elevation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
