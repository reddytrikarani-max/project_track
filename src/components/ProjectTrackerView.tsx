import React, { useState } from 'react';
import { Project, Milestone, User } from '../types';
import { EarlyWarningBadge } from './EarlyWarningBadge';
import {
  Layers,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Filter,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Minus
} from 'lucide-react';

interface Props {
  projects: Project[];
  currentUser: User;
  onUpdateMilestoneProgress: (projectId: string, milestoneId: string, newProgress: number) => void;
  onSelectProject: (project: Project) => void;
  onOpenAiForProject: (project: Project) => void;
}

export const ProjectTrackerView: React.FC<Props> = ({
  projects,
  currentUser,
  onUpdateMilestoneProgress,
  onSelectProject,
  onOpenAiForProject
}) => {
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(projects[0]?.id || null);
  const [filterSector, setFilterSector] = useState<string>('all');
  const [filterDelayedOnly, setFilterDelayedOnly] = useState<boolean>(false);
  const [filterCriticalOnly, setFilterCriticalOnly] = useState<boolean>(false);

  const sectors = Array.from(new Set(projects.map((p) => p.sector)));

  const filteredProjects = projects.filter((p) => {
    if (filterSector !== 'all' && p.sector !== filterSector) return false;
    if (filterDelayedOnly && p.physicalProgress.slippage <= 5) return false;
    return true;
  });

  const canEditMilestones =
    currentUser.role === 'admin' ||
    currentUser.role === 'project_manager' ||
    currentUser.role === 'field_officer';

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Milestone Progress Control Engine
            </span>
            <span className="text-xs text-slate-400">Planned vs Actual S-Curve Tracker</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight mt-1">
            Project & Milestone Execution Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Compare planned vs actual physical progress, monitor critical path dependencies, and inspect milestone sign-offs.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterSector}
            onChange={(e) => setFilterSector(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-950 text-slate-300 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Infrastructure Sectors</option>
            {sectors.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            onClick={() => setFilterDelayedOnly(!filterDelayedOnly)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              filterDelayedOnly
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            Delayed Only (&gt;5% slippage)
          </button>

          <button
            onClick={() => setFilterCriticalOnly(!filterCriticalOnly)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              filterCriticalOnly
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            Critical Path Only
          </button>
        </div>
      </div>

      {/* Projects Timeline Table / Expandable Cards */}
      <div className="space-y-4">
        {filteredProjects.map((project) => {
          const isExpanded = expandedProjectId === project.id;
          const slippage = project.physicalProgress.slippage;
          const isDelayed = slippage > 5;
          const isAhead = slippage < 0;

          // Milestone metrics
          const totalMilestones = project.milestones.length;
          const completedMilestones = project.milestones.filter((m) => m.status === 'completed').length;
          const delayedMilestones = project.milestones.filter((m) => m.status === 'delayed').length;

          const displayMilestones = filterCriticalOnly
            ? project.milestones.filter((m) => m.criticalPath)
            : project.milestones;

          return (
            <div
              key={project.id}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isExpanded
                  ? 'border-amber-500/40 bg-slate-900 shadow-lg shadow-amber-500/5'
                  : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
              }`}
            >
              {/* Project Summary Header Bar */}
              <div
                onClick={() => setExpandedProjectId(isExpanded ? null : project.id)}
                className="p-4 sm:p-5 cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-4 select-none hover:bg-slate-800/40 transition-colors"
              >
                {/* Left Info */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <EarlyWarningBadge status={project.earlyWarningStatus} size="sm" />
                    <span className="text-xs font-mono text-slate-400 font-semibold">{project.code}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {project.sector}
                    </span>
                    <span className="text-xs text-slate-400">{project.location.city}, {project.location.state}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <span>{project.name}</span>
                  </h3>

                  <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3">
                    <span>Agency: <strong className="text-slate-300">{project.executingAgency}</strong></span>
                    <span>•</span>
                    <span>Start: <span className="text-slate-300">{project.startDate}</span></span>
                    <span>•</span>
                    <span>Target: <span className="text-slate-300">{project.revisedCompletionDate}</span></span>
                  </div>
                </div>

                {/* Center / Right: Progress Bar & Milestone Counters */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6">
                  {/* Progress Comparison */}
                  <div className="w-full sm:w-56 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Physical Progress:</span>
                      <span className="font-mono font-bold text-slate-200">
                        {project.physicalProgress.actual}% / {project.physicalProgress.planned}%
                      </span>
                    </div>

                    <div className="relative w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 bottom-0 bg-slate-600/50 rounded-full"
                        style={{ width: `${project.physicalProgress.planned}%` }}
                      />
                      <div
                        className={`absolute top-0 bottom-0 rounded-full ${
                          project.earlyWarningStatus === 'red'
                            ? 'bg-rose-500'
                            : project.earlyWarningStatus === 'orange'
                            ? 'bg-orange-500'
                            : project.earlyWarningStatus === 'yellow'
                            ? 'bg-amber-400'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${project.physicalProgress.actual}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-500">Planned (grey) vs Actual</span>
                      {isAhead ? (
                        <span className="text-emerald-400 flex items-center gap-0.5">
                          <TrendingUp className="w-3 h-3" />+{Math.abs(slippage).toFixed(1)}% Ahead
                        </span>
                      ) : isDelayed ? (
                        <span className="text-rose-400 flex items-center gap-0.5">
                          <TrendingDown className="w-3 h-3" />-{slippage.toFixed(1)}% Slippage
                        </span>
                      ) : (
                        <span className="text-emerald-400 flex items-center gap-0.5">
                          <Minus className="w-3 h-3" />On Schedule
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Milestone Counts */}
                  <div className="flex items-center gap-3 text-xs bg-slate-950/60 px-3 py-2 rounded-lg border border-slate-800">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Done</div>
                      <div className="font-mono font-bold text-emerald-400">
                        {completedMilestones}/{totalMilestones}
                      </div>
                    </div>
                    <div className="w-px h-6 bg-slate-800" />
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Delayed</div>
                      <div className="font-mono font-bold text-rose-400">
                        {delayedMilestones}
                      </div>
                    </div>
                  </div>

                  {/* Expand Chevron */}
                  <div className="p-1 rounded-lg bg-slate-800 text-slate-300 self-center">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded Milestone Deep-Dive */}
              {isExpanded && (
                <div className="border-t border-slate-800/80 bg-slate-950/70 p-4 sm:p-6 space-y-4">
                  {/* Action Bar inside Expanded */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        Milestone Schedule & Work Package Breakdown ({displayMilestones.length})
                      </span>
                      {canEditMilestones && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {currentUser.roleTitle}: Edit Enabled
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenAiForProject(project)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>AI Turnaround Plan</span>
                      </button>
                      <button
                        onClick={() => onSelectProject(project)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
                      >
                        <span>Project 360° Specs</span>
                      </button>
                    </div>
                  </div>

                  {/* Milestone Cards / Rows */}
                  <div className="space-y-3">
                    {displayMilestones.map((m, idx) => {
                      const isComplete = m.status === 'completed';
                      const isMDelayed = m.status === 'delayed';

                      return (
                        <div
                          key={m.id}
                          className={`p-3.5 rounded-xl border transition-all bg-slate-900/90 ${
                            isComplete
                              ? 'border-emerald-500/30 bg-emerald-950/10'
                              : isMDelayed
                              ? 'border-rose-500/40 bg-rose-950/10'
                              : 'border-slate-800'
                          }`}
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                            {/* Milestone Title & Category */}
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[11px] font-mono text-slate-500 font-bold">
                                  #{idx + 1}
                                </span>
                                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                                  {m.category}
                                </span>
                                {m.criticalPath && (
                                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                    Critical Path
                                  </span>
                                )}
                                <span className="text-xs text-slate-400">
                                  Weightage: <strong className="text-slate-300 font-mono">{m.weightage}%</strong>
                                </span>
                              </div>

                              <div className="font-semibold text-slate-200 text-sm">
                                {m.title}
                              </div>

                              {m.remarks && (
                                <p className="text-xs text-slate-400 italic">
                                  Note: {m.remarks}
                                </p>
                              )}
                            </div>

                            {/* Dates & Status */}
                            <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                              <div>
                                <span className="text-slate-500 block text-[10px]">Planned Date</span>
                                <span className="text-slate-300 flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-slate-400" />
                                  {m.plannedDate}
                                </span>
                              </div>

                              {m.actualDate && (
                                <div>
                                  <span className="text-slate-500 block text-[10px]">Actual Date</span>
                                  <span className="text-emerald-400 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" />
                                    {m.actualDate}
                                  </span>
                                </div>
                              )}

                              {/* Progress Slider / Controls */}
                              <div className="w-32 space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="text-slate-400">Progress</span>
                                  <span className="font-bold text-amber-400 font-mono">{m.progress}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all ${
                                      isComplete
                                        ? 'bg-emerald-500'
                                        : isMDelayed
                                        ? 'bg-rose-500'
                                        : 'bg-amber-500'
                                    }`}
                                    style={{ width: `${m.progress}%` }}
                                  />
                                </div>
                              </div>

                              {/* Status Tag & Fast-Update Buttons for authorized roles */}
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${
                                    isComplete
                                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                      : isMDelayed
                                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                  }`}
                                >
                                  {m.status.replace('_', ' ')}
                                </span>

                                {canEditMilestones && !isComplete && (
                                  <button
                                    onClick={() => onUpdateMilestoneProgress(project.id, m.id, 100)}
                                    title="Mark Milestone as 100% Completed"
                                    className="px-2 py-1 rounded text-[10px] font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-colors"
                                  >
                                    Sign Off (100%)
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
