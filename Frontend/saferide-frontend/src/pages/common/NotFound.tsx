import React from 'react';
import { Link } from 'react-router-dom';
import { Bus, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
          <Bus className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black font-display text-slate-900">404</h1>
        <h2 className="text-base font-bold text-slate-800 mt-1">Route Not Found</h2>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          The requested page or transit stop does not exist in SafeRide.
        </p>

        <div className="mt-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
