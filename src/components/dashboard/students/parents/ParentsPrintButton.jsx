"use client";

import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Printer, Loader2 } from "lucide-react";
import ParentsPrintView from "./ParentsPrintView";

const PARENTS_PAGE_STYLE = `
  @media print {
    @page {
      size: A4 portrait;
      margin: 8mm 6mm 10mm 6mm;
    }
    html, body {
      background: #ffffff !important;
      margin: 0 !important;
      padding: 0 !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .parents-directory-print-root {
      position: static !important;
      width: 100% !important;
      max-width: 100% !important;
      padding: 0 !important;
      margin: 0 !important;
    }
  }
`;

export default function ParentsPrintButton({
  classGroups = [],
  sessionYear = "সকল শিক্ষাবর্ষ",
  disabled = false,
}) {
  const printRef = useRef(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const getPrintDate = () => {
    try {
      return new Intl.DateTimeFormat("bn-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date());
    } catch {
      return new Date().toLocaleDateString();
    }
  };

  const reactToPrintFn = useReactToPrint({
    contentRef: printRef,
    documentTitle: `AIM-Parents-Directory-${sessionYear}`,
    pageStyle: PARENTS_PAGE_STYLE,
    onBeforePrint: () => {
      setIsPrinting(true);
      return Promise.resolve();
    },
    onAfterPrint: () => {
      setIsPrinting(false);
    },
    onPrintError: () => {
      setIsPrinting(false);
    },
  });

  const handlePrint = () => {
    if (disabled || classGroups.length === 0 || !printRef.current) return;
    reactToPrintFn();
  };

  return (
    <div className="flex items-center gap-2">
      {/* 1. react-to-print Trigger Button */}
      <button
        type="button"
        onClick={handlePrint}
        disabled={disabled || isPrinting || classGroups.length === 0}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
        title="A4 সাইজ ডিরেক্টরি প্রিন্ট বা PDF সংরক্ষণ করুন"
      >
        {isPrinting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-emerald-200" />
            <span>প্রিন্ট প্রস্তুত হচ্ছে...</span>
          </>
        ) : (
          <>
            <Printer className="w-4 h-4" />
            <span>A4 প্রিন্ট / PDF</span>
          </>
        )}
      </button>

      {/* 2. Hidden Offscreen Printable Component */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
          width: "210mm",
          overflow: "hidden",
        }}
      >
        <ParentsPrintView
          ref={printRef}
          classGroups={classGroups}
          sessionYear={sessionYear}
          printDate={getPrintDate()}
        />
      </div>
    </div>
  );
}
