import React from 'react';

export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 5,
}) => {
  return (
    <div className="w-full animate-pulse divide-y divide-[#1e293b]">
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-[#0d0d0d]">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-4 bg-slate-800 rounded col-span-2" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="grid grid-cols-12 gap-4 px-6 py-4 items-center bg-[#0a0a0a]">
          {Array.from({ length: columns }).map((_, c) => (
            <div
              key={c}
              className={`h-4 bg-slate-800/60 rounded ${
                c === 0 ? 'col-span-3' : c === columns - 1 ? 'col-span-1' : 'col-span-2'
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-[#0a0a0a] rounded-xl p-5 border border-[#1e293b] shadow-xs animate-pulse">
          <div className="flex justify-between items-center">
            <div className="h-3 w-20 bg-slate-800 rounded" />
            <div className="w-9 h-9 bg-slate-800/80 rounded-lg" />
          </div>
          <div className="mt-4 h-7 w-24 bg-slate-700 rounded" />
          <div className="mt-2 h-3 w-32 bg-slate-800/60 rounded" />
        </div>
      ))}
    </div>
  );
};
