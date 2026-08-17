export default function Pagination({ page, totalPages, onPageChange, totalElements, pageSize }) {
  if (totalPages <= 1) return null;

  const start = page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, totalElements);

  return (
    <div className="flex items-center justify-between border-t border-navy-900/10 px-4 py-3 text-sm text-navy-700">
      <span>
        Showing <strong>{start}</strong>–<strong>{end}</strong> of <strong>{totalElements}</strong>
      </span>
      <div className="flex items-center gap-1">
        <button
          className="btn-ghost px-3 py-1.5"
          disabled={page === 0}
          onClick={() => onPageChange(page - 1)}
        >
          ← Prev
        </button>
        <span className="px-2 font-medium">
          Page {page + 1} of {totalPages}
        </span>
        <button
          className="btn-ghost px-3 py-1.5"
          disabled={page + 1 >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
