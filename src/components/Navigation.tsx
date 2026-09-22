"use client";

import React from "react";
import { 
  BarChart3, 
  Map, 
  Network, 
  Sparkles, 
  BatteryCharging 
} from "lucide-react";

export type NavTab = "overview" | "gis" | "karst" | "gemini" | "microgrid";

interface NavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: "overview", label: "Overview & Telemetry", icon: BarChart3 },
    { id: "gis", label: "Spatial GIS Energy Burden", icon: Map, badge: "Alachua GIS" },
    { id: "karst", label: "Karst-Grid DAG Simulator", icon: Network, badge: "<20ms DAG" },
    { id: "gemini", label: "Gemini Utility & LIHEAP Auditor", icon: Sparkles, badge: "Google AI" },
    { id: "microgrid", label: "72h Shelter Islanding Solver", icon: BatteryCharging, badge: "DoD Solver" },
  ];

  return (
    <nav className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-sm px-4 py-2 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap relative z-20 cursor-pointer ${
                isActive
                  ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isActive
                      ? "bg-cyan-500/25 text-cyan-200"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
