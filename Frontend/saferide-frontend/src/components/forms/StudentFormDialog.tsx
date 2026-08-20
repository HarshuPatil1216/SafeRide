import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../common/Modal';
import { EntityStatus, PickupDropType, Student, StudentRequestDTO } from '../../types';
import { useRoutes } from '../../hooks/useRoutes';
import { useParents } from '../../hooks/useParents';
import { useRouteStops } from '../../hooks/useStops';

interface StudentFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StudentRequestDTO) => void;
  initialData?: Student | null;
  isLoading?: boolean;
}

export const StudentFormDialog: React.FC<StudentFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<StudentRequestDTO>({
    defaultValues: {
      firstName: '',
      lastName: '',
      rollNumber: '',
      grade: 'Grade 5',
      section: 'A',
      gender: 'MALE',
      parentId: null,
      routeId: null,
      stopId: null,
      pickupDropType: PickupDropType.PICKUP_AND_DROP,
      status: EntityStatus.ACTIVE,
      emergencyContact: '',
      address: '',
    },
  });

  const selectedRouteId = watch('routeId');
  const { data: routes = [] } = useRoutes();
  const { data: parents = [] } = useParents();
  const { data: routeStops = [] } = useRouteStops(selectedRouteId || '');

  useEffect(() => {
    if (initialData) {
      reset({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        rollNumber: initialData.rollNumber,
        grade: initialData.grade,
        section: initialData.section || '',
        gender: initialData.gender || 'MALE',
        parentId: initialData.parentId || null,
        routeId: initialData.routeId || null,
        stopId: initialData.stopId || null,
        pickupDropType: initialData.pickupDropType || PickupDropType.PICKUP_AND_DROP,
        status: initialData.status || EntityStatus.ACTIVE,
        emergencyContact: initialData.emergencyContact || '',
        address: initialData.address || '',
      });
    } else {
      reset({
        firstName: '',
        lastName: '',
        rollNumber: `ST-${Math.floor(1000 + Math.random() * 9000)}`,
        grade: 'Grade 5',
        section: 'A',
        gender: 'MALE',
        parentId: null,
        routeId: null,
        stopId: null,
        pickupDropType: PickupDropType.PICKUP_AND_DROP,
        status: EntityStatus.ACTIVE,
        emergencyContact: '',
        address: '',
      });
    }
  }, [initialData, reset, isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Student Details' : 'Register New Student'}
      subtitle="Fill in student profile, parent association, and designated bus route"
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
              placeholder="e.g. Alex"
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
              placeholder="e.g. Vance"
            />
            {errors.lastName && <p className="text-xs text-rose-500 mt-1">{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Roll / ID Number *
            </label>
            <input
              type="text"
              {...register('rollNumber', { required: 'Roll number is required' })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="ST-1002"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Grade / Class *
            </label>
            <input
              type="text"
              {...register('grade', { required: 'Grade is required' })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Grade 5"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Section
            </label>
            <input
              type="text"
              {...register('section')}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="A"
            />
          </div>
        </div>

        {/* Associations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Parent / Guardian
            </label>
            <select
              {...register('parentId', { setValueAs: (v) => (v ? Number(v) : null) })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">-- Select Parent --</option>
              {parents.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName} ({p.phone})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Emergency Contact Phone
            </label>
            <input
              type="text"
              {...register('emergencyContact')}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="+1 (555) 019-2834"
            />
          </div>
        </div>

        {/* Transportation Route & Stop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Assigned Bus Route
            </label>
            <select
              {...register('routeId', { setValueAs: (v) => (v ? Number(v) : null) })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">-- Select Bus Route --</option>
              {routes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.routeName} ({r.routeCode})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Assigned Stop
            </label>
            <select
              {...register('stopId', { setValueAs: (v) => (v ? Number(v) : null) })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">-- Select Stop --</option>
              {routeStops.map((s) => (
                <option key={s.id} value={s.id}>
                  #{s.sequenceOrder} {s.stopName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Service Type
            </label>
            <select
              {...register('pickupDropType')}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value={PickupDropType.PICKUP_AND_DROP}>Pickup & Drop (Both)</option>
              <option value={PickupDropType.PICKUP_ONLY}>Pickup Only (Morning)</option>
              <option value={PickupDropType.DROP_ONLY}>Drop Only (Evening)</option>
            </select>
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

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Home Address
          </label>
          <input
            type="text"
            {...register('address')}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g. 742 Evergreen Terrace, Springfield"
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
            {isLoading ? 'Saving...' : initialData ? 'Update Student' : 'Create Student'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
