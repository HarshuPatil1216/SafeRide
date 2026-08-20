import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  UserCheck,
  Bus,
  Clock,
  Radio,
  Plus,
  AlertCircle,
  TrendingUp,
  MapPin,
  ShieldCheck,
  Bell,
  RefreshCw,
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { LiveMapView } from '../../components/maps/LiveMapView';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useDashboardSummary } from '../../hooks/useReports';
import { useActiveRides, useTodayRides } from '../../hooks/useRides';
import { useActiveVehiclesTracking } from '../../hooks/useTracking';
import { useStudents } from '../../hooks/useStudents';
import { useVehicles } from '../../hooks/useVehicles';
import { useDrivers } from '../../hooks/useDrivers';
import { useParents } from '../../hooks/useParents';
import { useNavigate } from 'react-router-dom';
import { StudentFormDialog } from '../../components/forms/StudentFormDialog';
import { VehicleFormDialog } from '../../components/forms/VehicleFormDialog';
import { DriverFormDialog } from '../../components/forms/DriverFormDialog';
import { BroadcastNotificationDialog } from '../../components/forms/BroadcastNotificationDialog';
import { useCreateStudent } from '../../hooks/useStudents';
import { useCreateVehicle } from '../../hooks/useVehicles';
import { useCreateDriver } from '../../hooks/useDrivers';
import { useBroadcastNotification } from '../../hooks/useNotifications';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  // API Data
  const { data: summary, isLoading: isSummaryLoading, refetch: refetchSummary } = useDashboardSummary();
  const { data: activeRides = [], refetch: refetchRides } = useActiveRides();
  const { data: todayRides = [] } = useTodayRides();
  const { data: activeVehicles = [] } = useActiveVehiclesTracking();
  const { data: students = [] } = useStudents();
  const { data: vehicles = [] } = useVehicles();
  const { data: drivers = [] } = useDrivers();
  const { data: parents = [] } = useParents();

  // Modals for Quick Actions
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [driverModalOpen, setDriverModalOpen] = useState(false);
  const [notifModalOpen, setNotifModalOpen] = useState(false);

  const createStudentMutation = useCreateStudent();
  const createVehicleMutation = useCreateVehicle();
  const createDriverMutation = useCreateDriver();
  const broadcastMutation = useBroadcastNotification();

  const totalStudentsCount = summary?.totalStudents || students.length || 0;
  const totalVehiclesCount = summary?.totalVehicles || vehicles.length || 0;
  const totalDriversCount = summary?.totalDrivers || drivers.length || 0;
  const totalParentsCount = summary?.totalParents || parents.length || 0;
  const activeRidesCount = activeRides.length;

  const handleRefreshAll = () => {
    refetchSummary();
    refetchRides();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-white">
            System Operations Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time fleet monitoring, student ridership, and Spring Boot REST telemetry
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefreshAll}
            className="p-2 text-slate-400 hover:text-white bg-[#0a0a0a] border border-[#1e293b] rounded-xl hover:bg-slate-800 shadow-2xs transition-colors"
            title="Refresh Server Metrics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setNotifModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#38bdf8] hover:bg-sky-400 text-slate-950 text-xs font-bold rounded-xl shadow-2xs transition-all"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Broadcast Alert</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Total Students"
          value={totalStudentsCount}
          subtitle="Enrolled bus passengers"
          icon={GraduationCap}
          color="blue"
          onClick={() => navigate('/admin/students')}
        />

        <StatCard
          title="Active Vehicles"
          value={vehicles.filter(v => v.status === 'ACTIVE').length || totalVehiclesCount}
          subtitle={`${totalVehiclesCount} total fleet vehicles`}
          icon={Bus}
          color="emerald"
          onClick={() => navigate('/admin/vehicles')}
        />

        <StatCard
          title="Active Drivers"
          value={drivers.filter(d => d.status === 'ON_DUTY' || d.status === 'AVAILABLE').length || totalDriversCount}
          subtitle={`${totalDriversCount} licensed operators`}
          icon={UserCheck}
          color="amber"
          onClick={() => navigate('/admin/drivers')}
        />

        <StatCard
          title="Live Rides En Route"
          value={activeRidesCount}
          subtitle={`${todayRides.length} scheduled today`}
          icon={Radio}
          color="purple"
          onClick={() => navigate('/admin/rides')}
        />
      </div>

      {/* Live Map & Active Trip Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live GPS Fleet Map */}
        <div className="lg:col-span-2 bg-[#0a0a0a] rounded-2xl p-5 border border-[#1e293b] shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#38bdf8]/10 text-[#38bdf8] rounded-lg border border-[#38bdf8]/30">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <h2 className="text-sm font-bold text-white">Live GPS Fleet Radar</h2>
            </div>
            <button
              onClick={() => navigate('/admin/live-tracking')}
              className="text-xs font-semibold text-[#38bdf8] hover:text-sky-300"
            >
              Full Screen Map →
            </button>
          </div>

          <div className="flex-1 min-h-[360px]">
            <LiveMapView
              vehicles={activeVehicles}
              height="360px"
              isInteractive={true}
            />
          </div>
        </div>

        {/* Quick Actions & Recent Activities */}
        <div className="space-y-6">
          {/* Quick Creation Panel */}
          <div className="bg-[#0a0a0a] rounded-2xl p-5 border border-[#1e293b] shadow-xs">
            <h2 className="text-sm font-bold text-white mb-3.5">Quick Management</h2>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setStudentModalOpen(true)}
                className="p-3 text-left rounded-xl border border-[#1e293b] bg-[#050505] hover:bg-[#38bdf8]/10 hover:border-[#38bdf8]/40 transition-all group"
              >
                <Plus className="w-4 h-4 text-[#38bdf8] mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-white">Add Student</p>
                <p className="text-[10px] text-slate-400">Register rider</p>
              </button>

              <button
                onClick={() => setVehicleModalOpen(true)}
                className="p-3 text-left rounded-xl border border-[#1e293b] bg-[#050505] hover:bg-emerald-950/30 hover:border-emerald-800/60 transition-all group"
              >
                <Plus className="w-4 h-4 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-white">Add Vehicle</p>
                <p className="text-[10px] text-slate-400">Register bus</p>
              </button>

              <button
                onClick={() => setDriverModalOpen(true)}
                className="p-3 text-left rounded-xl border border-[#1e293b] bg-[#050505] hover:bg-amber-950/30 hover:border-amber-800/60 transition-all group"
              >
                <Plus className="w-4 h-4 text-amber-400 mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-white">Add Driver</p>
                <p className="text-[10px] text-slate-400">New operator</p>
              </button>

              <button
                onClick={() => navigate('/admin/routes')}
                className="p-3 text-left rounded-xl border border-[#1e293b] bg-[#050505] hover:bg-purple-950/30 hover:border-purple-800/60 transition-all group"
              >
                <MapPin className="w-4 h-4 text-purple-400 mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-white">Plan Route</p>
                <p className="text-[10px] text-slate-400">Stops & paths</p>
              </button>
            </div>
          </div>

          {/* Safety & Compliance Badge */}
          <div className="bg-[#0a0a0a] text-white rounded-2xl p-5 border border-[#1e293b] shadow-md">
            <div className="flex items-center gap-2.5 mb-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold">Safety Protocols Active</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              SafeRide automated attendance verification, route geofencing, and parent push telemetry are currently enabled.
            </p>
            <div className="mt-4 pt-3 border-t border-[#1e293b] flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>JWT Auth: Active</span>
              <span className="text-emerald-400">● 100% Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Active / Scheduled Rides Table */}
      <div className="bg-[#0a0a0a] rounded-2xl border border-[#1e293b] shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1e293b] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">Today's School Bus Trips</h2>
            <p className="text-xs text-slate-400 mt-0.5">Live status of morning pickup and evening drop routes</p>
          </div>
          <button
            onClick={() => navigate('/admin/rides')}
            className="text-xs font-semibold text-[#38bdf8] hover:text-sky-300"
          >
            View All Trips ({todayRides.length}) →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0d0d0d] text-slate-400 uppercase tracking-wider font-semibold border-b border-[#1e293b]">
              <tr>
                <th className="px-6 py-3.5">Trip Code</th>
                <th className="px-6 py-3.5">Route</th>
                <th className="px-6 py-3.5">Assigned Bus & Driver</th>
                <th className="px-6 py-3.5">Scheduled Start</th>
                <th className="px-6 py-3.5">Passenger Progress</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]">
              {todayRides.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No active trips scheduled for today yet.
                  </td>
                </tr>
              ) : (
                todayRides.slice(0, 5).map((ride) => (
                  <tr key={ride.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-white">
                      {ride.rideCode || `RIDE-#${ride.id}`}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-200">
                      {ride.routeName || `Route #${ride.routeId}`}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{ride.vehicleNumber}</div>
                      <div className="text-[11px] text-slate-400">{ride.driverName}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-300">
                      {ride.scheduledStartTime || '07:30 AM'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-[#38bdf8] h-full rounded-full"
                            style={{
                              width: `${
                                ride.totalStudents > 0
                                  ? (ride.boardedStudents / ride.totalStudents) * 100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                        <span className="font-mono text-[11px] font-semibold text-slate-300">
                          {ride.boardedStudents}/{ride.totalStudents}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={ride.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialogs for Quick Action */}
      <StudentFormDialog
        isOpen={studentModalOpen}
        onClose={() => setStudentModalOpen(false)}
        onSubmit={(dto) => {
          createStudentMutation.mutate(dto, {
            onSuccess: () => setStudentModalOpen(false),
          });
        }}
        isLoading={createStudentMutation.isPending}
      />

      <VehicleFormDialog
        isOpen={vehicleModalOpen}
        onClose={() => setVehicleModalOpen(false)}
        onSubmit={(dto) => {
          createVehicleMutation.mutate(dto, {
            onSuccess: () => setVehicleModalOpen(false),
          });
        }}
        isLoading={createVehicleMutation.isPending}
      />

      <DriverFormDialog
        isOpen={driverModalOpen}
        onClose={() => setDriverModalOpen(false)}
        onSubmit={(dto) => {
          createDriverMutation.mutate(dto, {
            onSuccess: () => setDriverModalOpen(false),
          });
        }}
        isLoading={createDriverMutation.isPending}
      />

      <BroadcastNotificationDialog
        isOpen={notifModalOpen}
        onClose={() => setNotifModalOpen(false)}
        onSubmit={(dto) => {
          broadcastMutation.mutate(dto, {
            onSuccess: () => setNotifModalOpen(false),
          });
        }}
        isLoading={broadcastMutation.isPending}
      />
    </div>
  );
};
