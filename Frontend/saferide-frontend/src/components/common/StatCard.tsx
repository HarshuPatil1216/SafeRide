import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'indigo';
  trend?: {
    value: string;
    isPositive: boolean;
  };
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue',
  trend,
  onClick,
}) => {
  const colorStyles = {
    blue: {
      iconBg: 'bg-[#38bdf8]/10 text-[#38bdf8] border-[#38bdf8]/30',
      border: 'border-[#1e293b] hover:border-[#38bdf8]/50',
      valColor: 'text-[#38bdf8]',
    },
    emerald: {
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      border: 'border-[#1e293b] hover:border-emerald-500/50',
      valColor: 'text-emerald-400',
    },
    amber: {
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      border: 'border-[#1e293b] hover:border-amber-500/50',
      valColor: 'text-amber-400',
    },
    purple: {
      iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      border: 'border-[#1e293b] hover:border-purple-500/50',
      valColor: 'text-purple-400',
    },
    rose: {
      iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      border: 'border-[#1e293b] hover:border-rose-500/50',
      valColor: 'text-rose-400',
    },
    indigo: {
      iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      border: 'border-[#1e293b] hover:border-indigo-500/50',
      valColor: 'text-indigo-400',
    },
  }[color];

  return (
    <div
      onClick={onClick}
      className={`bg-[#0a0a0a] rounded-xl p-5 border shadow-xs transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:bg-slate-900/60 hover:-translate-y-0.5' : ''
      } ${colorStyles.border}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{title}</span>
        <div className={`p-2.5 rounded-lg border ${colorStyles.iconBg}`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{value}</span>
        {trend && (
          <span
            className={`text-xs font-medium ${
              trend.isPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
    </div>
  );
};
