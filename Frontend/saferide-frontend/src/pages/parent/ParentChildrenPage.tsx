import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useParentChildren } from '../../hooks/useParents';
import { useActiveRides } from '../../hooks/useRides';
import { ChildStatusCard } from '../../components/cards/ChildStatusCard';
import { GraduationCap, Heart, Bus, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Student } from '../../types';

export const ParentChildrenPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const parentId = user?.parentId || user?.id || '';

  const { data: children = [], isLoading, refetch } = useParentChildren(parentId);
  const { data: activeRides = [] } = useActiveRides();

  const handleTrackBus = (student: Student) => {
    navigate('/parent/live-tracking', { state: { selectedStudentId: student.id } });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-display tracking-tight text-slate-900">
            My Enrolled Children
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Registered student transit cards, route schedules, and real-time safety status
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-2xs transition-colors self-start sm:self-auto"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {children.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
          <GraduationCap className="w-10 h-10 mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Student Records Linked</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Please ask the SafeRide administrator to link your student to this email account ({user?.email}).
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {children.map((child) => {
            const activeRideForChild = activeRides.find((r) => r.routeId === child.routeId);
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
  );
};
