import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Bell,
  LogOut,
  User as UserIcon,
  Shield,
  Bus,
  Heart,
  Server,
  ChevronDown,
  Menu,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { useUnreadNotifications, useMarkNotificationAsRead, useMarkAllNotificationsAsRead } from '../../hooks/useNotifications';
import { ServerConfigModal } from '../common/ServerConfigModal';
import { getBaseApiUrl } from '../../api/axios';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  onToggleSidebar?: () => void;
  title?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, title }) => {
  const { user, logout, isAdmin, isDriver, isParent } = useAuth();
  const navigate = useNavigate();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isServerModalOpen, setIsServerModalOpen] = useState(false);

  const { data: unreadNotifs = [] } = useUnreadNotifications();
  const markReadMutation = useMarkNotificationAsRead();
  const markAllReadMutation = useMarkAllNotificationsAsRead();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getRoleBadge = () => {
    if (isAdmin) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-950/50 text-purple-300 border border-purple-800/60">
          <Shield className="w-3 h-3" /> Admin
        </span>
      );
    }
    if (isDriver) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/50 text-amber-300 border border-amber-800/60">
          <Bus className="w-3 h-3" /> Driver
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-950/50 text-sky-300 border border-sky-800/60">
        <Heart className="w-3 h-3" /> Parent
      </span>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#0a0a0a] border-b border-[#1e293b]">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Mobile hamburger & Page Title */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleSidebar}
              className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {title && (
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 font-medium">
                <span>SafeRide</span>
                <span className="text-slate-600">/</span>
                <span className="text-white font-semibold">{title}</span>
              </div>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Backend URL Indicator / Switcher */}
            <button
              onClick={() => setIsServerModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 bg-[#1e293b]/50 hover:bg-[#1e293b] hover:text-white border border-[#1e293b] rounded-lg transition-colors"
              title="Configure Spring Boot API Endpoint"
            >
              <Server className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span className="hidden md:inline font-mono text-[11px] max-w-[150px] truncate text-slate-300">
                {getBaseApiUrl().replace('http://', '').replace('https://', '')}
              </span>
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen);
                  setIsProfileOpen(false);
                }}
                className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-[#0a0a0a] animate-pulse" />
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0a0a0a] rounded-xl shadow-2xl border border-[#1e293b] py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2 border-b border-[#1e293b] flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Notifications ({unreadNotifs.length})
                    </span>
                    {unreadNotifs.length > 0 && (
                      <button
                        onClick={() => markAllReadMutation.mutate()}
                        className="text-xs text-[#38bdf8] hover:text-sky-300 font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-[#1e293b]">
                    {unreadNotifs.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-500">
                        No new notifications
                      </div>
                    ) : (
                      unreadNotifs.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markReadMutation.mutate(notif.id)}
                          className="px-4 py-3 hover:bg-slate-900/80 cursor-pointer transition-colors"
                        >
                          <p className="text-xs font-semibold text-slate-200">{notif.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{notif.message}</p>
                          <span className="text-[10px] text-slate-500 mt-1 block">
                            {new Date(notif.createdAt || Date.now()).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotifOpen(false);
                }}
                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-slate-800/60 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#1e293b] border border-[#38bdf8]/30 text-[#38bdf8] font-bold text-xs flex items-center justify-center shadow-xs">
                  {user?.firstName?.charAt(0) || 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-slate-200 truncate max-w-[120px]">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-[10px] text-slate-400">{getRoleBadge()}</div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-500 hidden sm:block" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#0a0a0a] rounded-xl shadow-2xl border border-[#1e293b] py-1.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2.5 border-b border-[#1e293b]">
                    <p className="text-xs font-semibold text-white truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                    <div className="mt-2">{getRoleBadge()}</div>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/70 hover:text-white"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    <span>My Profile</span>
                  </Link>

                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      setIsServerModalOpen(true);
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/70 hover:text-white"
                  >
                    <Server className="w-4 h-4 text-slate-400" />
                    <span>Backend Config</span>
                  </button>

                  <div className="border-t border-[#1e293b] mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/30"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Backend Server Configuration Modal */}
      <ServerConfigModal
        isOpen={isServerModalOpen}
        onClose={() => setIsServerModalOpen(false)}
      />
    </>
  );
};
