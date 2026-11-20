"use client";

import React, { forwardRef } from "react";
import Image from "next/image";
import siteConfig from "@/config/siteConfig";
import { formatSubjectName } from "@/lib/subjectFormatter";
import { toBengaliDigits } from "@/lib/studentUtils";
import PrintSignatures from "@/components/shared/print/PrintSignatures";
import PrintSocialFooter from "@/components/shared/print/PrintSocialFooter";

export const CT_PAGE_STYLE = `
  @page {
    size: A4 landscape;
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
    .ct-print-container {
      padding: 0 !important;
      margin: 0 !important;
      box-shadow: none !important;
      border: none !important;
      max-width: 100% !important;
      width: 100% !important;
      position: relative !important;
    }
    .ct-watermark-wrapper {
      position: fixed !important;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
      margin: 0 !important;
      z-index: 0 !important;
      opacity: 0.05 !important;
      pointer-events: none !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 420px !important;
      height: 420px !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .ct-result-table {
      width: 100% !important;
      min-width: 100% !important;
      font-size: 8.5px !important;
      border-collapse: collapse !important;
      background: transparent !important;
      page-break-inside: auto !important;
    }
    .ct-result-table thead {
      display: table-header-group !important;
    }
    .ct-result-table tfoot {
      display: table-footer-group !important;
    }
    .ct-result-table tr {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    .ct-result-table th,
    .ct-result-table td {
      border: 1px solid #475569 !important;
      padding: 3px 2px !important;
      text-align: center !important;
      vertical-align: middle !important;
    }
    .ct-result-table thead th {
      background-color: #043e30 !important;
      color: #fef08a !important;
      font-weight: 700 !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .ct-tied-row,
    .ct-tied-row td {
      background-color: #f0fdf4 !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .ct-absent-cell {
      background-color: #fef2f2 !important;
      color: #b91c1c !important;
      font-weight: 700 !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .ct-print-page-break-avoid {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    .signature-controller,
    .signature-principal {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      image-rendering: -webkit-optimize-contrast !important;
      image-rendering: crisp-edges !important;
    }
    .ct-print-footer-container {
      margin-top: auto !important;
      display: block !important;
      width: 100% !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    .ct-print-social-info {
      display: block !important;
      visibility: visible !important;
      width: 100% !important;
      padding-top: 3px !important;
      border-top: 1px solid #cbd5e1 !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
  }
`;

