import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { studentRideEventsApi } from "../../api/studentRideEvents";
import { Field, Input } from "../../components/ui/FormControls";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";
import EmptyState from "../../components/ui/EmptyState";
import { useAuth } from "../../hooks/useAuth";
import { useLocalProfile } from "../../hooks/useLocalProfile";
import { formatDateTime, titleCase } from "../../utils/formatters";

export default function ParentStudentEvents() {
  const { user } = useAuth();
  const { profile } = useLocalProfile("parent", user?.email);

  const [studentId, setStudentId] = useState(profile.studentId || "");
  const [events, setEvents] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function load(id) {
    if (!id) return;
    setLoading(true);
    setError("");
    studentRideEventsApi
      .byStudent(id, { page: 0, size: 20 })
      .then((res) => setEvents(res.content || res))
      .catch((err) => setError(err.message || "Couldn't load ride events."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (profile.studentId) load(profile.studentId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.studentId]);

  function handleSubmit(e) {
    e.preventDefault();
    load(studentId);
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="card p-4 flex gap-3">
        <Field label="Child's Student ID" required className="flex-1">
          <Input type="number" value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="e.g. 21" />
        </Field>
        <div className="self-end">
          <button type="submit" className="btn-primary" disabled={loading || !studentId}>
            {loading ? "Loading…" : "View events"}
          </button>
        </div>
      </form>

      {!profile.studentId && (
        <p className="text-xs text-navy-500">
          Tip: save your child's Student ID on the{" "}
          <Link to="/parent/setup" className="underline font-medium">
            My IDs
          </Link>{" "}
          page so this loads automatically.
        </p>
      )}

      {error && <ErrorMessage message={error} onRetry={() => load(studentId)} />}
      {loading && <LoadingSpinner label="Loading ride events" />}
      {events && events.length === 0 && <EmptyState title="No ride events yet" description="Pickup and drop-off events will appear here." />}
      {events && events.length > 0 && (
        <ul className="card divide-y divide-navy-900/5">
          {events.map((ev) => (
            <li key={ev.id} className="p-4 flex items-center justify-between">
              <span className="font-semibold text-navy-900">{titleCase(ev.eventType)}</span>
              <span className="text-sm text-navy-600">
                Ride #{ev.rideId} · {formatDateTime(ev.eventTime)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
