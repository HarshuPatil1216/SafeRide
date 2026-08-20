import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useParentChildren } from '../../hooks/useParents';
import { useActiveRides } from '../../hooks/useRides';
import { useUnreadNotifications } from '../../hooks/useNotifications';
import { ChildStatusCard } from '../../components/cards/ChildStatusCard';
import { Heart, Bus, Radio, Bell, ShieldCheck, MapPin, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Student } from '../../types';

export const ParentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const parentId = user?.parentId || user?.id || '';
  const { data: children = [], isLoading, refetch } = useParentChildren(parentId);
  const { data: activeRides = [] } = useActiveRides();
  const { data: unreadNotifs = [] } = useUnreadNotifications();

  const handleTrackBus = (student: Student) => {
    navigate('/parent/live-tracking', { state: { selectedStudentId: student.id } });
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-[#0a0a0a] border border-[#1e293b] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-[#38bdf8] text-xs font-bold uppercase tracking-wider mb-2">
            <Heart className="w-4 h-4 text-rose-400" /> SafeRide Parent Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
            Welcome, {user?.firstName || 'Parent'}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
            Live GPS telemetry and safety notifications for your child's daily school commute.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/parent/live-tracking')}
              className="px-5 py-2.5 bg-[#38bdf8] hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Radio className="w-4 h-4 text-slate-950 animate-pulse" />
              <span>Track School Bus Live</span>
            </button>
            <button
              onClick={() => navigate('/parent/notifications')}
              className="px-4 py-2.5 bg-[#050505] hover:bg-slate-800 text-slate-200 font-semibold text-xs rounded-xl border border-[#1e293b] transition-all flex items-center gap-2"
            >
              <Bell className="w-4 h-4" />
              <span>Alerts ({unreadNotifs.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Children Transit Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">My Children ({children.length})</h2>
            <p className="text-xs text-slate-400">Live attendance and transit status</p>
          </div>
          <button
            onClick={() => refetch()}
            className="p-2 text-slate-400 hover:text-white bg-[#0a0a0a] border border-[#1e293b] rounded-xl hover:bg-slate-800 shadow-2xs transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {children.length === 0 ? (
          <div className="bg-[#0a0a0a] rounded-2xl p-12 text-center border border-[#1e293b] shadow-xs">
            <Heart className="w-10 h-10 mx-auto text-slate-600 mb-3" />
            <h3 className="text-base font-bold text-white">No Children Linked</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Your account doesn't have any enrolled students linked yet. Contact your school administrator to link your student records.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {children.map((child) => {
              const activeRideForChild = activeRides.find(
                (r) => r.routeId === child.routeId
              );
              return (
                <ChildStatusCard
                  key={child.id}
                  student={child}
                  activeRide={activeRideForChild}
                  onTrackBus={handleTrackBus}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Safety & Protocol Assurance */}
      <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-[#1e293b] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-emerald-950/50 text-emerald-400 rounded-2xl border border-emerald-800/60">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">SafeRide Certified Tracking</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Instant boarding verification & geofenced safety alerts active for all trips.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
