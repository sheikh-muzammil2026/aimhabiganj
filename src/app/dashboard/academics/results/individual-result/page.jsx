"use client";

import ResultSheetGenerator from "@/components/academics/IndividualResult";

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-16 flex items-center justify-center">
      <div className="w-full">
        <ResultSheetGenerator />
      </div>
    </div>
  );
}
