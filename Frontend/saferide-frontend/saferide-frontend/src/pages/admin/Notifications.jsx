import { useEffect, useState } from "react";
import { notificationsApi } from "../../api/notifications";
import { parentsApi } from "../../api/parents";
import { studentsApi } from "../../api/students";
import ResourceFormModal from "../../components/admin/ResourceFormModal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Pagination from "../../components/ui/Pagination";
import { Field, Select } from "../../components/ui/FormControls";
import { useOptions } from "../../hooks/useOptions";
import { useToast } from "../../hooks/useToast";
import { formatDateTime, titleCase } from "../../utils/formatters";
import { NOTIFICATION_TYPES } from "../../utils/constants";

export default function Notifications() {
  const toast = useToast();
  const { options: parentOptions } = useOptions(parentsApi, (p) => ({ value: String(p.id), label: `${p.fullName} · ${p.email}` }));
  const { options: studentOptions } = useOptions(studentsApi, (s) => ({ value: String(s.id), label: `${s.fullName} (#${s.rollNumber})` }));

  const [selectedParentId, setSelectedParentId] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [page, setPage] = useState(0);
  const [data, setData] = useState({ content: [], totalPages: 0, totalElements: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  function load() {
    if (!selectedParentId) {
      setData({ content: [], totalPages: 0, totalElements: 0 });
      return;
    }
    setLoading(true);
    setError("");
    const call = unreadOnly ? notificationsApi.unreadByParent : notificationsApi.byParent;
    call(selectedParentId, { page, size: 10 })
      .then(setData)
      .catch((err) => setError(err.message || "Couldn't load notifications."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedParentId, unreadOnly, page]);

  async function handleMarkRead(id) {
    try {
      await notificationsApi.markAsRead(id);
      toast.success("Marked as read.");
      load();
    } catch (err) {
      toast.error(err.message || "Couldn't mark as read.");
    }
  }

  async function handleCreate(values) {
    setSubmitting(true);
    try {
      await notificationsApi.create({
        parentId: Number(values.parentId),
        studentId: values.studentId ? Number(values.studentId) : null,
        rideId: values.rideId ? Number(values.rideId) : null,
        type: values.type,
        title: values.title,
        message: values.message,
      });
      toast.success("Notification sent.");
      setCreateOpen(false);
      if (String(values.parentId) === String(selectedParentId)) load();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await notificationsApi.remove(deleteTarget.id);
      toast.success("Notification deleted.");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.message || "Couldn't delete this notification.");
    } finally {
      setDeleting(false);
    }
  }

  const createFields = [
    { name: "parentId", label: "Parent", type: "select", required: true, options: parentOptions, placeholder: "Select a parent" },
    { name: "studentId", label: "Student (optional)", type: "select", options: studentOptions, placeholder: "No student linked" },
    { name: "rideId", label: "Ride ID (optional)", type: "number" },
    {
      name: "type",
      label: "Type",
      type: "select",
      required: true,
      options: NOTIFICATION_TYPES.map((t) => ({ value: t, label: titleCase(t) })),
    },
    { name: "title", label: "Title", required: true },
    { name: "message", label: "Message", required: true },
  ];

  return (
    <div className="space-y-4">
      <div className="card p-4 flex flex-col sm:flex-row sm:items-end gap-3 justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="w-full sm:w-72">
            <Field label="View notifications for">
              <Select
                value={selectedParentId}
                onChange={(e) => {
                  setPage(0);
                  setSelectedParentId(e.target.value);
                }}
              >
                <option value="">Select a parent…</option>
                {parentOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm font-medium text-navy-800 pb-2.5">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-navy-900/25"
              checked={unreadOnly}
              onChange={(e) => {
                setPage(0);
                setUnreadOnly(e.target.checked);
              }}
            />
            Unread only
          </label>
        </div>
        <button className="btn-primary shrink-0" onClick={() => setCreateOpen(true)}>
          + New notification
        </button>
      </div>

      <div className="card overflow-hidden">
        {!selectedParentId ? (
          <div className="p-4">
            <EmptyState title="Choose a parent" description="Select a parent above to view their notification history." />
          </div>
        ) : loading ? (
          <LoadingSpinner label="Loading notifications" />
        ) : error ? (
          <div className="p-4">
            <ErrorMessage message={error} onRetry={load} />
          </div>
        ) : data.content.length === 0 ? (
          <div className="p-4">
            <EmptyState title="No notifications" description="This parent has no notifications matching your filters." />
          </div>
        ) : (
          <>
            <ul className="divide-y divide-navy-900/5">
              {data.content.map((n) => (
                <li key={n.id} className="p-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {!n.readStatus && <span className="h-2 w-2 rounded-full bg-signal-500" aria-hidden="true" />}
                      <p className="font-semibold text-navy-900">{n.title}</p>
                      <span className="text-xs font-medium text-navy-500 bg-navy-900/5 rounded-full px-2 py-0.5">
                        {titleCase(n.type)}
                      </span>
                    </div>
                    <p className="text-sm text-navy-700">{n.message}</p>
                    <p className="text-xs text-navy-500 mt-1">
                      {formatDateTime(n.createdAt)} {n.studentName ? `· ${n.studentName}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {!n.readStatus && (
                      <button className="btn-ghost px-3 py-1.5" onClick={() => handleMarkRead(n.id)}>
                        Mark read
                      </button>
                    )}
                    <button className="btn-ghost px-3 py-1.5 text-transit-stop" onClick={() => setDeleteTarget(n)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <Pagination
              page={page}
              totalPages={data.totalPages}
              totalElements={data.totalElements}
              pageSize={10}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      <ResourceFormModal
        open={createOpen}
        title="Send a notification"
        fields={createFields}
        initialValues={{ parentId: selectedParentId, studentId: "", rideId: "", type: "GENERAL", title: "", message: "" }}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        submitting={submitting}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete this notification?"
        description="This will permanently remove it for the parent."
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  );
}
