import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../common/Modal';
import { Vehicle, VehicleRequestDTO, VehicleStatus, VehicleType } from '../../types';
import { useAvailableDrivers } from '../../hooks/useDrivers';

interface VehicleFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VehicleRequestDTO) => void;
  initialData?: Vehicle | null;
  isLoading?: boolean;
}

export const VehicleFormDialog: React.FC<VehicleFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<VehicleRequestDTO>({
    defaultValues: {
      vehicleNumber: '',
      registrationNumber: '',
      capacity: 35,
      model: 'Starcraft Allstar',
      make: 'Ford',
      year: 2023,
      vehicleType: VehicleType.BUS,
      status: VehicleStatus.ACTIVE,
      assignedDriverId: null,
      fuelType: 'DIESEL',
      insuranceExpiry: '',
      fitnessExpiry: '',
    },
  });

  const { data: availableDrivers = [] } = useAvailableDrivers();

  useEffect(() => {
    if (initialData) {
      reset({
        vehicleNumber: initialData.vehicleNumber,
        registrationNumber: initialData.registrationNumber,
        capacity: initialData.capacity,
        model: initialData.model,
        make: initialData.make,
        year: initialData.year || 2023,
        vehicleType: initialData.vehicleType || VehicleType.BUS,
        status: initialData.status || VehicleStatus.ACTIVE,
        assignedDriverId: initialData.assignedDriverId || null,
        fuelType: initialData.fuelType || 'DIESEL',
        insuranceExpiry: initialData.insuranceExpiry || '',
        fitnessExpiry: initialData.fitnessExpiry || '',
      });
    } else {
      reset({
        vehicleNumber: `BUS-${Math.floor(10 + Math.random() * 90)}`,
        registrationNumber: `REG-${Math.floor(1000 + Math.random() * 9000)}`,
        capacity: 35,
        model: 'Allstar Transit',
        make: 'Ford',
        year: 2024,
        vehicleType: VehicleType.BUS,
        status: VehicleStatus.ACTIVE,
        assignedDriverId: null,
        fuelType: 'DIESEL',
        insuranceExpiry: '2027-12-31',
        fitnessExpiry: '2027-06-30',
      });
    }
  }, [initialData, reset, isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Fleet Vehicle' : 'Register New Vehicle'}
      subtitle="Fleet identification, seating capacity, and driver assignment"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Vehicle Bus Number *
            </label>
            <input
              type="text"
              {...register('vehicleNumber', { required: 'Vehicle number is required' })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="BUS-104"
            />
            {errors.vehicleNumber && <p className="text-xs text-rose-500 mt-1">{errors.vehicleNumber.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              State Registration / License Plate *
            </label>
            <input
              type="text"
              {...register('registrationNumber', { required: 'Registration is required' })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="NY-84920-SR"
            />
            {errors.registrationNumber && <p className="text-xs text-rose-500 mt-1">{errors.registrationNumber.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Vehicle Type
            </label>
            <select
              {...register('vehicleType')}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value={VehicleType.BUS}>School Bus (Full Size)</option>
              <option value={VehicleType.MINIBUS}>Minibus (Mid Size)</option>
              <option value={VehicleType.VAN}>Passenger Van</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Seating Capacity *
            </label>
            <input
              type="number"
              {...register('capacity', { required: 'Capacity is required', valueAsNumber: true })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              min="4"
              max="90"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Vehicle Status
            </label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value={VehicleStatus.ACTIVE}>Active / On Road</option>
              <option value={VehicleStatus.MAINTENANCE}>Under Maintenance</option>
              <option value={VehicleStatus.INACTIVE}>Inactive</option>
              <option value={VehicleStatus.OUT_OF_SERVICE}>Out of Service</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Make / Manufacturer
            </label>
            <input
              type="text"
              {...register('make')}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g. Ford / Blue Bird"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Model Name
            </label>
            <input
              type="text"
              {...register('model')}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g. Vision Transit"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Year of Manufacture
            </label>
            <input
              type="number"
              {...register('year', { valueAsNumber: true })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              min="2000"
              max="2030"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Assigned Driver
            </label>
            <select
              {...register('assignedDriverId', { setValueAs: (v) => (v ? Number(v) : null) })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">-- No Driver Assigned --</option>
              {availableDrivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.firstName} {d.lastName} ({d.phone})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Fuel Type
            </label>
            <select
              {...register('fuelType')}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="DIESEL">Diesel</option>
              <option value="ELECTRIC">Electric / EV</option>
              <option value="CNG">CNG / Natural Gas</option>
              <option value="PETROL">Petrol / Gasoline</option>
            </select>
          </div>
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
            {isLoading ? 'Saving...' : initialData ? 'Update Vehicle' : 'Register Vehicle'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
