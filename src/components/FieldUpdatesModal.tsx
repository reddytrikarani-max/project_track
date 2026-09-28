import React, { useState } from 'react';
import { Project, FieldUpdate, User } from '../types';
import { X, Camera, MapPin, Users, Wrench, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  currentUser: User;
  onSubmitUpdate: (update: FieldUpdate) => void;
}

export const FieldUpdatesModal: React.FC<Props> = ({
  isOpen,
  onClose,
  projects,
  currentUser,
  onSubmitUpdate
}) => {
  if (!isOpen) return null;

  const [projectId, setProjectId] = useState<string>(projects[0]?.id || '');
  const [siteLocation, setSiteLocation] = useState<string>('Pier #142 / Trenching Sector 4');
  const [reportedProgress, setReportedProgress] = useState<number>(
    projects.find((p) => p.id === (projects[0]?.id || ''))?.physicalProgress.actual || 50
  );
  const [workforceCount, setWorkforceCount] = useState<number>(240);
  const [machineryActive, setMachineryActive] = useState<number>(18);
  const [weatherCondition, setWeatherCondition] = useState<string>('Clear / 31°C');
  const [remarks, setRemarks] = useState<string>('Completed viaduct segment staging. Concrete curing tests verified by CRRI.');
  const [blockerFlagged, setBlockerFlagged] = useState<boolean>(false);
  const [blockerDetails, setBlockerDetails] = useState<string>('');

  const selectedProject = projects.find((p) => p.id === projectId) || projects[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newUpdate: FieldUpdate = {
      id: `upd-${Date.now()}`,
      projectId,
      officerName: currentUser.name,
      officerRole: currentUser.roleTitle,
      timestamp: new Date().toLocaleString([], {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      siteLocation,
      reportedPhysicalProgress: Number(reportedProgress),
      weatherCondition,
      workforceCount: Number(workforceCount),
      machineryActive: Number(machineryActive),
      remarks,
      photos: [
        'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80'
      ],
      verified: true,
      blockerFlagged,
      blockerDetails: blockerFlagged ? blockerDetails : undefined
    };

    onSubmitUpdate(newUpdate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                Submit On-Site Inspection Report
              </h2>
              <p className="text-xs text-slate-400">
                Reporting as: <strong className="text-slate-300">{currentUser.name}</strong> ({currentUser.roleTitle})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Project Picker */}
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold block">Infrastructure Asset:</label>
            <select
              value={projectId}
              onChange={(e) => {
                setProjectId(e.target.value);
                const p = projects.find((proj) => proj.id === e.target.value);
                if (p) setReportedProgress(p.physicalProgress.actual);
              }}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 text-slate-200 border border-slate-800 focus:outline-none focus:border-amber-500"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} - {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Site Location & Weather */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Site Chainage / Landmark:</span>
              </label>
              <input
                type="text"
                value={siteLocation}
                onChange={(e) => setSiteLocation(e.target.value)}
                placeholder="e.g. Km 18+200 Bajghera"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 text-slate-200 border border-slate-800 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Weather / Temperature:</label>
              <input
                type="text"
                value={weatherCondition}
                onChange={(e) => setWeatherCondition(e.target.value)}
                placeholder="e.g. Clear / 30°C"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 text-slate-200 border border-slate-800 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Physical Progress Update Slider */}
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-semibold">
                Updated Physical Progress %:
              </label>
              <span className="font-mono font-bold text-amber-400 text-sm">
                {reportedProgress}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={reportedProgress}
              onChange={(e) => setReportedProgress(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0% Groundbreaking</span>
              <span>Baseline: {selectedProject?.physicalProgress.actual}%</span>
              <span>100% Commissioned</span>
            </div>
          </div>

          {/* Workforce & Machinery */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                <span>Labor Turnout (Personnel):</span>
              </label>
              <input
                type="number"
                value={workforceCount}
                onChange={(e) => setWorkforceCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 text-slate-200 border border-slate-800 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold flex items-center gap-1">
                <Wrench className="w-3.5 h-3.5 text-emerald-400" />
                <span>Active Machinery Units:</span>
              </label>
              <input
                type="number"
                value={machineryActive}
                onChange={(e) => setMachineryActive(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 text-slate-200 border border-slate-800 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          {/* Remarks */}
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold block">Site Inspection Remarks:</label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 text-slate-200 border border-slate-800 focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          {/* Blocker Flag */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={blockerFlagged}
                onChange={(e) => setBlockerFlagged(e.target.checked)}
                className="rounded accent-rose-500"
              />
              <span className="font-semibold text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Flag Critical Site Blocker / Stoppage Hindrance
              </span>
            </label>

            {blockerFlagged && (
              <input
                type="text"
                value={blockerDetails}
                onChange={(e) => setBlockerDetails(e.target.value)}
                placeholder="Describe ground hindrance (e.g. HVPNL line cut delay, contractor labor strike...)"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 text-rose-200 border border-rose-900/50 focus:outline-none focus:border-rose-500 text-xs"
                required
              />
            )}
          </div>

          {/* Submit Footer */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-md shadow-emerald-500/20"
            >
              Submit Telemetry Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
