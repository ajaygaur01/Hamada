"use client";

import { ReactNode } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { SkeletonRow } from "./Skeleton";

interface Column<T> {
  key: string;
  label: string;
  render: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  search?: string;
  onSearchChange?: (val: string) => void;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  extraFilters?: ReactNode;
  actions?: ReactNode;
  selectable?: boolean;
  selectedIds?: (string | number)[];
  onSelectionChange?: (ids: (string | number)[]) => void;
}

export function DataTable<T extends { id: string | number }>({
  columns, data, loading, emptyMessage = "No results found.",
  search, onSearchChange, page, totalPages, onPageChange,
  extraFilters, actions, selectable, selectedIds = [], onSelectionChange
}: DataTableProps<T>) {
  const isAllSelected = data.length > 0 && selectedIds.length === data.length;

  const toggleAll = () => {
    if (isAllSelected) onSelectionChange?.([]);
    else onSelectionChange?.(data.map(i => i.id));
  };

  const toggleOne = (id: string | number) => {
    if (selectedIds.includes(id)) onSelectionChange?.(selectedIds.filter(x => x !== id));
    else onSelectionChange?.([...selectedIds, id]);
  };

  return (
    <div className="space-y-4">
      {/* Selection Toolbar */}
      {selectable && selectedIds.length > 0 && (
        <div className="bg-[#D04636] text-white px-4 py-2 rounded-xl flex items-center justify-between animate-in slide-in-from-top-2">
          <p className="text-sm font-semibold">{selectedIds.length} items selected</p>
          <div className="flex items-center gap-2">
            {actions}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {onSearchChange !== undefined && (
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input 
                type="text" 
                placeholder="Search..."
                value={search} 
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:border-[#D04636] focus:ring-1 focus:ring-[#D04636] transition-all" 
              />
            </div>
          )}
          {extraFilters}
        </div>
        <div className="flex items-center gap-3">
          {!selectable || selectedIds.length === 0 ? actions : null}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/80">
                {selectable && (
                  <th className="px-5 py-3 w-10">
                    <input type="checkbox" checked={isAllSelected} onChange={toggleAll} className="w-4 h-4 rounded accent-[#D04636]" />
                  </th>
                )}
                {columns.map(col => (
                  <th key={col.key} className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-5 py-10 text-center text-zinc-500">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className={`hover:bg-zinc-50 transition-colors ${selectedIds.includes(item.id) ? "bg-zinc-50" : ""}`}>
                    {selectable && (
                      <td className="px-5 py-3">
                        <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleOne(item.id)} className="w-4 h-4 rounded accent-[#D04636]" />
                      </td>
                    )}
                    {columns.map(col => (
                      <td key={col.key} className="px-5 py-3">
                        {col.render(item)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {page !== undefined && totalPages !== undefined && totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-zinc-500">Page {page} of {totalPages}</p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onPageChange?.(page - 1)} 
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-zinc-200 text-zinc-500 hover:bg-zinc-50 disabled:opacity-50 disabled:pointer-events-none"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={() => onPageChange?.(page + 1)} 
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-zinc-200 text-zinc-500 hover:bg-zinc-50 disabled:opacity-50 disabled:pointer-events-none"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
