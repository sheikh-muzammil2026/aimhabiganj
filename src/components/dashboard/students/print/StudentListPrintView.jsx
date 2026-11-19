"use client";

import React, { forwardRef, useMemo } from "react";
import PrintInstitutionalHeader from "@/components/shared/print/PrintInstitutionalHeader";
import PrintSignatures from "@/components/shared/print/PrintSignatures";
import { siteConfig } from "@/config/siteConfig";
import {
  compareStudentsByClassAndRoll,
  getClassRank,
  getStudentClassDetails,
  toBengaliDigits,
} from "@/lib/studentUtils";

const StudentListPrintView = forwardRef(function StudentListPrintView(
  {
    students = [],
    activeFilters = {},
    totalCount = 0,
    printDate,
  },
  ref
) {
  // ১. প্রিন্টের তারিখ ও সময় ফরম্যাটিং
  const formattedDate = useMemo(() => {
    if (printDate) return printDate;
    try {
      return new Intl.DateTimeFormat("bn-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date());
    } catch {
      return new Date().toLocaleDateString();
    }
  }, [printDate]);

  const formattedTime = useMemo(() => {
    try {
      return new Intl.DateTimeFormat("bn-BD", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }).format(new Date());
    } catch {
      return "";
    }
  }, []);

  // ২. ফিল্টার লেবেল ম্যাপিং
  const filterSummary = useMemo(() => {
    const parts = [];

    // সেশন
    if (activeFilters.selectedSession && activeFilters.selectedSession !== "all") {
      parts.push({ label: "শিক্ষাবর্ষ", value: activeFilters.selectedSession });
    } else {
      parts.push({ label: "শিক্ষাবর্ষ", value: "সকল শিক্ষাবর্ষ" });
    }

    // বিভাগ
    if (activeFilters.selectedDivision && activeFilters.selectedDivision !== "all") {
      const divMap = {
        preHifz: "প্রি-হিফজ বিভাগ",
        hifz: "হিফজ বিভাগ",
        academy: "একাডেমিক বিভাগ",
      };
      parts.push({
        label: "বিভাগ",
        value: divMap[activeFilters.selectedDivision] || activeFilters.selectedDivision,
      });
    }

    // একাডেমি টাইপ
    if (activeFilters.selectedAcademyType && activeFilters.selectedAcademyType !== "all") {
      parts.push({ label: "টাইপ", value: activeFilters.selectedAcademyType });
    }

    // শ্রেণি
    if (activeFilters.selectedClass && activeFilters.selectedClass !== "all") {
      parts.push({ label: "শ্রেণি", value: activeFilters.selectedClass });
    }

    // ধরন (আবাসিক/অনাবাসিক)
    if (activeFilters.selectedType && activeFilters.selectedType !== "all") {
      parts.push({ label: "আবাসিক ধরন", value: activeFilters.selectedType });
    }

    // ফি ক্যাটাগরি
    if (activeFilters.selectedFeeCategory && activeFilters.selectedFeeCategory !== "all") {
      parts.push({ label: "ফি ক্যাটাগরি", value: activeFilters.selectedFeeCategory });
    }

    // সার্চ কিওয়ার্ড
    if (activeFilters.searchTerm) {
      parts.push({ label: "অনুসন্ধান", value: `"${activeFilters.searchTerm}"` });
    }

    return parts;
  }, [activeFilters]);

  const sortedStudents = useMemo(() => {
    return [...students].sort(compareStudentsByClassAndRoll);
  }, [students]);

  // ৩. ডায়নামিক সামারি ব্রেকডাউন সরাসরি ফিল্টারকৃত অ্যারে থেকে হিসাব
  const dynamicSummary = useMemo(() => {
    const total = sortedStudents.length;

    // ধরন অনুযায়ী (Residential Type)
    const typeCounts = {
      residential: 0,
      nonResidential: 0,
      dayCare: 0,
      other: 0,
    };

    // বিভাগ অনুযায়ী (Division)
    const divisionCounts = {
      preHifz: 0,
      hifz: 0,
      academy: 0,
      other: 0,
    };

    // শ্রেণি অনুযায়ী (Class-wise)
    const classCounts = {};

    // ফি ক্যাটাগরি অনুযায়ী (Fee Category)
    const feeCounts = {};

    sortedStudents.forEach((student) => {
      const details = getStudentClassDetails(student);
      const studentType = details.type || "";

      if (studentType.includes("আবাসিক") && !studentType.includes("অনাবাসিক")) {
        typeCounts.residential += 1;
      } else if (studentType.includes("অনাবাসিক")) {
        typeCounts.nonResidential += 1;
      } else if (studentType.includes("ডে-কেয়ার") || studentType.includes("ডে কেয়ার")) {
        typeCounts.dayCare += 1;
      } else if (studentType && studentType !== "N/A") {
        typeCounts.other += 1;
      }

      // বিভাগ
      if (details.divisionKey === "preHifz" || details.divisionName.includes("প্রি-হিফজ")) {
        divisionCounts.preHifz += 1;
      } else if (details.divisionKey === "hifz" || details.divisionName.includes("হিফজ")) {
        divisionCounts.hifz += 1;
      } else if (details.divisionKey === "academy" || details.divisionName.includes("একাডেমিক")) {
        divisionCounts.academy += 1;
      } else {
        divisionCounts.other += 1;
      }

      // শ্রেণি অনুযায়ী গণনা
      const cls = details.className && details.className !== "N/A" ? details.className : "অন্যান্য";
      classCounts[cls] = (classCounts[cls] || 0) + 1;

      // ফি ক্যাটাগরি
      const feeCategory = student.feeCategory || student.category || "";
      if (feeCategory) {
        feeCounts[feeCategory] = (feeCounts[feeCategory] || 0) + 1;
      }
    });

    // শ্রেণি অনুযায়ী সাজানো (Play -> Hifz)
    const sortedClassEntries = Object.entries(classCounts).sort(([clsA], [clsB]) => {
      const rankDiff = getClassRank(clsA) - getClassRank(clsB);
      if (rankDiff !== 0) return rankDiff;
      return clsA.localeCompare(clsB, "bn");
    });

    return {
      total,
      typeCounts,
      divisionCounts,
      sortedClassEntries,
      feeCounts,
    };
  }, [sortedStudents]);

  return (
    <div
      ref={ref}
      className="student-list-print-root bg-white text-slate-900 p-4 sm:p-6 w-full max-w-[210mm] mx-auto print:max-w-none print:w-full print:p-0 font-bornomala"
      style={{
        boxSizing: "border-box",
        fontFamily: "'Bornomala', 'Ubuntu Sans', sans-serif",
      }}
    >
      {/* ---------------- ১. প্রাতিষ্ঠানিক হেডার ---------------- */}
      <div className="print-header-section mb-2 border-b-2 border-emerald-900 pb-2">
        <PrintInstitutionalHeader
          logoSrc={siteConfig.assets.logo}
          bannerSrc={siteConfig.assets.banner}
          logoWrapperClassName="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shrink-0 relative flex items-center justify-center border border-emerald-700"
          logoWidth={90}
          logoHeight={90}
          bannerClassName="w-full h-auto max-h-16 sm:max-h-20 object-contain mx-auto"
          containerClassName="flex justify-between items-center relative gap-3 w-full"
        />

        {/* হেডার সাব-টাইটেল / ডকুমেন্ট পরিচিতি */}
        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-200 text-xs">
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-emerald-950 tracking-tight">
              শিক্ষার্থী তালিকা ও সাধারণ বিবরণী
            </h2>
            <p className="text-[10px] sm:text-[11px] text-slate-600 font-medium">
              {siteConfig.address.bn} • {siteConfig.contacts.phoneBn}
            </p>
          </div>
          <div className="text-right">
            <span className="inline-block px-2.5 py-1 bg-emerald-50 border border-emerald-300 rounded-md text-[10.5px] font-bold text-emerald-900">
              প্রিন্ট তারিখ: {formattedDate} {formattedTime && `(${formattedTime})`}
            </span>
          </div>
        </div>
      </div>

      {/* ---------------- ২. সক্রিয় ফিল্টার সামারি ব্যানার ---------------- */}
      <div className="filter-summary-bar bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 mb-2.5 text-[10px] sm:text-[11px]">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-extrabold text-emerald-900 shrink-0">
            ফিল্টার প্যারামিটার:
          </span>
          {filterSummary.map((item, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800"
            >
              <strong className="text-slate-500 font-medium">{item.label}:</strong>
              <span className="font-bold text-slate-900">{item.value}</span>
            </span>
          ))}
          <span className="ml-auto inline-flex items-center gap-1 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-300 font-bold text-emerald-950">
            তালিকায় মোট শিক্ষার্থী:{" "}
            <span className="text-emerald-900 font-extrabold font-sans">
              {toBengaliDigits(totalCount || students.length)} জন
            </span>
          </span>
        </div>
      </div>

      {/* ---------------- ৩. ডায়নামিক সামারি সেকশন (ব্রেকডাউন কার্ড গ্রিড) ---------------- */}
      <div className="dynamic-summary-block mb-3 border border-emerald-800/20 bg-emerald-50/40 rounded-md p-2 text-[10px] sm:text-[10.5px] space-y-1.5 break-inside-avoid">
        <div className="flex items-center justify-between border-b border-emerald-900/10 pb-1">
          <span className="font-extrabold text-emerald-950 text-[11px]">
            📊 সংগৃহীত শিক্ষার্থীদের সারসংক্ষেপ:
          </span>
          <span className="text-slate-600 font-medium">
            মুদ্রিত মোট:{" "}
            <strong className="text-emerald-900 font-sans">
              {toBengaliDigits(dynamicSummary.total)}
            </strong>{" "}
            জন
          </span>
        </div>

        <div >
          {/* ধরন অনুযায়ী (Residential Type) */}
          {/* <div className="bg-white p-1.5 rounded border border-slate-200">
            <span className="block text-[9.5px] font-bold text-slate-500 border-b border-slate-100 pb-0.5 mb-1">
              আবাসিক ধরন অনুযায়ী:
            </span>
            <div className="space-y-0.5">
              {dynamicSummary.typeCounts.residential > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">আবাসিক:</span>
                  <strong className="font-sans text-emerald-800">
                    {toBengaliDigits(dynamicSummary.typeCounts.residential)}
                  </strong>
                </div>
              )}
              {dynamicSummary.typeCounts.nonResidential > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">অনাবাসিক:</span>
                  <strong className="font-sans text-emerald-800">
                    {toBengaliDigits(dynamicSummary.typeCounts.nonResidential)}
                  </strong>
                </div>
              )}
              {dynamicSummary.typeCounts.dayCare > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">ডে-কেয়ার:</span>
                  <strong className="font-sans text-emerald-800">
                    {toBengaliDigits(dynamicSummary.typeCounts.dayCare)}
                  </strong>
                </div>
              )}
              {dynamicSummary.typeCounts.other > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">অন্যান্য:</span>
                  <strong className="font-sans text-emerald-800">
                    {toBengaliDigits(dynamicSummary.typeCounts.other)}
                  </strong>
                </div>
              )}
              {dynamicSummary.typeCounts.residential === 0 &&
                dynamicSummary.typeCounts.nonResidential === 0 &&
                dynamicSummary.typeCounts.dayCare === 0 &&
                dynamicSummary.typeCounts.other === 0 && (
                  <span className="text-slate-400 italic">তথ্য নেই</span>
                )}
            </div>
          </div> */}

          {/* বিভাগ অনুযায়ী (Division) */}
          {/* <div className="bg-white p-1.5 rounded border border-slate-200">
            <span className="block text-[9.5px] font-bold text-slate-500 border-b border-slate-100 pb-0.5 mb-1">
              বিভাগ অনুযায়ী:
            </span>
            <div className="space-y-0.5">
              {dynamicSummary.divisionCounts.preHifz > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">প্রি-হিফজ:</span>
                  <strong className="font-sans text-blue-800">
                    {toBengaliDigits(dynamicSummary.divisionCounts.preHifz)}
                  </strong>
                </div>
              )}
              {dynamicSummary.divisionCounts.hifz > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">হিফজ:</span>
                  <strong className="font-sans text-teal-800">
                    {toBengaliDigits(dynamicSummary.divisionCounts.hifz)}
                  </strong>
                </div>
              )}
              {dynamicSummary.divisionCounts.academy > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">একাডেমিক:</span>
                  <strong className="font-sans text-purple-800">
                    {toBengaliDigits(dynamicSummary.divisionCounts.academy)}
                  </strong>
                </div>
              )}
              {dynamicSummary.divisionCounts.other > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">অন্যান্য:</span>
                  <strong className="font-sans text-slate-800">
                    {toBengaliDigits(dynamicSummary.divisionCounts.other)}
                  </strong>
                </div>
              )}
              {dynamicSummary.divisionCounts.preHifz === 0 &&
                dynamicSummary.divisionCounts.hifz === 0 &&
                dynamicSummary.divisionCounts.academy === 0 &&
                dynamicSummary.divisionCounts.other === 0 && (
                  <span className="text-slate-400 italic">তথ্য নেই</span>
                )}
            </div>
          </div> */}

          {/* শ্রেণি অনুযায়ী (Class-wise student count breakdown) */}
          <div className="bg-white p-1.5 rounded border border-slate-200">
            <span className="block text-[9.5px] font-bold text-slate-600 border-b border-slate-200 pb-0.5 mb-1">
              শ্রেণি অনুযায়ী শিক্ষার্থী সংখ্যা:
            </span>

            {dynamicSummary.sortedClassEntries && dynamicSummary.sortedClassEntries.length > 0 ? (
              <table className="w-full border-collapse text-[9px] sm:text-[9.5px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    <th className="py-0.5 px-1.5 text-left font-bold border-r border-slate-200">
                      শ্রেণি
                    </th>
                    <th className="py-0.5 px-1.5 text-right font-bold">
                      শিক্ষার্থী সংখ্যা
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dynamicSummary.sortedClassEntries.map(([cls, count]) => (
                    <tr key={cls} className="break-inside-avoid">
                      <td
                        className="py-0.5 px-1.5 text-slate-700 font-medium border-r border-slate-200 truncate"
                        title={cls}
                      >
                        {cls}
                      </td>
                      <td className="py-0.5 px-1.5 text-right font-bold font-sans text-emerald-800 whitespace-nowrap">
                        {toBengaliDigits(count)} জন
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <span className="text-[9.5px] text-slate-400 italic">তথ্য নেই</span>
            )}
          </div>

          {/* ফি ক্যাটাগরি অনুযায়ী (Fee Category) */}
          {/* <div className="bg-white p-1.5 rounded border border-slate-200">
            <span className="block text-[9.5px] font-bold text-slate-500 border-b border-slate-100 pb-0.5 mb-1">
              ফি ক্যাটাগরি অনুযায়ী:
            </span>
            <div className="space-y-0.5 max-h-16 overflow-hidden">
              {Object.keys(dynamicSummary.feeCounts).length > 0 ? (
                Object.entries(dynamicSummary.feeCounts).map(([cat, count]) => (
                  <div key={cat} className="flex justify-between items-center">
                    <span className="text-slate-700 truncate pr-1" title={cat}>
                      {cat}:
                    </span>
                    <strong className="font-sans text-slate-900">
                      {toBengaliDigits(count)}
                    </strong>
                  </div>
                ))
              ) : (
                <span className="text-slate-400 italic">সকল সাধারণ</span>
              )}
            </div>
          </div> */}
        </div>
      </div>

      {/* ---------------- ৪. মূল শিক্ষার্থী ডাটা টেবিল ---------------- */}
      <div className="print-table-wrapper w-full">
        <table className="w-full text-left border-collapse border border-slate-400 text-[10px] leading-tight">
          <thead>
            <tr className="bg-emerald-950 text-white font-bold uppercase text-[9.5px] tracking-wider text-center">
              <th className="py-2 px-1 border border-slate-400 w-9">ক্রমিক</th>
              <th className="py-2 px-1.5 border border-slate-400 w-20">রোল ও আইডি</th>
              <th className="py-2 px-2 border border-slate-400 text-left">শিক্ষার্থীর নাম</th>
              <th className="py-2 px-2 border border-slate-400 text-left">শ্রেণি ও বিভাগ</th>

              <th className="py-2 px-2 border border-slate-400 text-left">পিতার নাম</th>
              <th className="py-2 px-1.5 border border-slate-400 text-left">যোগাযোগ নম্বর</th>
              <th className="py-2 px-1.5 border border-slate-400 text-left w-20">জেলা / ঠিকানা</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="py-8 text-center text-slate-500 font-semibold border border-slate-300"
                >
                  কোনো শিক্ষার্থীর তথ্য পাওয়া যায়নি।
                </td>
              </tr>
            ) : (
              sortedStudents.map((student, index) => {
                const details = getStudentClassDetails(student);
                const rollDisplay = student.roll ? toBengaliDigits(student.roll) : "—";
                const studentIdDisplay = student.studentId ? String(student.studentId) : "N/A";

                const primaryMethod = student.primaryContactMethod || "পিতা";
                let contactNumber = student.fatherMobile || "N/A";
                if (primaryMethod === "মাতা" && student.motherMobile) {
                  contactNumber = student.motherMobile;
                }
                if (primaryMethod === "অভিভাবক" && student.guardianMobile) {
                  contactNumber = student.guardianMobile;
                }

                const district =
                  student.currentAddress?.district ||
                  student.permanentAddress?.district ||
                  "N/A";

                return (
                  <tr
                    key={student._id?.$oid || student._id || index}
                    className="border-b border-slate-300 odd:bg-white even:bg-slate-50/60 break-inside-avoid"
                    style={{ pageBreakInside: "avoid" }}
                  >
                    {/* ক্রমিক */}
                    <td className="py-1.5 px-1 border-r border-slate-300 text-center font-bold text-slate-700">
                      {toBengaliDigits(index + 1)}
                    </td>

                    {/* রোল ও আইডি */}
                    <td className="py-1.5 px-1.5 border-r border-slate-300 text-center font-semibold text-slate-800">
                      <div className="font-bold text-emerald-950 font-sans">
                        রোল: {rollDisplay}
                      </div>
                      <div className="text-[8.5px] text-slate-500 font-mono">
                        {studentIdDisplay}
                      </div>
                    </td>

                    {/* শিক্ষার্থীর নাম */}
                    <td className="py-1.5 px-2 border-r border-slate-300 font-bold text-slate-950">
                      <div>{student.studentNameBangla || "নাম বিহীন"}</div>
                      {student.studentNameEnglish && (
                        <div className="text-[8.5px] font-normal text-slate-500 font-sans">
                          {student.studentNameEnglish}
                        </div>
                      )}
                    </td>

                    {/* শ্রেণি ও বিভাগ */}
                    <td className="py-1.5 px-2 border-r border-slate-300 text-slate-800">
                      <div className="font-bold text-emerald-900">{details.className}</div>
                      <div className="text-[8.5px] text-slate-500 font-medium">
                        {details.divisionName}
                        {details.academyType ? ` (${details.academyType})` : ""}
                      </div>
                    </td>



                    {/* পিতার নাম */}
                    <td className="py-1.5 px-2 border-r border-slate-300 font-medium text-slate-800">
                      {student.fatherNameBangla || student.fatherNameEnglish || "—"}
                    </td>

                    {/* যোগাযোগ নম্বর */}
                    <td className="py-1.5 px-1.5 border-r border-slate-300 font-sans text-slate-800">
                      <div className="font-semibold text-slate-900">
                        {contactNumber !== "0" && contactNumber !== "N/A"
                          ? contactNumber
                          : "—"}
                      </div>
                      <div className="text-[8.5px] text-slate-500 font-bornomala">
                        ({primaryMethod})
                      </div>
                    </td>

                    {/* জেলা / ঠিকানা */}
                    <td className="py-1.5 px-1.5 border-slate-300 text-slate-700 text-[9px]">
                      {district}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ---------------- ৫. স্বাক্ষর ও পাদটীকা ---------------- */}
      <div className="print-footer-section mt-6 pt-2 break-inside-avoid">
        <PrintSignatures
          variant="compact"
          controllerLabel="প্রস্তুতকারী / অফিস সহকারী"
          principalLabel="প্রিন্সিপাল / মুহতামিম"
          controllerSignatureSrc={siteConfig.assets.controllerSignature}
          principalSignatureSrc={siteConfig.assets.principalSignature}
          className="flex justify-between items-end my-3 px-6 flex-shrink-0"
        />

        <div className="text-center text-[9px] text-slate-500 pt-2 border-t border-slate-200 mt-2">
          {siteConfig.name.fullBn} • কম্পিউটার জেনারেটেড রেজিস্টার বিবরণী • সর্বস্বত্ব সংরক্ষিত ©{" "}
          {toBengaliDigits(new Date().getFullYear())}
        </div>
      </div>
    </div>
  );
});

export default StudentListPrintView;
