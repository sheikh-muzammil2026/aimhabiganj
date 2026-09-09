"use client";

import React from "react";

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  limit = 20,
  limitOptions = [10, 20, 50, 100],
  onPageChange,
  onLimitChange,
  itemName = "items",
  className = "",
}) {
  const start = totalItems === 0 ? 0 : (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalItems);

  const canGoPrev = currentPage > 1 && totalItems > 0;
  const canGoNext = currentPage < totalPages && totalItems > 0;

  return (
    <div className={`flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 border-t border-slate-100 mt-4 rounded-b-2xl ${className}`}>
      {/* ১. টোটাল কাউন্ট স্ট্যাটাস টেক্সট */}
      <div className="text-xs sm:text-sm font-semibold text-slate-600">
        Showing {start}–{end} of {totalItems} {itemName}
      </div>

      {/* ২. ড্রপডাউন এবং নেভিগেশন কন্ট্রোলস */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        {/* পার পেজ ড্রপডাউন */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="pagination-limit-select"
            className="text-xs text-slate-500 font-medium whitespace-nowrap"
          >
            প্রতি পেজে:
          </label>
          <select
            id="pagination-limit-select"
            value={limit}
            onChange={(e) => onLimitChange?.(Number(e.target.value))}
            className="px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 cursor-pointer"
          >
            {limitOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* নেভিগেশন বাটনসমূহ: << < Page X of Y > >> */}
        <div className="flex items-center gap-1.5">
          {/* ফার্স্ট পেজ বাটন (<<) */}
          <button
            type="button"
            disabled={!canGoPrev}
            onClick={() => onPageChange?.(1)}
            aria-label="First Page"
            title="First Page"
            className="px-2.5 py-1.5 text-xs font-extrabold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            &lt;&lt;
          </button>

          {/* পূর্ববর্তী বাটন (<) */}
          <button
            type="button"
            disabled={!canGoPrev}
            onClick={() => onPageChange?.(currentPage - 1)}
            aria-label="Previous Page"
            title="Previous Page"
            className="px-3 py-1.5 text-xs font-extrabold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            &lt;
          </button>

          {/* বর্তমান পেজ ইন্ডিকেটর */}
          <span className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg whitespace-nowrap">
            Page {currentPage} of {totalPages || 1}
          </span>

          {/* পরবর্তী বাটন (>) */}
          <button
            type="button"
            disabled={!canGoNext}
            onClick={() => onPageChange?.(currentPage + 1)}
            aria-label="Next Page"
            title="Next Page"
            className="px-3 py-1.5 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 border border-emerald-600 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
          >
            &gt;
          </button>

          {/* লাস্ট পেজ বাটন (>>) */}
          <button
            type="button"
            disabled={!canGoNext}
            onClick={() => onPageChange?.(totalPages)}
            aria-label="Last Page"
            title="Last Page"
            className="px-2.5 py-1.5 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 border border-emerald-600 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
          >
            &gt;&gt;
          </button>
        </div>
      </div>
    </div>
  );
}
