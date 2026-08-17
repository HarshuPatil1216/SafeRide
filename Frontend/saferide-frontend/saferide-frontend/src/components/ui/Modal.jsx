import { useEffect } from "react";

export default function Modal({ open, onClose, title, children, width = "max-w-lg" }) {
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy-950/50 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative w-full ${width} max-h-[90vh] overflow-y-auto rounded-xl2 bg-white shadow-raised animate-[fadeIn_.15s_ease-out]`}
      >
        <div className="flex items-center justify-between border-b border-navy-900/10 px-6 py-4 sticky top-0 bg-white rounded-t-xl2">
          <h2 className="font-display text-lg font-semibold text-navy-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-navy-500 hover:text-navy-900 h-8 w-8 flex items-center justify-center rounded-full hover:bg-navy-900/5"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
