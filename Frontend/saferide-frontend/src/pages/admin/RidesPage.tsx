import React, { useState, useMemo } from 'react';
import {
  Clock,
  Play,
  CheckCircle,
  XCircle,
  Bus,
  User,
  MapPin,
  Calendar,
  RefreshCw,
  Eye,
  AlertTriangle,
} from 'lucide-react';
import {
  useRides,
  useStartRide,
  useCompleteRide,
  useCancelRide,
} from '../../hooks/useRides';
import { useRoutes } from '../../hooks/useRoutes';
import { Ride, RideStatus, RideType } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { TablePagination } from '../../components/common/TablePagination';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const RidesPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const [confirmAction, setConfirmAction] = useState<{
    type: 'START' | 'COMPLETE' | 'CANCEL';
    ride: Ride;
  } | null>(null);

  const { data: rides = [], isLoading, refetch } = useRides();
  const startMutation = useStartRide();
  const completeMutation = useCompleteRide();
  const cancelMutation = useCancelRide();

  const filteredRides = useMemo(() => {
    return rides.filter((r) => {
      const matchesStatus = !statusFilter || r.status === statusFilter;
      const matchesType = !typeFilter || r.rideType === typeFilter;
      return matchesStatus && matchesType;
    });
  }, [rides, statusFilter, typeFilter]);

  const totalPages = Math.ceil(filteredRides.length / pageSize) || 1;
  const paginatedRides = useMemo(() => {
    const start = page * pageSize;
    return filteredRides.slice(start, start + pageSize);
  }, [filteredRides, page, pageSize]);

  const handleOpenDetail = (ride: Ride) => {
    setSelectedRide(ride);
    setDetailModalOpen(true);
  };

  const handleActionConfirm = () => {
    if (!confirmAction) return;

    if (confirmAction.type === 'START') {
      startMutation.mutate(confirmAction.ride.id, {
        onSuccess: () => setConfirmAction(null),
      });
    } else if (confirmAction.type === 'COMPLETE') {
      completeMutation.mutate(confirmAction.ride.id, {
        onSuccess: () => setConfirmAction(null),
      });
    } else if (confirmAction.type === 'CANCEL') {
      cancelMutation.mutate(
        { id: confirmAction.ride.id, reason: 'Cancelled by Administrator' },
        { onSuccess: () => setConfirmAction(null) }
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-display tracking-tight text-slate-900">
            Bus Trips & Ride Operations
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time management of scheduled morning pickups and evening school return trips
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-2xs transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(0);
          }}
          className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="IN_PROGRESS">In Progress / En Route</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="DELAYED">Delayed</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setPage(0);
          }}
          className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Ride Types</option>
          <option value="PICKUP">Morning Pickup</option>
          <option value="DROP">Evening Drop</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={6} columns={6} />
        ) : filteredRides.length === 0 ? (
          <EmptyState
            title="No Rides Found"
            description="No trips match your filter criteria or no schedules are active."
            icon={Clock}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/70 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3.5">Ride Code</th>
                    <th className="px-6 py-3.5">Route</th>
                    <th className="px-6 py-3.5">Bus & Operator</th>
                    <th className="px-6 py-3.5">Schedule</th>
                    <th className="px-6 py-3.5">Student Riders</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedRides.map((ride) => (
                    <tr key={ride.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-slate-900">
                          {ride.rideCode || `RIDE-${ride.id}`}
                        </span>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                          {ride.rideType}
                        </div>
                      </td>

                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {ride.routeName || `Route #${ride.routeId}`}
                      </td>

                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          <div className="font-semibold text-slate-800 flex items-center gap-1">
                            <Bus className="w-3.5 h-3.5 text-blue-600" />
                            <span>{ride.vehicleNumber}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1">
                            <User className="w-3 h-3 text-amber-600" />
                            <span>{ride.driverName}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-mono">
                        <div className="text-slate-800 font-medium">{ride.scheduledDate || 'Today'}</div>
                        <div className="text-[11px] text-slate-400">
                          {ride.scheduledStartTime || '07:30 AM'}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-blue-600 h-full rounded-full"
                              style={{
                                width: `${
                                  ride.totalStudents > 0
                                    ? (ride.boardedStudents / ride.totalStudents) * 100
                                    : 0
                                }%`,
                              }}
                            />
                          </div>
                          <span className="font-mono text-[11px] font-semibold text-slate-700">
                            {ride.boardedStudents}/{ride.totalStudents}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={ride.status} />
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenDetail(ride)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Inspect Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {ride.status === RideStatus.SCHEDULED && (
                            <button
                              onClick={() => setConfirmAction({ type: 'START', ride })}
                              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-semibold flex items-center gap-1"
                            >
                              <Play className="w-3 h-3" /> Start
                            </button>
                          )}

                          {ride.status === RideStatus.IN_PROGRESS && (
                            <button
                              onClick={() => setConfirmAction({ type: 'COMPLETE', ride })}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold flex items-center gap-1"
                            >
                              <CheckCircle className="w-3 h-3" /> Finish
                            </button>
                          )}

                          {ride.status !== RideStatus.COMPLETED &&
                            ride.status !== RideStatus.CANCELLED && (
                              <button
                                onClick={() => setConfirmAction({ type: 'CANCEL', ride })}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Cancel Ride"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <TablePagination
              currentPage={page}
              totalPages={totalPages}
              totalElements={filteredRides.length}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(s) => {
                setPageSize(s);
                setPage(0);
              }}
            />
          </>
        )}
      </div>

      {/* Ride Detail Inspection Modal */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title={`Trip Manifest: ${selectedRide?.rideCode || `RIDE-${selectedRide?.id}`}`}
        subtitle={`Route: ${selectedRide?.routeName}`}
        maxWidth="lg"
      >
        {selectedRide && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Status</span>
                <StatusBadge status={selectedRide.status} />
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Bus Assigned</span>
                <span className="font-semibold text-slate-800">{selectedRide.vehicleNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Driver</span>
                <span className="font-semibold text-slate-800">{selectedRide.driverName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Boarding</span>
                <span className="font-mono font-bold text-blue-600">
                  {selectedRide.boardedStudents} of {selectedRide.totalStudents} Onboard
                </span>
              </div>
            </div>

            {/* Passenger Manifest Table */}
            <div>
              <h4 className="font-bold text-slate-800 mb-2">Student Boarding Manifest</h4>
              <div className="border border-slate-100 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] uppercase font-semibold text-slate-400">
                    <tr>
                      <th className="p-2.5">Student Name</th>
                      <th className="p-2.5">Stop</th>
                      <th className="p-2.5">Attendance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedRide.passengerAttendances?.length ? (
                      selectedRide.passengerAttendances.map((a) => (
                        <tr key={a.studentId}>
                          <td className="p-2.5 font-medium text-slate-800">{a.studentName}</td>
                          <td className="p-2.5 text-slate-500">{a.stopName}</td>
                          <td className="p-2.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                a.status === 'BOARDED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : a.status === 'DROPPED'
                                  ? 'bg-blue-100 text-blue-800'
                                  : a.status === 'ABSENT'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {a.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="p-4 text-center text-slate-400">
                          No student attendances recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleActionConfirm}
        title={
          confirmAction?.type === 'START'
            ? 'Start Bus Trip'
            : confirmAction?.type === 'COMPLETE'
            ? 'Complete Bus Trip'
            : 'Cancel Trip'
        }
        message={`Are you sure you want to ${confirmAction?.type.toLowerCase()} trip ${
          confirmAction?.ride.rideCode || `RIDE-${confirmAction?.ride.id}`
        }?`}
        confirmText={
          confirmAction?.type === 'START'
            ? 'Start Ride'
            : confirmAction?.type === 'COMPLETE'
            ? 'Complete Ride'
            : 'Cancel Ride'
        }
        variant={confirmAction?.type === 'CANCEL' ? 'danger' : 'primary'}
      />
    </div>
  );
};
