"use client";

import React, { useState, useEffect } from "react";
import { Printer, Download, RefreshCw, ExternalLink } from "lucide-react";
import dynamic from "next/dynamic";
import IncomeVoucherPdfDocument from "./IncomeVoucherPdfDocument";

// Dynamically import PDFDownloadLink to prevent SSR hydration issues
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

export default function IncomeVoucherPdfActions({ tx }) {
  const isClient = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleOpenPdfPrint = async () => {
    if (!tx) return;
    setIsGeneratingPdf(true);
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
      const doc = <IncomeVoucherPdfDocument tx={tx} baseUrl={baseUrl} />;
      const blob = await pdf(doc).toBlob();
      const blobUrl = URL.createObjectURL(blob);
      const printWin = window.open(blobUrl, "_blank");
      if (printWin) {
        printWin.focus();
      }
    } catch (err) {
      console.error("Error generating PDF view:", err);
      // Fallback to standard window print
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (!isClient || !tx) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-emerald-800 hover:bg-emerald-950 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Printer className="w-4 h-4" /> প্রিন্ট করুন
        </button>
      </div>
    );
  }

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* 1. Direct PDF Download using @react-pdf/renderer */}
      <PDFDownloadLink
        document={<IncomeVoucherPdfDocument tx={tx} baseUrl={baseUrl} />}
        fileName={`Income-Voucher-${tx.receiptNo || "Receipt"}.pdf`}
        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
        title="A4 Landscape PDF ডাউনলোড করুন"
      >
        {({ loading }) =>
          loading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-700" />
              <span>PDF তৈরি হচ্ছে...</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5 text-emerald-700" />
              <span>A4 PDF ডাউনলোড</span>
            </>
          )
        }
      </PDFDownloadLink>

      {/* 2. Direct A4 Landscape PDF Viewer / Print tab */}
      <button
        onClick={handleOpenPdfPrint}
        disabled={isGeneratingPdf}
        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-50"
        title="A4 সাইজ ল্যান্ডস্কেপ PDF প্রিন্ট ভিউ খুলুন"
      >
        {isGeneratingPdf ? (
          <>
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>প্রিন্ট ভিউ তৈরি হচ্ছে...</span>
          </>
        ) : (
          <>
            <ExternalLink className="w-3.5 h-3.5" />
            <span>A4 ল্যান্ডস্কেপ PDF প্রিন্ট ভিউ</span>
          </>
        )}
      </button>

      {/* 3. Browser Print */}
      <button
        onClick={() => window.print()}
        className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
        title="ব্রাউজার প্রিন্ট উইন্ডো খুলুন"
      >
        <Printer className="w-3.5 h-3.5" />
        <span>ব্রাউজার প্রিন্ট</span>
      </button>
    </div>
  );
}
