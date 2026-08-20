import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Unauthorized: React.FC = () => {
  const { user } = useAuth();

  const getHomeLink = () => {
    if (!user) return '/login';
    const role = String(user.role).toUpperCase();
    if (role.includes('ADMIN')) return '/admin/dashboard';
    if (role.includes('DRIVER')) return '/driver/dashboard';
    return '/parent/dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Access Restricted</h1>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          Your account role (<strong className="text-slate-700">{user?.role || 'Guest'}</strong>) does not have permission to view this resource.
        </p>

        <div className="mt-6">
          <Link
            to={getHomeLink()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
