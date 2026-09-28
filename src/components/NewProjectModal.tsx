import React, { useState } from 'react';
import { Project, ProjectSector, EarlyWarningStatus } from '../types';
import { X, Plus, Building2, IndianRupee, MapPin } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (project: Project) => void;
}

export const NewProjectModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onAddProject
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [code, setCode] = useState(`NHAI-${new Date().getFullYear()}-COR-${Math.floor(Math.random() * 90 + 10)}`);
  const [sector, setSector] = useState<ProjectSector>('Highways & Expressways');
  const [executingAgency, setExecutingAgency] = useState('National Highways Authority of India (NHAI)');
  const [contractor, setContractor] = useState('Tata Projects - HCC Consortium');
  const [sanctionedBudgetCr, setSanctionedBudgetCr] = useState<number>(3500);
  const [state, setState] = useState('Gujarat');
  const [city, setCity] = useState('Ahmedabad-Dholera');
  const [plannedProgress, setPlannedProgress] = useState<number>(30);
  const [actualProgress, setActualProgress] = useState<number>(28);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const slippage = Number((plannedProgress - actualProgress).toFixed(1));
    let status: EarlyWarningStatus = 'green';
    if (slippage > 25) status = 'red';
    else if (slippage > 15) status = 'orange';
    else if (slippage > 5) status = 'yellow';

    const newProj: Project = {
      id: `proj-${Date.now()}`,
      code,
      name,
      sector,
      executingAgency,
      contractor,
      startDate: '2023-04-01',
      plannedCompletionDate: '2026-03-31',
      revisedCompletionDate: '2026-06-30',
      earlyWarningStatus: status,
      warningReasons: slippage > 5 ? [`Initial physical slippage of ${slippage}% detected on subgrade works.`] : ['Project initiated within sanctioned parameters.'],
      healthScore: Math.max(30, Math.min(100, Math.round(100 - slippage * 2))),
      physicalProgress: {
        planned: plannedProgress,
        actual: actualProgress,
        slippage,
        trend: slippage > 0 ? 'declining' : 'improving'
      },
      financials: {
        sanctionedBudgetCr,
        revisedBudgetCr: sanctionedBudgetCr,
        disbursedCr: Math.round(sanctionedBudgetCr * 0.4),
        utilizedExpenditureCr: Math.round(sanctionedBudgetCr * 0.35),
        unspentBalanceCr: Math.round(sanctionedBudgetCr * 0.05),
        costOverrunAlert: slippage > 15,
        costOverrunEstimateCr: slippage > 15 ? Math.round(sanctionedBudgetCr * 0.08) : 0,
        financialProgressPercent: 35,
        monthlyExpenditure: [
          { month: 'Oct 2025', plannedCr: 60, actualCr: 55 },
          { month: 'Nov 2025', plannedCr: 65, actualCr: 62 },
          { month: 'Dec 2025', plannedCr: 70, actualCr: 68 },
          { month: 'Jan 2026', plannedCr: 75, actualCr: 71 },
          { month: 'Feb 2026', plannedCr: 80, actualCr: 78 },
          { month: 'Mar 2026', plannedCr: 85, actualCr: 82 }
        ]
      },
      milestones: [
        {
          id: `m-init-1`,
          title: 'Detailed Project Report (DPR) & Financial Sanction',
          category: 'Clearance',
          plannedDate: '2023-06-30',
          actualDate: '2023-06-15',
          weightage: 20,
          progress: 100,
          status: 'completed',
          criticalPath: true
        },
        {
          id: `m-init-2`,
          title: 'Land Acquisition & Environmental Impact Clearances',
          category: 'Clearance',
          plannedDate: '2024-03-31',
          weightage: 30,
          progress: 80,
          status: 'in_progress',
          criticalPath: true
        },
        {
          id: `m-init-3`,
          title: 'Substructure & Pavement Works',
          category: 'Civil Works',
          plannedDate: '2025-06-30',
          weightage: 50,
          progress: actualProgress,
          status: slippage > 5 ? 'delayed' : 'in_progress',
          criticalPath: true
        }
      ],
      risks: [
        {
          id: `r-init-1`,
          title: 'Agricultural Land Acquisition Compensation Review',
          category: 'Land Acquisition',
          severity: 'medium',
          impactCostCr: 45,
          impactDelayDays: 30,
          reportedDate: '2024-05-10',
          targetResolutionDate: '2026-11-15',
          assignedAuthority: 'District Collector',
          mitigationPlan: 'Special rehabilitation package negotiated with local Panchayats',
          status: 'mitigating'
        }
      ],
      location: {
        state,
        district: city,
        city,
        coordinates: { lat: 22.5, lng: 72.5 },
        svgCoords: { x: 26, y: 50 }
      },
      recentUpdates: [
        {
          id: `upd-init-1`,
          projectId: `proj-${Date.now()}`,
          officerName: 'Site Supervisor',
          officerRole: 'Field Officer',
          timestamp: 'Just now',
          siteLocation: 'Main Base Camp',
          reportedPhysicalProgress: actualProgress,
          weatherCondition: 'Sunny',
          workforceCount: 180,
          machineryActive: 15,
          remarks: 'Project initialized on ProjectDrishti portal.',
          photos: [],
          verified: true,
          blockerFlagged: false
        }
      ],
      aiBrief: 'Project recently onboarded into GatiShakti master monitoring matrix.'
    };

    onAddProject(newProj);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-slate-100">
              Register New Infrastructure Project
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold block">Project Corridor Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ahmedabad-Dholera Smart Expressway 6-Laning"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 text-slate-100 border border-slate-800 focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Project Code:</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 text-slate-100 border border-slate-800 font-mono text-xs focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Infrastructure Sector:</label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value as ProjectSector)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 text-slate-100 border border-slate-800 focus:outline-none focus:border-amber-500"
              >
                <option value="Highways & Expressways">Highways & Expressways</option>
                <option value="Flyovers & Bridges">Flyovers & Bridges</option>
                <option value="Water Supply & Grids">Water Supply & Grids</option>
                <option value="Urban Metro & Transit">Urban Metro & Transit</option>
                <option value="Port & Energy Logistics">Port & Energy Logistics</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Executing Agency:</label>
              <input
                type="text"
                value={executingAgency}
                onChange={(e) => setExecutingAgency(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 text-slate-100 border border-slate-800 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Sanctioned Capex (₹ Cr):</label>
              <input
                type="number"
                value={sanctionedBudgetCr}
                onChange={(e) => setSanctionedBudgetCr(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 text-slate-100 border border-slate-800 font-mono focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">State / Region:</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 text-slate-100 border border-slate-800 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">City / Corridor Stretch:</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 text-slate-100 border border-slate-800 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Planned Progress %:</label>
              <input
                type="number"
                min="0"
                max="100"
                value={plannedProgress}
                onChange={(e) => setPlannedProgress(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 text-slate-100 border border-slate-800 font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Actual Progress %:</label>
              <input
                type="number"
                min="0"
                max="100"
                value={actualProgress}
                onChange={(e) => setActualProgress(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 text-slate-100 border border-slate-800 font-mono"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20"
            >
              Register & Onboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
