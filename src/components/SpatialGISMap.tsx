"use client";

import React, { useState, useMemo } from "react";
import { ALACHUA_ZIP_DATA } from "@/data/alachuaZipData";
import { AlachuaZipCodeMetric, GISLayerType } from "@/lib/types";
import { 
  MapPin, 
  Layers, 
  Info, 
  Trees, 
  Building, 
  Thermometer, 
  Zap, 
  ChevronRight, 
  ExternalLink,
  ShieldCheck,
  Sun,
  Sparkles,
  TrendingDown,
  DollarSign,
  Flame
} from "lucide-react";

interface SpatialGISMapProps {
  onAuditZip?: (zip: string) => void;
}

export default function SpatialGISMap({ onAuditZip }: SpatialGISMapProps) {
  const [selectedLayer, setSelectedLayer] = useState<GISLayerType>("energyBurden");
  const [selectedZipCode, setSelectedZipCode] = useState<string>("32641");
  const [hoveredZip, setHoveredZip] = useState<AlachuaZipCodeMetric | null>(null);

  // Feature 1: "What-If" Municipal Policy Simulator State
  const [policySimulatorActive, setPolicySimulatorActive] = useState<boolean>(false);

  // Dynamically recalculate zip data based on policy simulator
  const displayedZipData = useMemo(() => {
    return ALACHUA_ZIP_DATA.map((zip) => {
      if (zip.zip === "32641" && policySimulatorActive) {
        // +15% urban tree canopy & 2MW community solar offset in East Gainesville
        const monthlyBillReduced = Math.max(0, zip.avgMonthlyGruBill - 42.50); // ~$42.50/mo savings per household
        const monthlyIncome = zip.medianHouseholdIncome / 12;
        const newBurden = parseFloat(((monthlyBillReduced / monthlyIncome) * 100).toFixed(1));
        return {
          ...zip,
          treeCanopyDeficitPct: Math.max(0, zip.treeCanopyDeficitPct - 15.0), // 21% down to 6%
          nasaLstThermalAnomalyC: 1.8, // Reduced from +4.2°C down to +1.8°C via canopy shading & evapotranspiration
          avgMonthlyGruBill: monthlyBillReduced,
          energyBurdenPct: newBurden, // 14.8% down to 13.0%
          vulnerabilityRationale: `[POLICY SIMULATOR ACTIVE: +15% Canopy & 2MW Community Solar] Saves ~$42.50/month per household ($510/year), lowering energy burden from 14.8% down to ${newBurden}% and mitigating NASA thermal anomaly from +4.2°C to +1.8°C. Injects $3.98M in annual equity retention into 7,800+ East Gainesville households.`
        };
      }
      return zip;
    });
  }, [policySimulatorActive]);

  const selectedZip = useMemo(() => {
    return displayedZipData.find((z) => z.zip === selectedZipCode) || displayedZipData[0];
  }, [displayedZipData, selectedZipCode]);

  // Compute color based on active layer
  const getPolygonFill = (zip: AlachuaZipCodeMetric, layer: GISLayerType): string => {
    if (layer === "energyBurden") {
      if (zip.energyBurdenPct > 13.5) return "#f43f5e"; // Rose-500 (Acute Crisis)
      if (zip.energyBurdenPct > 11.0) return "#fb923c"; // Orange-400 (Moderate Crisis / Post-policy)
      if (zip.energyBurdenPct > 8) return "#f59e0b"; // Amber-500 (Severe)
      if (zip.energyBurdenPct > 6) return "#eab308"; // Yellow-500 (Moderate)
      return "#10b981"; // Emerald-500 (Low / Resilient)
    }
    if (layer === "canopyDeficit") {
      if (zip.treeCanopyDeficitPct > 18) return "#f43f5e";
      if (zip.treeCanopyDeficitPct > 10) return "#f59e0b";
      return "#10b981";
    }
    if (layer === "structuralInefficiency") {
      if (zip.structuralInefficiencyScore > 70) return "#e11d48";
      if (zip.structuralInefficiencyScore > 45) return "#f59e0b";
      return "#06b6d4";
    }
    if (layer === "nasaThermal") {
      // NASA ECOSTRESS / Landsat LST Land Surface Temperature Anomaly Ramp
      if (zip.nasaLstThermalAnomalyC >= 4.0) return "#f43f5e"; // Rose-500 (Severe +4.2°C Heat Island)
      if (zip.nasaLstThermalAnomalyC >= 2.5) return "#f97316"; // Orange-500 (Elevated +2.6°C to +3.1°C)
      if (zip.nasaLstThermalAnomalyC >= 1.0) return "#facc15"; // Yellow-400 (Moderate +1.4°C)
      if (zip.nasaLstThermalAnomalyC >= 0.0) return "#06b6d4"; // Cyan-500 (Mild +0.8°C)
      return "#3b82f6"; // Blue-500 (Canopy Buffered Cool Zone <= 0°C)
    }
    // coolingDegreeDays
    if (zip.coolingDegreeDays > 2450) return "#f43f5e";
    if (zip.coolingDegreeDays > 2400) return "#f97316";
    return "#3b82f6";
  };

  const currentMetricLabel = (layer: GISLayerType): string => {
    switch (layer) {
      case "energyBurden": return "Energy Burden (% of Income)";
      case "canopyDeficit": return "Tree Canopy Deficit (%)";
      case "structuralInefficiency": return "Building Thermal Envelope Leakage (%)";
      case "nasaThermal": return "NASA ECOSTRESS Land Surface Temp Anomaly (°C)";
      case "coolingDegreeDays": return "Annual Cooling Degree Days (CDD)";
    }
  };

  const getZipMetricValue = (zip: AlachuaZipCodeMetric, layer: GISLayerType): string => {
    switch (layer) {
      case "energyBurden": return `${zip.energyBurdenPct.toFixed(1)}%`;
      case "canopyDeficit": return `${zip.treeCanopyDeficitPct.toFixed(1)}%`;
      case "structuralInefficiency": return `${zip.structuralInefficiencyScore}%`;
      case "nasaThermal": return `${zip.nasaLstThermalAnomalyC >= 0 ? "+" : ""}${zip.nasaLstThermalAnomalyC.toFixed(1)}°C`;
      case "coolingDegreeDays": return `${zip.coolingDegreeDays} CDD`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Layer Control Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            Alachua County & Gainesville Spatial Vulnerability GIS
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified Census tract, NASA ECOSTRESS thermal radiometric telemetry, and GRU tariff overlay.
          </p>
        </div>

        {/* Layer Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 relative z-20">
          <button
            onClick={() => setSelectedLayer("energyBurden")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all relative z-20 cursor-pointer ${
              selectedLayer === "energyBurden"
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-rose-400" />
            <span>Energy Burden</span>
          </button>
          <button
            onClick={() => setSelectedLayer("nasaThermal")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all relative z-20 cursor-pointer ${
              selectedLayer === "nasaThermal"
                ? "bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>NASA ECOSTRESS LST</span>
          </button>
          <button
            onClick={() => setSelectedLayer("canopyDeficit")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all relative z-20 cursor-pointer ${
              selectedLayer === "canopyDeficit"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Trees className="w-3.5 h-3.5 text-emerald-400" />
            <span>Canopy Deficit</span>
          </button>
          <button
            onClick={() => setSelectedLayer("structuralInefficiency")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all relative z-20 cursor-pointer ${
              selectedLayer === "structuralInefficiency"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Building className="w-3.5 h-3.5 text-cyan-400" />
            <span>Thermal Leakage</span>
          </button>
          <button
            onClick={() => setSelectedLayer("coolingDegreeDays")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all relative z-20 cursor-pointer ${
              selectedLayer === "coolingDegreeDays"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Thermometer className="w-3.5 h-3.5 text-amber-400" />
            <span>Cooling Degree Days</span>
          </button>
        </div>
      </div>

      {/* Feature 1: "What-If" Municipal Policy Simulator Control Banner */}
      <div className={`p-4 rounded-2xl border transition-all duration-300 relative z-20 ${
        policySimulatorActive
          ? "bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/60 border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          : "bg-slate-900/60 border-slate-800"
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                policySimulatorActive ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-400"
              }`}>
                What-If Policy Simulator
              </span>
              <span className="text-xs text-slate-300 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Simulate +15% Urban Canopy & 2MW Community Solar in East Gainesville (32641)</span>
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Evaluates targeted municipal microclimate cooling and community solar offsets on GRU electric statements in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-20">
            {policySimulatorActive && (
              <div className="text-right font-mono text-xs hidden sm:block">
                <span className="text-emerald-400 font-bold block">-$42.50 / Month per Home</span>
                <span className="text-[10px] text-slate-400">$3.98M/yr Community Wealth Retention</span>
              </div>
            )}
            <button
              onClick={() => setPolicySimulatorActive(!policySimulatorActive)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md relative z-20 cursor-pointer ${
                policySimulatorActive
                  ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
              }`}
            >
              <Trees className="w-4 h-4" />
              <span>{policySimulatorActive ? "Policy Active (Reset)" : "Engage Policy Simulation"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive GIS Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Vector Choropleth SVG Map */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-950 p-6 flex flex-col justify-between relative overflow-hidden shadow-inner">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Interactive Polygon Viewport — Click any ZIP to Inspect</span>
            </div>
            <div className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-md border border-cyan-800/40">
              Active Layer: {currentMetricLabel(selectedLayer)}
            </div>
          </div>

          {/* SVG Map Container */}
          <div className="relative w-full aspect-[4/3] flex items-center justify-center bg-slate-900/50 rounded-xl border border-slate-800/60 p-2">
            <svg
              viewBox="0 0 520 420"
              className="w-full h-full max-h-[440px] drop-shadow-md select-none"
            >
              <defs>
                <pattern id="gis-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="520" height="420" fill="url(#gis-grid)" className="pointer-events-none" />

              <text x="30" y="30" fill="#64748b" fontSize="10" fontFamily="monospace" className="pointer-events-none">Alachua County Boundary</text>
              <text x="380" y="380" fill="#475569" fontSize="9" fontFamily="monospace" className="pointer-events-none">Paynes Prairie Preserve ↓</text>
              <text x="20" y="390" fill="#475569" fontSize="9" fontFamily="monospace" className="pointer-events-none">Archer / Kanapaha Area</text>
              <text x="240" y="45" fill="#475569" fontSize="9" fontFamily="monospace" className="pointer-events-none">US-441 / Deerhaven Corridor ↑</text>

              {/* Polygons */}
              {displayedZipData.map((zip) => {
                const isSelected = selectedZip.zip === zip.zip;
                const isHovered = hoveredZip?.zip === zip.zip;
                const fillColor = getPolygonFill(zip, selectedLayer);

                return (
                  <g
                    key={zip.zip}
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => setSelectedZipCode(zip.zip)}
                    onMouseEnter={() => setHoveredZip(zip)}
                    onMouseLeave={() => setHoveredZip(null)}
                  >
                    <path
                      d={zip.svgPath}
                      fill={fillColor}
                      fillOpacity={isSelected ? 0.85 : isHovered ? 0.70 : 0.45}
                      stroke={isSelected ? "#38bdf8" : isHovered ? "#ffffff" : "rgba(255, 255, 255, 0.25)"}
                      strokeWidth={isSelected ? 3 : isHovered ? 2 : 1}
                      className="transition-all duration-150"
                    />

                    {/* Centroid Labels */}
                    <text
                      x={zip.centroid.x}
                      y={zip.centroid.y - 4}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="12"
                      fontWeight="bold"
                      fontFamily="monospace"
                      className="pointer-events-none drop-shadow-md"
                    >
                      {zip.zip}
                    </text>
                    <text
                      x={zip.centroid.x}
                      y={zip.centroid.y + 11}
                      textAnchor="middle"
                      fill="#cbd5e1"
                      fontSize="9"
                      fontFamily="sans-serif"
                      fontWeight="600"
                      className="pointer-events-none"
                    >
                      {getZipMetricValue(zip, selectedLayer)}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Choropleth Legend */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Scale:</span>
            {selectedLayer === "nasaThermal" ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-slate-300">Cool (≤0°C)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-cyan-500" />
                  <span className="text-slate-300">Mild (+0.8°C)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-yellow-400" />
                  <span className="text-slate-300">Elevated (+1.4°C)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-slate-300">High (+2.6–3.1°C)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="text-slate-300">Acute (+4.2°C)</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-slate-300">Resilient (&lt;5%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-slate-300">Moderate (5–10%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-orange-400" />
                  <span className="text-slate-300">Elevated (11–13%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="text-slate-300">Crisis (&gt;13.5%)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 5 Cols: Selected ZIP Code Detailed Inspector Drawer */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between backdrop-blur-md">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold font-mono text-white">{selectedZip.zip}</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                    selectedZip.energyBurdenPct > 10 
                      ? "bg-rose-950 text-rose-300 border border-rose-800/60" 
                      : "bg-emerald-950 text-emerald-300 border border-emerald-800/60"
                  }`}>
                    {selectedZip.energyBurdenPct > 10 ? "CRISIS ZONE" : "RESILIENT TRACT"}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-slate-300 mt-1">{selectedZip.name}</h3>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400 font-mono">Region</div>
                <div className="text-sm font-semibold text-cyan-300">{selectedZip.region} Alachua</div>
              </div>
            </div>

            {/* Before / After Policy Simulation Pill for 32641 */}
            {selectedZip.zip === "32641" && policySimulatorActive && (
              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs font-mono space-y-1">
                <div className="flex items-center justify-between text-emerald-300 font-bold">
                  <span>Policy Simulation Delta (32641):</span>
                  <span>-1.8% Burden | -2.4°C Surface Temp</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span>Baseline: <span className="text-rose-400">14.8% / +4.2°C LST</span></span>
                  <span>With Policy: <span className="text-emerald-400 font-bold">{selectedZip.energyBurdenPct}% / +1.8°C LST</span></span>
                </div>
              </div>
            )}

            {/* Key Metric Gauges */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-[11px] text-slate-400 font-mono">Energy Burden</div>
                <div className={`text-xl font-bold font-mono mt-0.5 ${
                  selectedZip.energyBurdenPct > 10 ? "text-rose-400" : "text-emerald-400"
                }`}>
                  {selectedZip.energyBurdenPct.toFixed(1)}%
                </div>
                <div className="text-[10px] text-slate-400 mt-1">of Household Gross Income</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-[11px] text-slate-400 font-mono">NASA LST Anomaly</div>
                <div className={`text-xl font-bold font-mono mt-0.5 ${
                  selectedZip.nasaLstThermalAnomalyC >= 4.0 
                    ? "text-rose-400" 
                    : selectedZip.nasaLstThermalAnomalyC >= 2.0 
                      ? "text-orange-400" 
                      : selectedZip.nasaLstThermalAnomalyC >= 0 
                        ? "text-cyan-400" 
                        : "text-blue-400"
                }`}>
                  {selectedZip.nasaLstThermalAnomalyC >= 0 ? "+" : ""}{selectedZip.nasaLstThermalAnomalyC.toFixed(1)}°C
                </div>
                <div className="text-[10px] text-slate-400 mt-1">ECOSTRESS Radiometric Delta</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-[11px] text-slate-400 font-mono">Avg Monthly GRU Bill</div>
                <div className="text-xl font-bold font-mono text-amber-300 mt-0.5">
                  ${selectedZip.avgMonthlyGruBill.toFixed(2)}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Avg {selectedZip.avgMonthlyKwh} kWh/mo</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-[11px] text-slate-400 font-mono">Canopy Deficit Index</div>
                <div className="text-xl font-bold font-mono text-cyan-300 mt-0.5">
                  {selectedZip.treeCanopyDeficitPct.toFixed(1)}%
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Deficit vs County Baseline</div>
              </div>
            </div>

            {/* NASA Ground-Truth Correlation Card */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-rose-950/40 via-amber-950/20 to-slate-950 border border-rose-500/30 text-xs space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-300 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  NASA ECOSTRESS Ground Truth
                </span>
                <span className="font-mono text-[11px] font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800/50">
                  {selectedZip.nasaLstThermalAnomalyC >= 0 ? "+" : ""}{selectedZip.nasaLstThermalAnomalyC.toFixed(1)}°C Anomaly
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {selectedZip.zip === "32641" 
                  ? "East Gainesville (32641) registers a +4.2°C surface heat anomaly due to canopy loss, driving a +38% increase in cooling degree loads compared to NW 32605 canopy buffer."
                  : `Landsat 8/9 & ECOSTRESS thermal infrared radiometers indicate a ${selectedZip.nasaLstThermalAnomalyC >= 0 ? "+" : ""}${selectedZip.nasaLstThermalAnomalyC.toFixed(1)}°C surface delta, directly influencing residential HVAC duty cycles.`}
              </p>
            </div>

            {/* Inefficiency & Rationale */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 space-y-2">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                <span>Civic Vulnerability Assessment:</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {selectedZip.vulnerabilityRationale}
              </p>
              <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-slate-400 border-t border-slate-800/80">
                <span>Renter Household Share:</span>
                <span className="text-white font-semibold">{selectedZip.pctRenters}%</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Building Thermal Leakage:</span>
                <span className="text-amber-400 font-semibold">{selectedZip.structuralInefficiencyScore}%</span>
              </div>
            </div>

            {/* Critical Facilities in this ZIP */}
            <div>
              <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Critical Infrastructure & Shelters:</span>
              </div>
              <div className="space-y-1.5">
                {selectedZip.criticalFacilities.map((facility, idx) => (
                  <div
                    key={idx}
                    className="text-xs p-2 rounded-lg bg-slate-950/50 border border-slate-800/70 text-slate-300 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>{facility}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="pt-4 mt-4 border-t border-slate-800">
            <button
              onClick={() => onAuditZip && onAuditZip(selectedZip.zip)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold text-xs transition-all shadow-md relative z-20 cursor-pointer"
            >
              <span>Audit GRU Bills & Hardship Relief for {selectedZip.zip}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
