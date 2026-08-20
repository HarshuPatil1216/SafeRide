import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../common/Modal';
import { Stop, StopRequestDTO } from '../../types';
import { useRoutes } from '../../hooks/useRoutes';

interface StopFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StopRequestDTO) => void;
  initialData?: Stop | null;
  isLoading?: boolean;
}

export const StopFormDialog: React.FC<StopFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<StopRequestDTO>({
    defaultValues: {
      stopName: '',
      address: '',
      latitude: 40.7128,
      longitude: -74.006,
      pickupTime: '07:30',
      dropTime: '15:45',
      sequenceOrder: 1,
      routeId: null,
    },
  });

  const { data: routes = [] } = useRoutes();

  useEffect(() => {
    if (initialData) {
      reset({
        stopName: initialData.stopName,
        address: initialData.address,
        latitude: initialData.latitude,
        longitude: initialData.longitude,
        pickupTime: initialData.pickupTime || '07:30',
        dropTime: initialData.dropTime || '15:45',
        sequenceOrder: initialData.sequenceOrder || 1,
        routeId: initialData.routeId || null,
      });
    } else {
      reset({
        stopName: '',
        address: '',
        latitude: 40.7128,
        longitude: -74.006,
        pickupTime: '07:30',
        dropTime: '15:45',
        sequenceOrder: 1,
        routeId: null,
      });
    }
  }, [initialData, reset, isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Designated Stop' : 'Add New Bus Stop'}
      subtitle="Define GPS latitude/longitude, stop sequence, and scheduled arrival timings"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Stop Landmark Name *
          </label>
          <input
            type="text"
            {...register('stopName', { required: 'Stop name is required' })}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g. Elm Street & 5th Ave Junction"
          />
          {errors.stopName && <p className="text-xs text-rose-500 mt-1">{errors.stopName.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Street Address *
          </label>
          <input
            type="text"
            {...register('address', { required: 'Address is required' })}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="450 Elm Street"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              GPS Latitude *
            </label>
            <input
              type="number"
              step="0.000001"
              {...register('latitude', { required: true, valueAsNumber: true })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="40.7128"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              GPS Longitude *
            </label>
            <input
              type="number"
              step="0.000001"
              {...register('longitude', { required: true, valueAsNumber: true })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="-74.0060"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Sequence Order
            </label>
            <input
              type="number"
              {...register('sequenceOrder', { valueAsNumber: true })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              min="1"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Morning Pickup
            </label>
            <input
              type="time"
              {...register('pickupTime')}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Evening Drop
            </label>
            <input
              type="time"
              {...register('dropTime')}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Belongs to Route
          </label>
          <select
            {...register('routeId', { setValueAs: (v) => (v ? Number(v) : null) })}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">-- Select Route --</option>
            {routes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.routeName} ({r.routeCode})
              </option>
            ))}
          </select>
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
            {isLoading ? 'Saving...' : initialData ? 'Update Stop' : 'Create Stop'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
