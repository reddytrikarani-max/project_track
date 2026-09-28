import React, { useState } from 'react';
import { Project, EarlyWarningStatus } from '../types';
import { EarlyWarningBadge } from './EarlyWarningBadge';
import {
  MapPin,
  Layers,
  ArrowUpRight,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Filter,
  Navigation
} from 'lucide-react';

interface Props {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onOpenAiForProject: (project: Project) => void;
}

export const MapView: React.FC<Props> = ({
  projects,
  onSelectProject,
  onOpenAiForProject
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sectorFilter, setSectorFilter] = useState<string>('all');

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const sectors = Array.from(new Set(projects.map((p) => p.sector)));

  const filteredProjects = projects.filter((p) => {
    if (statusFilter !== 'all' && p.earlyWarningStatus !== statusFilter) return false;
    if (sectorFilter !== 'all' && p.sector !== sectorFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              National Infrastructure GIS Radar
            </span>
            <span className="text-xs text-slate-400">Geo-Spatial Delivery Heatmap</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight mt-1">
            Interactive Project GIS Map View
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Geographic distribution of corridors color-coded by Early-Warning classification. Click pins to inspect regional telemetry.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-950 text-slate-300 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Early-Warning Statuses</option>
            <option value="red">Red Critical Only</option>
            <option value="orange">Orange At Risk Only</option>
            <option value="yellow">Yellow Attention Only</option>
            <option value="green">Green On Track Only</option>
          </select>

          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-950 text-slate-300 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Sectors</option>
            {sectors.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Map Container: Left Interactive GIS Canvas, Right Project Telemetry Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Interactive SVG Map */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <Navigation className="w-4 h-4 text-amber-400" />
              <span>India National Infrastructure Master Plan Canvas</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> On Track
              </span>
              <span className="flex items-center gap-1 text-[11px] text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Attention
              </span>
              <span className="flex items-center gap-1 text-[11px] text-orange-400">
                <span className="w-2 h-2 rounded-full bg-orange-400" /> At Risk
              </span>
              <span className="flex items-center gap-1 text-[11px] text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" /> Critical
              </span>
            </div>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative w-full aspect-[4/3] max-h-[520px] my-4 flex items-center justify-center bg-slate-950/60 rounded-xl border border-slate-800/60 overflow-hidden">
            {/* Background Grid Pattern */}
            <svg
              className="absolute inset-0 w-full h-full opacity-15 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Stylized India Geography Vector Outline */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full p-6 transition-all duration-300 select-none"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Outer boundary polygon representation of Indian subcontinent */}
              <polygon
                points="
                  35,10 40,8 45,12 43,18 48,22 55,25 62,28 72,25 80,28 85,32 82,38 75,37 70,42 66,46 68,52 64,60 55,70 50,78 48,84 45,92 41,88 38,82 34,75 30,68 28,60 26,52 24,45 28,38 32,32 30,22 35,15
                "
                className="fill-slate-900/90 stroke-slate-700/80 hover:stroke-slate-600 transition-colors"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />

              {/* State regional partition dividers */}
              <path
                d="
                  M 35 22 Q 45 26 55 25
                  M 28 38 Q 42 42 66 46
                  M 26 52 Q 44 55 64 60
                  M 30 68 Q 42 72 55 70
                  M 44 41 L 44 65
                  M 37 31 L 48 50
                "
                fill="none"
                stroke="#334155"
                strokeWidth="0.6"
                strokeDasharray="1.5,1.5"
              />

              {/* Corridor Inter-connector Highway lines between projects */}
              <path
                d="M 37 31 L 42 50 L 30 58 L 38 78 L 48 77"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="0.8"
                strokeOpacity="0.4"
                strokeDasharray="2,2"
              />
              <path
                d="M 37 31 L 44 41 L 62 39"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="0.8"
                strokeOpacity="0.4"
                strokeDasharray="2,2"
              />

              {/* Project Interactive Pins */}
              {filteredProjects.map((p) => {
                const isSelected = p.id === selectedProjectId;
                const colorConfig = {
                  green: { fill: '#10b981', ring: 'rgba(16, 185, 129, 0.4)' },
                  yellow: { fill: '#f59e0b', ring: 'rgba(245, 158, 11, 0.4)' },
                  orange: { fill: '#f97316', ring: 'rgba(249, 115, 22, 0.4)' },
                  red: { fill: '#f43f5e', ring: 'rgba(244, 63, 94, 0.5)' }
                }[p.earlyWarningStatus];

                return (
                  <g
                    key={p.id}
                    onClick={() => setSelectedProjectId(p.id)}
                    className="cursor-pointer group"
                    style={{ transformOrigin: `${p.location.svgCoords.x}% ${p.location.svgCoords.y}%` }}
                  >
                    {/* Pulsing ring on Red or Selected */}
                    {(p.earlyWarningStatus === 'red' || isSelected) && (
                      <circle
                        cx={p.location.svgCoords.x}
                        cy={p.location.svgCoords.y}
                        r={isSelected ? 5.5 : 4}
                        fill="none"
                        stroke={colorConfig.fill}
                        strokeWidth="0.6"
                        className="animate-ping origin-center opacity-75"
                      />
                    )}

                    {/* Outer halo */}
                    <circle
                      cx={p.location.svgCoords.x}
                      cy={p.location.svgCoords.y}
                      r={isSelected ? 4 : 2.8}
                      fill={colorConfig.ring}
                      className="transition-all duration-200"
                    />

                    {/* Center Pin Node */}
                    <circle
                      cx={p.location.svgCoords.x}
                      cy={p.location.svgCoords.y}
                      r={isSelected ? 2.4 : 1.8}
                      fill={colorConfig.fill}
                      stroke="#0f172a"
                      strokeWidth="0.6"
                      className="transition-all duration-200 group-hover:scale-125"
                    />

                    {/* Label Tag on Hover/Selected */}
                    {isSelected && (
                      <g>
                        <rect
                          x={p.location.svgCoords.x + 3}
                          y={p.location.svgCoords.y - 4}
                          width={p.name.length * 1.5 + 10}
                          height="6"
                          rx="1.5"
                          fill="#0f172a"
                          stroke={colorConfig.fill}
                          strokeWidth="0.4"
                        />
                        <text
                          x={p.location.svgCoords.x + 5}
                          y={p.location.svgCoords.y}
                          fill="#f8fafc"
                          fontSize="2.4"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                        >
                          {p.location.city} ({p.physicalProgress.actual}%)
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            <span>Click any pulsating pin to inspect regional corridor telemetry</span>
            <span className="font-mono text-amber-400">Total GIS Nodes: {filteredProjects.length}</span>
          </div>
        </div>

        {/* Right 5 Cols: Selected Project Detail Telemetry Card */}
        <div className="lg:col-span-5 space-y-4">
          {selectedProject ? (
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <EarlyWarningBadge status={selectedProject.earlyWarningStatus} size="md" />
                <span className="text-xs font-mono text-slate-400 font-bold">
                  {selectedProject.code}
                </span>
              </div>

              <div>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                  {selectedProject.sector}
                </span>
                <h3 className="text-lg font-bold text-slate-100 mt-2">
                  {selectedProject.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Location: <strong className="text-slate-200">{selectedProject.location.city}, {selectedProject.location.state}</strong> (Lat {selectedProject.location.coordinates.lat}, Lng {selectedProject.location.coordinates.lng})
                </p>
              </div>

              {/* Progress & Slippage Gauge */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Planned vs Actual Progress</span>
                  <span className="font-mono font-bold text-slate-200">
                    {selectedProject.physicalProgress.actual}% / {selectedProject.physicalProgress.planned}%
                  </span>
                </div>

                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden relative">
                  <div
                    className="absolute top-0 bottom-0 bg-slate-600/50 rounded-full"
                    style={{ width: `${selectedProject.physicalProgress.planned}%` }}
                  />
                  <div
                    className={`absolute top-0 bottom-0 rounded-full ${
                      selectedProject.earlyWarningStatus === 'red'
                        ? 'bg-rose-500'
                        : selectedProject.earlyWarningStatus === 'orange'
                        ? 'bg-orange-500'
                        : selectedProject.earlyWarningStatus === 'yellow'
                        ? 'bg-amber-400'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${selectedProject.physicalProgress.actual}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-500">Schedule Slippage</span>
                  <span
                    className={
                      selectedProject.physicalProgress.slippage > 10
                        ? 'text-rose-400 font-bold'
                        : selectedProject.physicalProgress.slippage < 0
                        ? 'text-emerald-400 font-bold'
                        : 'text-amber-400'
                    }
                  >
                    {selectedProject.physicalProgress.slippage > 0
                      ? `-${selectedProject.physicalProgress.slippage}% Behind`
                      : `+${Math.abs(selectedProject.physicalProgress.slippage)}% Ahead`}
                  </span>
                </div>
              </div>

              {/* Financial Snapshot */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800 font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">Sanctioned Capex</span>
                  <span className="font-bold text-slate-200 text-sm">
                    ₹{selectedProject.financials.sanctionedBudgetCr} Cr
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Utilized</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    ₹{selectedProject.financials.utilizedExpenditureCr} Cr
                  </span>
                </div>
              </div>

              {/* Top Warning Reason */}
              {selectedProject.warningReasons.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Active Ground Hindrance:
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedProject.warningReasons[0]}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => onOpenAiForProject(selectedProject)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-xs font-bold border border-amber-500/30 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>AI Remediation Plan</span>
                </button>
                <button
                  onClick={() => onSelectProject(selectedProject)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
                >
                  <span>Full 360° Specs</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400">Select a project on the map.</div>
          )}

          {/* Quick List of Other Projects */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              All Regional GIS Nodes ({projects.length})
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProjectId(p.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                    p.id === selectedProjectId
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      : 'text-slate-300 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <EarlyWarningBadge status={p.earlyWarningStatus} size="sm" showLabel={false} />
                    <span className="font-semibold truncate">{p.name}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 shrink-0">
                    {p.location.state.split('/')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
