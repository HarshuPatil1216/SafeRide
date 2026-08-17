import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { vehicleLocationsApi } from "../../api/vehicleLocations";
import { Field, Input } from "../../components/ui/FormControls";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";
import { useAuth } from "../../hooks/useAuth";
import { useLocalProfile } from "../../hooks/useLocalProfile";
import { formatDateTime } from "../../utils/formatters";

export default function ParentTracking() {
  const { user } = useAuth();
  const { profile } = useLocalProfile("parent", user?.email);

  const [vehicleId, setVehicleId] = useState(profile.vehicleId || "");
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function load(id) {
    if (!id) return;
    setLoading(true);
    setError("");
    vehicleLocationsApi
      .latest(id)
      .then(setLocation)
      .catch((err) => setError(err.message || "Couldn't load the bus location."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (profile.vehicleId) load(profile.vehicleId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.vehicleId]);

  function handleSubmit(e) {
    e.preventDefault();
    load(vehicleId);
  }

  const mapUrl =
    location?.latitude && location?.longitude
      ? `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
      : null;

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="card p-4 flex gap-3">
        <Field label="Bus / Vehicle ID" required className="flex-1">
          <Input type="number" value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} placeholder="e.g. 2" />
        </Field>
        <div className="self-end">
          <button type="submit" className="btn-primary" disabled={loading || !vehicleId}>
            {loading ? "Loading…" : "Track"}
          </button>
        </div>
      </form>

      {!profile.vehicleId && (
        <p className="text-xs text-navy-500">
          Tip: save the bus's Vehicle ID on the{" "}
          <Link to="/parent/setup" className="underline font-medium">
            My IDs
          </Link>{" "}
          page so this loads automatically.
        </p>
      )}

      {error && <ErrorMessage message={error} onRetry={() => load(vehicleId)} />}
      {loading && <LoadingSpinner label="Locating the bus" />}

      {location && !loading && (
        <div className="card p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-navy-500 mb-1">Last known location</p>
          <p className="font-mono text-lg text-navy-900 mb-1">
            {location.latitude}, {location.longitude}
          </p>
          <p className="text-sm text-navy-600 mb-4">Updated {formatDateTime(location.recordedAt)}</p>
          {mapUrl && (
            <a href={mapUrl} target="_blank" rel="noreferrer" className="btn-secondary inline-flex">
              Open in Google Maps ↗
            </a>
          )}
        </div>
      )}
    </div>
  );
}
