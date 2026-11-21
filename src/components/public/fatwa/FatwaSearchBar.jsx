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
        <div className="relative flex items-center rounded-2xl bg-white border-2 border-[#90CAF9] hover:border-[#2196F3] focus-within:border-[#2196F3] shadow-md transition-all duration-300">
          <div className="pl-4 sm:pl-5 text-[#2196F3] shrink-0">
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
            className="w-full py-4 sm:py-5 px-3 sm:px-4 text-sm sm:text-base text-[#1E293B] bg-transparent focus:outline-hidden placeholder:text-slate-400"
          />

          {query && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 mr-2 rounded-full text-slate-400 hover:text-[#0D47A1] hover:bg-[#E3F2FD] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="pr-2 sm:pr-3">
            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="btn-primary inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>অনুসন্ধান</span>
            </button>
          </div>
        </div>
      </form>

      {/* Suggested Topic Chips */}
      <div className="mt-4">
        <div className="flex items-center gap-1.5 mb-2 text-xs font-bold text-[#0D47A1]">
          <span>সাধারণ জিজ্ঞাসা ও বিষয়সমূহ:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((suggestion, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleChipClick(suggestion)}
              disabled={isLoading}
              className="text-xs px-3 py-1.5 rounded-lg bg-[#E3F2FD] hover:bg-[#90CAF9]/40 text-[#0D47A1] border border-[#90CAF9] transition-all duration-200 hover:scale-[1.02] active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
