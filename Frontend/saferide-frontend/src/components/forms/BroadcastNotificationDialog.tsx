import React from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../common/Modal';
import { NotificationRequestDTO, NotificationType, UserRole } from '../../types';
import { useRoutes } from '../../hooks/useRoutes';

interface BroadcastNotificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NotificationRequestDTO) => void;
  isLoading?: boolean;
}

export const BroadcastNotificationDialog: React.FC<BroadcastNotificationDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NotificationRequestDTO>({
    defaultValues: {
      title: '',
      message: '',
      type: NotificationType.SYSTEM,
      targetRole: UserRole.PARENT,
      routeId: undefined,
    },
  });

  const { data: routes = [] } = useRoutes();

  const handleFormSubmit = (data: NotificationRequestDTO) => {
    onSubmit(data);
    reset();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Broadcast Notification"
      subtitle="Send instant push alert to parents, drivers, or route groups"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Notification Title *
          </label>
          <input
            type="text"
            {...register('title', { required: 'Title is required' })}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g. Route 04 15-Minute Weather Delay"
          />
          {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Alert Category
            </label>
            <select
              {...register('type')}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value={NotificationType.SYSTEM}>System Announcement</option>
              <option value={NotificationType.DELAY}>Traffic / Weather Delay</option>
              <option value={NotificationType.EMERGENCY}>Safety Emergency Alert</option>
              <option value={NotificationType.RIDE_STARTED}>Ride Schedule Update</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Target Audience
            </label>
            <select
              {...register('targetRole')}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value={UserRole.PARENT}>All Parents & Guardians</option>
              <option value={UserRole.DRIVER}>All Drivers</option>
              <option value={UserRole.ADMIN}>Administrators Only</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Filter by Bus Route (Optional)
          </label>
          <select
            {...register('routeId', { setValueAs: (v) => (v ? Number(v) : undefined) })}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">-- Broadcast to All Routes --</option>
            {routes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.routeName} ({r.routeCode})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Detailed Message *
          </label>
          <textarea
            {...register('message', { required: 'Message is required' })}
            rows={3}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Type your announcement or emergency instructions..."
          />
          {errors.message && <p className="text-xs text-rose-500 mt-1">{errors.message.message}</p>}
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
            {isLoading ? 'Broadcasting...' : 'Send Broadcast'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
