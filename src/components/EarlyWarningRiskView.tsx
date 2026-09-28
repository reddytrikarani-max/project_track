import React, { useState } from 'react';
import { Project, RiskIssue, EarlyWarningStatus, User } from '../types';
import { EarlyWarningBadge } from './EarlyWarningBadge';
import {
  ShieldAlert,
  AlertTriangle,
  AlertOctagon,
  Clock,
  Send,
  CheckCircle2,
  Calendar,
  Filter,
  Layers,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';

interface Props {
  projects: Project[];
  currentUser: User;
  onEscalateRisk: (projectId: string, riskId: string) => void;
  onSelectProject: (project: Project) => void;
  onOpenAiForProject: (project: Project) => void;
}

export const EarlyWarningRiskView: React.FC<Props> = ({
  projects,
  currentUser,
  onEscalateRisk,
  onSelectProject,
  onOpenAiForProject
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  // Flatten all risks with project metadata
  const allRisks = projects.flatMap((p) =>
    p.risks.map((r) => ({
      ...r,
      project: p
    }))
  );

  const categories = Array.from(new Set(allRisks.map((r) => r.category)));

  const filteredRisks = allRisks.filter((r) => {
    if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;
    if (severityFilter !== 'all' && r.severity !== severityFilter) return false;
    return true;
  });

  const criticalRisksCount = allRisks.filter((r) => r.severity === 'critical').length;
  const pmoEscalatedCount = allRisks.filter((r) => r.status === 'escalated_to_pmo').length;
  const totalDelayImpactDays = allRisks.reduce((acc, r) => acc + r.impactDelayDays, 0);
  const totalCostImpactCr = allRisks.reduce((acc, r) => acc + r.impactCostCr, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
              National Early-Warning Classification Radar
            </span>
            <span className="text-xs text-slate-400">Predictive Project Risk Matrix</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight mt-1">
            Early-Warning System & Risk Radar
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Automated threshold triggers detecting land acquisition, utility relocations, and contractor liquidity freezes.
          </p>
        </div>
      </div>

      {/* Early-Warning Classification Standard Guide */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Green */}
        <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400">GREEN: ON TRACK</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <p className="text-[11px] text-slate-300">
            Slippage &lt; 5% | Budget Variance ≤ 0%. Operations running within baseline tolerances.
          </p>
        </div>

        {/* Yellow */}
        <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400">YELLOW: ATTENTION</span>
            <span className="w-2 h-2 rounded-full bg-amber-400" />
          </div>
          <p className="text-[11px] text-slate-300">
            Slippage 5-15% | Minor regulatory clearances pending (power/water shifting or seasonal weather).
          </p>
        </div>

        {/* Orange */}
        <div className="p-3.5 rounded-xl bg-orange-950/20 border border-orange-500/30 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-orange-400">ORANGE: AT RISK</span>
            <span className="w-2 h-2 rounded-full bg-orange-400" />
          </div>
          <p className="text-[11px] text-slate-300">
            Slippage 15-25% | Budget variance 5-15%. Right-of-Way disputes or critical path milestone breaches.
          </p>
        </div>

        {/* Red */}
        <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400">RED: CRITICAL</span>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          </div>
          <p className="text-[11px] text-slate-300">
            Slippage &gt; 25% | Overrun &gt; 15%. Severe contractor cash-flow freeze or legal stop-work order.
          </p>
        </div>
      </div>

      {/* Aggregate Risk Impact Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="text-xs text-slate-400 font-semibold uppercase">Total Active Risks</div>
          <div className="text-2xl font-extrabold text-slate-100 font-mono mt-1">{allRisks.length}</div>
          <div className="text-xs text-slate-400 mt-1">Across 8 national corridors</div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="text-xs text-rose-400 font-semibold uppercase">Critical Severity</div>
          <div className="text-2xl font-extrabold text-rose-400 font-mono mt-1">{criticalRisksCount}</div>
          <div className="text-xs text-rose-300/80 mt-1">Requiring Secretary escalation</div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="text-xs text-amber-400 font-semibold uppercase">In PMO Review</div>
          <div className="text-2xl font-extrabold text-amber-400 font-mono mt-1">{pmoEscalatedCount}</div>
          <div className="text-xs text-slate-400 mt-1">Direct central oversight</div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="text-xs text-slate-400 font-semibold uppercase">Cumulative Risk Cost</div>
          <div className="text-2xl font-extrabold text-slate-100 font-mono mt-1">₹{totalCostImpactCr} Cr</div>
          <div className="text-xs text-slate-400 mt-1">Estimated financial liability</div>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-400">Filter By:</span>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1 text-xs bg-slate-950 text-slate-300 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Risk Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-2.5 py-1 text-xs bg-slate-950 text-slate-300 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <span className="text-xs text-slate-400 font-mono">
          Showing {filteredRisks.length} of {allRisks.length} registered risks
        </span>
      </div>

      {/* Active Risks Cards / Register */}
      <div className="space-y-3">
        {filteredRisks.map((risk) => {
          const isPmo = risk.status === 'escalated_to_pmo';
          const isCritical = risk.severity === 'critical';

          return (
            <div
              key={risk.id}
              className={`p-4 sm:p-5 rounded-xl border transition-all duration-200 bg-slate-900/90 ${
                isCritical
                  ? 'border-rose-900/40 bg-gradient-to-r from-rose-950/15 via-slate-900 to-slate-900'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left: Project & Risk Description */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <EarlyWarningBadge status={risk.project.earlyWarningStatus} size="sm" />
                    <span className="text-xs font-mono font-semibold text-amber-400">
                      {risk.project.code}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {risk.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        isCritical
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : risk.severity === 'high'
                          ? 'bg-orange-500/20 text-orange-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {risk.severity} Severity
                    </span>
                    {isPmo && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        PMO Monitoring
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-100">
                    {risk.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong className="text-amber-400">Mitigation Strategy:</strong> {risk.mitigationPlan}
                  </p>

                  <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3 pt-1">
                    <span>
                      Authority: <strong className="text-slate-300">{risk.assignedAuthority}</strong>
                    </span>
                    <span>•</span>
                    <span>Project: <strong className="text-slate-300">{risk.project.name}</strong></span>
                    <span>•</span>
                    <span>Target Resolution: <strong className="text-slate-300">{risk.targetResolutionDate}</strong></span>
                  </div>
                </div>

                {/* Right: Metrics & Actions */}
                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                  <div className="text-right font-mono">
                    <div className="text-xs text-slate-400">Estimated Delay Impact:</div>
                    <div className="text-sm font-extrabold text-rose-400">
                      +{risk.impactDelayDays} Days ({risk.impactCostCr > 0 ? `₹${risk.impactCostCr} Cr` : 'Non-monetary'})
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isPmo && (
                      <button
                        onClick={() => onEscalateRisk(risk.project.id, risk.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition-colors"
                      >
                        <Send className="w-3 h-3" />
                        <span>Escalate to PMO</span>
                      </button>
                    )}

                    <button
                      onClick={() => onOpenAiForProject(risk.project)}
                      className="p-1.5 rounded-lg bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/20"
                      title="Generate AI Mitigation Brief"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
