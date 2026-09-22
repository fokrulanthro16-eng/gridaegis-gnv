"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Navigation, { NavTab } from "@/components/Navigation";
import ExecutiveDashboard from "@/components/ExecutiveDashboard";
import SpatialGISMap from "@/components/SpatialGISMap";
import KarstDAGSimulator from "@/components/KarstDAGSimulator";
import GeminiUtilityAuditor from "@/components/GeminiUtilityAuditor";
import ShelterMicrogridSolver from "@/components/ShelterMicrogridSolver";
import EmergencyShelterPass from "@/components/EmergencyShelterPass";
import { ShieldCheck, Heart, ExternalLink, Code2 } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<NavTab>("overview");
  const [shelterPassOpen, setShelterPassOpen] = useState<boolean>(false);

  const handleAuditZipFromGis = (zip: string) => {
    setActiveTab("gemini");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500/30">
      {/* Real-time Telemetry Header with Emergency Pass Button */}
      <Header onOpenShelterPass={() => setShelterPassOpen(true)} />

      {/* Sub-Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === "overview" && (
          <ExecutiveDashboard onNavigate={setActiveTab} />
        )}

        {activeTab === "gis" && (
          <SpatialGISMap onAuditZip={handleAuditZipFromGis} />
        )}

        {activeTab === "karst" && (
          <KarstDAGSimulator />
        )}

        {activeTab === "gemini" && (
          <GeminiUtilityAuditor />
        )}

        {activeTab === "microgrid" && (
          <ShelterMicrogridSolver />
        )}
      </main>

      {/* Offline Emergency Shelter Pass Modal */}
      <EmergencyShelterPass
        isOpen={shelterPassOpen}
        onClose={() => setShelterPassOpen(false)}
      />

      {/* Civic Enterprise Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 mt-12 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-200">GridAegis GNV</span>
            <span>— Civic Energy Resilience Platform for Gainesville & Alachua County</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>CityCamp Gainesville 2026 Hack Day</span>
            <span>•</span>
            <span className="text-cyan-400 font-mono">Best in Civic Tech 2 & Google Gemini</span>
            <span>•</span>
            <button
              onClick={() => setShelterPassOpen(true)}
              className="text-cyan-400 hover:underline font-mono relative z-20 cursor-pointer"
            >
              Print Offline Shelter Pass
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
