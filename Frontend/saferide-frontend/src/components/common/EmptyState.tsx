import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = Inbox,
  actionText,
  onAction,
}) => {
  return (
    <div className="py-12 px-6 text-center flex flex-col items-center justify-center">
      <div className="w-14 h-14 rounded-2xl bg-[#0a0a0a] border border-[#1e293b] flex items-center justify-center text-slate-500 mb-4 shadow-2xs">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#38bdf8] hover:bg-sky-400 text-slate-950 text-sm font-bold rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-sky-400"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
