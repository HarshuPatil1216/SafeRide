import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const NAV_ITEMS = [
  { to: "/parent", label: "Notifications", icon: "🔔", end: true },
  { to: "/parent/student", label: "Ride Events", icon: "🎒" },
  { to: "/parent/tracking", label: "Bus Tracking", icon: "🚌" },
  { to: "/parent/setup", label: "My IDs", icon: "⚙️" },
];

const TITLES = {
  "/parent": "Notifications",
  "/parent/student": "Ride Events",
  "/parent/tracking": "Bus Tracking",
  "/parent/setup": "My IDs",
};

export default function ParentLayout() {
  const location = useLocation();
  const title = TITLES[location.pathname] || "SafeRide Parent";

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar items={NAV_ITEMS} />
      <div className="flex-1 min-w-0">
        <Navbar title={title} items={NAV_ITEMS} />
        <main className="p-4 md:p-6 max-w-4xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
