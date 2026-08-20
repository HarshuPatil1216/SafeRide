import React from 'react';
import { Bell, AlertTriangle, Clock, Info, RefreshCw } from 'lucide-react';
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from '../../hooks/useNotifications';
import { NotificationType } from '../../types';

export const ParentNotificationsPage: React.FC = () => {
  const { data: notifications = [], isLoading, refetch } = useNotifications();
  const markReadMutation = useMarkNotificationAsRead();
  const markAllReadMutation = useMarkAllNotificationsAsRead();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-display tracking-tight text-slate-900">
            Safety & Bus Notifications
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time push alerts regarding student boarding, bus departures, delays, and emergency notices
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
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
          >
            Mark All Read
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">
            <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            No notifications logged at this time.
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => !notif.read && markReadMutation.mutate(notif.id)}
              className={`p-5 flex items-start gap-4 transition-colors cursor-pointer ${
                notif.read ? 'bg-white hover:bg-slate-50/70' : 'bg-blue-50/40 hover:bg-blue-50/60'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-slate-100 shrink-0">
                {notif.type === NotificationType.EMERGENCY ? (
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                ) : notif.type === NotificationType.DELAY ? (
                  <Clock className="w-4 h-4 text-amber-600" />
                ) : (
                  <Info className="w-4 h-4 text-blue-600" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">{notif.title}</h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(notif.createdAt || Date.now()).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
