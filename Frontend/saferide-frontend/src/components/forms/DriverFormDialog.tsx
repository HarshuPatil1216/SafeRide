import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../common/Modal';
import { Driver, DriverRequestDTO, DriverStatus } from '../../types';
import { useAvailableVehicles } from '../../hooks/useVehicles';
import { useRoutes } from '../../hooks/useRoutes';

interface DriverFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DriverRequestDTO) => void;
  initialData?: Driver | null;
  isLoading?: boolean;
}

export const DriverFormDialog: React.FC<DriverFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<DriverRequestDTO>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      licenseNumber: '',
      licenseExpiry: '',
      experienceYears: 5,
      address: '',
      status: DriverStatus.AVAILABLE,
      assignedVehicleId: null,
      assignedRouteId: null,
    },
  });

  const { data: availableVehicles = [] } = useAvailableVehicles();
  const { data: routes = [] } = useRoutes();

  useEffect(() => {
    if (initialData) {
      reset({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email,
        phone: initialData.phone,
        licenseNumber: initialData.licenseNumber,
        licenseExpiry: initialData.licenseExpiry || '',
        experienceYears: initialData.experienceYears || 3,
        address: initialData.address || '',
        status: initialData.status || DriverStatus.AVAILABLE,
        assignedVehicleId: initialData.assignedVehicleId || null,
        assignedRouteId: initialData.assignedRouteId || null,
      });
    } else {
      reset({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: 'Password@123',
        licenseNumber: `DL-${Math.floor(100000 + Math.random() * 900000)}`,
        licenseExpiry: '2028-12-31',
        experienceYears: 5,
        address: '',
        status: DriverStatus.AVAILABLE,
        assignedVehicleId: null,
        assignedRouteId: null,
      });
    }
  }, [initialData, reset, isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Driver Profile' : 'Register New Driver'}
      subtitle="Driver credentials, commercial license validation, and vehicle assignment"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              First Name *
            </label>
            <input
              type="text"
              {...register('firstName', { required: 'First name is required' })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Marcus"
            />
            {errors.firstName && <p className="text-xs text-rose-500 mt-1">{errors.firstName.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              {...register('lastName', { required: 'Last name is required' })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Jenkins"
            />
            {errors.lastName && <p className="text-xs text-rose-500 mt-1">{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Email Address (Login) *
            </label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="driver@saferide.school"
            />
            {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Phone Number *
            </label>
            <input
              type="text"
              {...register('phone', { required: 'Phone is required' })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="+1 (555) 234-5678"
            />
            {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone.message}</p>}
          </div>
        </div>

        {!initialData && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Temporary Password *
            </label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              License Number *
            </label>
            <input
              type="text"
              {...register('licenseNumber', { required: 'License is required' })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="DL-920192"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              License Expiry
            </label>
            <input
              type="date"
              {...register('licenseExpiry')}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Experience (Years)
            </label>
            <input
              type="number"
              {...register('experienceYears', { valueAsNumber: true })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              min="0"
              max="50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Duty Status
            </label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value={DriverStatus.AVAILABLE}>Available</option>
              <option value={DriverStatus.ON_DUTY}>On Duty</option>
              <option value={DriverStatus.OFF_DUTY}>Off Duty</option>
              <option value={DriverStatus.INACTIVE}>Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Assigned Vehicle
            </label>
            <select
              {...register('assignedVehicleId', { setValueAs: (v) => (v ? Number(v) : null) })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">-- No Vehicle Assigned --</option>
              {availableVehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.vehicleNumber} ({v.model})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Assigned Route
            </label>
            <select
              {...register('assignedRouteId', { setValueAs: (v) => (v ? Number(v) : null) })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">-- No Route Assigned --</option>
              {routes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.routeName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Residential Address
          </label>
          <input
            type="text"
            {...register('address')}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g. 500 Oak Lane, Apt 4"
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
            {isLoading ? 'Saving...' : initialData ? 'Update Driver' : 'Create Driver'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
