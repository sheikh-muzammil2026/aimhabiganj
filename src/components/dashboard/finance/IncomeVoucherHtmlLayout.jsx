"use client";

import React from "react";
import Image from "next/image";
import { MdEmail, MdInstallMobile } from "react-icons/md";

// Single Half for Income Voucher (Office Copy or Donor/Student Copy)
function VoucherSingleHalf({
  tx,
  copyType, // "office" | "client"
  formatBanglaNumber,
  parsePayerName,
}) {
  const isStudent =
    tx.payerType === "student" ||
    Boolean(tx.studentId) ||
    Boolean(tx.studentName) ||
    (tx.payerName && tx.payerName.includes(" / "));

  const parsed = parsePayerName ? parsePayerName(tx.payerName) : { donorName: tx.donorName || tx.payerName || "N/A", studentId: tx.studentId || "" };

  const displayName = isStudent
    ? tx.studentName || parsed.donorName || "N/A"
    : tx.donorName || parsed.donorName || "N/A";

  const subInfo = isStudent
    ? `${tx.studentId || parsed.studentId || "N/A"} (${tx.className || "N/A"})`
    : "দাতা / অনুদানকারী";

  const copyBadgeText =
    copyType === "office"
      ? "অফিস কপি (Office Copy)"
      : isStudent
        ? "শিক্ষার্থী কপি (Student Copy)"
        : "দাতা কপি (Donor Copy)";

  const items = Array.isArray(tx.items) && tx.items.length > 0 ? tx.items : [];
  const discount = Number(tx.discount) || 0;
  const grandTotal = Number(tx.totalIncome) || 0;
  const originalTotal = grandTotal + discount;

  return (
    <div className="relative w-full h-full bg-white rounded-lg border-2 border-double border-[#C5A059] p-3 flex flex-col justify-between overflow-hidden shadow-xs text-slate-800 font-sans">
      {/* Background Watermark Logo matching Admit Card */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.06]">
        <Image
          src="/aimlogo1.png"
          alt="Watermark Logo"
          width={180}
          height={180}
          className="object-contain"
        />
      </div>

      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Header Section matching Admit Card Branding */}
        <div className="flex items-center justify-between gap-2 border-b-2 border-[#C5A059] pb-2">
          {/* Logo on the left */}
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center bg-slate-50 border border-[#C5A059]">
            <Image
              src="/aimlogo1.png"
              alt="Institution Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>

          {/* Banner in the center */}
          <div className="flex-1 text-center min-w-0 px-1">
            <div className="w-full flex justify-center">
              <Image
                src="/banner.png"
                alt="Institution Banner"
                width={280}
                height={40}
                className="max-h-8 w-auto object-contain mx-auto"
                priority
              />
            </div>
            <p className="text-[9px] text-slate-600 font-semibold mt-0.5">
              হবিগঞ্জ সদর, হবিগঞ্জ
            </p>
            <div className="flex items-center justify-center gap-2 text-[8.5px] text-emerald-800 font-medium">
              <span className="flex items-center gap-0.5">
                <MdInstallMobile className="text-[10px] shrink-0" /> ০১৭১২-৩৪৫৬৭৮
              </span>
              <span className="text-slate-300">|</span>
              <span className="flex items-center gap-0.5">
                <MdEmail className="text-[10px] shrink-0" /> aimhabiganj@gmail.com
              </span>
            </div>
          </div>

          {/* Right Logo placeholder for balanced symmetry */}
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center bg-slate-50 border border-[#C5A059]">
            <Image
              src="/aimlogo1.png"
              alt="Institution Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
        </div>

        {/* Voucher Title and Copy Type Badges */}
        <div className="flex items-center justify-between my-1.5 px-0.5">
          <div className="inline-block bg-emerald-800 text-white px-3 py-0.5 rounded-full border border-emerald-600 shadow-xs">
            <span className="text-[10px] font-bold tracking-wider uppercase">
              আদায় রসিদ (INCOME VOUCHER)
            </span>
          </div>
          <span className="text-[9px] font-bold bg-amber-50 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-md">
            {copyBadgeText}
          </span>
        </div>

        {/* Metadata Section */}
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] bg-slate-50/70 p-2 rounded-lg border border-slate-200 mb-2">
          <div className="flex items-center gap-1">
            <span className="font-bold text-slate-500">রসিদ নম্বর:</span>
            <span className="font-mono font-black text-emerald-950">
              {tx.receiptNo || "N/A"}
            </span>
          </div>
          <div className="flex items-center justify-end gap-1 text-right">
            <span className="font-bold text-slate-500">তারিখ:</span>
            <span className="font-bold">{formatBanglaNumber(tx.date || "")}</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="font-bold text-slate-500">
              {isStudent ? "শিক্ষার্থীর নাম:" : "দাতার নাম:"}
            </span>
            <span className="font-bold text-slate-800 truncate">
              {displayName}
            </span>
          </div>
          <div className="flex items-center justify-end gap-1 text-right">
            <span className="font-bold text-slate-500">
              {isStudent ? "আইডি/শ্রেণি:" : "ধরণ:"}
            </span>
            <span className="font-bold text-slate-800 truncate">
              {subInfo}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="font-bold text-slate-500">পেমেন্ট পদ্ধতি:</span>
            <span className="font-semibold text-slate-700">
              {tx.paymentMethod || "নগদ (Cash)"}
            </span>
          </div>
          <div className="flex items-center justify-end gap-1 text-right">
            <span className="font-bold text-slate-500">হিসাব মাস:</span>
            <span className="font-semibold text-slate-700">
              {formatBanglaNumber(tx.month || "")}
            </span>
          </div>
        </div>

        {/* Particulars Table */}
        <div className="flex-1 overflow-hidden">
          <table className="w-full text-[9.5px] text-left border border-collapse border-slate-300">
            <thead>
              <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-300">
                <th className="p-1 border border-slate-300 text-center w-8">ক্র.</th>
                <th className="p-1 border border-slate-300">আয়ের খাত ও বিবরণ</th>
                <th className="p-1 border border-slate-300 text-right w-24">পরিমাণ (টাকা)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-b border-slate-200">
                  <td className="p-1 border border-slate-300 text-center">
                    {formatBanglaNumber(index + 1)}
                  </td>
                  <td className="p-1 border border-slate-300 font-semibold text-slate-800">
                    {item.head || "সাধারণ আয়"}
                  </td>
                  <td className="p-1 border border-slate-300 text-right font-bold">
                    ৳ {formatBanglaNumber(Number(item.amount || 0).toLocaleString("bn-BD"))}
                  </td>
                </tr>
              ))}

              {discount > 0 && (
                <>
                  <tr className="bg-slate-50/70 font-semibold text-slate-600">
                    <td colSpan="2" className="p-1 border border-slate-300 text-right">
                      মোট আসল টাকা:
                    </td>
                    <td className="p-1 border border-slate-300 text-right">
                      ৳ {formatBanglaNumber(originalTotal.toLocaleString("bn-BD"))}
                    </td>
                  </tr>
                  <tr className="bg-rose-50/60 text-rose-800 font-bold">
                    <td colSpan="2" className="p-1 border border-slate-300 text-right">
                      বিশেষ ছাড় / ডিসকাউন্ট:
                    </td>
                    <td className="p-1 border border-slate-300 text-right">
                      - ৳ {formatBanglaNumber(discount.toLocaleString("bn-BD"))}
                    </td>
                  </tr>
                </>
              )}

              <tr className="bg-emerald-50/80 font-black text-emerald-950">
                <td colSpan="2" className="p-1 border border-slate-300 text-right">
                  সর্বমোট আদায়কৃত টাকা:
                </td>
                <td className="p-1 border border-slate-300 text-right text-[10.5px]">
                  ৳ {formatBanglaNumber(grandTotal.toLocaleString("bn-BD"))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Remarks / Description if available */}
        {tx.description && (
          <div className="text-[9px] bg-slate-50 px-2 py-1 rounded border border-slate-200 mt-1">
            <span className="font-bold text-slate-500">মন্তব্য: </span>
            <span className="text-slate-700">{tx.description}</span>
          </div>
        )}

        {/* Signature Lines */}
        <div className="grid grid-cols-3 gap-3 pt-6 text-center text-[8.5px] font-bold text-slate-600">
          <div className="border-t border-slate-400 pt-1">
            <p>আদায়কারী</p>
            <span className="text-[7px] text-slate-400 block font-normal">স্বাক্ষর ও তারিখ</span>
          </div>
          <div className="border-t border-slate-400 pt-1">
            <p>হিসাবরক্ষক</p>
            <span className="text-[7px] text-slate-400 block font-normal">ক্যাশিয়ার</span>
          </div>
          <div className="border-t border-slate-400 pt-1">
            <p>অনুমোদনকারী</p>
            <span className="text-[7px] text-slate-400 block font-normal">মুহতামিম / অধ্যক্ষ</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dual-copy layout for A4 Landscape Income Voucher
