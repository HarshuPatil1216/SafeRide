export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null;
  return (
    <div className="rounded-lg border border-transit-stop/25 bg-transit-stop/5 px-4 py-3 text-sm text-transit-stop flex items-center justify-between gap-4">
      <span>{message}</span>
      {onRetry && (
        <button onClick={onRetry} className="font-semibold underline underline-offset-2 shrink-0">
          Try again
        </button>
      )}
    </div>
  );
}
