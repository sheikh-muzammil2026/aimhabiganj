// app/results/page.js
"use client";
import ResultSearch from "@/components/public/results/ResultSearch";

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-16 flex items-center justify-center">
      <div className="w-full">
        <ResultSearch />
      </div>
    </div>
  );
}
