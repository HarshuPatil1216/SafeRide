import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../common/Modal';
import { EntityStatus, Parent, ParentRelationship, ParentRequestDTO } from '../../types';

interface ParentFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ParentRequestDTO) => void;
  initialData?: Parent | null;
  isLoading?: boolean;
}

export const ParentFormDialog: React.FC<ParentFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ParentRequestDTO>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      emergencyContact: '',
      address: '',
      relationship: ParentRelationship.MOTHER,
      status: EntityStatus.ACTIVE,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email,
        phone: initialData.phone,
        emergencyContact: initialData.emergencyContact || '',
        address: initialData.address || '',
        relationship: initialData.relationship || ParentRelationship.MOTHER,
        status: initialData.status || EntityStatus.ACTIVE,
      });
    } else {
      reset({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: 'Password@123',
        emergencyContact: '',
        address: '',
        relationship: ParentRelationship.MOTHER,
        status: EntityStatus.ACTIVE,
      });
    }
  }, [initialData, reset, isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Parent Profile' : 'Register Parent Account'}
      subtitle="Parent login credentials, primary contacts, and relationship"
      maxWidth="md"
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
              placeholder="e.g. Elena"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Email Address (Login Username) *
            </label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="elena.vance@example.com"
            />
            {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Primary Phone *
            </label>
            <input
              type="text"
              {...register('phone', { required: 'Phone is required' })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="+1 (555) 902-1284"
            />
            {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone.message}</p>}
          </div>
        </div>

        {!initialData && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Initial Password *
            </label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Relationship to Child
            </label>
            <select
              {...register('relationship')}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value={ParentRelationship.MOTHER}>Mother</option>
              <option value={ParentRelationship.FATHER}>Father</option>
              <option value={ParentRelationship.GUARDIAN}>Legal Guardian</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Account Status
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
            Residential Address
          </label>
          <input
            type="text"
            {...register('address')}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="124 Conch Street"
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
            {isLoading ? 'Saving...' : initialData ? 'Update Parent' : 'Create Parent'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
