import { useState } from "react";
import { Link } from "react-router-dom";
import { studentRideEventsApi } from "../../api/studentRideEvents";
import { Field, Input, Select } from "../../components/ui/FormControls";
import ErrorMessage from "../../components/ui/ErrorMessage";
import EmptyState from "../../components/ui/EmptyState";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { useAuth } from "../../hooks/useAuth";
import { useLocalProfile } from "../../hooks/useLocalProfile";
import { useToast } from "../../hooks/useToast";
import { formatDateTime, titleCase } from "../../utils/formatters";
import { RIDE_EVENT_TYPES } from "../../utils/constants";

export default function DriverStudentEvents() {
  const { user } = useAuth();
  const { isComplete } = useLocalProfile("driver", user?.email);
  const toast = useToast();

  const [form, setForm] = useState({ studentId: "", rideId: "", eventType: "PICKED_UP" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [lookupStudentId, setLookupStudentId] = useState("");
  const [events, setEvents] = useState(null);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [lookupError, setLookupError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    if (!form.studentId || !form.rideId) {
      setFormError("Student ID and Ride ID are both required.");
      return;
    }
    setSubmitting(true);
    try {
      await studentRideEventsApi.create({
        studentId: Number(form.studentId),
        rideId: Number(form.rideId),
        eventType: form.eventType,
      });
      toast.success(`Recorded ${titleCase(form.eventType)} for student #${form.studentId}.`);
      setForm({ studentId: "", rideId: form.rideId, eventType: form.eventType });
    } catch (err) {
      setFormError(err.message || "Couldn't record this event.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLookup(e) {
    e.preventDefault();
    if (!lookupStudentId) return;
    setLoadingEvents(true);
    setLookupError("");
    try {
      const result = await studentRideEventsApi.byStudent(lookupStudentId, { page: 0, size: 20 });
      setEvents(result.content || result);
    } catch (err) {
      setLookupError(err.message || "Couldn't load events for this student.");
    } finally {
      setLoadingEvents(false);
    }
  }

  if (!isComplete) {
    return (
      <div className="card p-6 text-center">
        <p className="text-navy-800 font-medium mb-3">Set up your Driver ID first.</p>
        <Link to="/driver/setup" className="btn-primary inline-flex">
          Go to My IDs
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display font-semibold text-navy-900 mb-3">Record a pickup or drop-off</h3>
        <form onSubmit={handleSubmit} className="card p-5 space-y-4 max-w-sm">
          {formError && <ErrorMessage message={formError} />}
          <Field label="Student ID" required>
            <Input
              type="number"
              value={form.studentId}
              onChange={(e) => setForm({ ...form, studentId: e.target.value })}
              placeholder="e.g. 21"
            />
          </Field>
          <Field label="Ride ID" required>
            <Input
              type="number"
              value={form.rideId}
              onChange={(e) => setForm({ ...form, rideId: e.target.value })}
              placeholder="e.g. 12"
            />
          </Field>
          <Field label="Event" required>
            <Select value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })}>
              {RIDE_EVENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {titleCase(t)}
                </option>
              ))}
            </Select>
          </Field>
          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            {submitting ? "Recording…" : "Record event"}
          </button>
        </form>
      </div>

      <div>
        <h3 className="font-display font-semibold text-navy-900 mb-3">Look up a student's ride events</h3>
        <form onSubmit={handleLookup} className="flex gap-2 max-w-sm mb-4">
          <Input
            type="number"
            value={lookupStudentId}
            onChange={(e) => setLookupStudentId(e.target.value)}
            placeholder="Student ID"
          />
          <button type="submit" className="btn-secondary shrink-0" disabled={loadingEvents}>
            {loadingEvents ? "Loading…" : "Look up"}
          </button>
        </form>

        {lookupError && <ErrorMessage message={lookupError} />}
        {loadingEvents && <LoadingSpinner label="Loading events" />}
        {events && events.length === 0 && <EmptyState title="No events found for this student" />}
        {events && events.length > 0 && (
          <ul className="card divide-y divide-navy-900/5">
            {events.map((ev) => (
              <li key={ev.id} className="p-4 flex items-center justify-between">
                <span className="font-medium text-navy-900">{titleCase(ev.eventType)}</span>
                <span className="text-sm text-navy-600">Ride #{ev.rideId} · {formatDateTime(ev.eventTime)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
