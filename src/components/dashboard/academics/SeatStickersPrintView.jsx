/* eslint-disable @next/next/no-img-element */
"use client";

import React, { forwardRef } from "react";
import siteConfig from "@/config/siteConfig";
import { getStudentClassDetails, toBengaliDigits } from "@/lib/studentUtils";

export const FALLBACK_AVATAR_DATA_URI =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='%2394a3b8'><circle cx='50' cy='36' r='20'/><path d='M20 86c0-16.5 13.5-30 30-30s30 13.5 30 30z'/></svg>";

export const isValidImageUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (
    !trimmed ||
    trimmed === "null" ||
    trimmed === "undefined" ||
    trimmed === "[object Object]"
  ) {
    return false;
  }
  return /^(https?:\/\/|\/|data:image\/)/i.test(trimmed);
};

export const SEAT_STICKERS_PAGE_STYLE = `
  @page {
    size: A4 portrait;
    margin: 8mm;
  }
  @media print {
    html, body {
      width: 100% !important;
      height: auto !important;
      margin: 0 !important;
      padding: 0 !important;
      background: #fff !important;
      color: #000 !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      font-family: 'Bornomala', 'Ubuntu Sans', sans-serif !important;
    }
    .no-print {
      display: none !important;
    }
    .seat-sticker-sheet {
      width: 194mm !important;
      height: 281mm !important;
      max-height: 281mm !important;
      margin: 0 auto !important;
      padding: 0 !important;
      display: grid !important;
      grid-template-columns: repeat(2, 94mm) !important;
      grid-template-rows: repeat(4, 66mm) !important;
      gap: 5mm 6mm !important;
      page-break-after: always !important;
      break-after: page !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
      overflow: hidden !important;
      box-sizing: border-box !important;
    }
    .seat-sticker-sheet:last-child {
      page-break-after: auto !important;
      break-after: auto !important;
    }
    .seat-sticker-card {
      width: 94mm !important;
      height: 66mm !important;
      max-height: 66mm !important;
      box-sizing: border-box !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
      overflow: hidden !important;
      border: 1.5px dashed #94a3b8 !important;
      background: #ffffff !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
  }
`;

