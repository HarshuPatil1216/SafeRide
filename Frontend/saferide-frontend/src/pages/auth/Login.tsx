import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoginRequest, UserRole } from '../../types';
import { Bus, Lock, Mail, Shield, AlertCircle, Server, CheckCircle2, Heart, UserCheck } from 'lucide-react';
import { ServerConfigModal } from '../../components/common/ServerConfigModal';
import { getBaseApiUrl } from '../../api/axios';

export const Login: React.FC = () => {
  const { login, setDemoUser } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isServerModalOpen, setIsServerModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginRequest>({
    defaultValues: {
      email: 'admin@saferide.school',
      password: 'adminPassword123',
    },
  });

  const onSubmit = async (data: LoginRequest) => {
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      const response = await login(data);
      const role = String(response.role).toUpperCase();

      if (role.includes('ADMIN')) {
        navigate('/admin/dashboard');
      } else if (role.includes('DRIVER')) {
        navigate('/driver/dashboard');
      } else {
        navigate('/parent/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(
        err.message || 'Failed to authenticate. Please verify backend server is running and credentials match.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillCredentials = (role: UserRole) => {
    if (role === UserRole.ROLE_ADMIN || role === UserRole.ADMIN) {
      setValue('email', 'admin@saferide.school');
      setValue('password', 'adminPassword123');
    } else if (role === UserRole.ROLE_DRIVER || role === UserRole.DRIVER) {
      setValue('email', 'driver@saferide.school');
      setValue('password', 'driverPassword123');
    } else {
      setValue('email', 'parent@saferide.school');
      setValue('password', 'parentPassword123');
    }
    setErrorMsg(null);
  };

  const handleDemoBypass = (role: UserRole) => {
    setDemoUser(role);
    if (role === UserRole.ADMIN || role === UserRole.ROLE_ADMIN) {
      navigate('/admin/dashboard');
    } else if (role === UserRole.DRIVER || role === UserRole.ROLE_DRIVER) {
      navigate('/driver/dashboard');
    } else {
      navigate('/parent/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e2e8f0] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Graphic Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#38bdf8]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar with Server Config */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setIsServerModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-[#0a0a0a] hover:bg-slate-800 hover:text-white border border-[#1e293b] rounded-lg transition-colors shadow-sm"
        >
          <Server className="w-3.5 h-3.5 text-[#38bdf8]" />
          <span className="font-mono text-[11px]">{getBaseApiUrl()}</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        {/* Brand Logo */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-xl bg-[#38bdf8]/10 border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8] shadow-lg">
            <Bus className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl tracking-tight text-white uppercase">
              Safe<span className="text-[#38bdf8]">Ride</span>
            </h1>
          </div>
        </div>
        <p className="text-center text-[10px] font-medium text-slate-500 uppercase tracking-[0.2em]">
          Transportation Command System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <div className="bg-[#0a0a0a] py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-[#1e293b]">
          <div className="mb-6 text-center">
            <h2 className="text-lg font-bold text-white">Sign In to SafeRide</h2>
            <p className="text-xs text-slate-400 mt-1">
              Select your role preset or enter Spring Boot JWT credentials
            </p>
          </div>

          {/* Quick Role Fillers */}
          <div className="mb-6">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 text-center">
              Quick Role Presets
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials(UserRole.ADMIN)}
                className="p-2.5 rounded-xl border border-[#1e293b] bg-[#050505] hover:bg-purple-950/30 hover:border-purple-800/50 text-slate-300 hover:text-purple-300 flex flex-col items-center gap-1 transition-all"
              >
                <Shield className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold">Admin</span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials(UserRole.DRIVER)}
                className="p-2.5 rounded-xl border border-[#1e293b] bg-[#050505] hover:bg-amber-950/30 hover:border-amber-800/50 text-slate-300 hover:text-amber-300 flex flex-col items-center gap-1 transition-all"
              >
                <Bus className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold">Driver</span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials(UserRole.PARENT)}
                className="p-2.5 rounded-xl border border-[#1e293b] bg-[#050505] hover:bg-sky-950/30 hover:border-sky-800/50 text-slate-300 hover:text-sky-300 flex flex-col items-center gap-1 transition-all"
              >
                <Heart className="w-4 h-4 text-[#38bdf8]" />
                <span className="text-xs font-bold">Parent</span>
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Authentication Error</p>
                <p className="mt-0.5 leading-relaxed">{errorMsg}</p>
                <button
                  type="button"
                  onClick={() => setIsServerModalOpen(true)}
                  className="mt-2 text-rose-400 hover:text-rose-300 underline font-semibold block"
                >
                  Configure API Base URL
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#050505] border border-[#1e293b] rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#38bdf8] focus:border-[#38bdf8] transition-all"
                  placeholder="name@saferide.school"
                />
              </div>
              {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="password"
                  {...register('password', { required: 'Password is required' })}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#050505] border border-[#1e293b] rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#38bdf8] focus:border-[#38bdf8] transition-all"
                  placeholder="••••••••••••"
                />
              </div>
              {errors.password && <p className="text-xs text-rose-400 mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-slate-950 bg-[#38bdf8] hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-md shadow-sky-500/20 transition-all disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? 'Authenticating with Spring Boot...' : 'Sign In with JWT'}
            </button>
          </form>

          {/* Quick Demo Preview Direct Access */}
          <div className="mt-6 pt-5 border-t border-[#1e293b] text-center">
            <p className="text-xs text-slate-400 mb-2.5">
              Testing UI before backend is up? Instant Portal Entry:
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handleDemoBypass(UserRole.ADMIN)}
                className="px-2.5 py-1 text-[11px] font-semibold text-purple-300 bg-purple-950/40 hover:bg-purple-900/50 rounded-lg border border-purple-800/60"
              >
                Admin UI
              </button>
              <button
                type="button"
                onClick={() => handleDemoBypass(UserRole.DRIVER)}
                className="px-2.5 py-1 text-[11px] font-semibold text-amber-300 bg-amber-950/40 hover:bg-amber-900/50 rounded-lg border border-amber-800/60"
              >
                Driver UI
              </button>
              <button
                type="button"
                onClick={() => handleDemoBypass(UserRole.PARENT)}
                className="px-2.5 py-1 text-[11px] font-semibold text-sky-300 bg-sky-950/40 hover:bg-sky-900/50 rounded-lg border border-sky-800/60"
              >
                Parent UI
              </button>
            </div>
          </div>
        </div>
      </div>

      <ServerConfigModal isOpen={isServerModalOpen} onClose={() => setIsServerModalOpen(false)} />
    </div>
  );
};
