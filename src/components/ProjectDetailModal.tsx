import React, { useState } from 'react';
import { Project, User } from '../types';
import { EarlyWarningBadge } from './EarlyWarningBadge';
import {
  X,
  Sparkles,
  Calendar,
  Layers,
  IndianRupee,
  ShieldAlert,
  Camera,
  CheckCircle2,
  Clock,
  Send,
  Building2,
  AlertTriangle,
  Users,
  Wrench
} from 'lucide-react';

interface Props {
  project: Project | null;
  currentUser: User;
  onClose: () => void;
  onOpenAi: (project: Project) => void;
  onEscalateRisk: (projectId: string, riskId: string) => void;
}

export const ProjectDetailModal: React.FC<Props> = ({
  project,
  currentUser,
  onClose,
  onOpenAi,
  onEscalateRisk
}) => {
  if (!project) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'financials' | 'risks' | 'site_logs'>('overview');

  const slippage = project.physicalProgress.slippage;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <EarlyWarningBadge status={project.earlyWarningStatus} size="sm" />
              <span className="text-xs font-mono font-bold text-amber-400">{project.code}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {project.sector}
              </span>
              <span className="text-xs text-slate-400">
                {project.location.city}, {project.location.state}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-100">{project.name}</h2>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => {
                onClose();
                onOpenAi(project);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-xs font-bold border border-amber-500/30 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Turnaround</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-950/40 border-b border-slate-800/80 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'overview'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview & Telemetry
          </button>
          <button
            onClick={() => setActiveTab('milestones')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'milestones'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Milestones ({project.milestones.length})
          </button>
          <button
            onClick={() => setActiveTab('financials')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'financials'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Capex & Budget (₹{project.financials.sanctionedBudgetCr} Cr)
          </button>
          <button
            onClick={() => setActiveTab('risks')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'risks'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Active Risks ({project.risks.length})
          </button>
          <button
            onClick={() => setActiveTab('site_logs')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'site_logs'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Field Inspection Logs ({project.recentUpdates.length})
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 text-xs text-slate-300">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Agency & Contractor info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Executing Agency
                  </span>
                  <span className="font-semibold text-slate-200 text-xs mt-0.5 block">
                    {project.executingAgency}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Lead Contractor
                  </span>
                  <span className="font-semibold text-slate-200 text-xs mt-0.5 block">
                    {project.contractor}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Start Date
                  </span>
                  <span className="font-mono text-slate-200 text-xs mt-0.5 block">
                    {project.startDate}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Target Completion
                  </span>
                  <span className="font-mono text-amber-400 text-xs mt-0.5 block font-bold">
                    {project.revisedCompletionDate}
                  </span>
                </div>
              </div>

              {/* Progress Bar Card */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">Physical Progress vs Planned Baseline</span>
                  <span className="font-mono font-bold text-slate-100">
                    {project.physicalProgress.actual}% actual / {project.physicalProgress.planned}% planned
                  </span>
                </div>

                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden relative">
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
                  <span
                    className={`font-bold ${
                      slippage > 10 ? 'text-rose-400' : slippage < 0 ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {slippage > 0 ? `-${slippage}% Schedule Slippage` : `+${Math.abs(slippage)}% Ahead of Schedule`}
                  </span>
                </div>
              </div>

              {/* Early Warning Reasons */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  Early-Warning Triggers & Root-Cause Hindrances
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {project.warningReasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold shrink-0">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* AI Brief */}
              {project.aiBrief && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Drishti AI Corridor Assessment
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">
                    {project.aiBrief}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MILESTONES */}
          {activeTab === 'milestones' && (
            <div className="space-y-3">
              {project.milestones.map((m, idx) => (
                <div
                  key={m.id}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-500 font-bold">#{idx + 1}</span>
                        <span className="font-bold text-slate-200">{m.title}</span>
                        {m.criticalPath && (
                          <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300">
                            Critical Path
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Category: <strong className="text-slate-300">{m.category}</strong> | Weightage: {m.weightage}%
                      </div>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-xs">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Planned</span>
                        <span className="text-slate-300">{m.plannedDate}</span>
                      </div>
                      <div className="w-20">
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>{m.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full"
                            style={{ width: `${m.progress}%` }}
                          />
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          m.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : m.status === 'delayed'
                            ? 'bg-rose-500/20 text-rose-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {m.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  {m.remarks && <p className="text-[11px] text-slate-400 italic">Note: {m.remarks}</p>}
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: FINANCIALS */}
          {activeTab === 'financials' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Sanctioned</span>
                  <span className="text-base font-extrabold text-slate-200 font-mono">
                    ₹{project.financials.sanctionedBudgetCr} Cr
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Revised</span>
                  <span className="text-base font-extrabold text-slate-200 font-mono">
                    ₹{project.financials.revisedBudgetCr} Cr
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Utilized</span>
                  <span className="text-base font-extrabold text-amber-400 font-mono">
                    ₹{project.financials.utilizedExpenditureCr} Cr
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Unspent Balance</span>
                  <span className="text-base font-extrabold text-slate-400 font-mono">
                    ₹{project.financials.unspentBalanceCr} Cr
                  </span>
                </div>
              </div>

              {project.financials.costOverrunAlert && (
                <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <div>
                      <span className="font-bold text-rose-300">Cost-Overrun Breach Alert Triggered</span>
                      <p className="text-slate-300 mt-0.5">
                        Forecast expenditure escalation of ₹{project.financials.costOverrunEstimateCr} Cr over sanctioned baseline.
                      </p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-rose-400 text-sm">
                    +₹{project.financials.costOverrunEstimateCr} Cr
                  </span>
                </div>
              )}

              {/* Monthly Expenditure */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Recent Monthly Capex Outlay (₹ Crores)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                  {project.financials.monthlyExpenditure.map((m) => (
                    <div key={m.month} className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-center font-mono">
                      <div className="text-[11px] text-slate-400 font-semibold">{m.month}</div>
                      <div className="text-xs font-bold text-amber-400 mt-1">₹{m.actualCr} Cr</div>
                      <div className="text-[10px] text-slate-500">Plan: ₹{m.plannedCr} Cr</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RISKS */}
          {activeTab === 'risks' && (
            <div className="space-y-3">
              {project.risks.map((risk) => (
                <div
                  key={risk.id}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200">{risk.title}</span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {risk.category}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        risk.severity === 'critical'
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-orange-500/20 text-orange-400'
                      }`}
                    >
                      {risk.severity}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">
                    <strong className="text-amber-400">Mitigation:</strong> {risk.mitigationPlan}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                    <span>Authority: {risk.assignedAuthority}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-rose-400">+{risk.impactDelayDays}d delay</span>
                      {risk.status !== 'escalated_to_pmo' && (
                        <button
                          onClick={() => onEscalateRisk(project.id, risk.id)}
                          className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold hover:bg-rose-500/30"
                        >
                          Escalate to PMO
                        </button>
                      )}
                      {risk.status === 'escalated_to_pmo' && (
                        <span className="text-amber-400 font-bold">In PMO Review</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: SITE LOGS */}
          {activeTab === 'site_logs' && (
            <div className="space-y-3">
              {project.recentUpdates.length === 0 ? (
                <p className="text-slate-400 text-center py-6">No site updates logged yet.</p>
              ) : (
                project.recentUpdates.map((upd) => (
                  <div
                    key={upd.id}
                    className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200">{upd.officerName}</span>
                        <span className="text-[10px] text-amber-400 font-mono">({upd.officerRole})</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">{upd.siteLocation}</span>
                      </div>
                      <span className="font-mono text-slate-500 text-[11px]">{upd.timestamp}</span>
                    </div>

                    <p className="text-xs text-slate-300">{upd.remarks}</p>

                    <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono pt-1">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-blue-400" />
                        {upd.workforceCount} Labor
                      </span>
                      <span className="flex items-center gap-1">
                        <Wrench className="w-3 h-3 text-emerald-400" />
                        {upd.machineryActive} Machinery
                      </span>
                      <span>Weather: {upd.weatherCondition}</span>
                      <span className="text-amber-400 font-bold">
                        Reported Progress: {upd.reportedPhysicalProgress}%
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
