import React, { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  delay?: number;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value: initialValue = '',
  placeholder = 'Search...',
  onChange,
  className = '',
  delay = 300,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(searchTerm);
    }, delay);

    return () => clearTimeout(handler);
  }, [searchTerm, delay, onChange]);

  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-9 py-2 text-sm bg-[#0a0a0a] border border-[#1e293b] rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#38bdf8] focus:border-[#38bdf8] transition-all"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={() => setSearchTerm('')}
          className="absolute right-3 p-0.5 text-slate-500 hover:text-white rounded-full hover:bg-slate-800"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
