import { useEffect, useState } from "react";
import { dashboardApi } from "../../api/dashboard";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";

const CARD_GROUPS = [
  {
    title: "Network",
    cards: [
      { key: "totalStudents", label: "Students", icon: "🎒" },
      { key: "totalParents", label: "Parents", icon: "👪" },
      { key: "totalDrivers", label: "Drivers", icon: "🧑‍✈️" },
      { key: "totalVehicles", label: "Vehicles", icon: "🚌" },
      { key: "totalRoutes", label: "Routes", icon: "🗺️" },
      { key: "totalStops", label: "Stops", icon: "📍" },
    ],
  },
  {
    title: "Rides",
    cards: [
      { key: "totalRides", label: "Total rides", icon: "🛣️" },
      { key: "scheduledRides", label: "Scheduled", icon: "🕐", tone: "text-transit-wait" },
      { key: "runningRides", label: "In progress", icon: "🟢", tone: "text-transit-go" },
      { key: "completedRides", label: "Completed", icon: "✅", tone: "text-transit-idle" },
    ],
  },
  {
    title: "Notifications",
    cards: [
      { key: "totalNotifications", label: "Total sent", icon: "🔔" },
      { key: "unreadNotifications", label: "Unread", icon: "🔴", tone: "text-transit-stop" },
    ],
  },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function load() {
    setLoading(true);
    setError("");
    dashboardApi
      .getStats()
      .then(setStats)
      .catch((err) => setError(err.message || "Couldn't load dashboard stats."))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  if (loading) return <LoadingSpinner label="Loading dashboard" size="lg" />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-xl font-semibold text-navy-900">Welcome back</h2>
        <p className="text-navy-600 text-sm mt-1">Here's what's moving across the SafeRide network right now.</p>
      </div>

      {CARD_GROUPS.map((group) => (
        <div key={group.title}>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-navy-500 mb-3">{group.title}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {group.cards.map((c) => (
              <div key={c.key} className="card p-4">
                <div className="text-xl mb-2">{c.icon}</div>
                <p className={`font-display text-2xl font-semibold ${c.tone || "text-navy-900"}`}>{stats[c.key] ?? 0}</p>
                <p className="text-xs text-navy-600 mt-0.5">{c.label}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
