import React from 'react';
import { EarlyWarningStatus } from '../types';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info } from 'lucide-react';

interface Props {
  status: EarlyWarningStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  pulse?: boolean;
}

export const EarlyWarningBadge: React.FC<Props> = ({
  status,
  size = 'md',
  showLabel = true,
  pulse = true
}) => {
  const config = {
    green: {
      label: 'On Track',
      code: 'GREEN',
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      dot: 'bg-emerald-400',
      glow: 'shadow-emerald-500/20',
      icon: CheckCircle2
    },
    yellow: {
      label: 'Attention',
      code: 'YELLOW',
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      dot: 'bg-amber-400',
      glow: 'shadow-amber-500/20',
      icon: Info
    },
    orange: {
      label: 'At Risk',
      code: 'ORANGE',
      bg: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      dot: 'bg-orange-400',
      glow: 'shadow-orange-500/20',
      icon: AlertTriangle
    },
    red: {
      label: 'Critical',
      code: 'RED',
      bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      dot: 'bg-rose-400',
      glow: 'shadow-rose-500/20',
      icon: AlertOctagon
    }
  }[status];

  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-2'
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-sm ${config.bg} ${config.glow} ${sizeClasses}`}
      title={`Early Warning Classification: ${config.label} (${config.code})`}
    >
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dot}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dot}`} />
      </span>
      <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
};
