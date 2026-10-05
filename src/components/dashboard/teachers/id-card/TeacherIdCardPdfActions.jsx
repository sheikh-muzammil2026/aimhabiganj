"use client";

import React, { useState } from "react";
import { Download, Eye, FileText, X } from "lucide-react";
import { toast } from "react-toastify";
import { pdf, PDFViewer } from "@react-pdf/renderer";
import TeacherIdPdfDocument from "./TeacherIdPdfDocument";

export default function TeacherIdCardPdfActions({
  selectedTeachers = [],
  printSide = "both",
}) {
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  // Download Vector PDF with @react-pdf/renderer
  const handleDownloadPdf = async (mode = "a4") => {
    if (selectedTeachers.length === 0) {
      toast.warn("অনুগ্রহ করে অন্তত একজন শিক্ষক নির্বাচন করুন!");
      return;
    }

    try {
      setGeneratingPdf(true);
      toast.info("পিডিএফ তৈরি হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...");

      const origin =
        typeof window !== "undefined" ? window.location.origin : "";

      const blob = await pdf(
        <TeacherIdPdfDocument
          teachers={selectedTeachers}
          mode={mode}
          printSide={printSide}
          origin={origin}
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `teachers-id-cards-${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("পিডিএফ সফলভাবে ডাউনলোড হয়েছে!");
    } catch (err) {
      console.error("Download PDF Error:", err);
      toast.error("পিডিএফ জেনারেট করতে সমস্যা হয়েছে!");
    } finally {
      setGeneratingPdf(false);
    }
  };

  return (
    <>
      {/* Download PDF Button */}
      <button
        onClick={() => handleDownloadPdf("a4")}
        disabled={generatingPdf || selectedTeachers.length === 0}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
        title="A4 শিট ফরম্যাটে PDF ডাউনলোড করুন"
      >
        <Download
          className={`w-4 h-4 ${generatingPdf ? "animate-bounce" : ""}`}
        />
        <span>PDF ডাউনলোড</span>
      </button>

      {/* PDF Live Preview Modal Button */}
      <button
        onClick={() => setShowPdfModal(true)}
        disabled={selectedTeachers.length === 0}
        className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 text-xs sm:text-sm font-bold transition-all disabled:opacity-50"
        title="পিডিএফ ভিউয়ারে প্রিভিউ দেখুন"
      >
        <Eye className="w-4 h-4" />
        <span>পিডিএফ প্রিভিউ</span>
      </button>

      {/* PDF VIEWER MODAL */}
      {showPdfModal && (
        <div className="print:hidden fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  পিডিএফ লাইভ প্রিভিউ ({selectedTeachers.length} জন শিক্ষক)
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadPdf("a4")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ডাউনলোড PDF</span>
                </button>

                <button
                  onClick={() => setShowPdfModal(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Viewer Body */}
            <div className="flex-1 w-full h-full bg-slate-100 dark:bg-slate-950">
              <PDFViewer width="100%" height="100%" showToolbar={true}>
                <TeacherIdPdfDocument
                  teachers={selectedTeachers}
                  mode="a4"
                  printSide={printSide}
                  origin={
                    typeof window !== "undefined" ? window.location.origin : ""
                  }
                />
              </PDFViewer>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
