import React, { useState } from 'react';
import {
  Bell,
  Plus,
  Send,
  Radio,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  RefreshCw,
} from 'lucide-react';
import {
  useNotifications,
  useBroadcastNotification,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from '../../hooks/useNotifications';
import { Notification, NotificationRequestDTO, NotificationType } from '../../types';
import { TablePagination } from '../../components/common/TablePagination';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { BroadcastNotificationDialog } from '../../components/forms/BroadcastNotificationDialog';

export const NotificationsPage: React.FC = () => {
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { data: notifications = [], isLoading, refetch } = useNotifications();
  const broadcastMutation = useBroadcastNotification();
  const markReadMutation = useMarkNotificationAsRead();
  const markAllReadMutation = useMarkAllNotificationsAsRead();

  const totalPages = Math.ceil(notifications.length / pageSize) || 1;
  const paginatedNotifs = notifications.slice(page * pageSize, (page + 1) * pageSize);

  const handleBroadcast = (dto: NotificationRequestDTO) => {
    broadcastMutation.mutate(dto, {
      onSuccess: () => setBroadcastOpen(false),
    });
  };

  const getNotificationIcon = (type: NotificationType | string) => {
    switch (type) {
      case NotificationType.EMERGENCY:
      case 'EMERGENCY':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case NotificationType.DELAY:
      case 'DELAY':
        return <Clock className="w-4 h-4 text-amber-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-display tracking-tight text-slate-900">
            Push Alerts & Broadcasts
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Send real-time alerts to parents and drivers, and review historical broadcast logs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-2xs transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => markAllReadMutation.mutate()}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
          >
            Mark All Read
          </button>
          <button
            onClick={() => setBroadcastOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all hover:shadow-md cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Broadcast Alert</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={6} columns={4} />
        ) : notifications.length === 0 ? (
          <EmptyState
            title="No Notifications Logged"
            description="Broadcast alerts to parents regarding weather delays, emergencies, or route updates."
            icon={Bell}
            actionText="Send Broadcast"
            onAction={() => setBroadcastOpen(true)}
          />
        ) : (
          <>
            <div className="divide-y divide-slate-100">
              {paginatedNotifs.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => !notif.read && markReadMutation.mutate(notif.id)}
                  className={`p-4 sm:p-5 flex items-start gap-4 transition-colors cursor-pointer ${
                    notif.read ? 'bg-white hover:bg-slate-50/70' : 'bg-blue-50/30 hover:bg-blue-50/50'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-100 shrink-0">
                    {getNotificationIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h3 className="text-sm font-bold text-slate-900">{notif.title}</h3>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(notif.createdAt || Date.now()).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>

                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                        {notif.type}
                      </span>
                      {notif.targetRole && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-700">
                          Audience: {notif.targetRole}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <TablePagination
              currentPage={page}
              totalPages={totalPages}
              totalElements={notifications.length}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(s) => {
                setPageSize(s);
                setPage(0);
              }}
            />
          </>
        )}
      </div>

      <BroadcastNotificationDialog
        isOpen={broadcastOpen}
        onClose={() => setBroadcastOpen(false)}
        onSubmit={handleBroadcast}
        isLoading={broadcastMutation.isPending}
      />
    </div>
  );
};
