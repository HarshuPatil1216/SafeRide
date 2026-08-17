import Modal from "./Modal";

export default function ConfirmDialog({ open, onClose, onConfirm, title = "Are you sure?", description, confirmLabel = "Confirm", danger = true, loading = false }) {
  return (
    <Modal open={open} onClose={onClose} title={title} width="max-w-sm">
      <p className="text-sm text-navy-700">{description}</p>
      <div className="mt-6 flex justify-end gap-2">
        <button className="btn-secondary" onClick={onClose} disabled={loading}>
          Cancel
        </button>
        <button className={danger ? "btn-danger" : "btn-primary"} onClick={onConfirm} disabled={loading}>
          {loading ? "Please wait…" : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
