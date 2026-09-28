import React, { useState } from 'react';
import { Project, User } from '../types';
import {
  IndianRupee,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Wallet,
  Coins,
  ShieldCheck,
  FileSpreadsheet,
  AlertOctagon,
  ArrowUpRight
} from 'lucide-react';

interface Props {
  projects: Project[];
  currentUser: User;
  onSelectProject: (project: Project) => void;
  onOpenAiForProject: (project: Project) => void;
}

export const CapexFinancialsView: React.FC<Props> = ({
  projects,
  currentUser,
  onSelectProject,
  onOpenAiForProject
}) => {
  const [filterOverrunOnly, setFilterOverrunOnly] = useState(false);

  const totalSanctioned = projects.reduce((acc, p) => acc + p.financials.sanctionedBudgetCr, 0);
  const totalRevised = projects.reduce((acc, p) => acc + p.financials.revisedBudgetCr, 0);
  const totalDisbursed = projects.reduce((acc, p) => acc + p.financials.disbursedCr, 0);
  const totalUtilized = projects.reduce((acc, p) => acc + p.financials.utilizedExpenditureCr, 0);
  const totalUnspent = projects.reduce((acc, p) => acc + p.financials.unspentBalanceCr, 0);
  const totalOverrunForecast = projects.reduce((acc, p) => acc + (p.financials.costOverrunEstimateCr || 0), 0);

  const overrunProjects = projects.filter((p) => p.financials.costOverrunAlert);
  const displayProjects = filterOverrunOnly ? overrunProjects : projects;

  // Monthly aggregated Capex burn (using the months from the first project as template)
  const sampleMonths = projects[0]?.financials.monthlyExpenditure || [];
  const monthlyAggregated = sampleMonths.map((m, idx) => {
    let plannedTotal = 0;
    let actualTotal = 0;
    projects.forEach((p) => {
      const entry = p.financials.monthlyExpenditure[idx];
      if (entry) {
        plannedTotal += entry.plannedCr;
        actualTotal += entry.actualCr;
      }
    });
    return {
      month: m.month,
      plannedCr: plannedTotal,
      actualCr: actualTotal
    };
  });

  const maxMonthValue = Math.max(...monthlyAggregated.map((m) => Math.max(m.plannedCr, m.actualCr)), 1);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              National Capex Governance Portal
            </span>
            <span className="text-xs text-slate-400">Public Accounts & Expenditure Cell</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight mt-1">
            Budget vs Actual Expenditure & Cost-Overrun Monitor
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Audit Capex fund releases, track financial burn rates, and detect early cost escalation vulnerabilities.
          </p>
        </div>

        <button
          onClick={() => setFilterOverrunOnly(!filterOverrunOnly)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
            filterOverrunOnly
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
              : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          <span>Cost-Overrun Breaches Only ({overrunProjects.length})</span>
        </button>
      </div>

      {/* KPI Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sanctioned */}
        <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span>Sanctioned Budget</span>
            <Coins className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono">
            ₹{totalSanctioned.toLocaleString()} Cr
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800">
            <span>Revised Estimates:</span>
            <span className="font-mono text-slate-300 font-semibold">₹{totalRevised.toLocaleString()} Cr</span>
          </div>
        </div>

        {/* Disbursed to Agencies */}
        <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span>Disbursed Outlays</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
            ₹{totalDisbursed.toLocaleString()} Cr
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800">
            <span>Disbursal Ratio:</span>
            <span className="font-mono text-emerald-300 font-semibold">
              {((totalDisbursed / totalSanctioned) * 100).toFixed(1)}% of Sanctioned
            </span>
          </div>
        </div>

        {/* Utilized Expenditure */}
        <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span>Utilized Expenditure</span>
            <IndianRupee className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
            ₹{totalUtilized.toLocaleString()} Cr
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800">
            <span>Unspent Balance with Agencies:</span>
            <span className="font-mono text-slate-300 font-semibold">₹{totalUnspent.toLocaleString()} Cr</span>
          </div>
        </div>

        {/* Overrun Exposure */}
        <div className="bg-slate-900/80 rounded-xl p-4 border border-rose-900/40 bg-gradient-to-br from-rose-950/20 to-slate-900">
          <div className="flex items-center justify-between text-xs text-rose-300 font-semibold uppercase tracking-wider">
            <span>Total Overrun Risk</span>
            <AlertOctagon className="w-4 h-4 text-rose-400 animate-pulse" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono">
            ₹{totalOverrunForecast.toLocaleString()} Cr
          </div>
          <div className="mt-2 text-xs text-rose-300/80 flex items-center justify-between pt-2 border-t border-rose-900/50">
            <span>Breached Projects:</span>
            <span className="font-mono font-bold text-rose-300">{overrunProjects.length} of {projects.length}</span>
          </div>
        </div>
      </div>

      {/* Monthly Capex Burn Chart */}
      <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Portfolio Monthly Capex Trajectory (Planned vs Actual Spend)
            </h3>
            <p className="text-xs text-slate-400">
              Values in ₹ Crores per month across all monitored infrastructure corridors
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-600" />
              <span className="text-slate-400">Planned Capex</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-500" />
              <span className="text-amber-400">Actual Outlay</span>
            </div>
          </div>
        </div>

        {/* Bar Chart Representation */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 pt-4">
          {monthlyAggregated.map((m) => {
            const plannedHeight = (m.plannedCr / maxMonthValue) * 120;
            const actualHeight = (m.actualCr / maxMonthValue) * 120;
            const deficit = m.plannedCr - m.actualCr;

            return (
              <div key={m.month} className="flex flex-col items-center space-y-2">
                <div className="h-32 w-full flex items-end justify-center gap-2 px-2 bg-slate-950/60 rounded-xl p-2 border border-slate-800/80">
                  {/* Planned Bar */}
                  <div
                    className="w-1/2 bg-slate-600/70 hover:bg-slate-500 rounded-t transition-all relative group"
                    style={{ height: `${Math.max(plannedHeight, 10)}px` }}
                  >
                    <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono bg-slate-800 text-slate-200 px-1 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-10">
                      ₹{m.plannedCr} Cr
                    </span>
                  </div>
                  {/* Actual Bar */}
                  <div
                    className="w-1/2 bg-amber-500 hover:bg-amber-400 rounded-t transition-all relative group"
                    style={{ height: `${Math.max(actualHeight, 10)}px` }}
                  >
                    <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono bg-amber-500 text-slate-950 font-bold px-1 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-10">
                      ₹{m.actualCr} Cr
                    </span>
                  </div>
                </div>

                <div className="text-center font-mono">
                  <div className="text-xs font-semibold text-slate-200">{m.month}</div>
                  <div className={`text-[10px] ${deficit > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {deficit > 0 ? `-${deficit} Cr lag` : `+${Math.abs(deficit)} Cr`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Project Financial Breakdown Table */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Project Financial Ledger & Fiscal Burn Rate
            </h3>
            <p className="text-xs text-slate-400">
              Comparing Physical vs Financial Progress disparity (high financial progress with lagging physical indicates severe inefficiency)
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-800 tracking-wider">
              <tr>
                <th className="p-3.5 pl-5">Project Details</th>
                <th className="p-3.5">Sanctioned</th>
                <th className="p-3.5">Utilized</th>
                <th className="p-3.5">Unspent</th>
                <th className="p-3.5">Physical vs Financial</th>
                <th className="p-3.5">Overrun Alert</th>
                <th className="p-3.5 text-right pr-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {displayProjects.map((p) => {
                const physical = p.physicalProgress.actual;
                const financial = p.financials.financialProgressPercent;
                const disparity = financial - physical; // if positive, spent faster than built!

                return (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Project */}
                    <td className="p-3.5 pl-5 font-sans">
                      <div className="font-bold text-slate-100">{p.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                        <span>{p.code}</span>
                        <span>•</span>
                        <span>{p.executingAgency}</span>
                      </div>
                    </td>

                    {/* Sanctioned */}
                    <td className="p-3.5 text-slate-200 font-semibold">
                      ₹{p.financials.sanctionedBudgetCr} Cr
                    </td>

                    {/* Utilized */}
                    <td className="p-3.5 text-slate-200">
                      ₹{p.financials.utilizedExpenditureCr} Cr
                    </td>

                    {/* Unspent */}
                    <td className="p-3.5 text-slate-400">
                      ₹{p.financials.unspentBalanceCr} Cr
                    </td>

                    {/* Progress Comparison */}
                    <td className="p-3.5 font-sans">
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="text-slate-200">{physical}% phy</span>
                        <span className="text-slate-500">vs</span>
                        <span className="text-amber-400">{financial}% fin</span>
                      </div>
                      <div className="text-[10px] mt-0.5">
                        {disparity > 15 ? (
                          <span className="text-rose-400 font-bold">
                            ⚠️ Severe Disparity (+{disparity.toFixed(1)}% cash lead)
                          </span>
                        ) : (
                          <span className="text-slate-400">Aligned within tolerance</span>
                        )}
                      </div>
                    </td>

                    {/* Overrun Alert */}
                    <td className="p-3.5 font-sans">
                      {p.financials.costOverrunAlert ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold text-[11px]">
                          <AlertTriangle className="w-3 h-3" />
                          +₹{p.financials.costOverrunEstimateCr} Cr
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-medium">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Within Budget
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="p-3.5 text-right pr-5 font-sans">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onOpenAiForProject(p)}
                          className="px-2 py-1 rounded text-xs font-semibold bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition-colors"
                        >
                          Remediation
                        </button>
                        <button
                          onClick={() => onSelectProject(p)}
                          className="p-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