const SeatStickersPrintView = forwardRef(function SeatStickersPrintView(
  {
    students = [],
    examName = "২য় সাময়িক পরীক্ষা",
    sessionYear = "২০২৬",
  },
  ref,
) {
  // ৮টি করে স্টিকার প্রতি পেজে ভাগ করা (A4 portrait 2 columns x 4 rows)
  const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const pages = chunkArray(students, 8);

  return (
    <div ref={ref} className="font-bornomala text-slate-900 bg-white">
      {pages.map((pageStudents, pageIdx) => (
        <div
          key={`page-${pageIdx}`}
          className="seat-sticker-sheet grid grid-cols-2 gap-x-[6mm] gap-y-[5mm] p-0 w-[194mm] h-[281mm] mx-auto overflow-hidden bg-white"
        >
          {pageStudents.map((student) => {
            const id = student._id?.$oid || student._id || student.studentId;
            const details = getStudentClassDetails(student);
            const currentSeat = student.seatPlan || {
              hallNo: student.hallNo || "",
              benchNo: student.benchNo || "",
              seatNo: student.seatNo || "",
            };

            const hallDisplay = currentSeat.hallNo || student.hallNo || "—";
            const benchDisplay = currentSeat.benchNo || student.benchNo || "";
            const seatDisplay = currentSeat.seatNo || student.seatNo || "—";

            return (
              <div
                key={id}
                className="seat-sticker-card w-[94mm] h-[66mm] border-[1.5px] border-dashed border-slate-400 rounded-xl p-2.5 flex flex-col justify-between relative bg-white shadow-2xs overflow-hidden"
              >
                {/* ১. প্রাতিষ্ঠানিক মিনি-হেডার (লোগো, মাদ্রাসার নাম ও পরীক্ষার নাম) */}
                <div className="flex items-center justify-between gap-1.5 border-b border-emerald-900/20 pb-1 flex-shrink-0">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 relative flex items-center justify-center bg-white border border-emerald-900/20">
                      <img
                        src={siteConfig.assets.logo}
                        alt="Logo"
                        width={24}
                        height={24}
                        loading="eager"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover scale-[1.05]"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = FALLBACK_AVATAR_DATA_URI;
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[10px] font-black text-[#043e30] leading-tight truncate">
                        {siteConfig.name.bn}
                      </h4>
                      <p className="text-[7.5px] font-semibold text-slate-500 leading-none">
                        পরীক্ষা আসন স্টিকার
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#043e30]/10 text-[#043e30] font-black text-[7.5px] px-1.5 py-0.5 rounded border border-[#043e30]/20 flex-shrink-0 whitespace-nowrap">
                    {examName} - {toBengaliDigits(sessionYear)}
                  </div>
                </div>

                {/* ২. মূল বডি সেকশন (ছবি + নাম ও শ্রেণির বিবরণ) */}
                <div className="flex items-center gap-2.5 my-auto py-1 flex-1 min-h-0">
                  {/* ছবি ও রোল ফ্রেম */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-[19mm] h-[23mm] rounded-lg border border-slate-300 overflow-hidden relative bg-slate-100 flex items-center justify-center shadow-2xs">
                      {isValidImageUrl(student.studentImage) ? (
                        <img
                          src={student.studentImage.trim()}
                          alt={
                            student.studentNameBangla ||
                            student.studentNameEnglish ||
                            "Student"
                          }
                          loading="eager"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.warn(
                              `[SeatStickersPrintView] Failed to load student photo for ID: ${student.studentId || "unknown"}`,
                              e.currentTarget.src,
                            );
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = FALLBACK_AVATAR_DATA_URI;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100 text-center p-1">
                          <span className="text-sm">👤</span>
                          <span className="text-[6.5px] font-semibold mt-0.5 text-slate-500">
                            ছবি নেই
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="bg-slate-100 text-slate-800 text-[8px] font-bold px-1.5 py-0.2 rounded mt-0.5 border border-slate-300 font-ubuntu">
                      রোল: {student.roll ? toBengaliDigits(student.roll) : "—"}
                    </span>
                  </div>

                  {/* শিক্ষার্থীর তথ্যাবলী */}
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div>
                      <span className="text-[7.5px] font-semibold text-slate-400 block leading-tight">
                        শিক্ষার্থীর নাম
                      </span>
                      <h3 className="text-[18px] font-black text-slate-900 leading-snug truncate">
                        {student.studentNameBangla ||
                          student.studentNameEnglish ||
                          "নাম নেই"}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5 text-[8.5px] text-slate-700">
                      <span className="font-bold text-[#043e30] bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                        শ্রেণি: {details.className || "প্রযোজ্য নয়"}
                      </span>
                      {details.divisionName && details.divisionName !== "N/A" && (
                        <span className="text-slate-500 truncate">
                          ({details.divisionName})
                        </span>
                      )}
                    </div>

                    <div className="text-[8px] text-slate-500 font-ubuntu">
                      আইডি:{" "}
                      <span className="font-bold text-slate-800">
                        {toBengaliDigits(student.studentId || "-")}
                      </span>
                    </div>

                  </div>

                </div>

                {/* ৩. বটম হাই-ভিজিবিলিটি ডেস্ক ইনফো বার (হল, বেঞ্চ ও আসন নম্বর) */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-1 px-2 flex items-center justify-between gap-1 flex-shrink-0">
                  <div className="flex items-center gap-2 text-[9px] text-slate-700 font-bold">
                    <span>
                      হল/রুম:{" "}
                      <strong className="text-slate-900 font-black font-ubuntu">
                        {toBengaliDigits(hallDisplay)}
                      </strong>
                    </span>
                    {benchDisplay && (
                      <>
                        <span className="text-slate-300">|</span>
                        <span>
                          বেঞ্চ:{" "}
                          <strong className="text-slate-900 font-black font-ubuntu">
                            {toBengaliDigits(benchDisplay)}
                          </strong>
                        </span>
                      </>
                    )}
                  </div>

                  <div className="bg-[#043e30] text-amber-300 px-2.5 py-0.5 rounded-md font-black text-[11px] tracking-wide shadow-2xs font-ubuntu flex items-center gap-1">
                    <span className="text-[8px] font-bold text-emerald-200">
                      আসন:
                    </span>
                    <span>{toBengaliDigits(seatDisplay)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
});

export default SeatStickersPrintView;
