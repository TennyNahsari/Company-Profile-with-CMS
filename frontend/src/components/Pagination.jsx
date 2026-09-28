import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function getPaginationRange(currentPage, totalPages, maxStart = 2, maxEnd = 2) {
  if (totalPages <= 1) return [];

  if (totalPages <= 6) {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  }

  const startPages = [];
  for (let i = 1; i <= Math.min(maxStart, totalPages); i++) {
    startPages.push(i);
  }

  const endPages = [];
  for (let i = Math.max(totalPages - maxEnd + 1, maxStart + 1); i <= totalPages; i++) {
    endPages.push(i);
  }

  const middlePages = [];
  const middleStart = Math.max(currentPage - 1, maxStart + 1);
  const middleEnd = Math.min(currentPage + 1, totalPages - maxEnd);

  for (let i = middleStart; i <= middleEnd; i++) {
    if (!startPages.includes(i) && !endPages.includes(i)) {
      middlePages.push(i);
    }
  }

  let result = [...startPages];

  if (middlePages.length > 0) {
    if (middlePages[0] > startPages[startPages.length - 1] + 1) {
      result.push('...');
    }
    result.push(...middlePages);
    if (endPages[0] > middlePages[middlePages.length - 1] + 1) {
      result.push('...');
    }
  } else {
    if (endPages[0] > startPages[startPages.length - 1] + 1) {
      result.push('...');
    }
  }

  result.push(...endPages);
  return result;
}

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const range = getPaginationRange(currentPage, totalPages);

  return (
    <nav className="flex items-center justify-center gap-1.5 sm:gap-2 my-6 select-none" aria-label="Pagination Navigation">
      {/* Previous Button */}
      <button
        type="button"
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
          currentPage === 1
            ? 'opacity-40 cursor-not-allowed bg-slate-900/40 border-white/5 text-slate-500'
            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white hover:border-indigo-500/50'
        }`}
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        <span>Prev</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {range.map((item, idx) => {
          if (item === '...') {
            return (
              <span key={`dots-${idx}`} className="px-2 py-1 text-xs text-slate-500 font-mono">
                ...
              </span>
            );
          }

          const isCurrent = item === currentPage;
          return (
            <button
              key={`page-${item}`}
              type="button"
              onClick={() => onPageChange(item)}
              className={`min-w-[32px] h-[32px] px-2.5 rounded-lg text-xs font-bold transition-all border flex items-center justify-center ${
                isCurrent
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white hover:border-indigo-500/40'
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        type="button"
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
          currentPage === totalPages
            ? 'opacity-40 cursor-not-allowed bg-slate-900/40 border-white/5 text-slate-500'
            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white hover:border-indigo-500/50'
        }`}
      >
        <span>Next</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </nav>
  );
}
