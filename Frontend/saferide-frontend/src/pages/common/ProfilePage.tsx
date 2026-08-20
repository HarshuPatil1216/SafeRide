import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { authService } from '../../services/authService';
import { User, Mail, Phone, Lock, Shield, CheckCircle, AlertCircle, KeyRound } from 'lucide-react';
import { ChangePasswordRequest } from '../../types';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordRequest>();

  const onSubmitPassword = async (data: ChangePasswordRequest) => {
    setSuccessMsg(null);
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await authService.changePassword(data);
      setSuccessMsg('Your account password has been successfully updated.');
      reset();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update password. Please check your current password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black font-display tracking-tight text-slate-900">
          User Account & Security
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review your SafeRide profile credentials and update your security password
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-3xl bg-blue-600 text-white font-bold text-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
            {user?.firstName?.charAt(0) || 'U'}
            {user?.lastName?.charAt(0) || ''}
          </div>

          <h3 className="text-base font-bold text-slate-900">
            {user?.firstName} {user?.lastName}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>

          <span className="mt-3 px-3 py-1 rounded-full text-xs font-semibold uppercase bg-purple-50 text-purple-700 border border-purple-200">
            {user?.role}
          </span>

          <div className="w-full mt-6 pt-6 border-t border-slate-100 text-left space-y-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="truncate">{user?.email}</span>
            </div>
            {user?.phone && (
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{user?.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Change Password Form */}
        <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-5">
            <KeyRound className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Update Password</h3>
              <p className="text-xs text-slate-500">Ensure a minimum of 8 characters for account safety</p>
            </div>
          </div>

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Current Password *
              </label>
              <input
                type="password"
                {...register('currentPassword', { required: 'Current password is required' })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="••••••••••••"
              />
              {errors.currentPassword && (
                <p className="text-xs text-rose-500 mt-1">{errors.currentPassword.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                New Password *
              </label>
              <input
                type="password"
                {...register('newPassword', {
                  required: 'New password is required',
                  minLength: { value: 6, message: 'Minimum 6 characters' },
                })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="••••••••••••"
              />
              {errors.newPassword && (
                <p className="text-xs text-rose-500 mt-1">{errors.newPassword.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Confirm New Password *
              </label>
              <input
                type="password"
                {...register('confirmPassword', { required: 'Please confirm new password' })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="••••••••••••"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? 'Updating...' : 'Save New Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
