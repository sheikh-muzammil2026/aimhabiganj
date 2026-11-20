// app/results/page.js
"use client";
import ResultSheetGenerator from "@/components/public/academics/IndividualResult";

export default function ResultsPage() {
  return (
    <div className="page-wrapper flex items-center justify-center">
      <div className="w-full">
        <ResultSheetGenerator />
      </div>
    </div>
  );
}
