export function formatDateTime(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return value;
  }
}

export function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString(undefined, { dateStyle: "medium" });
  } catch {
    return value;
  }
}

export function titleCase(value) {
  if (!value) return "";
  return String(value)
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
