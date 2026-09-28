import React, { useState } from 'react';
import { Project, EarlyWarningStatus, User } from '../types';
import { EarlyWarningBadge } from './EarlyWarningBadge';
import {
  TrendingUp,
  AlertTriangle,
  AlertOctagon,
  IndianRupee,
  Layers,
  ArrowUpRight,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Send
} from 'lucide-react';

interface Props {
  projects: Project[];
  currentUser: User;
  onSelectProject: (project: Project) => void;
  onOpenAiForProject: (project: Project) => void;
  onNavigateToAi: () => void;
  onEscalateRisk: (projectId: string, riskId: string) => void;
  searchQuery: string;
}

export const DashboardView: React.FC<Props> = ({
  projects,
  currentUser,
  onSelectProject,
  onOpenAiForProject,
  onNavigateToAi,
  onEscalateRisk,
  searchQuery
}) => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedSectorFilter, setSelectedSectorFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'health' | 'slippage' | 'budget'>('slippage');

  // Aggregated Metrics
  const totalSanctionedCapex = projects.reduce((acc, p) => acc + p.financials.sanctionedBudgetCr, 0);
  const totalUtilizedCapex = projects.reduce((acc, p) => acc + p.financials.utilizedExpenditureCr, 0);
  const totalOverrunExposure = projects.reduce((acc, p) => acc + (p.financials.costOverrunEstimateCr || 0), 0);
  const avgPhysicalProgress = (projects.reduce((acc, p) => acc + p.physicalProgress.actual, 0) / projects.length).toFixed(1);

  const statusCounts = {
    green: projects.filter((p) => p.earlyWarningStatus === 'green').length,
    yellow: projects.filter((p) => p.earlyWarningStatus === 'yellow').length,
    orange: projects.filter((p) => p.earlyWarningStatus === 'orange').length,
    red: projects.filter((p) => p.earlyWarningStatus === 'red').length
  };

  const delayedProjectsCount = projects.filter((p) => p.physicalProgress.slippage > 5).length;
  const criticalOverrunCount = projects.filter((p) => p.financials.costOverrunAlert).length;

  // Filtered & Sorted Projects
  const filteredProjects = projects
    .filter((p) => {
      const matchesSearch =
        searchQuery === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.executingAgency.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.state.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatusFilter === 'all' || p.earlyWarningStatus === selectedStatusFilter;

      const matchesSector =
        selectedSectorFilter === 'all' || p.sector === selectedSectorFilter;

      return matchesSearch && matchesStatus && matchesSector;
    })
    .sort((a, b) => {
      if (sortBy === 'slippage') return b.physicalProgress.slippage - a.physicalProgress.slippage;
      if (sortBy === 'health') return a.healthScore - b.healthScore; // lowest health first
      if (sortBy === 'budget') return b.financials.sanctionedBudgetCr - a.financials.sanctionedBudgetCr;
      return 0;
    });

  // Top escalated risks across all projects
  const topRisks = projects
    .flatMap((p) =>
      p.risks.map((r) => ({
        ...r,
        project: p
      }))
    )
    .filter((r) => r.severity === 'critical' || r.severity === 'high')
    .slice(0, 5);

  const sectors = Array.from(new Set(projects.map((p) => p.sector)));

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner / Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 p-4 sm:p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              National Infrastructure Monitoring Command
            </span>
            <span className="text-xs text-slate-400">Live Telemetry & Field Feeds</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight mt-1">
            GatiShakti Infrastructure Early-Warning Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Active monitoring across {projects.length} major public infrastructure projects representing{' '}
            <span className="text-amber-400 font-semibold">₹{totalSanctionedCapex.toLocaleString()} Cr</span> in sanctioned capital outlays.
          </p>
        </div>

        <button
          onClick={onNavigateToAi}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all shrink-0 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Run AI Strategic Diagnosis</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Projects & Active Health */}
        <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Monitored Projects
            </span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono">
              {projects.length}
            </span>
            <span className="text-xs text-slate-400">Major Corridors</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Avg Physical Progress:</span>
            <span className="font-semibold text-amber-400 font-mono">{avgPhysicalProgress}%</span>
          </div>
        </div>

        {/* Card 2: Capex Sanctioned & Utilized */}
        <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Sanctioned Capex
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono">
              ₹{(totalSanctionedCapex / 1000).toFixed(1)}k Cr
            </span>
            <span className="text-xs text-emerald-400 font-medium">
              ({((totalUtilizedCapex / totalSanctionedCapex) * 100).toFixed(0)}% Utilized)
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Utilized Expenditure:</span>
            <span className="font-semibold text-slate-200 font-mono">
              ₹{totalUtilizedCapex.toLocaleString()} Cr
            </span>
          </div>
        </div>

        {/* Card 3: Early Warning Breakdown */}
        <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Early-Warning Alert Radar
            </span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-xl font-extrabold text-rose-400 font-mono">
                {statusCounts.red}
              </span>
              <span className="text-[10px] text-rose-300 uppercase font-semibold">Critical</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <span className="text-xl font-extrabold text-orange-400 font-mono">
                {statusCounts.orange}
              </span>
              <span className="text-[10px] text-orange-300 uppercase font-semibold">At Risk</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xl font-extrabold text-emerald-400 font-mono">
                {statusCounts.green}
              </span>
              <span className="text-[10px] text-emerald-300 uppercase font-semibold">On Track</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Delayed Corridors:</span>
            <span className="font-semibold text-rose-400 font-mono">{delayedProjectsCount} projects</span>
          </div>
        </div>

        {/* Card 4: Cost Overrun Exposure */}
        <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Cost Overrun Exposure
            </span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
              ₹{totalOverrunExposure.toLocaleString()} Cr
            </span>
            <span className="text-xs text-rose-400 font-medium">({criticalOverrunCount} breaches)</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Contingency Threshold:</span>
            <span className="font-semibold text-rose-400">Exceeded by 14.2%</span>
          </div>
        </div>
      </div>

      {/* Interactive Early-Warning Status Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-400 mr-1">Early-Warning Filter:</span>
          <button
            onClick={() => setSelectedStatusFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              selectedStatusFilter === 'all'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            All Projects ({projects.length})
          </button>
          <button
            onClick={() => setSelectedStatusFilter('red')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              selectedStatusFilter === 'red'
                ? 'bg-rose-500/25 text-rose-300 border border-rose-500/50 shadow-sm'
                : 'text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>Red Critical ({statusCounts.red})</span>
          </button>
          <button
            onClick={() => setSelectedStatusFilter('orange')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              selectedStatusFilter === 'orange'
                ? 'bg-orange-500/25 text-orange-300 border border-orange-500/50 shadow-sm'
                : 'text-orange-400/80 hover:text-orange-300 hover:bg-orange-500/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span>Orange At Risk ({statusCounts.orange})</span>
          </button>
          <button
            onClick={() => setSelectedStatusFilter('yellow')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              selectedStatusFilter === 'yellow'
                ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50 shadow-sm'
                : 'text-amber-400/80 hover:text-amber-300 hover:bg-amber-500/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Yellow Attention ({statusCounts.yellow})</span>
          </button>
          <button
            onClick={() => setSelectedStatusFilter('green')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              selectedStatusFilter === 'green'
                ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/50 shadow-sm'
                : 'text-emerald-400/80 hover:text-emerald-300 hover:bg-emerald-500/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Green On Track ({statusCounts.green})</span>
          </button>
        </div>

        {/* Sector and Sort dropdowns */}
        <div className="flex items-center gap-2">
          <select
            value={selectedSectorFilter}
            onChange={(e) => setSelectedSectorFilter(e.target.value)}
            className="px-2.5 py-1 text-xs bg-slate-950 text-slate-300 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Sectors</option>
            {sectors.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1 text-xs bg-slate-950 text-slate-300 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500"
          >
            <option value="slippage">Sort by Schedule Slippage</option>
            <option value="health">Sort by Health Score (Lowest)</option>
            <option value="budget">Sort by Budget (Highest)</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Projects List (2 Cols on lg) + Sidebar Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Project Monitoring Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Infrastructure Project Portfolio ({filteredProjects.length})
            </h2>
            <span className="text-xs text-slate-400">
              Showing active delivery telemetry & field updates
            </span>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/40 rounded-xl border border-dashed border-slate-800">
              <p className="text-slate-400 text-sm">No infrastructure projects match your filter criteria.</p>
              <button
                onClick={() => {
                  setSelectedStatusFilter('all');
                  setSelectedSectorFilter('all');
                }}
                className="mt-3 px-3 py-1.5 rounded-lg text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project) => {
                const slippage = project.physicalProgress.slippage;
                const isDelayed = slippage > 5;
                const isAhead = slippage < 0;

                return (
                  <div
                    key={project.id}
                    className={`p-4 sm:p-5 rounded-xl border transition-all duration-200 bg-slate-900/90 hover:bg-slate-900 hover:border-slate-700 shadow-sm ${
                      project.earlyWarningStatus === 'red'
                        ? 'border-rose-900/40 hover:border-rose-700/60'
                        : project.earlyWarningStatus === 'orange'
                        ? 'border-orange-900/40 hover:border-orange-700/60'
                        : project.earlyWarningStatus === 'yellow'
                        ? 'border-amber-900/40 hover:border-amber-700/60'
                        : 'border-slate-800'
                    }`}
                  >
                    {/* Top Row: Early Warning Status, Code, Sector, Health Score */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <EarlyWarningBadge status={project.earlyWarningStatus} size="sm" />
                        <span className="text-[11px] font-mono text-slate-400 font-semibold">
                          {project.code}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                          {project.sector}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {project.location.state}
                        </span>
                      </div>

                      {/* Health Score Pill */}
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400">Health Index:</span>
                        <span
                          className={`text-xs font-extrabold px-2 py-0.5 rounded-full font-mono ${
                            project.healthScore >= 80
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : project.healthScore >= 60
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {project.healthScore}/100
                        </span>
                      </div>
                    </div>

                    {/* Project Title & Agency */}
                    <div className="mt-2.5">
                      <h3
                        onClick={() => onSelectProject(project)}
                        className="text-base font-bold text-slate-100 hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5 group"
                      >
                        <span>{project.name}</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-amber-400 shrink-0" />
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Agency: <span className="text-slate-300 font-medium">{project.executingAgency}</span> | Contractor: <span className="text-slate-300">{project.contractor}</span>
                      </p>
                    </div>

                    {/* Progress Comparison Bar (Planned vs Actual) */}
                    <div className="mt-4 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400">Physical Progress:</span>
                          <span className="font-mono font-bold text-slate-200">
                            {project.physicalProgress.actual}% actual
                          </span>
                          <span className="text-slate-500">/</span>
                          <span className="font-mono text-slate-400">
                            {project.physicalProgress.planned}% planned
                          </span>
                        </div>

                        {/* Slippage badge */}
                        <div className="flex items-center gap-1 font-mono text-xs">
                          {isAhead ? (
                            <span className="text-emerald-400 font-bold">
                              +{Math.abs(slippage).toFixed(1)}% Ahead
                            </span>
                          ) : isDelayed ? (
                            <span className={`font-bold ${slippage > 20 ? 'text-rose-400' : 'text-orange-400'}`}>
                              -{slippage.toFixed(1)}% Slippage
                            </span>
                          ) : (
                            <span className="text-emerald-400 font-medium">On Schedule</span>
                          )}
                        </div>
                      </div>

                      {/* Stacked Progress Bar */}
                      <div className="relative w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                        {/* Planned Marker / Ghost Bar */}
                        <div
                          className="absolute top-0 bottom-0 bg-slate-600/40 rounded-full transition-all"
                          style={{ width: `${Math.min(project.physicalProgress.planned, 100)}%` }}
                        />
                        {/* Actual Bar */}
                        <div
                          className={`absolute top-0 bottom-0 rounded-full transition-all ${
                            project.earlyWarningStatus === 'red'
                              ? 'bg-rose-500'
                              : project.earlyWarningStatus === 'orange'
                              ? 'bg-orange-500'
                              : project.earlyWarningStatus === 'yellow'
                              ? 'bg-amber-400'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(project.physicalProgress.actual, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Financial Snapshot & Cost Overrun Badge */}
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-3 font-mono">
                        <div>
                          <span className="text-slate-400">Sanctioned: </span>
                          <span className="font-semibold text-slate-200">
                            ₹{project.financials.sanctionedBudgetCr} Cr
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">Spent: </span>
                          <span className="font-semibold text-slate-200">
                            ₹{project.financials.utilizedExpenditureCr} Cr ({project.financials.financialProgressPercent}%)
                          </span>
                        </div>
                      </div>

                      {project.financials.costOverrunAlert && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30 font-semibold font-mono text-[11px]">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Overrun Forecast: +₹{project.financials.costOverrunEstimateCr} Cr</span>
                        </div>
                      )}
                    </div>

                    {/* Warning Triggers Snippet */}
                    {project.warningReasons.length > 0 && (
                      <div className="mt-3 text-xs bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
                        <span className="text-[10px] uppercase font-bold text-amber-400/90 tracking-wider">
                          Key Early-Warning Bottleneck:
                        </span>
                        <p className="text-slate-300 mt-0.5 line-clamp-1">
                          {project.warningReasons[0]}
                        </p>
                      </div>
                    )}

                    {/* Action Footers */}
                    <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <div className="text-[11px] text-slate-400">
                        Target Completion: <span className="text-slate-300">{project.revisedCompletionDate}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onOpenAiForProject(project)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                        >
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>AI Turnaround</span>
                        </button>
                        <button
                          onClick={() => onSelectProject(project)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
                        >
                          <span>Full 360° View</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 1 Col: Portfolio Analytics & Top Bottlenecks */}
        <div className="space-y-6">
          {/* Quick AI Summary Widget */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Drishti AI Radar</span>
              </div>
              <span className="text-[10px] text-amber-300/80 bg-amber-500/20 px-2 py-0.5 rounded-full font-medium">
                Live Intelligence
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Portfolio delay exposure is concentrated in <strong>2 Red Projects</strong> (Bundelkhand Water Grid & Chennai Coastal Viaduct). Major driver: <strong>contractor working capital shortages</strong> causing supply stalls for DI pipes and precast steel.
            </p>

            <button
              onClick={onNavigateToAi}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-colors"
            >
              <span>View Full AI Corrective Action Report</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Top Bottlenecks & Escalations */}
          <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Critical Path Escalations ({topRisks.length})</span>
              </h3>
              <span className="text-[11px] text-rose-400 font-medium">PMO Review</span>
            </div>

            <div className="space-y-2.5">
              {topRisks.map((risk) => (
                <div
                  key={risk.id}
                  className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-200 line-clamp-1">
                      {risk.title}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded shrink-0 ${
                        risk.severity === 'critical'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-orange-500/20 text-orange-400'
                      }`}
                    >
                      {risk.severity}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {risk.mitigationPlan}
                  </p>

                  <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
                    <span className="truncate max-w-[140px] text-amber-400/90">
                      {risk.project.name.split(' ')[0]} {risk.project.code}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-rose-400">+{risk.impactDelayDays}d delay</span>
                      {risk.status !== 'escalated_to_pmo' && (currentUser.role === 'officer' || currentUser.role === 'admin' || currentUser.role === 'project_manager') && (
                        <button
                          onClick={() => onEscalateRisk(risk.project.id, risk.id)}
                          title="Escalate to PMO Monitoring Cell"
                          className="flex items-center gap-1 text-[10px] font-bold text-amber-400 hover:text-amber-300 underline"
                        >
                          <Send className="w-2.5 h-2.5" />
                          Escalate
                        </button>
                      )}
                      {risk.status === 'escalated_to_pmo' && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold">
                          In PMO Review
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sector-wise Capex Allocation Breakdown */}
          <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Sector Capex Allocation
            </h3>

            <div className="space-y-2">
              {sectors.map((sec) => {
                const secProjects = projects.filter((p) => p.sector === sec);
                const secSanctioned = secProjects.reduce((acc, p) => acc + p.financials.sanctionedBudgetCr, 0);
                const percent = ((secSanctioned / totalSanctionedCapex) * 100).toFixed(0);

                return (
                  <div key={sec} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 truncate max-w-[180px]">{sec}</span>
                      <span className="font-mono text-slate-400">
                        ₹{secSanctioned.toLocaleString()} Cr ({percent}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
