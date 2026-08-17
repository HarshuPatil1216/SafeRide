import { useEffect, useState } from "react";
import { reportsApi } from "../../api/reports";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";
import EmptyState from "../../components/ui/EmptyState";
import StatusBadge from "../../components/ui/StatusBadge";
import { Field, Input, Select } from "../../components/ui/FormControls";
import { formatDateTime, titleCase } from "../../utils/formatters";
import { RIDE_EVENT_TYPES } from "../../utils/constants";

const TABS = [
  { key: "rides", label: "Ride reports" },
  { key: "attendance", label: "Attendance reports" },
  { key: "locations", label: "Vehicle location reports" },
];

export default function Reports() {
  const [tab, setTab] = useState("rides");
  return (
    <div className="space-y-4">
      <div className="flex gap-1 border-b border-navy-900/10">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
              tab === t.key ? "border-navy-900 text-navy-900" : "border-transparent text-navy-500 hover:text-navy-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "rides" && <RideReports />}
      {tab === "attendance" && <AttendanceReports />}
      {tab === "locations" && <VehicleLocationReports />}
    </div>
  );
}

function useReportCall(callFn, deps) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function load() {
    setLoading(true);
    setError("");
    callFn()
      .then(setData)
      .catch((err) => setError(err.message || "Couldn't load this report."))
      .finally(() => setLoading(false));
  }

  useEffect(load, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error, reload: load };
}

function RideReports() {
  const [filter, setFilter] = useState("all");
  const callFn =
    filter === "completed"
      ? reportsApi.completedRides
      : filter === "running"
      ? reportsApi.runningRides
      : filter === "scheduled"
      ? reportsApi.scheduledRides
      : reportsApi.allRides;

  const { data, loading, error, reload } = useReportCall(callFn, [filter]);

  return (
    <div className="card">
      <div className="p-4 border-b border-navy-900/10 w-full sm:w-64">
        <Field label="Filter">
          <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All rides</option>
            <option value="scheduled">Scheduled</option>
            <option value="running">In progress</option>
            <option value="completed">Completed</option>
          </Select>
        </Field>
      </div>
      {loading ? (
        <LoadingSpinner label="Loading report" />
      ) : error ? (
        <div className="p-4">
          <ErrorMessage message={error} onRetry={reload} />
        </div>
      ) : !data || data.length === 0 ? (
        <div className="p-4">
          <EmptyState title="No rides found" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy-900/[0.03] text-left text-xs font-semibold uppercase tracking-wide text-navy-600">
                <th className="px-4 py-3">Ride #</th>
                <th className="px-4 py-3">Driver</th>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Route</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Started</th>
                <th className="px-4 py-3">Ended</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-900/5">
              {data.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3">{r.id}</td>
                  <td className="px-4 py-3">{r.driverName}</td>
                  <td className="px-4 py-3">{r.vehicleNumber}</td>
                  <td className="px-4 py-3">
                    {r.source} → {r.destination}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge value={r.status} />
                  </td>
                  <td className="px-4 py-3">{formatDateTime(r.startTime)}</td>
                  <td className="px-4 py-3">{formatDateTime(r.endTime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AttendanceReports() {
  const [eventType, setEventType] = useState("");
  const callFn = eventType ? () => reportsApi.attendanceByType(eventType) : reportsApi.allAttendance;
  const { data, loading, error, reload } = useReportCall(callFn, [eventType]);

  return (
    <div className="card">
      <div className="p-4 border-b border-navy-900/10 w-full sm:w-64">
        <Field label="Event type">
          <Select value={eventType} onChange={(e) => setEventType(e.target.value)}>
            <option value="">All events</option>
            {RIDE_EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {titleCase(t)}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      {loading ? (
        <LoadingSpinner label="Loading report" />
      ) : error ? (
        <div className="p-4">
          <ErrorMessage message={error} onRetry={reload} />
        </div>
      ) : !data || data.length === 0 ? (
        <div className="p-4">
          <EmptyState title="No attendance records found" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy-900/[0.03] text-left text-xs font-semibold uppercase tracking-wide text-navy-600">
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Ride #</th>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Recorded at</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-900/5">
              {data.map((e) => (
                <tr key={e.id}>
                  <td className="px-4 py-3">{e.studentName}</td>
                  <td className="px-4 py-3">{e.rideId}</td>
                  <td className="px-4 py-3">
                    <StatusBadge value={e.eventType} />
                  </td>
                  <td className="px-4 py-3">{formatDateTime(e.eventTime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function VehicleLocationReports() {
  const [vehicleId, setVehicleId] = useState("");
  const callFn = vehicleId ? () => reportsApi.vehicleLocationReport(vehicleId) : reportsApi.allVehicleLocations;
  const { data, loading, error, reload } = useReportCall(callFn, [vehicleId]);

  return (
    <div className="card">
      <div className="p-4 border-b border-navy-900/10 w-full sm:w-64">
        <Field label="Vehicle ID (optional)" hint="Leave blank for all vehicles">
          <Input type="number" value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} placeholder="e.g. 3" />
        </Field>
      </div>
      {loading ? (
        <LoadingSpinner label="Loading report" />
      ) : error ? (
        <div className="p-4">
          <ErrorMessage message={error} onRetry={reload} />
        </div>
      ) : !data || data.length === 0 ? (
        <div className="p-4">
          <EmptyState title="No location records found" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy-900/[0.03] text-left text-xs font-semibold uppercase tracking-wide text-navy-600">
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Latitude</th>
                <th className="px-4 py-3">Longitude</th>
                <th className="px-4 py-3">Recorded at</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-900/5">
              {data.map((loc, i) => (
                <tr key={loc.id || i}>
                  <td className="px-4 py-3">{loc.vehicleNumber || loc.vehicleId}</td>
                  <td className="px-4 py-3 font-mono">{loc.latitude}</td>
                  <td className="px-4 py-3 font-mono">{loc.longitude}</td>
                  <td className="px-4 py-3">{formatDateTime(loc.recordedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
