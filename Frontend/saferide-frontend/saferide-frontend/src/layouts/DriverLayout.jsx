import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const NAV_ITEMS = [
  { to: "/driver", label: "My Ride", icon: "🚦", end: true },
  { to: "/driver/students", label: "Student Events", icon: "🎒" },
  { to: "/driver/location", label: "Vehicle Location", icon: "📍" },
  { to: "/driver/setup", label: "My IDs", icon: "⚙️" },
];

const TITLES = {
  "/driver": "My Ride",
  "/driver/students": "Student Events",
  "/driver/location": "Vehicle Location",
  "/driver/setup": "My IDs",
};

export default function DriverLayout() {
  const location = useLocation();
  const title = TITLES[location.pathname] || "SafeRide Driver";

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
