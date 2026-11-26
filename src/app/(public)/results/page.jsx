// app/results/page.js
"use client";
import ResultSheetGenerator from "@/components/public/academics/IndividualResult";

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-[#E3F2FD] pt-3 sm:pt-4 pb-6 sm:pb-8 flex items-start justify-center">
      <div className="w-full">
        <ResultSheetGenerator />
      </div>
    </div>
  );
}
