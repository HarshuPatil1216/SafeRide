import { useState } from "react";
import { Link } from "react-router-dom";
import { vehicleLocationsApi } from "../../api/vehicleLocations";
import { Field, Input } from "../../components/ui/FormControls";
import ErrorMessage from "../../components/ui/ErrorMessage";
import EmptyState from "../../components/ui/EmptyState";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { useAuth } from "../../hooks/useAuth";
import { useLocalProfile } from "../../hooks/useLocalProfile";
import { useToast } from "../../hooks/useToast";
import { formatDateTime } from "../../utils/formatters";

export default function DriverVehicleLocation() {
  const { user } = useAuth();
  const { profile, isComplete } = useLocalProfile("driver", user?.email);
  const toast = useToast();

  const [coords, setCoords] = useState({ latitude: "", longitude: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [history, setHistory] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    if (!coords.latitude || !coords.longitude) {
      setFormError("Latitude and longitude are both required.");
      return;
    }
    setSubmitting(true);
    try {
      await vehicleLocationsApi.update({
        vehicleId: Number(profile.vehicleId),
        latitude: Number(coords.latitude),
        longitude: Number(coords.longitude),
      });
      toast.success("Location updated.");
    } catch (err) {
      setFormError(err.message || "Couldn't update location.");
    } finally {
      setSubmitting(false);
    }
  }

  function useDeviceLocation() {
    if (!navigator.geolocation) {
      setFormError("Your browser doesn't support location access.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          latitude: String(pos.coords.latitude.toFixed(6)),
          longitude: String(pos.coords.longitude.toFixed(6)),
        });
      },
      () => setFormError("Couldn't get your device location. Enter it manually instead.")
    );
  }

  async function loadHistory() {
    setLoadingHistory(true);
    setHistoryError("");
    try {
      const result = await vehicleLocationsApi.history(profile.vehicleId, { page: 0, size: 15 });
      setHistory(result.content || result);
    } catch (err) {
      setHistoryError(err.message || "Couldn't load location history.");
    } finally {
      setLoadingHistory(false);
    }
  }

  if (!isComplete) {
    return (
      <div className="card p-6 text-center">
        <p className="text-navy-800 font-medium mb-3">Set up your Vehicle ID first.</p>
        <Link to="/driver/setup" className="btn-primary inline-flex">
          Go to My IDs
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display font-semibold text-navy-900 mb-3">Update vehicle location</h3>
        <form onSubmit={handleSubmit} className="card p-5 space-y-4 max-w-sm">
          {formError && <ErrorMessage message={formError} />}
          <Field label="Latitude" required>
            <Input
              type="number"
              step="0.000001"
              value={coords.latitude}
              onChange={(e) => setCoords({ ...coords, latitude: e.target.value })}
            />
          </Field>
          <Field label="Longitude" required>
            <Input
              type="number"
              step="0.000001"
              value={coords.longitude}
              onChange={(e) => setCoords({ ...coords, longitude: e.target.value })}
            />
          </Field>
          <button type="button" className="btn-secondary w-full" onClick={useDeviceLocation}>
            📍 Use my current location
          </button>
          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            {submitting ? "Updating…" : "Send update"}
          </button>
        </form>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold text-navy-900">Recent location history</h3>
          <button className="btn-ghost px-3 py-1.5" onClick={loadHistory}>
            {loadingHistory ? "Loading…" : "Refresh"}
          </button>
        </div>
        {historyError && <ErrorMessage message={historyError} onRetry={loadHistory} />}
        {loadingHistory && <LoadingSpinner label="Loading history" />}
        {history && history.length === 0 && <EmptyState title="No location updates yet" />}
        {history && history.length > 0 && (
          <ul className="card divide-y divide-navy-900/5">
            {history.map((h, i) => (
              <li key={h.id || i} className="p-4 flex items-center justify-between text-sm">
                <span className="font-mono text-navy-900">
                  {h.latitude}, {h.longitude}
                </span>
                <span className="text-navy-600">{formatDateTime(h.recordedAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
