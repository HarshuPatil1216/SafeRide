import React, { useState } from 'react';
import { LiveMapView } from '../../components/maps/LiveMapView';
import { useActiveVehiclesTracking } from '../../hooks/useTracking';
import { useActiveRides } from '../../hooks/useRides';
import { useRoutes } from '../../hooks/useRoutes';
import { Radio, Bus, MapPin, Phone, ShieldCheck, Gauge, Navigation, RefreshCw } from 'lucide-react';
import { VehicleLocationDTO } from '../../types';

export const LiveTrackingPage: React.FC = () => {
  const { data: vehicles = [], isLoading, refetch } = useActiveVehiclesTracking();
  const { data: activeRides = [] } = useActiveRides();
  const { data: routes = [] } = useRoutes();

  const [selectedVehicle, setSelectedVehicle] = useState<VehicleLocationDTO | null>(null);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="text-2xl font-bold font-display tracking-tight text-white">
              Live Fleet GPS Operations
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time geospatial telemetry, GPS velocity, driver communication, and trip tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#0a0a0a] border border-[#1e293b] hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl shadow-2xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Poll GPS</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Map & Vehicle Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Vehicles list sidebar */}
        <div className="lg:col-span-1 bg-[#0a0a0a] rounded-2xl p-4 border border-[#1e293b] shadow-xs flex flex-col h-[650px]">
          <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Active Vehicles ({vehicles.length})
            </h2>
            <span className="text-[10px] font-semibold bg-emerald-950/50 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded-full">
              Live
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#1e293b] mt-2">
            {vehicles.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                <Bus className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                No vehicles are currently sending telemetry.
              </div>
            ) : (
              vehicles.map((v) => {
                const isSelected = selectedVehicle?.vehicleId === v.vehicleId;
                return (
                  <div
                    key={v.vehicleId}
                    onClick={() => setSelectedVehicle(v)}
                    className={`p-3 rounded-xl cursor-pointer transition-all my-1 ${
                      isSelected
                        ? 'bg-[#38bdf8]/10 border border-[#38bdf8]/50 text-white'
                        : 'hover:bg-slate-900/60 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#38bdf8]/20 border border-[#38bdf8]/40 text-[#38bdf8] font-bold text-xs flex items-center justify-center">
                          <Bus className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-bold text-xs text-white">
                          {v.vehicleNumber}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                        {v.speed ? `${Math.round(v.speed)} km/h` : 'Moving'}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 mt-2 space-y-0.5">
                      <p className="truncate font-medium text-slate-200">
                        Route: {v.routeName || 'Active Route'}
                      </p>
                      <p className="truncate text-slate-400">Driver: {v.driverName || 'Assigned Driver'}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Live Interactive Map */}
        <div className="lg:col-span-3 bg-[#0a0a0a] rounded-2xl p-2 border border-[#1e293b] shadow-xs h-[650px] relative">
          <LiveMapView
            vehicles={vehicles}
            center={
              selectedVehicle
                ? [selectedVehicle.latitude, selectedVehicle.longitude]
                : undefined
            }
            height="100%"
            isInteractive={true}
          />
        </div>
      </div>
    </div>
  );
};
