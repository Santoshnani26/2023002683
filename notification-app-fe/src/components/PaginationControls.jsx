import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function PaginationControls({ pagination, onPageChange, onLimitChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { currentPage, totalPages, itemsPerPage } = pagination;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-border">
      {/* Limit Selector */}
      <div className="flex items-center space-x-2 text-sm text-secondary">
        <span>Show</span>
        <select
          value={itemsPerPage || 10}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="bg-surface border border-border text-primary rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-primary/50 text-sm cursor-pointer hover:bg-surfaceHover transition-colors"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <span>per page</span>
      </div>

      {/* Page Selector */}
      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 border border-border rounded-lg bg-surface text-secondary hover:text-primary hover:bg-surfaceHover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              page === currentPage
                ? 'bg-primary text-background font-semibold'
                : 'bg-surface border border-border text-secondary hover:text-primary hover:bg-surfaceHover'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 border border-border rounded-lg bg-surface text-secondary hover:text-primary hover:bg-surfaceHover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
