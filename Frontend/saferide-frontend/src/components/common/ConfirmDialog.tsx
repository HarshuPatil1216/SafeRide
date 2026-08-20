import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: 'danger' | 'warning' | 'primary';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  variant = 'danger',
}) => {
  const variantStyles = {
    danger: {
      icon: Trash2,
      iconBg: 'bg-rose-950/40 text-rose-400 border-rose-800/60',
      buttonBg: 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500 text-white',
    },
    warning: {
      icon: AlertTriangle,
      iconBg: 'bg-amber-950/40 text-amber-400 border-amber-800/60',
      buttonBg: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500 text-white',
    },
    primary: {
      icon: AlertTriangle,
      iconBg: 'bg-[#38bdf8]/10 text-[#38bdf8] border-[#38bdf8]/30',
      buttonBg: 'bg-[#38bdf8] hover:bg-sky-400 focus:ring-sky-500 text-slate-950 font-bold',
    },
  }[variant];

  const Icon = variantStyles.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl border ${variantStyles.iconBg} shrink-0`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-slate-300 leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#1e293b]">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className={`px-4 py-2 text-sm font-semibold rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${variantStyles.buttonBg} ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Processing...' : confirmText}
        </button>
      </div>
    </Modal>
  );
};
