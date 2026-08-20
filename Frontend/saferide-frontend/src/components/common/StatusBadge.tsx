import React from 'react';
import { AttendanceStatus, DriverStatus, EntityStatus, RideStatus, VehicleStatus } from '../../types';

interface StatusBadgeProps {
  status: string | EntityStatus | VehicleStatus | DriverStatus | RideStatus | AttendanceStatus | undefined;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  if (!status) return null;

  const s = String(status).toUpperCase();

  let colorClasses = 'bg-slate-900 text-slate-300 border-slate-800';
  let dotColor = 'bg-slate-400';

  if (s === 'ACTIVE' || s === 'AVAILABLE' || s === 'COMPLETED' || s === 'BOARDED') {
    colorClasses = 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60';
    dotColor = 'bg-emerald-400';
  } else if (s === 'IN_PROGRESS' || s === 'ON_DUTY' || s === 'MAINTENANCE') {
    colorClasses = 'bg-amber-950/40 text-amber-300 border-amber-800/60';
    dotColor = 'bg-amber-400 animate-pulse';
  } else if (s === 'SCHEDULED' || s === 'PENDING' || s === 'DROPPED') {
    colorClasses = 'bg-sky-950/40 text-sky-300 border-sky-800/60';
    dotColor = 'bg-[#38bdf8]';
  } else if (s === 'INACTIVE' || s === 'OFF_DUTY' || s === 'CANCELLED' || s === 'OUT_OF_SERVICE' || s === 'ABSENT' || s === 'DELAYED') {
    colorClasses = 'bg-rose-950/40 text-rose-300 border-rose-800/60';
    dotColor = 'bg-rose-400';
  }

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs font-medium px-2.5 py-1',
    lg: 'text-sm font-medium px-3 py-1.5',
  }[size];

  const formattedLabel = s
    .split('_')
    .map(w => w.charAt(0) + w.slice(1).toLowerCase())
    .join(' ');

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${colorClasses} ${sizeClasses} whitespace-nowrap shadow-2xs font-medium`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{formattedLabel}</span>
    </span>
  );
};
