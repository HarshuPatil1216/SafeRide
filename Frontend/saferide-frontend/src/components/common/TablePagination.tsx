import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalElements?: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const startItem = totalElements ? currentPage * pageSize + 1 : 0;
  const endItem = totalElements ? Math.min((currentPage + 1) * pageSize, totalElements) : 0;

  return (
    <div className="px-6 py-3.5 border-t border-[#1e293b] bg-[#0a0a0a] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-slate-400">
      <div className="flex items-center gap-2">
        {totalElements !== undefined ? (
          <span>
            Showing <strong className="font-medium text-white">{startItem}</strong> to{' '}
            <strong className="font-medium text-white">{endItem}</strong> of{' '}
            <strong className="font-medium text-white">{totalElements}</strong> results
          </span>
        ) : (
          <span>Page {currentPage + 1} of {Math.max(1, totalPages)}</span>
        )}

        {onPageSizeChange && (
          <div className="ml-4 flex items-center gap-1.5">
            <span className="text-slate-500">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-[#050505] border border-[#1e293b] rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#38bdf8]"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="p-1.5 rounded-lg border border-[#1e293b] bg-[#0a0a0a] text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="px-2.5 py-1 text-xs font-semibold text-slate-200 bg-[#050505] border border-[#1e293b] rounded-lg">
          {currentPage + 1} / {Math.max(1, totalPages)}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1 || totalPages === 0}
          className="p-1.5 rounded-lg border border-[#1e293b] bg-[#0a0a0a] text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
