"use client";

import ResultSheetGenerator from "@/components/public/academics/IndividualResult";

export default function ResultsPage() {
  return (
    <div className="w-full dark:bg-slate-900 -mt-2 sm:-mt-3 pt-0 pb-2 flex items-start justify-center overflow-x-hidden">
      <div className="w-full">
        <ResultSheetGenerator />
      </div>
    </div>
  );
}
