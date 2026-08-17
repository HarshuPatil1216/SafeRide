import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorMessage from "../ui/ErrorMessage";
import EmptyState from "../ui/EmptyState";
import Pagination from "../ui/Pagination";
import { Input } from "../ui/FormControls";

export default function ResourceTable({
  columns,
  rows,
  loading,
  error,
  onRetry,
  page,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search…",
  onCreate,
  createLabel = "Add new",
  renderActions,
  emptyTitle = "No records yet",
  emptyDescription,
}) {
  return (
    <div className="card overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-navy-900/10">
        <div className="w-full sm:w-72">
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
          />
        </div>
        {onCreate && (
          <button className="btn-primary shrink-0" onClick={onCreate}>
            + {createLabel}
          </button>
        )}
      </div>

      {loading ? (
        <LoadingSpinner label="Loading records" />
      ) : error ? (
        <div className="p-4">
          <ErrorMessage message={error} onRetry={onRetry} />
        </div>
      ) : rows.length === 0 ? (
        <div className="p-4">
          <EmptyState title={emptyTitle} description={emptyDescription} />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy-900/[0.03] text-left text-xs font-semibold uppercase tracking-wide text-navy-600">
                  {columns.map((col) => (
                    <th key={col.key} className="px-4 py-3 whitespace-nowrap">
                      {col.label}
                    </th>
                  ))}
                  {renderActions && <th className="px-4 py-3 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-900/5">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-navy-900/[0.02]">
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3 align-middle whitespace-nowrap">
                        {col.render ? col.render(row) : row[col.key] ?? "—"}
                      </td>
                    ))}
                    {renderActions && (
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">{renderActions(row)}</div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            totalElements={totalElements}
            pageSize={pageSize}
            onPageChange={onPageChange}
          />
        </>
      )}
    </div>
  );
}
