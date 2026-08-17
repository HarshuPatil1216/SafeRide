import { useState } from "react";
import { Link } from "react-router-dom";
import { ridesApi } from "../../api/rides";
import { Field, Input } from "../../components/ui/FormControls";
import StatusBadge from "../../components/ui/StatusBadge";
import ErrorMessage from "../../components/ui/ErrorMessage";
import { useAuth } from "../../hooks/useAuth";
import { useLocalProfile } from "../../hooks/useLocalProfile";
import { useToast } from "../../hooks/useToast";
import { formatDateTime } from "../../utils/formatters";

export default function DriverRideControl() {
  const { user } = useAuth();
  const { profile, isComplete } = useLocalProfile("driver", user?.email);
  const toast = useToast();

  const [rideId, setRideId] = useState("");
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleStart(e) {
    e.preventDefault();
    if (!rideId) return;
    setLoading(true);
    setError("");
    try {
      const result = await ridesApi.start(rideId);
      setRide(result);
      toast.success(`Ride #${rideId} started.`);
    } catch (err) {
      setError(err.message || "Couldn't start this ride.");
    } finally {
      setLoading(false);
    }
  }

  async function handleEnd() {
    setLoading(true);
    setError("");
    try {
      const result = await ridesApi.end(rideId);
      setRide(result);
      toast.success(`Ride #${rideId} completed.`);
    } catch (err) {
      setError(err.message || "Couldn't end this ride.");
    } finally {
      setLoading(false);
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
    <div className="space-y-4">
      <form onSubmit={handleStart} className="card p-5 space-y-4 max-w-sm">
        <Field label="Ride ID" required hint="Given to you by dispatch/admin for today's route">
          <Input type="number" value={rideId} onChange={(e) => setRideId(e.target.value)} placeholder="e.g. 12" />
        </Field>
        <div className="flex gap-2">
          <button type="submit" className="btn-primary flex-1" disabled={loading || !rideId}>
            {loading ? "Working…" : "Start ride"}
          </button>
          <button
            type="button"
            className="btn-secondary flex-1"
            onClick={handleEnd}
            disabled={loading || !rideId}
          >
            End ride
          </button>
        </div>
      </form>

      {error && <ErrorMessage message={error} />}

      {ride && (
        <div className="card p-5 max-w-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="font-display font-semibold text-navy-900">Ride #{ride.id}</p>
            <StatusBadge value={ride.status} />
          </div>
          <dl className="text-sm space-y-1.5 text-navy-700">
            <div className="flex justify-between">
              <dt>Route</dt>
              <dd className="font-medium text-navy-900">
                {ride.source} → {ride.destination}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt>Started</dt>
              <dd>{formatDateTime(ride.startTime)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Ended</dt>
              <dd>{formatDateTime(ride.endTime)}</dd>
            </div>
          </dl>
        </div>
      )}

      <p className="text-xs text-navy-500">
        My Driver ID: <span className="font-mono">{profile.driverId}</span> · My Vehicle ID:{" "}
        <span className="font-mono">{profile.vehicleId}</span>
      </p>
    </div>
  );
}
