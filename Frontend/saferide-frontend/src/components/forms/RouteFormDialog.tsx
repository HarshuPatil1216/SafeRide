import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../common/Modal';
import { EntityStatus, Route, RouteRequestDTO } from '../../types';
import { useAvailableDrivers } from '../../hooks/useDrivers';
import { useAvailableVehicles } from '../../hooks/useVehicles';

interface RouteFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RouteRequestDTO) => void;
  initialData?: Route | null;
  isLoading?: boolean;
}

export const RouteFormDialog: React.FC<RouteFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<RouteRequestDTO>({
    defaultValues: {
      routeName: '',
      routeCode: '',
      startLocation: 'Central School Campus',
      endLocation: 'Downtown Terminal',
      description: '',
      totalDistanceKm: 14.5,
      estimatedDurationMinutes: 45,
      status: EntityStatus.ACTIVE,
      vehicleId: null,
      driverId: null,
    },
  });

  const { data: drivers = [] } = useAvailableDrivers();
  const { data: vehicles = [] } = useAvailableVehicles();

  useEffect(() => {
    if (initialData) {
      reset({
        routeName: initialData.routeName,
        routeCode: initialData.routeCode,
        startLocation: initialData.startLocation,
        endLocation: initialData.endLocation,
        description: initialData.description || '',
        totalDistanceKm: initialData.totalDistanceKm || 12,
        estimatedDurationMinutes: initialData.estimatedDurationMinutes || 40,
        status: initialData.status || EntityStatus.ACTIVE,
        vehicleId: initialData.vehicleId || null,
        driverId: initialData.driverId || null,
      });
    } else {
      reset({
        routeName: '',
        routeCode: `RT-${Math.floor(10 + Math.random() * 90)}`,
        startLocation: 'Greenwood High School Gate 1',
        endLocation: 'Riverdale Heights Bus Stop',
        description: 'Morning pickup and afternoon return circuit',
        totalDistanceKm: 15,
        estimatedDurationMinutes: 45,
        status: EntityStatus.ACTIVE,
        vehicleId: null,
        driverId: null,
      });
    }
  }, [initialData, reset, isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Route Path' : 'Create New Bus Route'}
      subtitle="Define route endpoints, assigned bus, driver, and travel metrics"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Route Name *
            </label>
            <input
              type="text"
              {...register('routeName', { required: 'Route name is required' })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g. North Riverdale Express"
            />
            {errors.routeName && <p className="text-xs text-rose-500 mt-1">{errors.routeName.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Route Code *
            </label>
            <input
              type="text"
              {...register('routeCode', { required: 'Route code is required' })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="RT-01"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Origin / Starting Point *
            </label>
            <input
              type="text"
              {...register('startLocation', { required: 'Start location is required' })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Central High School"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Destination / Final Stop *
            </label>
            <input
              type="text"
              {...register('endLocation', { required: 'End location is required' })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Westview Ridge"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Distance (km)
            </label>
            <input
              type="number"
              step="0.1"
              {...register('totalDistanceKm', { valueAsNumber: true })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Duration (Minutes)
            </label>
            <input
              type="number"
              {...register('estimatedDurationMinutes', { valueAsNumber: true })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Status
            </label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value={EntityStatus.ACTIVE}>Active</option>
              <option value={EntityStatus.INACTIVE}>Inactive</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Assigned Fleet Vehicle
            </label>
            <select
              {...register('vehicleId', { setValueAs: (v) => (v ? Number(v) : null) })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">-- Select Vehicle --</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.vehicleNumber} ({v.model} - {v.capacity} seats)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Assigned Driver
            </label>
            <select
              {...register('driverId', { setValueAs: (v) => (v ? Number(v) : null) })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">-- Select Driver --</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.firstName} {d.lastName} ({d.phone})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Route Description / Notes
          </label>
          <textarea
            {...register('description')}
            rows={2}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Special instructions or landmark checkpoints"
          />
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-60"
          >
            {isLoading ? 'Saving...' : initialData ? 'Update Route' : 'Create Route'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
