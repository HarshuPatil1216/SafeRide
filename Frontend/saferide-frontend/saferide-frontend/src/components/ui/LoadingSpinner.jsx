export default function LoadingSpinner({ label = "Loading", size = "md" }) {
  const dim = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-10 w-10" : "h-6 w-6";
  return (
    <div className="flex items-center justify-center gap-3 py-10 text-navy-600" role="status" aria-live="polite">
      <span
        className={`${dim} rounded-full border-2 border-navy-900/15 border-t-signal-500 animate-spin`}
        aria-hidden="true"
      />
      <span className="text-sm font-medium">{label}…</span>
    </div>
  );
}
