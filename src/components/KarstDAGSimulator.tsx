"use client";

import React, { useState, useMemo } from "react";
import { simulateKarstGridFailure } from "@/lib/dagEngine";
import { SimulationParams, GridNode, GridEdge } from "@/lib/types";
import { 
  Network, 
  Wind, 
  CloudRain, 
  AlertOctagon, 
  RefreshCw, 
  ShieldCheck, 
  Zap, 
  Power, 
  Activity, 
  AlertTriangle,
  Flame,
  CheckCircle2,
  XCircle,
  ListOrdered
} from "lucide-react";

export default function KarstDAGSimulator() {
  const [params, setParams] = useState<SimulationParams>({
    hurricaneCategory: 2,
    rainfallInches: 6.5,
    hogtownCreekSpillover: false,
    sweetwaterSinkholeSwarm: false,
    hardenedNodes: ["shelter-shands"]
  });

  const [selectedNode, setSelectedNode] = useState<GridNode | null>(null);

  // Exact BFS traversal simulation
  const { nodes, edges, result } = useMemo(() => {
    return simulateKarstGridFailure(params);
  }, [params]);

  const toggleHardenedNode = (nodeId: string) => {
    setParams((prev) => {
      const isHardened = prev.hardenedNodes.includes(nodeId);
      return {
        ...prev,
        hardenedNodes: isHardened
          ? prev.hardenedNodes.filter((id) => id !== nodeId)
          : [...prev.hardenedNodes, nodeId]
      };
    });
  };

  const handleReset = () => {
    setParams({
      hurricaneCategory: 1,
      rainfallInches: 1.5,
      hogtownCreekSpillover: false,
      sweetwaterSinkholeSwarm: false,
      hardenedNodes: ["shelter-shands"]
    });
  };

  const handleWorstCaseCascade = () => {
    setParams({
      hurricaneCategory: 4,
      rainfallInches: 13.5,
      hogtownCreekSpillover: true,
      sweetwaterSinkholeSwarm: true,
      hardenedNodes: []
    });
  };

  const nodeMap = useMemo(() => {
    const map = new Map<string, GridNode>();
    nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [nodes]);

  const getNodeColor = (node: GridNode) => {
    if (node.type === "hazard_zone") return "#f43f5e";
    if (node.status === "tripped") return "#ef4444"; // Red
    if (node.status === "compromised") return "#f59e0b"; // Amber
    if (node.status === "islanded") return "#eab308"; // Yellow (islanded on battery/gen)
    if (node.type === "generator") return "#06b6d4"; // Cyan
    if (node.type === "shelter") return "#10b981"; // Emerald
    return "#38bdf8"; // Substation Online
  };

  return (
    <div className="space-y-6">
      {/* Simulation Header & Benchmarks */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">
              Real Topological Karst-Grid Cascading Failure Engine
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/40 font-mono font-semibold">
              BFS Latency: {result.executionTimeMs} ms (&lt;20ms SLA)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Exact Breadth-First Search topological cascade modeling Deerhaven, J.R. Kelly, Sugarfoot, Kanapaha, and Springhill substations across Hogtown Creek karst terrain.
          </p>
        </div>

        {/* Real-time Simulator Scorecard */}
        <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
          <div className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Load Served</span>
            <span className={`text-base font-bold ${result.loadServedPct > 70 ? "text-emerald-400" : result.loadServedPct > 40 ? "text-amber-400" : "text-rose-400"}`}>
              {result.loadServedPct}%
            </span>
          </div>

          <div className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Unserved Energy</span>
            <span className="text-base font-bold text-rose-400">
              {result.unservedEnergyMwh} MWh
            </span>
          </div>

          <div className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Tripped Lines</span>
            <span className="text-base font-bold text-amber-400">
              {result.trippedEdgeIds.length} / {edges.length}
            </span>
          </div>

          <div className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Islanded Shelters</span>
            <span className="text-base font-bold text-yellow-400">
              {result.islandedShelterIds.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main DAG Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 4 Cols: Interactive Environmental Controls & Pre-emptive Hardening */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-sm font-semibold text-white flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-cyan-400" />
                <span>Storm & Karst Stress Vectors</span>
              </span>
              <button
                onClick={handleReset}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono relative z-20 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Hurricane Category Slider */}
            <div className="space-y-1.5 relative z-20">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Hurricane Wind Shear:</span>
                <span className="text-cyan-400 font-bold">Category {params.hurricaneCategory}</span>
              </div>
              <input
                type="range"
                min="1"
                max="4"
                step="1"
                value={params.hurricaneCategory}
                onChange={(e) => setParams({ ...params, hurricaneCategory: parseInt(e.target.value) })}
                className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer relative z-20"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Cat 1 (74-95mph)</span>
                <span>Cat 2</span>
                <span>Cat 3</span>
                <span>Cat 4 (130mph+)</span>
              </div>
            </div>

            {/* Rainfall Slider */}
            <div className="space-y-1.5 relative z-20">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Karst Basin Rainfall:</span>
                <span className="text-cyan-400 font-bold">{params.rainfallInches.toFixed(1)}" Precipitation</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="0.5"
                value={params.rainfallInches}
                onChange={(e) => setParams({ ...params, rainfallInches: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer relative z-20"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0" (Dry)</span>
                <span>7.5" (Flash Flood)</span>
                <span>15" (Historic Surge)</span>
              </div>
            </div>

            {/* Specific Karst Failure Toggles */}
            <div className="space-y-2 pt-2 border-t border-slate-800 relative z-20">
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 cursor-pointer hover:border-slate-700 relative z-20">
                <span className="text-xs text-slate-300 flex items-center gap-2">
                  <CloudRain className="w-3.5 h-3.5 text-blue-400" />
                  <span>Hogtown Creek Basin Inundation</span>
                </span>
                <input
                  type="checkbox"
                  checked={params.hogtownCreekSpillover}
                  onChange={(e) => setParams({ ...params, hogtownCreekSpillover: e.target.checked })}
                  className="rounded accent-cyan-500 w-4 h-4 cursor-pointer relative z-20"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 cursor-pointer hover:border-slate-700 relative z-20">
                <span className="text-xs text-slate-300 flex items-center gap-2">
                  <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                  <span>Sweetwater Sinkhole Fracture Subsidence</span>
                </span>
                <input
                  type="checkbox"
                  checked={params.sweetwaterSinkholeSwarm}
                  onChange={(e) => setParams({ ...params, sweetwaterSinkholeSwarm: e.target.checked })}
                  className="rounded accent-cyan-500 w-4 h-4 cursor-pointer relative z-20"
                />
              </label>
            </div>

            {/* Catastrophic Cascade Shock Button */}
            <button
              onClick={handleWorstCaseCascade}
              className="w-full py-2.5 px-3 rounded-xl bg-rose-950/80 hover:bg-rose-900/80 border border-rose-700/60 text-rose-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm relative z-20 cursor-pointer"
            >
              <Flame className="w-4 h-4 text-rose-400" />
              <span>Trigger Cat 4 Karst Cascading Blackout</span>
            </button>
          </div>

          {/* Pre-emptive Civic Hardening */}
          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2.5 relative z-20">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Pre-emptive Civic Hardening Investments:</span>
            </span>
            <div className="space-y-1.5">
              {nodes
                .filter((n) => n.type === "shelter" || n.type === "substation")
                .map((n) => {
                  const isHardened = params.hardenedNodes.includes(n.id);
                  return (
                    <button
                      key={n.id}
                      onClick={() => toggleHardenedNode(n.id)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-mono transition-all relative z-20 cursor-pointer ${
                        isHardened
                          ? "bg-emerald-950/60 border border-emerald-700/50 text-emerald-300"
                          : "bg-slate-950/50 border border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span className="truncate pr-2">{n.name}</span>
                      <span className="text-[9px] uppercase font-bold">
                        {isHardened ? "HARDENED" : "STANDARD"}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Right 8 Cols: SVG Graph Canvas & Restoration Priority Queue */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 relative overflow-hidden shadow-inner flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>Gainesville Regional Utilities (GRU) Transmission Topology (230kV / 138kV / 23kV)</span>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="text-slate-300">Generator</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  <span className="text-slate-300">Substation</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-slate-300">Shelter</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="text-slate-300">Hazard</span>
                </div>
              </div>
            </div>

            {/* SVG Visualizer */}
            <div className="relative w-full aspect-[16/10] bg-slate-900/70 rounded-xl border border-slate-800/80 overflow-hidden">
              <svg
                viewBox="0 0 540 380"
                className="w-full h-full select-none"
              >
                <defs>
                  <linearGradient id="hogtown-basin" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.14" />
                    <stop offset="100%" stopColor="#0369a1" stopOpacity="0.04" />
                  </linearGradient>
                  <linearGradient id="sweetwater-basin" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.14" />
                    <stop offset="100%" stopColor="#e11d48" stopOpacity="0.04" />
                  </linearGradient>
                </defs>

                {/* Karst Hydrology Boundaries */}
                <ellipse cx="140" cy="185" rx="65" ry="50" fill="url(#hogtown-basin)" stroke="#0284c7" strokeWidth="0.75" strokeDasharray="3 3" className="pointer-events-none" />
                <text x="140" y="235" fill="#38bdf8" fontSize="8" fontFamily="monospace" textAnchor="middle" className="pointer-events-none">Hogtown Creek Basin (84 ft)</text>

                <ellipse cx="400" cy="210" rx="60" ry="45" fill="url(#sweetwater-basin)" stroke="#f43f5e" strokeWidth="0.75" strokeDasharray="3 3" className="pointer-events-none" />
                <text x="400" y="255" fill="#fb7185" fontSize="8" fontFamily="monospace" textAnchor="middle" className="pointer-events-none">Sweetwater Karst Basin</text>

                {/* Conductor Lines (Edges) */}
                {edges.map((edge) => {
                  const src = nodeMap.get(edge.source);
                  const tgt = nodeMap.get(edge.target);
                  if (!src || !tgt) return null;

                  const isTripped = edge.status === "tripped";

                  return (
                    <g key={edge.id} className="pointer-events-none">
                      <line
                        x1={src.x}
                        y1={src.y}
                        x2={tgt.x}
                        y2={tgt.y}
                        stroke={isTripped ? "#ef4444" : "#06b6d4"}
                        strokeWidth={edge.kv >= 138 ? 3 : 1.75}
                        strokeDasharray={isTripped ? "5 5" : "none"}
                        strokeOpacity={isTripped ? 0.6 : 0.85}
                      />
                      <circle
                        cx={(src.x + tgt.x) / 2}
                        cy={(src.y + tgt.y) / 2}
                        r="2.5"
                        fill={isTripped ? "#ef4444" : "#06b6d4"}
                      />
                    </g>
                  );
                })}

                {/* Nodes */}
                {nodes.map((node) => {
                  const isSelected = selectedNode?.id === node.id;
                  const color = getNodeColor(node);
                  const isHardened = params.hardenedNodes.includes(node.id);

                  return (
                    <g
                      key={node.id}
                      className="cursor-pointer transition-transform hover:scale-110"
                      onClick={() => setSelectedNode(node)}
                    >
                      {isSelected && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="22"
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="2"
                          strokeDasharray="4 2"
                          className="animate-spin"
                        />
                      )}

                      {isHardened && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="18"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="1.5"
                        />
                      )}

                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.type === "generator" ? 14 : node.type === "shelter" ? 12 : 10}
                        fill={color}
                        stroke="#0f172a"
                        strokeWidth="2.5"
                        className="drop-shadow-lg"
                      />

                      <text
                        x={node.x}
                        y={node.y + (node.type === "generator" ? -18 : 20)}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
                        className="pointer-events-none drop-shadow-md"
                      >
                        {node.name.split(" ")[0]}
                      </text>

                      <text
                        x={node.x}
                        y={node.y + (node.type === "generator" ? -8 : 28)}
                        textAnchor="middle"
                        fill={color}
                        fontSize="7.5"
                        fontWeight="bold"
                        fontFamily="monospace"
                        className="pointer-events-none"
                      >
                        [{node.status.toUpperCase()}]
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Restoration Priority Queue & Incident Stream */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Restoration Priority Ranking */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 font-mono">
                <span className="text-slate-300 font-bold flex items-center gap-1.5">
                  <ListOrdered className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Estimated Restoration Priority:</span>
                </span>
                <span className="text-[10px] text-slate-500">RPI Score</span>
              </div>

              {result.restorationPriority.length === 0 ? (
                <div className="text-slate-500 py-6 text-center font-mono text-[11px]">
                  Grid operates at 100% nominal state. No restoration backlog.
                </div>
              ) : (
                <div className="space-y-1.5 max-h-36 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 font-mono text-[11px]">
                  {result.restorationPriority.map((item, idx) => (
                    <div
                      key={item.nodeId}
                      className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-center justify-between"
                    >
                      <div className="truncate pr-2">
                        <span className="text-cyan-400 font-bold mr-1">#{idx + 1}</span>
                        <span className="text-white font-semibold">{item.name}</span>
                        <div className="text-[10px] text-slate-400 truncate">{item.rationale}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold text-[10px]">
                        {item.priorityScore}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Real-time Chronological Incident Event Stream */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 text-xs font-mono flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Chronological Failure Propagation Log</span>
                </span>
                <span className="text-[10px] text-slate-500">BFS Graph Stream</span>
              </div>
              <div className="h-36 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-slate-800 text-[10.5px]">
                {result.events.map((evt, idx) => (
                  <div
                    key={idx}
                    className={`leading-tight ${
                      evt.includes("CRITICAL") || evt.includes("BLACKOUT") ? "text-rose-400" :
                      evt.includes("TRIP") || evt.includes("DAMAGE") ? "text-amber-400" :
                      evt.includes("ISLANDING") || evt.includes("COMPLETED") ? "text-emerald-400" : "text-slate-400"
                    }`}
                  >
                    {evt}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
