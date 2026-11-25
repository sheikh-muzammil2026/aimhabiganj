"use client";

import ResultSheetGenerator from "@/components/public/academics/IndividualResult";

export default function ResultsPage() {
  return (
    <div className="min-h-screen dark:bg-slate-900 py-3 sm:py-6 flex items-start sm:items-center justify-center overflow-x-hidden">
      <div className="w-full">
        <ResultSheetGenerator />
      </div>
    </div>
  );
}
