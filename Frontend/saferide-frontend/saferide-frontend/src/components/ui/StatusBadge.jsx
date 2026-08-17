const TONE_MAP = {
  // ride statuses
  SCHEDULED: "wait",
  IN_PROGRESS: "go",
  COMPLETED: "idle",
  CANCELLED: "stop",
  // driver / vehicle statuses
  ACTIVE: "go",
  INACTIVE: "idle",
  ON_LEAVE: "wait",
  UNDER_MAINTENANCE: "wait",
  // generic booleans as text
  true: "go",
  false: "idle",
};

const TONE_CLASSES = {
  go: "bg-transit-go/10 text-transit-go border-transit-go/20",
  wait: "bg-transit-wait/10 text-transit-wait border-transit-wait/25",
  stop: "bg-transit-stop/10 text-transit-stop border-transit-stop/20",
  idle: "bg-transit-idle/10 text-transit-idle border-transit-idle/20",
};

export default function StatusBadge({ value }) {
  const key = typeof value === "boolean" ? String(value) : value;
  const tone = TONE_MAP[key] || "idle";
  const label = typeof value === "boolean" ? (value ? "Active" : "Inactive") : String(value || "—").replace(/_/g, " ");

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${TONE_CLASSES[tone]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label.toLowerCase()}
    </span>
  );
}
