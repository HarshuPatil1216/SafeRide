import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDriverTodayRides, useActiveRides } from '../../hooks/useRides';
import { useUnreadNotifications } from '../../hooks/useNotifications';
import {
  Bus,
  MapPin,
  Clock,
  Play,
  Navigation,
  CheckCircle2,
  ShieldAlert,
  Bell,
  UserCheck,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '../../components/common/StatusBadge';
import { RideStatus } from '../../types';

export const DriverDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const driverId = user?.driverId || user?.id || '';
  const { data: todayRides = [], isLoading } = useDriverTodayRides(driverId);
  const { data: unreadNotifs = [] } = useUnreadNotifications();

  const activeTrip = todayRides.find((r) => r.status === RideStatus.IN_PROGRESS);
  const nextScheduled = todayRides.find((r) => r.status === RideStatus.SCHEDULED);

  return (
    <div className="space-y-6">
      {/* Driver Welcome Hero */}
      <div className="bg-[#0a0a0a] border border-[#1e293b] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-[#38bdf8] text-xs font-bold uppercase tracking-wider mb-2">
            <UserCheck className="w-4 h-4" /> Driver Cockpit Active
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
            Hello, {user?.firstName || 'Driver'}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
            Check your daily schedule, start your school bus route, and record student passenger boarding.
          </p>

          {/* Quick Active Trip Banner */}
          {activeTrip ? (
            <div className="mt-6 bg-[#38bdf8]/10 border border-[#38bdf8]/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-wide text-[#38bdf8]">
                    Trip In Progress
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {activeTrip.routeName || `Trip ${activeTrip.rideCode}`}
                </h3>
              </div>
              <button
                onClick={() => navigate('/driver/trip')}
                className="px-5 py-2.5 bg-[#38bdf8] hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Navigation className="w-4 h-4" /> Open Active Cockpit
              </button>
            </div>
          ) : nextScheduled ? (
            <div className="mt-6 bg-[#050505] border border-[#1e293b] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-slate-400">Next Scheduled Trip</span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {nextScheduled.routeName} ({nextScheduled.scheduledStartTime || '07:30 AM'})
                </h3>
              </div>
              <button
                onClick={() => navigate('/driver/trip')}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4" /> Ready to Start Trip
              </button>
            </div>
          ) : (
            <div className="mt-6 text-xs text-slate-500">
              No more scheduled trips remaining for today. Great job!
            </div>
          )}
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          onClick={() => navigate('/driver/trip')}
          className="bg-[#0a0a0a] rounded-2xl p-5 border border-[#1e293b] shadow-xs hover:border-[#38bdf8]/40 hover:bg-slate-900/40 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Navigation className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Trip & Attendance Navigation</h3>
          <p className="text-xs text-slate-400 mt-1">
            Real-time GPS tracker, route stop sequence, and student check-in
          </p>
        </div>

        <div
          onClick={() => navigate('/driver/notifications')}
          className="bg-[#0a0a0a] rounded-2xl p-5 border border-[#1e293b] shadow-xs hover:border-[#38bdf8]/40 hover:bg-slate-900/40 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-950/40 border border-purple-800/50 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Bell className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Alerts & Messages</h3>
            {unreadNotifs.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                {unreadNotifs.length} new
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch announcements, weather warnings, and schedule changes
          </p>
        </div>
      </div>

      {/* Today's Schedule Timeline */}
      <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-[#1e293b] shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1e293b]">
          <div>
            <h2 className="text-base font-bold text-white">Today's Assigned Schedule</h2>
            <p className="text-xs text-slate-400 mt-0.5">Assigned route circuits and vehicle</p>
          </div>
          <span className="text-xs font-mono text-slate-400">{new Date().toLocaleDateString()}</span>
        </div>

        <div className="space-y-3">
          {todayRides.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No trips assigned to you for today.
            </div>
          ) : (
            todayRides.map((ride) => (
              <div
                key={ride.id}
                className="p-4 rounded-xl border border-[#1e293b] bg-[#050505] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#38bdf8]/10 border border-[#38bdf8]/30 text-[#38bdf8] font-bold text-xs flex items-center justify-center shrink-0">
                    <Bus className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">
                        {ride.routeName || `Trip ${ride.rideCode}`}
                      </h4>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {ride.rideType}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {ride.scheduledStartTime || '07:30 AM'}
                      </span>
                      <span>•</span>
                      <span>Bus: {ride.vehicleNumber || 'Assigned Bus'}</span>
                      <span>•</span>
                      <span>{ride.totalStudents || 0} Students</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <StatusBadge status={ride.status} />
                  <button
                    onClick={() => navigate('/driver/trip')}
                    className="px-3 py-1.5 bg-[#38bdf8] hover:bg-sky-400 text-slate-950 text-xs font-bold rounded-lg shadow-xs transition-all"
                  >
                    Open
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
