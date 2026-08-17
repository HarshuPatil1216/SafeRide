import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: "📊", end: true },
  { to: "/admin/students", label: "Students", icon: "🎒" },
  { to: "/admin/parents", label: "Parents", icon: "👪" },
  { to: "/admin/drivers", label: "Drivers", icon: "🧑‍✈️" },
  { to: "/admin/vehicles", label: "Vehicles", icon: "🚌" },
  { to: "/admin/routes", label: "Routes", icon: "🗺️" },
  { to: "/admin/stops", label: "Stops", icon: "📍" },
  { to: "/admin/rides", label: "Rides", icon: "🛣️" },
  { to: "/admin/notifications", label: "Notifications", icon: "🔔" },
  { to: "/admin/reports", label: "Reports", icon: "📑" },
  { to: "/admin/search", label: "Search", icon: "🔍" },
];

const TITLES = {
  "/admin": "Dashboard",
  "/admin/students": "Students",
  "/admin/parents": "Parents",
  "/admin/drivers": "Drivers",
  "/admin/vehicles": "Vehicles",
  "/admin/routes": "Routes",
  "/admin/stops": "Stops",
  "/admin/rides": "Rides",
  "/admin/notifications": "Notifications",
  "/admin/reports": "Reports",
  "/admin/search": "Search",
};

export default function AdminLayout() {
  const location = useLocation();
  const title = TITLES[location.pathname] || "SafeRide Admin";

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar items={NAV_ITEMS} />
      <div className="flex-1 min-w-0">
        <Navbar title={title} items={NAV_ITEMS} />
        <main className="p-4 md:p-6 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
