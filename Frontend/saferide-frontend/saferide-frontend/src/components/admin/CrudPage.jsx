import { useState } from "react";
import ResourceTable from "./ResourceTable";
import ResourceFormModal from "./ResourceFormModal";
import ConfirmDialog from "../ui/ConfirmDialog";
import { useResourceList } from "../../hooks/useResourceList";
import { useToast } from "../../hooks/useToast";

/**
 * A fully wired admin CRUD page for one resource.
 *
 * props:
 *  - api: resource api (list/search/create/update/remove)
 *  - columns: table columns [{key,label,render}]
 *  - fields: form fields array, or fields(row) for edit-aware fields
 *  - emptyValues: default values for the create form
 *  - toEditValues(row): map a row to form values for editing
 *  - toPayload(values): map form values to the API payload
 *  - searchPlaceholder, resourceLabel (singular, e.g. "driver")
 *  - deleteWarning(row): custom delete confirmation text
 *  - disableCreate/disableEdit/disableDelete
 *  - extraActions(row, ctx): render extra row action buttons
 */
export default function CrudPage({
  api,
  columns,
  fields,
  emptyValues = {},
  toEditValues = (row) => row,
  toPayload = (values) => values,
  searchPlaceholder = "Search…",
  resourceLabel = "record",
  deleteWarning,
  disableCreate,
  disableEdit,
  disableDelete,
  extraActions,
}) {
  const list = useResourceList(api);
  const toast = useToast();

  const [modalState, setModalState] = useState({ open: false, mode: "create", row: null });
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  function openCreate() {
    setModalState({ open: true, mode: "create", row: null });
  }

  function openEdit(row) {
    setModalState({ open: true, mode: "edit", row });
  }

  function closeModal() {
    setModalState({ open: false, mode: "create", row: null });
  }

  async function handleSubmit(values) {
    setSubmitting(true);
    try {
      const payload = toPayload(values);
      if (modalState.mode === "create") {
        await api.create(payload);
        toast.success(`${capitalize(resourceLabel)} created.`);
      } else {
        await api.update(modalState.row.id, payload);
        toast.success(`${capitalize(resourceLabel)} updated.`);
      }
      closeModal();
      list.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.remove(deleteTarget.id);
      toast.success(`${capitalize(resourceLabel)} deleted.`);
      setDeleteTarget(null);
      list.refresh();
    } catch (err) {
      toast.error(err.message || `Couldn't delete this ${resourceLabel}.`);
    } finally {
      setDeleting(false);
    }
  }

  const resolvedFields = typeof fields === "function" ? fields(modalState.row) : fields;

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
        searchPlaceholder={searchPlaceholder}
        onCreate={disableCreate ? undefined : openCreate}
        createLabel={`Add ${resourceLabel}`}
        emptyTitle={`No ${resourceLabel}s yet`}
        emptyDescription={`${capitalize(resourceLabel)}s you add will show up here.`}
        renderActions={(row) => (
          <>
            {extraActions && extraActions(row, { refresh: list.refresh })}
            {!disableEdit && (
              <button className="btn-ghost px-3 py-1.5" onClick={() => openEdit(row)}>
                Edit
              </button>
            )}
            {!disableDelete && (
              <button className="btn-ghost px-3 py-1.5 text-transit-stop" onClick={() => setDeleteTarget(row)}>
                Delete
              </button>
            )}
          </>
        )}
      />

      <ResourceFormModal
        open={modalState.open}
        title={modalState.mode === "create" ? `Add ${resourceLabel}` : `Edit ${resourceLabel}`}
        fields={resolvedFields}
        initialValues={modalState.mode === "create" ? emptyValues : toEditValues(modalState.row)}
        onClose={closeModal}
        onSubmit={handleSubmit}
        submitting={submitting}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`Delete this ${resourceLabel}?`}
        description={
          deleteTarget
            ? deleteWarning
              ? deleteWarning(deleteTarget)
              : `This will permanently remove this ${resourceLabel}. This can't be undone.`
            : ""
        }
        confirmLabel="Delete"
        loading={deleting}
      />
    </>
  );
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
