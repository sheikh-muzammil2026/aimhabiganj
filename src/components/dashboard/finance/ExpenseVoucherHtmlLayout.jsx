"use client";

import React from "react";
import Image from "next/image";
import { Phone, Globe, Mail } from "lucide-react";
import { MdEmail, MdInstallMobile } from "react-icons/md";
import { BsWhatsapp, BsYoutube } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";

export default function ExpenseVoucherHtmlLayout({
  tx,
  formatBanglaNumber,
  parsePayerName,
}) {
  if (!tx) return null;

  const isIncome = tx.type === "income";
  const parsed = parsePayerName
    ? parsePayerName(tx.payerName)
    : {
        donorName: tx.donorName || tx.payerName || "N/A",
        studentId: tx.studentId || "",
      };

  const title = isIncome ? "আয় আদায় রসিদ" : "ব্যয় পরিশোধ ভাউচার";
  const idLabel = isIncome ? "রসিদ নম্বর " : "ভাউচার নম্বর";
  const idValue = isIncome ? tx.receiptNo : tx.voucherNo;
  const dateValue = tx.date;
  const totalAmount = isIncome ? tx.totalIncome : tx.totalExpense;

  const isStudent =
    isIncome &&
    (tx.payerType === "student" ||
      !!tx.studentId ||
      (tx.payerName && tx.payerName.includes(" / ")));
  const deficit =
    !isIncome && tx.totalExpense > tx.advanceAmount
      ? tx.totalExpense - tx.advanceAmount
      : 0;

  return (
    <div className="space-y-4 text-black bg-white w-full max-w-full font-sans leading-relaxed text-xs">
      {/* Organisation Header matching Admit Card Branding */}
      {/* Header Section */}
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
                     className="w-auto object-fill mx-auto max-h-45"
                     priority
                   />
                 </div>
                 <p className="text-[9px] text-slate-600 font-semibold mt-0.5">
                   দক্ষিণ শ্যামলী, হবিগঞ্জ সদর, হবিগঞ্জ
                 </p>
               </div>
     
               {/* Right Logo placeholder for balanced symmetry */}
             </div>

      <div className="text-center my-1.5">
        <div className="inline-block bg-emerald-800 text-white px-4 py-0.5 rounded-full border border-emerald-600 shadow-xs text-[10px] font-bold tracking-wider uppercase">
          {title}
        </div>
      </div>

      {/* Metadata Section */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] border-b border-dashed border-slate-300 pb-2">
        <div>
          <span className="font-bold text-slate-500">{idLabel}: </span>
          <span className="font-mono font-black text-emerald-955">
            {idValue}
          </span>
        </div>
        <div className="text-right">
          <span className="font-bold text-slate-500">তারিখ: </span>
          <span className="font-bold">{formatBanglaNumber(dateValue)}</span>
        </div>

        {isIncome ? (
          isStudent ? (
            <>
              <div>
                <span className="font-bold text-slate-500">
                  শিক্ষার্থীর নাম :{" "}
                </span>
                <span className="font-bold text-slate-800">
                  {tx.studentName || parsed.donorName || "N/A"}
                </span>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-500">
                  আইডি ও শ্রেণী:{" "}
                </span>
                <span className="font-bold text-slate-800">
                  {tx.studentId || parsed.studentId || "N/A"} (
                  {tx.className || "N/A"})
                </span>
              </div>
            </>
          ) : (
            <>
              <div>
                <span className="font-bold text-slate-500">দাতার নাম : </span>
                <span className="font-bold text-slate-800">
                  {tx.donorName || parsed.donorName || "N/A"}
                </span>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-500">ধরণ: </span>
                <span className="font-bold text-slate-800">
                  দাতা / অনুদানকারী
                </span>
              </div>
            </>
          )
        ) : (
          <>
            <div>
              <span className="font-bold text-slate-500">খরচকারির নাম: </span>
              <span className="font-bold text-slate-800">
                {tx.receiverName || "N/A"}
              </span>
            </div>
            <div className="text-right">
              <span className="font-bold text-slate-500">চেক নং: </span>
              <span className="font-mono font-bold text-slate-800">
                {tx.chequeNo || "N/A"}
              </span>
            </div>
          </>
        )}

        <div>
          <span className="font-bold text-slate-500">পেমেন্ট পদ্ধতি: </span>
          <span className="font-bold">{tx.paymentMethod || "Cash"}</span>
        </div>
        {!isIncome && tx.advanceAmount > 0 && (
          <div className="text-right">
            <span className="font-bold text-slate-500">অগ্রীম গৃহীত: </span>
            <span className="font-bold">
              ৳ {formatBanglaNumber(tx.advanceAmount.toLocaleString("bn-BD"))}
            </span>
          </div>
        )}
        {deficit > 0 && (
          <div className="sm:col-span-2 text-right">
            <span className="font-bold text-slate-500">ঘাটতি/ঋণ: </span>
            <span className="font-bold text-rose-900">
              ৳ {formatBanglaNumber(deficit.toLocaleString("bn-BD"))}
            </span>
            {tx.reimbursement?.status === "paid" && (
              <span className="text-emerald-600 font-bold ml-1.5">(paid)</span>
            )}
          </div>
        )}
      </div>

      {/* Particulars Table */}
      <table className="w-full text-[10px] text-left border border-collapse border-slate-300 font-medium">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-350 text-slate-700 font-bold">
            <th className="p-1.5 border border-slate-300 text-center w-10">
              ক্রমিক
            </th>
            <th className="p-1.5 border border-slate-300">হিসাবের খাত</th>
            <th className="p-1.5 border border-slate-300 text-right w-28">
              টাকার পরিমাণ
            </th>
          </tr>
        </thead>
        <tbody>
          {tx.items?.map((item, index) => (
            <tr key={index} className="border-b border-slate-200">
              <td className="p-1.5 border border-slate-300 text-center">
                {formatBanglaNumber(index + 1)}
              </td>
              <td className="p-1.5 border border-slate-300 font-semibold">
                <div>{item.head}</div>
                {!isIncome && (item.institutionName || item.shopVoucher) && (
                  <div className="text-[8px] text-slate-500 font-normal mt-0.5">
                    {item.institutionName &&
                      "সরবরাহকারী প্রতিষ্ঠান: " + item.institutionName}
                    {item.shopVoucher && " | মেমো নং: " + item.shopVoucher}
                  </div>
                )}
              </td>
              <td className="p-1.5 border border-slate-300 text-right font-bold">
                ৳ {formatBanglaNumber(item.amount.toLocaleString("bn-BD"))}
              </td>
            </tr>
          ))}
          {isIncome && tx.discount > 0 && (
            <>
              <tr className="bg-slate-50/50 font-bold print:hidden">
                <td
                  colSpan="2"
                  className="p-1.5 border border-slate-300 text-right"
                >
                  আসল মোট:
                </td>
                <td className="p-1.5 border border-slate-300 text-right">
                  ৳{" "}
                  {formatBanglaNumber(
                    (tx.totalIncome + tx.discount).toLocaleString("bn-BD"),
                  )}
                </td>
              </tr>
              <tr className="bg-slate-50/50 text-rose-800 font-bold print:hidden">
                <td
                  colSpan="2"
                  className="p-1.5 border border-slate-300 text-right font-bold"
                >
                  ছাড়:
                </td>
                <td className="p-1.5 border border-slate-300 text-right font-bold">
                  - ৳ {formatBanglaNumber(tx.discount.toLocaleString("bn-BD"))}
                </td>
              </tr>
            </>
          )}
          <tr className="bg-slate-50/50 font-black">
            <td
              colSpan="2"
              className="p-1.5 border border-slate-300 text-right"
            >
              সর্বমোট:
            </td>
            <td className="p-1.5 border border-slate-300 text-right text-xs">
              ৳ {formatBanglaNumber((totalAmount || 0).toLocaleString("bn-BD"))}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Remarks Section */}
      {tx.description && (
        <div className="text-[10px] bg-slate-50 p-2.5 rounded-lg border border-slate-200">
          <span className="font-bold text-slate-500">বিবরণ / মন্তব্য: </span>
          <span className="text-slate-700 font-medium">{tx.description}</span>
        </div>
      )}

      {/* Signature Lines */}
      <div className="grid grid-cols-3 gap-6 pt-12 text-center text-[9px] font-bold text-slate-500">
        <div className="border-t border-slate-400 pt-1.5">
          <p>{isIncome ? "আদায়কারী" : "খরচকারী / গ্রহীতা"}</p>
          <span className="text-[7px] text-slate-400 block font-normal mt-0.5">
            স্বাক্ষর ও তারিখ
          </span>
        </div>
        <div className="border-t border-slate-400 pt-1.5">
          <p>হিসাবরক্ষক</p>
          <span className="text-[7px] text-slate-400 block font-normal mt-0.5">
            ক্যাশিয়ার
          </span>
        </div>
        <div className="border-t border-slate-400 pt-1.5">
          <p>অনুমোদনকারী</p>
          <span className="text-[7px] text-slate-400 block font-normal mt-0.5">
            প্রিন্সিপাল
          </span>
        </div>
      </div>

      {/* সোশ্যাল ও কন্টাক্ট ইনফো */}
      <div className="pt-1 border-t border-gray-300">
        <div className="flex flex-wrap justify-center items-center gap-x-1 gap-y-0.5 text-[8.5px] font-semibold text-gray-800">
          <span className="flex items-center gap-0.5">
            <Phone className="w-2.5 h-2.5 text-gray-700" />
            ০১৩১৬-২০৯২০১
          </span>

          <span className="flex items-center gap-0.5">
            <BsWhatsapp className="w-2.5 h-2.5 text-green-600" />
            ০১৭৪৮-৮৮৬১৬১
          </span>

          <span className="flex items-center gap-0.5">
            <Globe className="w-2.5 h-2.5 text-blue-500" />
            www.aimhabiganj.com
          </span>

          <span className="flex items-center gap-0.5">
            <Mail className="w-2.5 h-2.5 text-red-500" />
            aimhabiganj@gmail.com
          </span>

          <span className="flex items-center gap-0.5">
            <FaFacebook className="w-2.5 h-2.5 text-blue-600" />
            aimhabiganj
          </span>

          <span className="flex items-center gap-0.5">
            <BsYoutube className="w-2.5 h-2.5 text-red-600" />
            aimhabiganj
          </span>
        </div>
      </div>
    </div>
  );
}
