"use client";

import React, { useState } from "react";
import { pdf, PDFDownloadLink } from "@react-pdf/renderer";
import { Printer, Download, RefreshCw, FileText } from "lucide-react";
import ParentsPdfDocument from "./ParentsPdfDocument";

export default function ParentsPrintButton({
  classGroups = [],
  sessionYear = "সকল শিক্ষাবর্ষ",
  disabled = false,
}) {
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handlePrintView = async () => {
    if (disabled || classGroups.length === 0) return;
    setIsGenerating(true);

    try {
      const doc = (
        <ParentsPdfDocument
          classGroups={classGroups}
          sessionYear={sessionYear}
          printDate={getPrintDate()}
        />
      );

      const blob = await pdf(doc).toBlob();
      const blobUrl = URL.createObjectURL(blob);
      const printWindow = window.open(blobUrl, "_blank");
      if (printWindow) {
        printWindow.focus();
      }
    } catch (error) {
      console.error("PDF Print View generation error:", error);
      // Fallback to standard browser print if popup or blob fails
      window.print();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* 1. Direct A4 PDF Print Viewer Button */}
      <button
        onClick={handlePrintView}
        disabled={disabled || isGenerating || classGroups.length === 0}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50"
        title="A4 সাইজ PDF প্রিন্ট ভিউ খুলুন"
      >
        {isGenerating ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>PDF তৈরি হচ্ছে...</span>
          </>
        ) : (
          <>
            <Printer className="w-4 h-4" />
            <span>A4 প্রিন্ট ভিউ</span>
          </>
        )}
      </button>

      {/* 2. Direct A4 PDF File Download Link */}
      {classGroups.length > 0 && !disabled && (
        <PDFDownloadLink
          document={
            <ParentsPdfDocument
              classGroups={classGroups}
              sessionYear={sessionYear}
              printDate={getPrintDate()}
            />
          }
          fileName={`AIM-Parents-Directory-${sessionYear}.pdf`}
          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all"
          title="A4 PDF ফাইল সরাসরি ডাউনলোড করুন"
        >
          {({ loading }) =>
            loading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">PDF ডাউনলোড</span>
              </>
            )
          }
        </PDFDownloadLink>
      )}
    </div>
  );
}
