export default function EmptyState({ title = "Nothing here yet", description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl2 border border-dashed border-navy-900/15 py-14 px-6 text-center">
      <div className="h-10 w-10 rounded-full bg-navy-900/5 flex items-center justify-center text-navy-500 mb-1">◌</div>
      <p className="font-display font-semibold text-navy-900">{title}</p>
      {description && <p className="text-sm text-navy-600 max-w-sm">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
