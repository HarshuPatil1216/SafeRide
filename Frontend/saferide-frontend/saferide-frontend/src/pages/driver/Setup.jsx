import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useLocalProfile } from "../../hooks/useLocalProfile";
import { useToast } from "../../hooks/useToast";
import { Field, Input } from "../../components/ui/FormControls";

export default function DriverSetup() {
  const { user } = useAuth();
  const toast = useToast();
  const { profile, save } = useLocalProfile("driver", user?.email);
  const [form, setForm] = useState({ driverId: profile.driverId || "", vehicleId: profile.vehicleId || "" });

  function handleSubmit(e) {
    e.preventDefault();
    save({ driverId: form.driverId, vehicleId: form.vehicleId });
    toast.success("Saved. These IDs will be remembered on this device.");
  }

  return (
    <div className="space-y-4">
      <div className="card p-5 border-signal-500/40 bg-signal-500/5">
        <p className="text-sm text-navy-800">
          <strong>Why this screen exists:</strong> SafeRide doesn't yet have a "my profile" endpoint linking your
          login to your driver record, so an admin needs to give you your Driver ID and Vehicle ID once. Enter them
          below — they're saved on this device only, and used to log ride events and location updates for you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card p-5 space-y-4 max-w-sm">
        <Field label="My Driver ID" required hint="Given to you by an admin">
          <Input
            type="number"
            value={form.driverId}
            onChange={(e) => setForm({ ...form, driverId: e.target.value })}
            placeholder="e.g. 4"
          />
        </Field>
        <Field label="My Vehicle ID" required hint="The vehicle assigned to you">
          <Input
            type="number"
            value={form.vehicleId}
            onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
            placeholder="e.g. 2"
          />
        </Field>
        <button type="submit" className="btn-primary w-full">
          Save
        </button>
      </form>
    </div>
  );
}
