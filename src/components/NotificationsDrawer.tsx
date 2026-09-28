import React from 'react';
import { NotificationItem } from '../types';
import { EarlyWarningBadge } from './EarlyWarningBadge';
import { X, Bell, Check, AlertOctagon, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onSelectProjectById: (projectId: string) => void;
}

export const NotificationsDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSelectProjectById
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-100">
                  Early-Warning Alert Feed
                </h2>
                <p className="text-xs text-slate-400">
                  Real-time alerts for delays, budget breaches & risks
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Mark Read Action */}
          <div className="px-5 py-2.5 bg-slate-950/40 border-b border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono">
              {notifications.filter((n) => !n.read).length} unread alerts
            </span>
            <button
              onClick={onMarkAllAsRead}
              className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark all as read</span>
            </button>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                No active early-warning notifications.
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectProjectById(item.projectId);
                    onClose();
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    item.severity === 'red'
                      ? 'border-rose-500/40 bg-rose-950/15 hover:border-rose-500/60'
                      : item.severity === 'orange'
                      ? 'border-orange-500/40 bg-orange-950/15 hover:border-orange-500/60'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                  } ${!item.read ? 'ring-1 ring-amber-500/30' : 'opacity-85'}`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <EarlyWarningBadge status={item.severity} size="sm" />
                    <span className="text-[10px] font-mono text-slate-400">{item.timestamp}</span>
                  </div>

                  <h3 className="font-bold text-slate-200 text-xs">{item.title}</h3>
                  <p className="text-slate-300 text-[11px] mt-1 leading-relaxed">
                    {item.message}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-mono text-amber-400/90 truncate max-w-[200px]">
                      {item.projectName}
                    </span>
                    <span className="text-amber-400 font-semibold hover:underline">
                      Inspect &rarr;
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