const CTResultPrintView = forwardRef(function CTResultPrintView(
  {
    results = [],
    selectedClass = "প্রথম",
    examType = "term1",
    year = "২০২৬",
    allSubjectsList = [],
    ctCalculationsMap = new Map(),
    ctMeritRankMap = new Map(),
    tiedMarksSet = new Set(),
    stats = {},
    principalSignatureSrc = "/principle's_signature.jpg",
    controllerSignatureSrc = "/anarul.png",
  },
  ref,
) {
  const getExamLabel = (term) => {
    switch (term) {
      case "term1":
        return "১ম সাময়িক সিটি";
      case "term2":
        return "২য় সাময়িক সিটি";
      case "annual":
        return "বার্ষিক পরীক্ষা সিটি";
      default:
        return "ক্লাস টেস্ট (সিটি)";
    }
  };

  const cleanYear = (year || "").split(/[-–/]/)[0].trim();

  return (
    <div
      ref={ref}
      className="ct-print-container bg-white p-4 w-full relative min-h-[185mm] flex flex-col justify-between font-bornomala text-slate-900"
    >
      {/* ওয়াটারমার্ক লোগো */}
      <div className="ct-watermark-wrapper absolute inset-0 m-auto flex items-center justify-center pointer-events-none z-0 opacity-[0.05] overflow-hidden">
        <div className="w-[420px] h-[420px] rounded-full overflow-hidden flex items-center justify-center">
          <Image
            src={siteConfig.assets.logo}
            alt="Watermark Logo"
            width={420}
            height={420}
            className="w-full h-full object-cover scale-[1.08] transform-gpu"
          />
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        {/* ১. প্রাতিষ্ঠানিক হেডার (মাদ্রাসার লোগো, ব্যানার, শিরোনাম ও মেটাডেটা) */}
        <div className="mb-2.5 border-b-2 border-slate-800 pb-2 ct-print-page-break-avoid">
          <div className="flex items-center justify-between gap-2">
            {/* বামে মাদ্রাসার লোগো */}
            <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 bg-transparent relative flex items-center justify-center -mr-2">
              <Image
                src={siteConfig.assets.logo}
                alt="Institution Logo"
                width={96}
                height={96}
                quality={100}
                priority
                className="w-full h-full object-cover scale-[1.08] transform-gpu"
              />
            </div>

            {/* মাঝে ব্যানার ও বিবরণ */}
            <div className="flex-1 text-center px-1">
              <Image
                src="/banner_routine.png"
                alt="Institution Banner"
                width={1600}
                height={320}
                quality={100}
                priority
                className="w-full h-auto max-h-24 object-fill mx-auto"
              />

              <div className="inline-block bg-[#043e30] text-amber-300 font-extrabold px-4 py-0.5 rounded-full text-xs mt-1 tracking-wide shadow-xs">
                শ্রেণিভিত্তিক ক্লাস টেস্ট (সিটি) ফলাফল শিট
              </div>

              <p className="text-[10px] font-bold text-slate-700 mt-1">
                শ্রেণি:{" "}
                <span className="font-extrabold text-slate-900">
                  {selectedClass}
                </span>{" "}
                | পরীক্ষা:{" "}
                <span className="font-extrabold text-[#043e30]">
                  {getExamLabel(examType)}
                </span>{" "}
                | শিক্ষাবর্ষ:{" "}
                <span className="font-extrabold text-slate-900">
                  {toBengaliDigits(cleanYear)}
                </span>{" "}
                | মোট পরীক্ষার্থী:{" "}
                <span className="font-extrabold text-slate-900">
                  {toBengaliDigits(results.length)}
                </span>{" "}
                জন
              </p>
            </div>

            {/* ডানে পরিচ্ছন্ন ব্যালেন্সিং তথ্য বাক্স */}
            <div className="w-24 flex-shrink-0 text-right text-[8.5px] font-semibold text-slate-700 leading-tight border border-slate-300 rounded p-1.5 bg-slate-50/70">
              <div className="font-bold text-[#043e30] border-b border-slate-300 pb-0.5 mb-0.5">
                সিটি বিবরণী
              </div>
              <div>বিষয়: {toBengaliDigits(allSubjectsList.length)}টি</div>
              <div>উপস্থিত: {toBengaliDigits(stats.presentStudents ?? results.length)}</div>
              <div>অনুপস্থিত: {toBengaliDigits(stats.absentCount ?? 0)}</div>
            </div>
          </div>
        </div>

        {/* ২. সিটি ফলাফল টেবিল */}
        <div className="overflow-x-auto relative z-10 flex-1">
          <table className="ct-result-table w-full text-center border-collapse text-[9px] font-bornomala">
            <thead>
              <tr className="bg-[#043e30] text-amber-300">
                <th className="p-1 border border-emerald-950 font-bold w-9">
                  রোল
                </th>
                <th className="p-1 border border-emerald-950 font-bold w-14 font-ubuntu">
                  আইডি
                </th>
                <th className="p-1 border border-emerald-950 font-bold text-left min-w-[110px] px-2">
                  শিক্ষার্থীর নাম
                </th>

                {allSubjectsList.map((subjectName, i) => (
                  <th
                    key={i}
                    className="p-1 border border-emerald-950 font-bold text-center whitespace-nowrap min-w-[42px]"
                  >
                    {formatSubjectName(subjectName)}
                  </th>
                ))}

                <th className="p-1 border border-emerald-950 font-bold text-center whitespace-nowrap w-16">
                  মোট নম্বর
                </th>
                <th className="p-1 border border-emerald-950 font-bold text-center whitespace-nowrap w-12 font-ubuntu">
                  গড়
                </th>
                <th className="p-1 border border-emerald-950 font-bold text-center whitespace-nowrap w-14">
                  সিটি মেধা
                </th>
              </tr>
            </thead>
            <tbody className="bg-white/95">
              {results.length === 0 ? (
                <tr>
                  <td
                    colSpan={allSubjectsList.length + 6}
                    className="p-4 text-center text-slate-500 font-medium"
                  >
                    কোনো শিক্ষার্থীর সিটি ফলাফলের তথ্য পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                results.map((student) => {
                  const calc =
                    ctCalculationsMap.get(student.studentId) || {
                      totalCTMarks: 0,
                      averageCT: "0.00",
                      isAbsentAll: true,
                    };
                  const merit =
                    calc.isAbsentAll
                      ? "-"
                      : ctMeritRankMap.get(student.studentId) || "-";
                  const isTied =
                    !calc.isAbsentAll &&
                    calc.totalCTMarks > 0 &&
                    tiedMarksSet.has(calc.totalCTMarks);

                  return (
                    <tr
                      key={student.studentId}
                      className={`border-b border-slate-300 ${
                        isTied ? "ct-tied-row bg-emerald-50/60" : "bg-white"
                      }`}
                    >
                      <td className="p-1 border border-slate-400 font-bold text-slate-800 text-center font-ubuntu">
                        {student.roll
                          ? toBengaliDigits(student.roll)
                          : "-"}
                      </td>
                      <td className="p-1 border border-slate-400 font-bold text-slate-800 text-center font-ubuntu">
                        {toBengaliDigits(student.studentId)}
                      </td>
                      <td className="p-1 border border-slate-400 font-bold text-slate-900 text-left px-2 whitespace-nowrap">
                        {student.studentName || "প্রযোজ্য নয়"}
                      </td>

                      {allSubjectsList.map((subjName, idx) => {
                        const matchedSub = student.allSubjects?.find(
                          (s) => s.subject === subjName,
                        );
                        if (!matchedSub) {
                          return (
                            <td
                              key={idx}
                              className="p-1 border border-slate-300 text-slate-400 text-center font-ubuntu"
                            >
                              -
                            </td>
                          );
                        }

                        const termData = matchedSub[examType] || {};
                        const ctVal = termData.ct;
                        const isAbsent =
                          Boolean(termData.isAbsent) ||
                          ctVal === "A" ||
                          ctVal === "a" ||
                          ctVal === "Abs" ||
                          ctVal === "ABS" ||
                          ctVal === "অনুঃ";

                        if (isAbsent) {
                          return (
                            <td
                              key={idx}
                              className="p-1 border border-slate-400 text-center font-bold ct-absent-cell text-rose-600 bg-rose-50"
                            >
                              অনুঃ
                            </td>
                          );
                        }

                        if (
                          ctVal === undefined ||
                          ctVal === null ||
                          String(ctVal).trim() === ""
                        ) {
                          return (
                            <td
                              key={idx}
                              className="p-1 border border-slate-300 text-slate-400 text-center font-ubuntu"
                            >
                              -
                            </td>
                          );
                        }

                        const num = parseFloat(ctVal);
                        const displayVal = Number.isFinite(num)
                          ? toBengaliDigits(num)
                          : toBengaliDigits(ctVal);

                        return (
                          <td
                            key={idx}
                            className="p-1 border border-slate-400 text-center font-bold text-slate-800 font-ubuntu"
                          >
                            {displayVal}
                          </td>
                        );
                      })}

                      <td className="p-1 border border-slate-400 font-extrabold text-center text-slate-900 font-ubuntu bg-slate-50/50">
                        {calc.isAbsentAll
                          ? "অনুঃ"
                          : toBengaliDigits(calc.totalCTMarks)}
                      </td>
                      <td className="p-1 border border-slate-400 font-bold text-center text-slate-800 font-ubuntu">
                        {calc.isAbsentAll
                          ? "-"
                          : toBengaliDigits(calc.averageCT)}
                      </td>
                      <td className="p-1 border border-slate-400 font-black text-center text-[#043e30] font-ubuntu bg-emerald-50/40">
                        {merit !== "-" ? toBengaliDigits(merit) : "-"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ৩. এক নজরে পরিসংখ্যান ও সারাংশ */}
        <div className="text-[9.5px] font-bold text-slate-800 bg-slate-100/80 rounded-md mt-1.5 py-1 px-3 flex flex-wrap items-center justify-between border border-slate-300 ct-print-page-break-avoid">
          <div className="flex items-center gap-3">
            <span>
              মোট পরীক্ষার্থী:{" "}
              <strong className="text-slate-900 font-extrabold font-ubuntu">
                {toBengaliDigits(results.length)}
              </strong>{" "}
              জন
            </span>
            <span>•</span>
            <span>
              উপস্থিত:{" "}
              <strong className="text-emerald-700 font-extrabold font-ubuntu">
                {toBengaliDigits(stats.presentStudents ?? results.length)}
              </strong>{" "}
              জন
            </span>
            <span>•</span>
            <span>
              অনুপস্থিত:{" "}
              <strong className="text-rose-600 font-extrabold font-ubuntu">
                {toBengaliDigits(stats.absentCount ?? 0)}
              </strong>{" "}
              জন
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span>
              সর্বোচ্চ সিটি মার্ক:{" "}
              <strong className="text-[#043e30] font-black font-ubuntu">
                {stats.highestMarks !== undefined
                  ? toBengaliDigits(stats.highestMarks)
                  : "-"}
              </strong>
            </span>
            <span>•</span>
            <span>
              ক্লাস গড়:{" "}
              <strong className="text-slate-900 font-extrabold font-ubuntu">
                {stats.classAverage !== undefined
                  ? toBengaliDigits(stats.classAverage)
                  : "-"}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* ৪. প্রাতিষ্ঠানিক স্বাক্ষর ও সোশ্যাল ফুটার */}
      <div className="mt-3 pt-2 ct-print-page-break-avoid relative z-10 ct-print-footer-container">
        <PrintSignatures
          variant="large"
          controllerSignatureSrc={controllerSignatureSrc}
          principalSignatureSrc={principalSignatureSrc}
          controllerLabel="পরীক্ষা নিয়ন্ত্রক"
          principalLabel="প্রিন্সিপাল"
          className="flex justify-between items-end px-8 mb-4"
        />

        <PrintSocialFooter
          className="relative z-10 pt-2 border-t border-slate-300 ct-print-social-info"
          innerClassName="flex flex-wrap justify-center items-center gap-x-3 gap-y-0.5 text-[8px] font-semibold text-slate-800"
        />
      </div>
    </div>
  );
});

export default CTResultPrintView;
