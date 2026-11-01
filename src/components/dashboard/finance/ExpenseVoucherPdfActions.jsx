"use client";

import React from "react";
import { Printer, Download } from "lucide-react";
import { useReactToPrint } from "react-to-print";

const EXPENSE_VOUCHER_PAGE_STYLE = `
  @media print {
    @page {
      size: A4 portrait;
      margin: 10mm;
    }
    body {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
`;

export default function ExpenseVoucherPdfActions({ tx, contentRef }) {
  const documentTitle = `Expense-Voucher-${tx?.voucherNo || tx?._id || "Voucher"}`;

  const handlePrintExpenseVoucher = useReactToPrint({
    contentRef,
    documentTitle,
    pageStyle: EXPENSE_VOUCHER_PAGE_STYLE,
  });

  const handleDownloadExpenseVoucherPdf = useReactToPrint({
    contentRef,
    documentTitle,
    pageStyle: EXPENSE_VOUCHER_PAGE_STYLE,
  });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => handlePrintExpenseVoucher()}
        className="px-4 py-2 bg-emerald-800 hover:bg-emerald-950 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
      >
        <Printer className="w-4 h-4" /> প্রিন্ট ভাউচার
      </button>
      <button
        type="button"
        onClick={() => handleDownloadExpenseVoucherPdf()}
        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
      >
        <Download className="w-4 h-4 text-emerald-700" /> ডাউনলোড PDF
      </button>
    </div>
  );
}
