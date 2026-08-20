import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  useDriverTodayRides,
  useStartRide,
  useCompleteRide,
  useRecordAttendance,
} from '../../hooks/useRides';
import { useRouteStops } from '../../hooks/useStops';
import { useUpdateLocation } from '../../hooks/useTracking';
import { useBroadcastNotification } from '../../hooks/useNotifications';
import {
  Bus,
  Play,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Clock,
  UserCheck,
  UserX,
  Phone,
  Navigation,
  Radio,
  RefreshCw,
  ShieldAlert,
} from 'lucide-react';
import { AttendanceStatus, NotificationType, RideStatus, UserRole } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { LiveMapView } from '../../components/maps/LiveMapView';

export const DriverTripPage: React.FC = () => {
  const { user } = useAuth();
  const driverId = user?.driverId || user?.id || '';

  const { data: todayRides = [], refetch: refetchRides } = useDriverTodayRides(driverId);
  const activeRide =
    todayRides.find((r) => r.status === RideStatus.IN_PROGRESS) ||
    todayRides.find((r) => r.status === RideStatus.SCHEDULED) ||
    todayRides[0];

  const { data: routeStops = [] } = useRouteStops(activeRide?.routeId || '');

  // Mutations
  const startRideMutation = useStartRide();
  const completeRideMutation = useCompleteRide();
  const recordAttendanceMutation = useRecordAttendance();
  const updateLocationMutation = useUpdateLocation();
  const broadcastMutation = useBroadcastNotification();

  // Local state
  const [currentGps, setCurrentGps] = useState<{ lat: number; lng: number }>({
    lat: 40.7128,
    lng: -74.006,
  });
  const [speed, setSpeed] = useState<number>(35);
  const [isGpsStreaming, setIsGpsStreaming] = useState(false);
  const [emergencyConfirmOpen, setEmergencyConfirmOpen] = useState(false);
  const [completeConfirmOpen, setCompleteConfirmOpen] = useState(false);

  // Periodic GPS pulse when trip is active
  useEffect(() => {
    let interval: any;
    if (activeRide?.status === RideStatus.IN_PROGRESS && isGpsStreaming) {
      interval = setInterval(() => {
        // Slightly simulate coordinate drift or use real geolocation
        setCurrentGps((prev) => {
          const newLat = prev.lat + (Math.random() - 0.5) * 0.0005;
          const newLng = prev.lng + (Math.random() - 0.5) * 0.0005;

          if (activeRide?.vehicleId) {
            updateLocationMutation.mutate({
              vehicleId: activeRide.vehicleId,
              rideId: activeRide.id,
              latitude: newLat,
              longitude: newLng,
              speedKmH: speed,
              heading: 90,
            });
          }
          return { lat: newLat, lng: newLng };
        });
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [activeRide, isGpsStreaming, speed]);

  const handleStartTrip = () => {
    if (!activeRide) return;
    startRideMutation.mutate(activeRide.id, {
      onSuccess: () => {
        setIsGpsStreaming(true);
        refetchRides();
      },
    });
  };

  const handleCompleteTrip = () => {
    if (!activeRide) return;
    completeRideMutation.mutate(activeRide.id, {
      onSuccess: () => {
        setIsGpsStreaming(false);
        setCompleteConfirmOpen(false);
        refetchRides();
      },
    });
  };

  const handleMarkAttendance = (studentId: string | number, status: AttendanceStatus) => {
    if (!activeRide) return;
    recordAttendanceMutation.mutate(
      {
        rideId: activeRide.id,
        dto: {
          studentId,
          status,
          recordedAt: new Date().toISOString(),
        },
      },
      {
        onSuccess: () => refetchRides(),
      }
    );
  };

  const handleSendEmergencyAlert = () => {
    if (!activeRide) return;
    broadcastMutation.mutate(
      {
        title: `EMERGENCY ALERT: Bus ${activeRide.vehicleNumber}`,
        message: `Driver reported an incident on Route ${activeRide.routeName}. Dispatch and safety team notified.`,
        type: NotificationType.EMERGENCY,
        targetRole: UserRole.ADMIN,
        routeId: activeRide.routeId,
      },
      {
        onSuccess: () => setEmergencyConfirmOpen(false),
      }
    );
  };

  const isTripActive = activeRide?.status === RideStatus.IN_PROGRESS;

  return (
    <div className="space-y-6">
      {/* Header & Trip Status Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md ${
              isTripActive
                ? 'bg-emerald-600 animate-pulse'
                : 'bg-gradient-to-tr from-blue-600 to-indigo-600'
            }`}
          >
            <Bus className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black font-display tracking-tight text-slate-900">
                {activeRide?.routeName || 'No Active Route'}
              </h1>
              {activeRide && <StatusBadge status={activeRide.status} />}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Bus Number: <strong className="text-slate-800 font-mono">{activeRide?.vehicleNumber || 'Assigned'}</strong> • Code: {activeRide?.rideCode || 'RIDE'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {activeRide?.status === RideStatus.SCHEDULED && (
            <button
              onClick={handleStartTrip}
              disabled={startRideMutation.isPending}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Trip Now</span>
            </button>
          )}

          {isTripActive && (
            <>
              <button
                onClick={() => setEmergencyConfirmOpen(true)}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/20 flex items-center gap-2 transition-all cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>SOS Alarm</span>
              </button>

              <button
                onClick={() => setCompleteConfirmOpen(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-2xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Finish Trip</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* GPS & Route Map Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
              <h3 className="text-sm font-bold text-slate-900">Live GPS Navigation Radar</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-slate-500">
                Speed: <strong>{speed} km/h</strong>
              </span>
              <button
                onClick={() => setIsGpsStreaming(!isGpsStreaming)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  isGpsStreaming
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {isGpsStreaming ? 'GPS Active' : 'Start GPS'}
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-[320px]">
            <LiveMapView
              center={[currentGps.lat, currentGps.lng]}
              stops={routeStops}
              vehicles={
                activeRide?.vehicleId
                  ? [
                      {
                        vehicleId: activeRide.vehicleId,
                        vehicleNumber: activeRide.vehicleNumber,
                        latitude: currentGps.lat,
                        longitude: currentGps.lng,
                        speedKmH: speed,
                        heading: 90,
                        driverName: user?.firstName || 'Driver',
                      },
                    ]
                  : []
              }
              height="320px"
              isInteractive={true}
            />
          </div>
        </div>

        {/* Route Stops Sequence */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>Route Stop Checkpoints</span>
          </h3>

          <div className="flex-1 overflow-y-auto space-y-3">
            {routeStops.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No stops registered on this route yet.
              </div>
            ) : (
              routeStops.map((stop, idx) => (
                <div
                  key={stop.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {stop.sequenceOrder || idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate">{stop.stopName}</p>
                    <p className="text-[11px] text-slate-500 truncate">{stop.address}</p>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-600 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>ETA: {stop.pickupTime || '07:30'}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Student Passenger Attendance Boarding Manifest */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Student Attendance & Boarding Manifest
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Check in passengers at each bus stop. Parents receive instant notification.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-700 rounded-lg">
              {activeRide?.boardedStudents || 0} / {activeRide?.totalStudents || 0} Boarded
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/70 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Student Passenger</th>
                <th className="px-6 py-3.5">Assigned Stop</th>
                <th className="px-6 py-3.5">Parent Contact</th>
                <th className="px-6 py-3.5">Current Status</th>
                <th className="px-6 py-3.5 text-right">Attendance Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeRide?.passengerAttendances?.length ? (
                activeRide.passengerAttendances.map((passenger) => (
                  <tr key={passenger.studentId} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                          {passenger.studentName?.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{passenger.studentName}</div>
                          <div className="text-[11px] text-slate-400">Student ID: #{passenger.studentId}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-800">
                      {passenger.stopName || 'Designated Stop'}
                    </td>

                    <td className="px-6 py-4">
                      {passenger.parentPhone ? (
                        <a
                          href={`tel:${passenger.parentPhone}`}
                          className="text-blue-600 font-semibold flex items-center gap-1 hover:underline"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{passenger.parentPhone}</span>
                        </a>
                      ) : (
                        <span className="text-slate-400 italic">No Phone</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          passenger.status === AttendanceStatus.BOARDED
                            ? 'bg-emerald-100 text-emerald-800'
                            : passenger.status === AttendanceStatus.DROPPED
                            ? 'bg-blue-100 text-blue-800'
                            : passenger.status === AttendanceStatus.ABSENT
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {passenger.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() =>
                            handleMarkAttendance(passenger.studentId, AttendanceStatus.BOARDED)
                          }
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Board</span>
                        </button>

                        <button
                          onClick={() =>
                            handleMarkAttendance(passenger.studentId, AttendanceStatus.DROPPED)
                          }
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Drop</span>
                        </button>

                        <button
                          onClick={() =>
                            handleMarkAttendance(passenger.studentId, AttendanceStatus.ABSENT)
                          }
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <UserX className="w-3.5 h-3.5" />
                          <span>Absent</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No passengers assigned to this trip yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Emergency Confirm Dialog */}
      <ConfirmDialog
        isOpen={emergencyConfirmOpen}
        onClose={() => setEmergencyConfirmOpen(false)}
        onConfirm={handleSendEmergencyAlert}
        title="Trigger Emergency SOS"
        message="Are you sure you want to broadcast an urgent safety alert? This will immediately notify dispatch administrators and parents."
        confirmText="Confirm Emergency SOS"
        variant="danger"
      />

      {/* Complete Trip Confirm Dialog */}
      <ConfirmDialog
        isOpen={completeConfirmOpen}
        onClose={() => setCompleteConfirmOpen(false)}
        onConfirm={handleCompleteTrip}
        title="Complete Bus Route"
        message="Have all students been safely dropped off and is the vehicle parked?"
        confirmText="Yes, Complete Trip"
        variant="primary"
      />
    </div>
  );
};
