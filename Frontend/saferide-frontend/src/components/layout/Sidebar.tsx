import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  UserCheck,
  Bus,
  Route as RouteIcon,
  MapPin,
  Clock,
  Radio,
  Bell,
  BarChart3,
  X,
  Heart,
  Navigation,
  CheckSquare,
  Shield,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { isAdmin, isDriver, isParent } = useAuth();

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/live-tracking', label: 'Live Fleet Tracking', icon: Radio },
    { to: '/admin/students', label: 'Students', icon: GraduationCap },
    { to: '/admin/parents', label: 'Parents', icon: Heart },
    { to: '/admin/drivers', label: 'Drivers', icon: UserCheck },
    { to: '/admin/vehicles', label: 'Vehicles', icon: Bus },
    { to: '/admin/routes', label: 'Routes', icon: RouteIcon },
    { to: '/admin/stops', label: 'Stops', icon: MapPin },
    { to: '/admin/rides', label: 'Rides & Trips', icon: Clock },
    { to: '/admin/notifications', label: 'Broadcasts', icon: Bell },
    { to: '/admin/reports', label: 'Reports & Analytics', icon: BarChart3 },
  ];

  const driverLinks = [
    { to: '/driver/dashboard', label: 'Driver Cockpit', icon: LayoutDashboard },
    { to: '/driver/trip', label: 'Active Navigation', icon: Navigation },
    { to: '/driver/notifications', label: 'Alerts & Messages', icon: Bell },
  ];

  const parentLinks = [
    { to: '/parent/dashboard', label: 'Child Dashboard', icon: Heart },
    { to: '/parent/live-tracking', label: 'Track School Bus', icon: Radio },
    { to: '/parent/children', label: 'My Children', icon: GraduationCap },
    { to: '/parent/notifications', label: 'Notifications', icon: Bell },
  ];

  const links = isAdmin ? adminLinks : isDriver ? driverLinks : parentLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#0a0a0a] text-[#e2e8f0] border-r border-[#1e293b] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-[#1e293b] bg-[#0a0a0a]">
          <div className="flex items-center gap-2.5 text-[#38bdf8]">
            <div className="w-8 h-8 rounded-lg bg-[#38bdf8]/10 border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8] shadow-xs">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display font-bold text-lg tracking-tight text-white uppercase">
                Safe<span className="text-[#38bdf8]">Ride</span>
              </span>
              <p className="text-[9px] text-slate-500 font-medium tracking-[0.18em] uppercase">
                {isAdmin ? 'Command Center' : isDriver ? 'Driver Portal' : 'Parent Portal'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Links */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {isAdmin ? 'Fleet Operations' : isDriver ? 'Driver Console' : 'Family Tracking'}
          </div>

          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#1e293b]/70 border-l-2 border-[#38bdf8] text-white font-semibold'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white border-l-2 border-transparent'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Footer Role info */}
        <div className="p-4 border-t border-[#1e293b] bg-[#050505]/70">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] text-slate-400 font-medium">
              System: Online
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
