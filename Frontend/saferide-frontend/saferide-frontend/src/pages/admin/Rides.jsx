import { useState } from "react";
import { ridesApi } from "../../api/rides";
import { driversApi } from "../../api/drivers";
import { vehiclesApi } from "../../api/vehicles";
import ResourceTable from "../../components/admin/ResourceTable";
import ResourceFormModal from "../../components/admin/ResourceFormModal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import StatusBadge from "../../components/ui/StatusBadge";
import { useResourceList } from "../../hooks/useResourceList";
import { useOptions } from "../../hooks/useOptions";
import { useToast } from "../../hooks/useToast";
import { formatDateTime } from "../../utils/formatters";

const columns = [
  { key: "id", label: "Ride #" },
  { key: "driverName", label: "Driver" },
  { key: "vehicleNumber", label: "Vehicle" },
  { key: "source", label: "From" },
  { key: "destination", label: "To" },
  { key: "status", label: "Status", render: (row) => <StatusBadge value={row.status} /> },
  { key: "startTime", label: "Started", render: (row) => formatDateTime(row.startTime) },
  { key: "endTime", label: "Ended", render: (row) => formatDateTime(row.endTime) },
];

export default function Rides() {
  const list = useResourceList(ridesApi, { sortBy: "id", sortDir: "desc" });
  const toast = useToast();

  const { options: driverOptions } = useOptions(driversApi, (d) => ({ value: String(d.id), label: d.fullName }));
  const { options: vehicleOptions } = useOptions(vehiclesApi, (v) => ({ value: String(v.id), label: v.vehicleNumber }));

  const [createOpen, setCreateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [actionRideId, setActionRideId] = useState(null);

  const fields = [
    {
      name: "driverId",
      label: "Driver",
      type: "select",
      required: true,
      options: driverOptions,
      placeholder: driverOptions.length ? "Select a driver" : "No drivers yet — add one first",
    },
    {
      name: "vehicleId",
      label: "Vehicle",
      type: "select",
      required: true,
      options: vehicleOptions,
      placeholder: vehicleOptions.length ? "Select a vehicle" : "No vehicles yet — add one first",
    },
    { name: "source", label: "Source", required: true },
    { name: "destination", label: "Destination", required: true },
  ];

  async function handleCreate(values) {
    setSubmitting(true);
    try {
      await ridesApi.create({ ...values, driverId: Number(values.driverId), vehicleId: Number(values.vehicleId) });
      toast.success("Ride scheduled.");
      setCreateOpen(false);
      list.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStart(row) {
    setActionRideId(row.id);
    try {
      await ridesApi.start(row.id);
      toast.success(`Ride #${row.id} started.`);
      list.refresh();
    } catch (err) {
      toast.error(err.message || "Couldn't start this ride.");
    } finally {
      setActionRideId(null);
    }
  }

  async function handleEnd(row) {
    setActionRideId(row.id);
    try {
      await ridesApi.end(row.id);
      toast.success(`Ride #${row.id} completed.`);
      list.refresh();
    } catch (err) {
      toast.error(err.message || "Couldn't end this ride.");
    } finally {
      setActionRideId(null);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await ridesApi.remove(deleteTarget.id);
      toast.success(`Ride #${deleteTarget.id} deleted.`);
      setDeleteTarget(null);
      list.refresh();
    } catch (err) {
      toast.error(err.message || "Couldn't delete this ride.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <ResourceTable
        columns={columns}
        rows={list.rows}
        loading={list.loading}
        error={list.error}
        onRetry={list.refresh}
        page={list.page}
        totalPages={list.totalPages}
        totalElements={list.totalElements}
        pageSize={list.pageSize}
        onPageChange={list.setPage}
        searchQuery={list.query}
        onSearchChange={list.onSearchChange}
        searchPlaceholder="Search by source or destination…"
        onCreate={() => setCreateOpen(true)}
        createLabel="ride"
        emptyTitle="No rides yet"
        emptyDescription="Scheduled rides will show up here."
        renderActions={(row) => (
          <>
            {row.status === "SCHEDULED" && (
              <button
                className="btn-ghost px-3 py-1.5 text-transit-go"
                onClick={() => handleStart(row)}
                disabled={actionRideId === row.id}
              >
                Start
              </button>
            )}
            {row.status === "IN_PROGRESS" && (
              <button
                className="btn-ghost px-3 py-1.5 text-transit-wait"
                onClick={() => handleEnd(row)}
                disabled={actionRideId === row.id}
              >
                End
              </button>
            )}
            <button className="btn-ghost px-3 py-1.5 text-transit-stop" onClick={() => setDeleteTarget(row)}>
              Delete
            </button>
          </>
        )}
      />

      <ResourceFormModal
        open={createOpen}
        title="Schedule a ride"
        fields={fields}
        initialValues={{ driverId: "", vehicleId: "", source: "", destination: "" }}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        submitting={submitting}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete this ride?"
        description={deleteTarget ? `This will permanently remove ride #${deleteTarget.id}. This can't be undone.` : ""}
        confirmLabel="Delete"
        loading={deleting}
      />
    </>
  );
}
