import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useParentChildren } from '../../hooks/useParents';
import { useActiveVehiclesTracking } from '../../hooks/useTracking';
import { useActiveRides } from '../../hooks/useRides';
import { useRouteStops } from '../../hooks/useStops';
import { LiveMapView } from '../../components/maps/LiveMapView';
import {
  Radio,
  Bus,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  Navigation,
  RefreshCw,
  Heart,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const ParentLiveTrackingPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const parentId = user?.parentId || user?.id || '';

  const { data: children = [] } = useParentChildren(parentId);
  const [selectedChildId, setSelectedChildId] = useState<string | number>(
    location.state?.selectedStudentId || children[0]?.id || ''
  );

  const selectedChild =
    children.find((c) => String(c.id) === String(selectedChildId)) || children[0];

  const { data: activeVehicles = [], refetch: refetchVehicles } = useActiveVehiclesTracking();
  const { data: activeRides = [] } = useActiveRides();
  const { data: routeStops = [] } = useRouteStops(selectedChild?.routeId || '');

  const activeRideForChild = activeRides.find(
    (r) => r.routeId === selectedChild?.routeId
  );

  const childVehicle = activeVehicles.find(
    (v) => v.vehicleId === activeRideForChild?.vehicleId || v.routeId === selectedChild?.routeId
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-2xl font-black font-display tracking-tight text-slate-900">
              Live School Bus Radar
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time GPS coordinates, vehicle speed, and estimated arrival time
          </p>
        </div>

        <div className="flex items-center gap-2">
          {children.length > 1 && (
            <select
              value={selectedChildId}
              onChange={(e) => setSelectedChildId(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl text-slate-700 shadow-2xs focus:ring-2 focus:ring-blue-500"
            >
              {children.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.firstName} ({child.grade})
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => refetchVehicles()}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-2xs transition-colors"
            title="Refresh GPS"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Telemetry Details & Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Child & Bus Information Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 font-bold text-sm flex items-center justify-center">
                {selectedChild?.firstName?.charAt(0) || 'C'}
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  {selectedChild?.firstName} {selectedChild?.lastName}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {selectedChild?.grade} • Roll #{selectedChild?.rollNumber}
                </p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Assigned Route:</span>
                <span className="font-semibold text-slate-800">
                  {selectedChild?.routeName || 'North Express'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Pickup Stop:</span>
                <span className="font-semibold text-slate-800">
                  {selectedChild?.stopName || 'Designated Stop'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Assigned Bus:</span>
                <span className="font-mono font-bold text-blue-600">
                  {activeRideForChild?.vehicleNumber || 'BUS-104'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Driver:</span>
                <span className="font-semibold text-slate-800">
                  {activeRideForChild?.driverName || 'Designated Operator'}
                </span>
              </div>
            </div>

            {activeRideForChild?.driverPhone && (
              <a
                href={`tel:${activeRideForChild.driverPhone}`}
                className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center justify-center gap-2 transition-all"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Call Driver ({activeRideForChild.driverPhone})</span>
              </a>
            )}
          </div>

          {/* Route Stops Sequence Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs max-h-72 overflow-y-auto">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Route Stop Sequence
            </h4>
            <div className="space-y-2.5">
              {routeStops.map((stop, idx) => (
                <div
                  key={stop.id}
                  className={`flex items-start gap-2.5 p-2 rounded-xl text-xs ${
                    stop.id === selectedChild?.stopId
                      ? 'bg-blue-50/80 border border-blue-200'
                      : 'bg-slate-50'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 font-bold text-[10px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate">{stop.stopName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Pickup {stop.pickupTime || '07:30'} • Drop {stop.dropTime || '15:45'}
                    </p>
                  </div>
                  {stop.id === selectedChild?.stopId && (
                    <span className="text-[9px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                      My Stop
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live GPS Map */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-2 border border-slate-200 shadow-xs h-[560px] relative">
          <LiveMapView
            center={
              childVehicle
                ? [childVehicle.latitude, childVehicle.longitude]
                : undefined
            }
            vehicles={childVehicle ? [childVehicle] : activeVehicles}
            stops={routeStops}
            height="100%"
            isInteractive={true}
          />
        </div>
      </div>
    </div>
  );
};
