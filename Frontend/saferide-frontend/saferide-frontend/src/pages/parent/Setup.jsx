import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useLocalProfile } from "../../hooks/useLocalProfile";
import { useToast } from "../../hooks/useToast";
import { Field, Input } from "../../components/ui/FormControls";

export default function ParentSetup() {
  const { user } = useAuth();
  const toast = useToast();
  const { profile, save } = useLocalProfile("parent", user?.email);
  const [form, setForm] = useState({
    parentId: profile.parentId || "",
    studentId: profile.studentId || "",
    vehicleId: profile.vehicleId || "",
  });

  function handleSubmit(e) {
    e.preventDefault();
    save({ parentId: form.parentId, studentId: form.studentId, vehicleId: form.vehicleId });
    toast.success("Saved. These IDs will be remembered on this device.");
  }

  return (
    <div className="space-y-4">
      <div className="card p-5 border-signal-500/40 bg-signal-500/5">
        <p className="text-sm text-navy-800">
          <strong>Why this screen exists:</strong> SafeRide doesn't yet have a "my profile" endpoint linking your
          login to your parent record, so an admin needs to give you your Parent ID once. Enter it below — it's
          saved on this device only, and used to fetch your notifications and your child's ride events.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card p-5 space-y-4 max-w-sm">
        <Field label="My Parent ID" required hint="Given to you by an admin">
          <Input
            type="number"
            value={form.parentId}
            onChange={(e) => setForm({ ...form, parentId: e.target.value })}
            placeholder="e.g. 7"
          />
        </Field>
        <Field label="My Child's Student ID" hint="Optional — lets you jump straight to their ride events">
          <Input
            type="number"
            value={form.studentId}
            onChange={(e) => setForm({ ...form, studentId: e.target.value })}
            placeholder="e.g. 21"
          />
        </Field>
        <Field label="Bus/Vehicle ID" hint="Optional — lets you view live location on the Bus Tracking page">
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