export default function IncomeVoucherHtmlLayout({
  tx,
  formatBanglaNumber,
  parsePayerName,
}) {
  if (!tx) return null;

  return (
    <div className="w-full h-full bg-white print:p-0 print:m-0">
      {/* A4 Landscape Container: 2 Equal Halves with Vertical Divider */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch relative">
        {/* Left Half: Office Copy */}
        <div className="relative">
          <VoucherSingleHalf
            tx={tx}
            copyType="office"
            formatBanglaNumber={formatBanglaNumber}
            parsePayerName={parsePayerName}
          />
        </div>

        {/* Center Vertical Divider with Scissors Icon for screen and print */}
        <div className="hidden md:flex absolute top-0 bottom-0 left-1/2 -translate-x-1/2 items-center justify-center pointer-events-none z-20">
          <div className="h-full border-r-2 border-dashed border-slate-300 relative">
            <span className="absolute top-1/2 -translate-y-1/2 -left-2.5 bg-white border border-slate-300 rounded-full w-5 h-5 flex items-center justify-center text-[10px] text-slate-500 shadow-xs">
              ✂
            </span>
          </div>
        </div>

        {/* Right Half: Donor / Student Copy */}
        <div className="relative">
          <VoucherSingleHalf
            tx={tx}
            copyType="client"
            formatBanglaNumber={formatBanglaNumber}
            parsePayerName={parsePayerName}
          />
        </div>
      </div>
    </div>
  );
}
