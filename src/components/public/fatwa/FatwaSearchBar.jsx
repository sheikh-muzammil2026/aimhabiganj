// src/components/fatwa/FatwaSearchBar.jsx
"use client";

import React, { useState } from "react";
import { Search, Sparkles, X, Loader2 } from "lucide-react";

const SUGGESTIONS = [
  "নামাজের পর সম্মিলিত মোনাজাতের বিধান",
  "রোজা অবস্থায় ইনজেকশন বা স্যালাইন নেয়া",
  "স্বর্ণ ও জমানো টাকার যাকাত আদায়ের নিয়ম",
  "শেয়ার বাজারের ব্যবসা ও হালাল বিনিয়োগ",
  "কাযা নামাজের সঠিক হিসাব ও আদায়ের নিয়ম",
  "ব্যাংকের সুদ ও সমসাময়িক ফতোয়া"
];

export default function FatwaSearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    onSearch(query.trim());
  };

  const handleChipClick = suggestion => {
    setQuery(suggestion);
    onSearch(suggestion);
  };

  const handleClear = () => {
    setQuery("");
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Search Input Box */}
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex items-center rounded-2xl bg-white dark:bg-zinc-900 border-2 border-emerald-600/30 hover:border-emerald-600/60 focus-within:border-emerald-600 dark:focus-within:border-emerald-500 shadow-[0_8px_30px_rgb(4,120,87,0.12)] transition-all duration-300">
          <div className="pl-4 sm:pl-5 text-emerald-700 dark:text-emerald-400 shrink-0">
            {isLoading ? (
              <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
            ) : (
              <Search className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </div>

          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            maxLength={300}
            disabled={isLoading}
            placeholder="আপনার মাসআলা বা ফতোয়ার প্রশ্নটি এখানে লিখুন..."
            className="w-full py-4 sm:py-5 px-3 sm:px-4 text-sm sm:text-base text-gray-900 dark:text-gray-100 bg-transparent focus:outline-hidden placeholder:text-gray-400 dark:placeholder:text-zinc-500"
          />

          {query && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 mr-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="pr-2 sm:pr-3">
            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white font-medium text-xs sm:text-sm shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all duration-200"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>অনুসন্ধান</span>
            </button>
          </div>
        </div>
      </form>

      {/* Suggested Topic Chips */}
      <div className="mt-4">
        <div className="flex items-center gap-1.5 mb-2 text-xs font-medium text-gray-500 dark:text-zinc-400">
          <span>সাধারণ জিজ্ঞাসা ও বিষয়সমূহ:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((suggestion, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleChipClick(suggestion)}
              disabled={isLoading}
              className="text-xs px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-zinc-700/60 transition-all duration-200 hover:scale-[1.02] active:scale-98 disabled:opacity-50"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
