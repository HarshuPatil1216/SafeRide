import React from 'react';
import { Student, Ride, RideStatus } from '../../types';
import { Bus, MapPin, Phone, ShieldCheck, Clock, User } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

interface ChildStatusCardProps {
  student: Student;
  activeRide?: Ride | null;
  onTrackBus?: (student: Student) => void;
}

export const ChildStatusCard: React.FC<ChildStatusCardProps> = ({
  student,
  activeRide,
  onTrackBus,
}) => {
  const isRideActive = activeRide?.status === RideStatus.IN_PROGRESS;
  const attendance = activeRide?.passengerAttendances?.find(a => a.studentId === student.id);

  let statusText = 'Not in transit';
  let statusColor = 'bg-slate-100 text-slate-700';

  if (isRideActive) {
    if (attendance?.status === 'BOARDED') {
      statusText = 'Onboard School Bus';
      statusColor = 'bg-emerald-500 text-white animate-pulse';
    } else if (attendance?.status === 'DROPPED') {
      statusText = 'Safely Dropped Off';
      statusColor = 'bg-blue-600 text-white';
    } else {
      statusText = 'Bus En Route to Stop';
      statusColor = 'bg-amber-500 text-white';
    }
  }

  return (
    <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-[#1e293b] shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1e293b]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#38bdf8]/10 border border-[#38bdf8]/30 text-[#38bdf8] font-bold text-base flex items-center justify-center shadow-sm">
            {student.firstName.charAt(0)}
            {student.lastName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">
                {student.firstName} {student.lastName}
              </h3>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#050505] border border-[#1e293b] text-slate-300 font-mono">
                {student.rollNumber}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {student.grade} {student.section ? `• Section ${student.section}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${statusColor}`}>
            {statusText}
          </span>
        </div>
      </div>

      {/* Transit & Route Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 text-xs">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-400">
            <Bus className="w-4 h-4 text-[#38bdf8] shrink-0" />
            <span>
              Route: <strong className="text-white">{student.routeName || 'Not Assigned'}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              Stop: <strong className="text-white">{student.stopName || 'Designated Stop'}</strong>
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-400">
            <User className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Driver: <strong className="text-white">{activeRide?.driverName || 'Designated Driver'}</strong>
            </span>
          </div>
          {activeRide?.driverPhone && (
            <div className="flex items-center gap-2 text-slate-400">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <a
                href={`tel:${activeRide.driverPhone}`}
                className="text-[#38bdf8] hover:underline font-semibold"
              >
                {activeRide.driverPhone}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-[#1e293b] flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>SafeRide Verified Safety Protocol</span>
        </div>

        {onTrackBus && (
          <button
            onClick={() => onTrackBus(student)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#38bdf8] hover:bg-sky-400 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition-all hover:shadow-md"
          >
            <Bus className="w-4 h-4" />
            <span>Live GPS Map</span>
          </button>
        )}
      </div>
    </div>
  );
};
