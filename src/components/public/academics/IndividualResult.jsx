"use client";

import { Check, Copy, Search, Share2 } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";
import { useReactToPrint } from "react-to-print";
import { authClient } from "@/lib/auth-client";
import { formatSubjectName } from "@/lib/subjectFormatter";
import { toBengaliDigits, toEnglishDigits } from "@/lib/studentUtils";
import PrintInstitutionalHeader from "@/components/shared/print/PrintInstitutionalHeader";
import PrintSignatures from "@/components/shared/print/PrintSignatures";
import PrintSocialFooter from "@/components/shared/print/PrintSocialFooter";
import siteConfig from "@/config/siteConfig";

const RESULT_SHEET_PAGE_STYLE = `
  @page {
    size: A4 portrait;
    margin: 0mm !important;
  }

  @media print {
    html,
    body {
      width: 210mm !important;
      height: auto !important;
      margin: 0 !important;
      padding: 0 !important;
      background: #ffffff !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    .print-area-container {
      display: block !important;
      width: 210mm !important;
      margin: 0 !important;
      padding: 0 !important;
      gap: 0 !important;
    }

    .page-break {
      width: 210mm !important;
      max-width: 210mm !important;
      min-height: 297mm !important;
      height: 297mm !important;
      max-height: 297mm !important;
      margin: 0 auto !important;
      padding: 6mm 7mm !important;
      box-sizing: border-box !important;
      page-break-after: always !important;
      break-after: page !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
      overflow: hidden !important;
      box-shadow: none !important;
    }

    .page-break:last-child {
      page-break-after: auto !important;
      break-after: auto !important;
    }
  }
`;

/**
 * Grade to remark conversion utility based on institutional academic standards.
 * @param {string} grade - Letter grade (A+, A, A-, B, C, F)
 * @param {string} [fallback=""] - Clean fallback string if grade is unmapped
 * @returns {string} Mapped Bengali remark or fallback
 */
export const getGradeRemark = (grade, fallback = "") => {
  if (!grade || typeof grade !== "string") return fallback;
  const normalizedGrade = grade.trim().toUpperCase();
  switch (normalizedGrade) {
    case "A+":
      return "মুমতাজ";
    case "A":
      return "জায়্যিদ জিদ্দান";
    case "A-":
      return "জায়্যিদ";
    case "B":
      return "মাকবুল প্লাস";
    case "C":
      return "মাকবুল";
    case "F":
      return "রাসেব";
    default:
      return fallback;
  }
};

// বিষয়ভিত্তিক গ্রেড এবং গ্রেড পয়েন্ট নির্ধারণ
export const calculateSubjectGrade = (mark) => {
  if (
    mark === "ABS" ||
    mark === "A" ||
    mark === "Abs" ||
    mark === "অনুঃ" ||
    mark === "a"
  ) {
    return { grade: "অনুঃ", gpa: "০.০০", point: 0.0 };
  }
  const num = typeof mark === "number" ? mark : parseFloat(mark);
  if (isNaN(num)) return { grade: "-", gpa: "০.০০", point: 0.0 };
  if (num >= 80) return { grade: "A+", gpa: "৫.০০", point: 5.0 };
  if (num >= 70) return { grade: "A", gpa: "৪.০০", point: 4.0 };
  if (num >= 60) return { grade: "A-", gpa: "৩.০০", point: 3.0 };
  if (num >= 50) return { grade: "B", gpa: "২.০০", point: 2.0 };
  if (num >= 40) return { grade: "C", gpa: "১.০০", point: 1.0 };
  return { grade: "F", gpa: "০.০০", point: 0.0 };
};

// GPA পয়েন্ট অনুযায়ী লেটার গ্রেড বের করার নিয়ম
export const getGradeFromPoint = (point) => {
  const num = parseFloat(point) || 0;
  if (num >= 5.0) return "A+";
  if (num >= 4.0) return "A";
  if (num >= 3.0) return "A-";
  if (num >= 2.0) return "B";
  if (num >= 1.0) return "C";
  return "F";
};

// সামগ্রিক জিপিএ থেকে আন্তর্জাতিক গ্রেড বাউন্ডারি নির্ধারণ
export const getOverallGradeFromGPA = (gpaVal) => {
  return getGradeFromPoint(gpaVal);
};

// অবজেক্টের CT ও Exam যোগ করে মোট নম্বর বের করার হেলপার
export const parseExamData = (examObj) => {
  if (!examObj || Object.keys(examObj).length === 0) return "-";

  const { ct, exam, isAbsent } = examObj;

  const ctStr = String(ct || "")
    .trim()
    .toUpperCase();
  const examStr = String(exam || "")
    .trim()
    .toUpperCase();

  if (
    isAbsent ||
    ctStr === "A" ||
    examStr === "A" ||
    ctStr === "ABS" ||
    examStr === "ABS" ||
    ctStr === "ABSENT" ||
    examStr === "ABSENT" ||
    ct === "অনুঃ" ||
    exam === "অনুঃ"
  ) {
    return "অনুঃ";
  }

  const hasCt = ct !== undefined && ct !== null && String(ct).trim() !== "";
  const hasExam =
    exam !== undefined && exam !== null && String(exam).trim() !== "";

  if (!hasCt && !hasExam) return "-";

  const ctNum = typeof ct === "number" ? ct : parseFloat(ct) || 0;
  const examNum = typeof exam === "number" ? exam : parseFloat(exam) || 0;

  return ctNum + examNum;
};

export const isAnnualExamType = (examName) => {
  if (!examName || typeof examName !== "string") return false;
  const normalized = examName.replace(/\s+/g, " ").trim();
  return (
    normalized === "বার্ষিক পরীক্ষা" ||
    normalized === "বার্ষিক পরিক্ষা" ||
    normalized === "বার্ষিক" ||
    normalized.toLowerCase() === "annual"
  );
};

// ডাটাবেজের 'বার্ষিক পরীক্ষা' / 'বার্ষিক পরিক্ষা' লেবেলকে UI-তে '৩য় সাময়িক পরীক্ষা' (অথবা সংক্ষিপ্ত '৩য় সাময়িক') হিসেবে প্রদর্শন
export const formatExamDisplayLabel = (examName, { short = false } = {}) => {
  if (!examName || typeof examName !== "string") return examName || "";
  if (isAnnualExamType(examName)) {
    return short ? "৩য় সাময়িক" : "৩য় সাময়িক পরীক্ষা";
  }
  return examName.trim();
};

// একক টার্মের জন্য একটি বিষয়ের পূর্ণমান (Full Marks) নির্ধারণ (ডিফল্ট ১০০)
export const getTermFullMark = (item, termKey) => {
  const termData =
    termKey === "term1"
      ? item?.term1 || item?.["১ম সাময়িক পরীক্ষা"] || {}
      : termKey === "term2"
        ? item?.term2 || item?.["২য় সাময়িক পরীক্ষা"] || {}
        : item?.annual || item?.["বার্ষিক পরীক্ষা"] || {};

  const candidates = [
    termData?.fullMarks,
    termData?.fullMark,
    termData?.totalMarks,
    item?.fullMarks,
    item?.fullMark,
    item?.totalMarks,
  ];
  for (const val of candidates) {
    const parsed = typeof val === "number" ? val : parseFloat(val);
    if (!Number.isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return 100;
};

// সক্রিয় পরীক্ষার ধরন অনুযায়ী একটি বিষয়ের মোট পূর্ণমান (বার্ষিক/৩য় সাময়িকে ৩ টার্মের যোগফল, নতুবা একক টার্ম)
export const getSubjectTotalFullMarks = (item, currentExamType) => {
  if (isAnnualExamType(currentExamType)) {
    return (
      getTermFullMark(item, "term1") +
      getTermFullMark(item, "term2") +
      getTermFullMark(item, "annual")
    );
  }
  if (currentExamType === "১ম সাময়িক পরীক্ষা") {
    return getTermFullMark(item, "term1");
  }
  if (currentExamType === "২য় সাময়িক পরীক্ষা") {
    return getTermFullMark(item, "term2");
  }
  return getTermFullMark(item, "term1");
};

// সাবজেক্ট অনুসারে নির্দিষ্ট পরীক্ষার জন্য মার্কস বের করার হেলপার
export const getMarkForExamType = (item, currentExamType) => {
  const term1Data = item.term1 || item["১ম সাময়িক পরীক্ষা"] || {};
  const term2Data = item.term2 || item["২য় সাময়িক পরীক্ষা"] || {};
  const annualData = item.annual || item["বার্ষিক পরীক্ষা"] || {};

  const t1 = parseExamData(term1Data);
  const t2 = parseExamData(term2Data);
  const ann = parseExamData(annualData);

  if (currentExamType === "১ম সাময়িক পরীক্ষা") {
    return t1;
  } else if (currentExamType === "২য় সাময়িক পরীক্ষা") {
    return t2;
  } else if (isAnnualExamType(currentExamType)) {
    if (ann === "অনুঃ" || t1 === "অনুঃ" || t2 === "অনুঃ") return "অনুঃ";

    const num1 = typeof t1 === "number" ? t1 : 0;
    const num2 = typeof t2 === "number" ? t2 : 0;
    const numAnn = typeof ann === "number" ? ann : 0;

    if (t1 === "-" && t2 === "-" && ann === "-") return "-";
    return num1 + num2 + numAnn;
  }
  return "-";
};

// বার্ষিক পরীক্ষায় প্রতিটি বিষয়ের ৩টি টার্মের গ্রেড পয়েন্টের গড় হিসাব করে ফাইনাল গ্রেড ও জিপি বের করা
export const getFinalSubjectGradeForAnnual = (item) => {
  const term1Data = item.term1 || item["১ম সাময়িক পরীক্ষা"] || {};
  const term2Data = item.term2 || item["২য় সাময়িক পরীক্ষা"] || {};
  const annualData = item.annual || item["বার্ষিক পরীক্ষা"] || {};

  const t1 = parseExamData(term1Data);
  const t2 = parseExamData(term2Data);
  const ann = parseExamData(annualData);

  if (t1 === "অনুঃ" || t2 === "অনুঃ" || ann === "অনুঃ") {
    return { grade: "অনুঃ", gpa: "০.০০", point: 0.0 };
  }
  if (t1 === "-" && t2 === "-" && ann === "-") {
    return { grade: "-", gpa: "০.০০", point: 0.0 };
  }

  const g1 = calculateSubjectGrade(t1);
  const g2 = calculateSubjectGrade(t2);
  const gAnn = calculateSubjectGrade(ann);

  if (g1.point === 0 || g2.point === 0 || gAnn.point === 0) {
    return { grade: "F", gpa: "০.০০", point: 0.0 };
  }

  const avgPoint = (g1.point + g2.point + gAnn.point) / 3;
  const finalGrade = getGradeFromPoint(avgPoint);

  return {
    grade: finalGrade,
    gpa: toBengaliDigits(avgPoint.toFixed(2)),
    point: avgPoint,
  };
};

// বার্ষিক পরীক্ষায় শতকরা বা ১০০-এর স্কেলে মার্ক নরমালাইজেশন
export const getNormalizedMarkForGrade = (item, currentExamType) => {
  const mark = getMarkForExamType(item, currentExamType);
  if (mark === "অনুঃ" || mark === "-") return mark;
  if (isAnnualExamType(currentExamType)) {
    const term1Data = item.term1 || item["১ম সাময়িক পরীক্ষা"] || {};
    const term2Data = item.term2 || item["২য় সাময়িক পরীক্ষা"] || {};
    const annualData = item.annual || item["বার্ষিক পরীক্ষা"] || {};
    const t1 = parseExamData(term1Data);
    const t2 = parseExamData(term2Data);
    const ann = parseExamData(annualData);
    let count = 0;
    if (typeof t1 === "number") count++;
    if (typeof t2 === "number") count++;
    if (typeof ann === "number") count++;
    count = count || 1;
    return mark / count;
  }
  return mark;
};

// নির্দিষ্ট বিষয়ে শিক্ষার্থী অনুপস্থিত কি না যাচাই
export const isSubjectAbsent = (item, currentExamType) => {
  let termData = {};
  if (currentExamType === "১ম সাময়িক পরীক্ষা") {
    termData = item.term1 || item["১ম সাময়িক পরীক্ষা"] || {};
  } else if (currentExamType === "২য় সাময়িক পরীক্ষা") {
    termData = item.term2 || item["২য় সাময়িক পরীক্ষা"] || {};
  } else if (isAnnualExamType(currentExamType)) {
    termData = item.annual || item["বার্ষিক পরীক্ষা"] || {};
  }

  if (!termData || Object.keys(termData).length === 0) return true;
  if (termData.isAbsent) return true;

  const ctStr = String(termData.ct || "")
    .trim()
    .toUpperCase();
  const examStr = String(termData.exam || "")
    .trim()
    .toUpperCase();

  if (
    ctStr === "A" ||
    ctStr === "ABS" ||
    ctStr === "ABSENT" ||
    examStr === "A" ||
    examStr === "ABS" ||
    examStr === "ABSENT" ||
    termData.ct === "অনুঃ" ||
    termData.exam === "অনুঃ"
  ) {
    return true;
  }

  const hasCt =
    termData.ct !== undefined &&
    termData.ct !== null &&
    String(termData.ct).trim() !== "";
  const hasExam =
    termData.exam !== undefined &&
    termData.exam !== null &&
    String(termData.exam).trim() !== "";
  if (!hasCt && !hasExam) return true;

  return false;
};

// ডুপ্লিকেট সাবজেক্ট এন্ট্রি রিমুভ করার হেল্পার
export const deduplicateSubjects = (resultsList = []) => {
  if (!Array.isArray(resultsList) || resultsList.length === 0) return [];
  return Array.from(
    new Map(
      resultsList.map((item, idx) => [
        String(
          item?.subjectCode ||
          item?.subjectId ||
          item?.subjectName ||
          formatSubjectName(item?.subject) ||
          item?.subject ||
          `subject-${idx}`,
        ).trim(),
        item,
      ]),
    ).values(),
  );
};

// আন্তর্জাতিক গ্রেডিং সিস্টেম ও উপস্থিতি ভিত্তিক সামারি ক্যালকুলেশন
export const calculateSummary = (resultsList = [], currentExamType) => {
  const uniqueResults = deduplicateSubjects(resultsList);
  if (!uniqueResults || uniqueResults.length === 0) {
    return {
      totalFullMarks: "০",
      totalObtained: "০",
      average: "০.০০",
      grade: "-",
      gpa: "০.০০",
      status: "অনুপস্থিত",
      remark: "",
    };
  }

  const totalSubjects = uniqueResults.length;
  const isAnnual = isAnnualExamType(currentExamType);
  let absentCount = 0;
  let totalFullMarks = 0;
  let totalObtained = 0;
  let validCount = 0;
  let hasFailedCompulsory = false;
  let totalGradePoints = 0;
  let totalNormalizedMarks = 0;

  uniqueResults.forEach((item) => {
    totalFullMarks += getSubjectTotalFullMarks(item, currentExamType);
    const isAbsent = isSubjectAbsent(item, currentExamType);
    if (isAbsent) {
      absentCount++;
    } else {
      const mark = getMarkForExamType(item, currentExamType);
      if (typeof mark === "number") {
        totalObtained += mark;
        validCount++;
      }

      let subGrade;
      if (isAnnual) {
        subGrade = getFinalSubjectGradeForAnnual(item);
        const normMark = getNormalizedMarkForGrade(item, currentExamType);
        if (typeof normMark === "number") {
          totalNormalizedMarks += normMark;
        }
      } else {
        const normalizedMark = getNormalizedMarkForGrade(
          item,
          currentExamType,
        );
        subGrade = calculateSubjectGrade(normalizedMark);
      }

      if (subGrade.grade === "F" || subGrade.point === 0) {
        hasFailedCompulsory = true;
      }
      totalGradePoints += subGrade.point;
    }
  });

  if (absentCount === totalSubjects) {
    return {
      totalFullMarks: toBengaliDigits(totalFullMarks),
      totalObtained: "অনুঃ",
      average: "-",
      grade: "অনুঃ",
      gpa: "০.০০",
      status: "অনুপস্থিত",
      remark: "",
    };
  }

  if (absentCount > 0) {
    return {
      totalFullMarks: toBengaliDigits(totalFullMarks),
      totalObtained: toBengaliDigits(totalObtained),
      average:
        validCount > 0
          ? toBengaliDigits(
            (
              (isAnnual ? totalNormalizedMarks : totalObtained) / validCount
            ).toFixed(2),
          )
          : "০.০০",
      grade: "অসম্পূর্ণ",
      gpa: "০.০০",
      status: "অসম্পূর্ণ",
      remark: "",
    };
  }

  const avgMarks =
    validCount > 0
      ? ((isAnnual ? totalNormalizedMarks : totalObtained) / validCount).toFixed(
        2,
      )
      : "0.00";

  if (hasFailedCompulsory) {
    return {
      totalFullMarks: toBengaliDigits(totalFullMarks),
      totalObtained: toBengaliDigits(totalObtained),
      average: toBengaliDigits(avgMarks),
      grade: "F",
      gpa: "০.০০",
      status: "অকৃতকার্য",
      remark: getGradeRemark("F"),
    };
  }

  const rawGPA = Math.min(5.0, totalGradePoints / totalSubjects);
  const calculatedGPA = rawGPA.toFixed(2);
  const overallGrade = getOverallGradeFromGPA(rawGPA);

  return {
    totalFullMarks: toBengaliDigits(totalFullMarks),
    totalObtained: toBengaliDigits(totalObtained),
    average: toBengaliDigits(avgMarks),
    grade: overallGrade,
    gpa: toBengaliDigits(calculatedGPA),
    status: "উত্তীর্ণ",
    remark: getGradeRemark(overallGrade),
  };
};

// --- ক্লাস টেস্ট (সিটি / CT) মার্কস বিশ্লেষণ হেলপার ---
export const getCTSubjectData = (item, currentExamType) => {
  let termData = {};
  if (
    currentExamType === "১ম সাময়িক পরীক্ষা" ||
    currentExamType === "term1"
  ) {
    termData = item.term1 || item["১ম সাময়িক পরীক্ষা"] || {};
  } else if (
    currentExamType === "২য় সাময়িক পরীক্ষা" ||
    currentExamType === "term2"
  ) {
    termData = item.term2 || item["২য় সাময়িক পরীক্ষা"] || {};
  } else if (
    currentExamType === "বার্ষিক পরীক্ষা" ||
    currentExamType === "annual"
  ) {
    termData = item.annual || item["বার্ষিক পরীক্ষা"] || {};
  } else {
    termData = item[currentExamType] || item.term1 || {};
  }

  const ctVal = termData.ct;
  const isAbsent =
    Boolean(termData.isAbsent) ||
    ctVal === "A" ||
    ctVal === "a" ||
    ctVal === "ABS" ||
    ctVal === "Abs" ||
    ctVal === "ABSENT" ||
    ctVal === "absent" ||
    ctVal === "অনুঃ" ||
    termData.exam === "A" ||
    termData.exam === "ABS" ||
    termData.exam === "অনুঃ";

  const fullMark =
    typeof item.ctFullMark === "number" && item.ctFullMark > 0
      ? item.ctFullMark
      : 20;

  if (isAbsent) {
    return {
      obtained: "অনুঃ",
      numericMark: 0,
      fullMark,
      isAbsent: true,
      grade: "অনুঃ",
      remark: "অনুপস্থিত",
      hasMark: true,
    };
  }

  if (
    ctVal === undefined ||
    ctVal === null ||
    String(ctVal).trim() === "" ||
    ctVal === "-"
  ) {
    return {
      obtained: "-",
      numericMark: 0,
      fullMark,
      isAbsent: false,
      grade: "-",
      remark: "-",
      hasMark: false,
    };
  }

  const num = typeof ctVal === "number" ? ctVal : parseFloat(ctVal);
  if (isNaN(num)) {
    return {
      obtained: "-",
      numericMark: 0,
      fullMark,
      isAbsent: false,
      grade: "-",
      remark: "-",
      hasMark: false,
    };
  }

  const ratio = fullMark > 0 ? num / fullMark : 0;
  let grade = "C";
  let remark = "উত্তীর্ণ (C)";

  if (ratio >= 0.8) {
    grade = "A+";
    remark = "মুমতাজ (A+)";
  } else if (ratio >= 0.7) {
    grade = "A";
    remark = "জায়্যিদ জিদ্দান (A)";
  } else if (ratio >= 0.6) {
    grade = "A-";
    remark = "জায়্যিদ (A-)";
  } else if (ratio >= 0.5) {
    grade = "B";
    remark = "মাকবুল (B)";
  } else if (ratio >= 0.4) {
    grade = "C";
    remark = "উত্তীর্ণ (C)";
  } else {
    grade = "F";
    remark = "রাসেব (F)";
  }

  return {
    obtained: num,
    numericMark: num,
    fullMark,
    isAbsent: false,
    grade,
    remark,
    hasMark: true,
  };
};

// ক্লাস টেস্ট (সিটি / CT) সামারি পরিসংখ্যান
export const calculateCTSummary = (resultsList = [], currentExamType) => {
  const uniqueResults = deduplicateSubjects(resultsList);
  if (!uniqueResults || uniqueResults.length === 0) {
    return {
      totalFullMarks: "০",
      totalObtained: "০",
      percentage: "০.০০%",
      average: "০.০০",
      grade: "-",
      status: "অনুপস্থিত",
      remark: "-",
      isAbsentAll: true,
      numericTotalObtained: 0,
    };
  }

  const totalSubs = uniqueResults.length;
  let absentCount = 0;
  let totalObtained = 0;
  let totalFull = 0;
  let validCount = 0;
  let hasFailed = false;

  uniqueResults.forEach((item) => {
    const ctData = getCTSubjectData(item, currentExamType);
    totalFull += ctData.fullMark;

    if (ctData.isAbsent) {
      absentCount++;
      hasFailed = true;
    } else if (ctData.hasMark) {
      totalObtained += ctData.numericMark;
      validCount++;
      if (ctData.grade === "F") {
        hasFailed = true;
      }
    }
  });

  const isAbsentAll = absentCount === totalSubs;
  const isPartialAbsent = absentCount > 0 && absentCount < totalSubs;

  if (isAbsentAll) {
    return {
      totalFullMarks: toBengaliDigits(totalFull),
      totalObtained: "অনুঃ",
      percentage: "০.০০%",
      average: "-",
      grade: "অনুঃ",
      status: "অনুপস্থিত",
      remark: "অনুপস্থিত",
      isAbsentAll: true,
      numericTotalObtained: 0,
    };
  }

  const avgMarks =
    validCount > 0 ? (totalObtained / validCount).toFixed(2) : "0.00";
  const pct =
    totalFull > 0 ? ((totalObtained / totalFull) * 100).toFixed(2) : "0.00";

  let status = "উত্তীর্ণ";
  let grade = "C";
  let remark = "উত্তীর্ণ";

  const overallRatio = totalFull > 0 ? totalObtained / totalFull : 0;
  if (overallRatio >= 0.8) {
    grade = "A+";
    remark = "মুমতাজ (উৎকৃষ্ট)";
  } else if (overallRatio >= 0.7) {
    grade = "A";
    remark = "জায়্যিদ জিদ্দান (খুব ভালো)";
  } else if (overallRatio >= 0.6) {
    grade = "A-";
    remark = "জায়্যিদ (ভালো)";
  } else if (overallRatio >= 0.5) {
    grade = "B";
    remark = "মাকবুল (সন্তোষজনক)";
  } else if (overallRatio >= 0.4) {
    grade = "C";
    remark = "উত্তীর্ণ (চলতি মান)";
  } else {
    grade = "F";
    remark = "রাসেব (অনুত্তীর্ণ)";
  }

  if (isPartialAbsent) {
    status = "অসম্পূর্ণ";
    remark = "অসম্পূর্ণ";
    grade = "অসম্পূর্ণ";
  } else if (hasFailed) {
    status = "অকৃতকার্য";
    grade = "F";
    remark = "রাসেব (অনুত্তীর্ণ)";
  }

  return {
    totalFullMarks: toBengaliDigits(totalFull),
    totalObtained: toBengaliDigits(totalObtained),
    percentage: toBengaliDigits(pct) + "%",
    average: toBengaliDigits(avgMarks),
    grade,
    status,
    remark,
    isAbsentAll: false,
    numericTotalObtained: totalObtained,
  };
};

function ResultSheetGeneratorContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: session } = authClient.useSession();
  const user = session?.user;

  const userRef = useRef(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [students, setStudents] = useState([]);

  // রেজাল্ট শিটের জন্য ডাটা ও স্টেট
  const [resultSheets, setResultSheets] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const [resultsError, setResultsError] = useState(null);

  const resolveTabFromSearchParams = useCallback((params) => {
    const rawTab = (
      params.get("tab") ||
      params.get("type") ||
      params.get("mode") ||
      ""
    )
      .trim()
      .toLowerCase();
    return rawTab === "ct" ? "ct" : "term";
  }, []);

  // ফিল্টারিং স্টেট (শুধুমাত্র লোকাল ইনপুট স্টেট; সার্চ বাটনে ক্লিক না করা পর্যন্ত ফেচ বা ফিল্টার হবে না)
  const [selectedClass, setSelectedClass] = useState(
    () => (searchParams.get("class") || "").trim() || "all",
  );
  const [targetYear, setTargetYear] = useState(
    () =>
      (searchParams.get("year") || searchParams.get("session") || "").trim() ||
      "২০২৬",
  );
  const [examType, setExamType] = useState(
    () =>
      (searchParams.get("exam") || searchParams.get("examType") || "").trim() ||
      "২য় সাময়িক পরীক্ষা",
  );
  const [resultMode, setResultMode] = useState(() =>
    resolveTabFromSearchParams(searchParams),
  );
  const [searchInput, setSearchInput] = useState(() =>
    (
      searchParams.get("roll") ||
      searchParams.get("studentId") ||
      searchParams.get("id") ||
      searchParams.get("search") ||
      ""
    ).trim(),
  );
  const [searchTerm, setSearchTerm] = useState(() =>
    (
      searchParams.get("roll") ||
      searchParams.get("studentId") ||
      searchParams.get("id") ||
      searchParams.get("search") ||
      ""
    ).trim(),
  );

  // প্রদর্শিত রেজাল্ট শিটের জন্য কমিটেড স্টেট (যাতে ড্রপডাউন পরিবর্তনের সাথে সাথে লাইভ রি-ক্যালকুলেশন না হয়)
  const [activeExamType, setActiveExamType] = useState(
    () =>
      (searchParams.get("exam") || searchParams.get("examType") || "").trim() ||
      "২য় সাময়িক পরীক্ষা",
  );
  const [activeYear, setActiveYear] = useState(
    () =>
      (searchParams.get("year") || searchParams.get("session") || "").trim() ||
      "২০২৬",
  );
  const [activeClass, setActiveClass] = useState(
    () => (searchParams.get("class") || "").trim() || "all",
  );
  const [activeResultMode, setActiveResultMode] = useState(() =>
    resolveTabFromSearchParams(searchParams),
  );
  const [copiedLink, setCopiedLink] = useState(false);

  // ডুপ্লিকেট রিকোয়েস্ট ও Strict Mode ডাবল-ইনভোকেশন রোধ করার রেফারেন্স
  const requestIdRef = useRef(0);
  const lastExecutedQueryRef = useRef("");
  const syllabusFetchedRef = useRef(false);

  const [syllabusCategories, setSyllabusCategories] = useState({
    preHifz: [],
    hifz: [],
    prePrimary: [],
    primary: [],
    secondary: [],
  });

  const sessionYears = ["২০২৬", "২০২৫", "২০২৪", "২০২৩", "২০২২"];

  // ০. ডায়নামিক সিলেবাস ফেচ
  useEffect(() => {
    if (syllabusFetchedRef.current) return;
    syllabusFetchedRef.current = true;
    const fetchSyllabus = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_API}/api/syllabus`,
        );
        const json = await res.json();
        if (json.success && json.categories) {
          setSyllabusCategories(json.categories);
        }
      } catch (err) {
        console.error("Failed to fetch syllabus:", err);
      }
    };
    fetchSyllabus();
  }, []);

  // ১ ও ২. সমন্বিত সার্চ ও রেজাল্ট ফেচিং (শুধুমাত্র সার্চ সাবমিট অথবা সরাসরি শেয়ারেবল URL লোডে কল হবে)
  const executeSearch = useCallback(
    async ({
      term = "",
      cls = "all",
      yr = "২০২৬",
      exam = "২য় সাময়িক পরীক্ষা",
      mode = "term",
      syncUrl = true,
    }) => {
      const trimmedTerm = (term || "").trim();
      const hasClass = Boolean(cls && cls !== "all");

      if (!trimmedTerm && !hasClass) {
        setSelectedIds([]);
        setStudents([]);
        setResultSheets([]);
        setResultsError(null);
        return;
      }

      const currentReqId = ++requestIdRef.current;

      try {
        setLoading(true);
        setLoadingResults(true);
        setError(null);
        setResultsError(null);
        setResultSheets([]);

        const params = new URLSearchParams({
          status: "Approved",
          activity: "active",
          limit: "1000",
        });

        if (trimmedTerm) {
          params.append("search", trimmedTerm);
        }
        if (hasClass) {
          params.append("class", cls);
        }
        if (yr) {
          params.append("sessionYear", yr);
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_API}/api/students?${params.toString()}`,
        );
        const result = await response.json();

        if (currentReqId !== requestIdRef.current) return;

        let idsToFetch = [];

        if (result.success) {
          const rawStudents = (result.data || []).sort(
            (a, b) =>
              (parseInt(a.roll, 10) || Infinity) -
              (parseInt(b.roll, 10) || Infinity),
          );

          // ১. Student ID দিয়ে সার্চ করা হলে অবশ্যই EXACT MATCH ফিল্টারিং হবে
          let fetchedStudents = rawStudents;
          if (trimmedTerm) {
            const normalizedTerm = toEnglishDigits(trimmedTerm);
            fetchedStudents = rawStudents.filter((item) => {
              const rawId = item?.studentId ?? item?.id;
              if (rawId === undefined || rawId === null) return false;
              const strId = rawId.toString().trim();
              return (
                strId === trimmedTerm ||
                strId === normalizedTerm ||
                toBengaliDigits(strId) === trimmedTerm
              );
            });
          }

          // ডুপ্লিকেট স্টুডেন্ট রেকর্ড রোধ করতে ইউনিক আইডি ফিল্টারিং
          const uniqueStudents = [];
          const seenInputIds = new Set();
          fetchedStudents.forEach((s) => {
            const sid = s.studentId ?? s.id;
            if (sid === undefined || sid === null) return;
            const cleanSid = sid.toString().trim();
            const normalizedKey = toEnglishDigits(cleanSid);
            if (!normalizedKey || seenInputIds.has(normalizedKey)) return;
            seenInputIds.add(normalizedKey);
            uniqueStudents.push(s);
          });

          if (uniqueStudents.length > 0) {
            setStudents(uniqueStudents);
            idsToFetch = uniqueStudents.map((s) => {
              const sid = s.studentId ?? s.id;
              return sid.toString().trim();
            });
            setSelectedIds(idsToFetch);
          } else {
            if (trimmedTerm) {
              setStudents([]);
              const normalizedId = toEnglishDigits(trimmedTerm);
              idsToFetch = [normalizedId || trimmedTerm];
              setSelectedIds(idsToFetch);
            } else {
              setStudents([]);
              setSelectedIds([]);
              setResultSheets([]);
              setError("এই শ্রেণীতে কোনো শিক্ষার্থী পাওয়া যায়নি।");
              setResultsError("কোনো ফলাফল পাওয়া যায়নি (No result found)।");
              return;
            }
          }
        } else {
          setStudents([]);
          setSelectedIds([]);
          setResultSheets([]);
          setError(result.message || "শিক্ষার্থীদের তথ্য লোড করা যায়নি।");
          setResultsError(
            result.message || "কোনো ফলাফল পাওয়া যায়নি (No result found)।",
          );
          return;
        }

        if (idsToFetch.length === 0) {
          setResultSheets([]);
          return;
        }

        let unpublishedMsg = null;

        const fetchPromises = idsToFetch.map(async (studentId) => {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_API}/api/results/student/${studentId}?year=${encodeURIComponent(
              yr,
            )}&examType=${encodeURIComponent(exam)}`,
            {
              headers: {
                "x-user-email": userRef.current?.email || "",
                "x-user-role": userRef.current?.role || "",
              },
            },
          );
          const data = await res.json();

          if (res.status === 403 || data.isPublished === false) {
            if (!data.success) {
              unpublishedMsg =
                data.message || "এই শিক্ষাবর্ষের ফলাফল এখনো প্রকাশিত হয়নি।";
            }
          }

          return data.success ? data : null;
        });

        const fetchedResults = await Promise.all(fetchPromises);
        if (currentReqId !== requestIdRef.current) return;

        const validResults = fetchedResults.filter((item) => item !== null);

        // রেজাল্ট ডাটাতেও যদি সার্চ কুয়েরি থাকে, তবে নিখুঁত EXACT MATCH নিশ্চিত করা
        let finalResults = validResults;
        if (trimmedTerm) {
          const normalizedQuery = toEnglishDigits(trimmedTerm);
          finalResults = validResults.filter((item) => {
            const resId =
              item?.studentId ??
              item?.student?.studentId ??
              item?.student?.id ??
              item?.id;
            if (resId === undefined || resId === null) return false;
            const strId = resId.toString().trim();
            return (
              strId === trimmedTerm ||
              strId === normalizedQuery ||
              toBengaliDigits(strId) === trimmedTerm
            );
          });
        }

        // প্রতিটি কুয়েরির জন্য ইউনিক স্টুডেন্ট শিট নিশ্চিত করা (ডুপ্লিকেট কার্ড রেন্ডারিং রোধ)
        const seenSheetIds = new Set();
        const uniqueFinalResults = finalResults.filter((item) => {
          const resId =
            item?.studentId ??
            item?.student?.studentId ??
            item?.student?.id ??
            item?.id;
          const key =
            resId !== undefined && resId !== null
              ? toEnglishDigits(resId.toString().trim())
              : "";
          if (!key) return true;
          if (seenSheetIds.has(key)) return false;
          seenSheetIds.add(key);
          return true;
        });

        setActiveExamType(exam);
        setActiveYear(yr);
        setActiveClass(cls || "all");
        setActiveResultMode(mode);
        setResultSheets(uniqueFinalResults);

        if (uniqueFinalResults.length === 0) {
          setResultsError(
            unpublishedMsg || "কোনো ফলাফল পাওয়া যায়নি (No result found)।",
          );
        }

        if (syncUrl) {
          // ব্রাউজার অ্যাড্রেস বার URL-এ tab, roll, class, year, exam সিঙ্ক্রোনাইজ করা (পেজ রিলোড ছাড়া)
          const nextParams = new URLSearchParams(searchParams.toString());
          nextParams.delete("studentId");
          nextParams.delete("id");
          nextParams.delete("search");
          nextParams.delete("examType");
          nextParams.delete("session");
          nextParams.delete("type");
          nextParams.delete("mode");

          nextParams.set("tab", mode === "ct" ? "ct" : "term");

          if (trimmedTerm) {
            nextParams.set("roll", trimmedTerm);
          } else {
            nextParams.delete("roll");
          }

          if (hasClass) {
            nextParams.set("class", cls);
          } else {
            nextParams.delete("class");
          }

          if (yr) {
            nextParams.set("year", yr);
          }

          if (exam) {
            nextParams.set("exam", exam);
          }

          const nextQueryStr = nextParams.toString();
          if (nextQueryStr !== searchParams.toString()) {
            router.replace(`${pathname}?${nextQueryStr}`, { scroll: false });
          }
        }
      } catch (err) {
        if (currentReqId !== requestIdRef.current) return;
        console.error("Error fetching student results:", err);
        setStudents([]);
        setSelectedIds([]);
        setResultSheets([]);
        setError("সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।");
        setResultsError("রেজাল্ট লোড করতে সমস্যা হয়েছে।");
      } finally {
        if (currentReqId === requestIdRef.current) {
          setLoading(false);
          setLoadingResults(false);
        }
      }
    },
    [pathname, router, searchParams],
  );

  // সরাসরি শেয়ারেবল URL (/results?tab=ct বা /results?tab=ct&roll=...&exam=...&year=...) থেকে ভিজিট করলে ট্যাব সিঙ্ক ও স্বয়ংক্রিয়ভাবে ফলাফল লোড করা
  useEffect(() => {
    const urlRoll = (
      searchParams.get("roll") ||
      searchParams.get("studentId") ||
      searchParams.get("id") ||
      searchParams.get("search") ||
      ""
    ).trim();
    const urlClass = (searchParams.get("class") || "").trim();
    const urlYear = (
      searchParams.get("year") ||
      searchParams.get("session") ||
      ""
    ).trim();
    const urlExam = (
      searchParams.get("exam") ||
      searchParams.get("examType") ||
      ""
    ).trim();
    const effectiveMode = resolveTabFromSearchParams(searchParams);

    setResultMode(effectiveMode);
    setActiveResultMode(effectiveMode);
    if (urlYear) {
      setTargetYear(urlYear);
    }
    if (urlExam) {
      setExamType(urlExam);
    }

    if (!urlRoll && (!urlClass || urlClass === "all")) {
      return;
    }

    const effectiveYear = urlYear || "২০২৬";
    const effectiveExam = urlExam || "২য় সাময়িক পরীক্ষা";
    const effectiveClass = urlClass || "all";
    const queryKey = `${toEnglishDigits(urlRoll)}|${effectiveYear}|${effectiveExam}|${effectiveClass}|${effectiveMode}`;

    if (lastExecutedQueryRef.current === queryKey) {
      return;
    }

    lastExecutedQueryRef.current = queryKey;
    setSearchInput(urlRoll);
    setSearchTerm(urlRoll);
    setTargetYear(effectiveYear);
    setExamType(effectiveExam);
    setSelectedClass(effectiveClass);

    executeSearch({
      term: urlRoll,
      cls: effectiveClass,
      yr: effectiveYear,
      exam: effectiveExam,
      mode: effectiveMode,
      syncUrl: true,
    });
  }, [searchParams, executeSearch, resolveTabFromSearchParams]);

  // সার্চ হ্যান্ডলার (শুধুমাত্র ফর্ম সাবমিট / খুঁজুন বাটন ক্লিকে কল হবে)
  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    if (!trimmed && (!selectedClass || selectedClass === "all")) {
      setError(
        "অনুগ্রহ করে শিক্ষার্থীর আইডি লিখুন অথবা একটি শ্রেণী নির্বাচন করুন।",
      );
      setResultSheets([]);
      setSelectedIds([]);
      setResultsError(null);
      return;
    }

    const queryKey = `${toEnglishDigits(trimmed)}|${targetYear}|${examType}|${selectedClass}|${resultMode}`;
    lastExecutedQueryRef.current = queryKey;

    setError(null);
    setResultsError(null);
    setSearchTerm(trimmed);
    setActiveResultMode(resultMode);

    executeSearch({
      term: trimmed,
      cls: selectedClass,
      yr: targetYear,
      exam: examType,
      mode: resultMode,
      syncUrl: true,
    });
  };

  // টার্ম ও সিটি ফলাফলের মাঝে তাৎক্ষণিক ট্যাব পরিবর্তন ও ব্রাউজার অ্যাড্রেস বার URL (?tab=term / ?tab=ct) সিঙ্ক
  const handleSwitchMode = (newMode) => {
    const normalizedMode = newMode === "ct" ? "ct" : "term";
    setResultMode(normalizedMode);
    setActiveResultMode(normalizedMode);

    if (lastExecutedQueryRef.current) {
      const parts = lastExecutedQueryRef.current.split("|");
      if (parts.length === 5) {
        parts[4] = normalizedMode;
        lastExecutedQueryRef.current = parts.join("|");
      }
    }

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("type");
    nextParams.delete("mode");
    nextParams.set("tab", normalizedMode);

    router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
  };

  // শেয়ারেবল ফলাফল লিংক তৈরি ও ক্লিপবোর্ডে কপি করা
  const handleCopyShareLink = async () => {
    if (typeof window === "undefined") return;
    try {
      const shareParams = new URLSearchParams();
      const currentMode =
        resultSheets.length > 0 ? activeResultMode : resultMode;
      shareParams.set("tab", currentMode === "ct" ? "ct" : "term");

      const primarySheet = resultSheets[0];
      const displayedId = String(
        searchTerm ||
        primarySheet?.studentId ||
        primarySheet?.student?.studentId ||
        searchInput.trim() ||
        searchParams.get("roll") ||
        "",
      ).trim();

      const effectiveClass =
        resultSheets.length > 0
          ? activeClass
          : selectedClass !== "all"
            ? selectedClass
            : (searchParams.get("class") || "").trim();
      const effectiveYear =
        resultSheets.length > 0
          ? activeYear
          : displayedId || (effectiveClass && effectiveClass !== "all")
            ? targetYear
            : (searchParams.get("year") || "").trim();
      const effectiveExam =
        resultSheets.length > 0
          ? activeExamType
          : displayedId || (effectiveClass && effectiveClass !== "all")
            ? examType
            : (searchParams.get("exam") || "").trim();

      if (displayedId) {
        shareParams.set("roll", displayedId);
      }
      if (effectiveClass && effectiveClass !== "all") {
        shareParams.set("class", effectiveClass);
      }
      if (effectiveYear) {
        shareParams.set("year", effectiveYear);
      }
      if (effectiveExam) {
        shareParams.set("exam", effectiveExam);
      }

      const qs = shareParams.toString();
      const shareUrl = `${window.location.origin}${pathname}${qs ? `?${qs}` : ""}`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setCopiedLink(true);
      toast.success("ফলাফলের লিংক কপি করা হয়েছে! (Copied!)");
      setTimeout(() => {
        setCopiedLink(false);
      }, 2500);
    } catch (err) {
      console.error("Failed to copy result link:", err);
      toast.error("লিংক কপি করা সম্ভব হয়নি।");
    }
  };

  // একাধিক শিক্ষার্থীর রেজাল্ট একসাথে লোড হলে মোট নম্বরের (Total Marks) ভিত্তিতে মেধাস্থান হিসাব
  const clientMeritMap = useMemo(() => {
    const map = new Map();
    if (!resultSheets || resultSheets.length === 0) return map;

    const passed = [];
    resultSheets.forEach((sheet) => {
      const resultsList = deduplicateSubjects(sheet.results || []);
      const summary = calculateSummary(resultsList, activeExamType);
      const isPassed =
        summary.status === "উত্তীর্ণ" &&
        summary.grade !== "F" &&
        summary.grade !== "অনুঃ" &&
        summary.grade !== "অসম্পূর্ণ";

      const totalMarks =
        resultsList.reduce((sum, item) => {
          const m = getMarkForExamType(item, activeExamType);
          return typeof m === "number" ? sum + m : sum;
        }, 0) || 0;

      const sid = String(sheet.studentId || sheet.student?.studentId || "");
      const rollNum =
        parseInt(
          sheet.student?.roll || sheet.student?.officeUse?.rollNumber,
          10,
        ) || 999999;
      const gpaNum = parseFloat(summary.gpa) || 0;

      if (isPassed && sid) {
        passed.push({
          studentId: sid,
          totalMarks,
          gpa: gpaNum,
          roll: rollNum,
        });
      }
    });

    // ১. মোট নম্বর (Total Marks) এর ভিত্তিতে অবতরণ ক্রমে সর্টিং
    passed.sort((a, b) => {
      const markDiff = b.totalMarks - a.totalMarks;
      if (markDiff !== 0) return markDiff;
      const gpaDiff = b.gpa - a.gpa;
      if (Math.abs(gpaDiff) > 0.001) return gpaDiff;
      return a.roll - b.roll;
    });

    // ২. সমসংখ্যক মোট নম্বরে একই মেধাস্থান নির্ধারণ
    passed.forEach((st, idx) => {
      if (idx > 0) {
        const prev = passed[idx - 1];
        if (st.totalMarks === prev.totalMarks) {
          map.set(st.studentId, map.get(prev.studentId));
        } else {
          map.set(st.studentId, idx + 1);
        }
      } else {
        map.set(st.studentId, 1);
      }
    });

    return map;
  }, [resultSheets, activeExamType]);

  // ক্লাস টেস্ট (সিটি / CT) একাধিক শিক্ষার্থী থাকলে মেধাস্থান হিসাব
  const clientCTMeritMap = useMemo(() => {
    const map = new Map();
    if (!resultSheets || resultSheets.length === 0) return map;

    const passed = [];
    resultSheets.forEach((sheet) => {
      const resultsList = deduplicateSubjects(sheet.results || []);
      const summary = calculateCTSummary(resultsList, activeExamType);
      const isPassed =
        summary.status === "উত্তীর্ণ" &&
        summary.grade !== "F" &&
        summary.grade !== "অনুঃ" &&
        summary.grade !== "অসম্পূর্ণ";

      const sid = String(sheet.studentId || sheet.student?.studentId || "");
      const rollNum =
        parseInt(
          sheet.student?.roll || sheet.student?.officeUse?.rollNumber,
          10,
        ) || 999999;

      if (isPassed && sid) {
        passed.push({
          studentId: sid,
          totalMarks: summary.numericTotalObtained || 0,
          roll: rollNum,
        });
      }
    });

    passed.sort((a, b) => {
      const markDiff = b.totalMarks - a.totalMarks;
      if (markDiff !== 0) return markDiff;
      return a.roll - b.roll;
    });

    passed.forEach((st, idx) => {
      if (idx > 0) {
        const prev = passed[idx - 1];
        if (st.totalMarks === prev.totalMarks) {
          map.set(st.studentId, map.get(prev.studentId));
        } else {
          map.set(st.studentId, idx + 1);
        }
      } else {
        map.set(st.studentId, 1);
      }
    });

    return map;
  }, [resultSheets, activeExamType]);

  const printRef = useRef(null);

  const reactToPrintFn = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Result-Sheet-${formatExamDisplayLabel(activeExamType)}-${activeYear || ""}`,
    pageStyle: RESULT_SHEET_PAGE_STYLE,
  });

  const handlePrint = () => {
    if (!printRef.current) return;
    reactToPrintFn();
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-2.5 sm:px-4 pt-0 pb-2 sm:pb-3 print:p-0 print:max-w-none text-[#1E293B]">
      {/* ----------------- ১. স্মার্ট কন্ট্রোল প্যানেল (প্রিন্টে হাইড থাকবে) ----------------- */}
      <div className="print:hidden mb-4 sm:mb-5 font-sans">
        <div className="bg-white rounded-3xl border border-[#90CAF9]/80 shadow-lg shadow-[#0D47A1]/5 text-[#1E293B] relative overflow-hidden">
          {/* টপ অ্যাকসেন্ট বার ও ব্যাকগ্রাউন্ড গ্লো */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#0D47A1] via-[#2196F3] to-[#90CAF9]" />
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#2196F3]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#0D47A1]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="p-3 sm:p-4 relative z-10">
            {/* হেডার ও রেজাল্ট মোড সুইচার এক লাইনে */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#E3F2FD]">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#0D47A1] bg-[#E3F2FD] border border-[#90CAF9] px-3 py-1 rounded-full mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2196F3] animate-pulse" />
                  <span>রেজাল্ট ম্যানেজমেন্ট প্যানেল</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0D47A1]">
                  রেজাল্ট শিট জেনারেটর
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  শিক্ষার্থীর আইডি, শিক্ষাবর্ষ ও পরীক্ষা নির্বাচন করে তাৎক্ষণিক মার্কসীট তৈরি ও প্রিন্ট করুন
                </p>
              </div>

              {/* ১. ফলাফলের ধরন (Segmented Pill Switcher + Copy Link) */}
              <div className="flex flex-col sm:items-end gap-1.5">
                <span className="text-[11px] font-bold text-[#0D47A1]/80 uppercase tracking-wider">
                  ফলাফলের ধরন
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex p-1 bg-[#E3F2FD]/80 rounded-2xl border border-[#90CAF9] shadow-inner">
                    <button
                      type="button"
                      onClick={() => handleSwitchMode("term")}
                      className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${resultMode === "term"
                          ? "bg-[#0D47A1] text-white shadow-md shadow-[#0D47A1]/20"
                          : "text-[#0D47A1] hover:bg-white/70"
                        }`}
                    >
                      <span>📑</span>
                      <span>সাময়িক পরীক্ষা</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSwitchMode("ct")}
                      className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${resultMode === "ct"
                          ? "bg-[#2196F3] text-white shadow-md shadow-[#2196F3]/25"
                          : "text-[#0D47A1] hover:bg-white/70"
                        }`}
                    >
                      <span>📝</span>
                      <span>ক্লাস টেস্ট (CT)</span>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyShareLink}
                    aria-label="Copy current tab shareable link"
                    title="শেয়ারেবল লিংক কপি করুন"
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${copiedLink
                        ? "bg-emerald-600 text-white border-emerald-500 shadow-sm"
                        : "bg-[#E3F2FD]/60 hover:bg-[#E3F2FD] text-[#0D47A1] border-[#90CAF9]"
                      }`}
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>কপি হয়েছে!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5 stroke-[2.2]" />
                        <span>লিংক কপি</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* এরর নোটিফিকেশন */}
            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-sm font-medium flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-base shrink-0">
                  ⚠️
                </span>
                <span>{error}</span>
              </div>
            )}

            {/* ২. ফিল্টার ও সার্চ গ্রিড */}
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
                {/* শিক্ষার্থী আইডি (৪ কলাম) */}
                <div className="lg:col-span-4">
                  <label className="flex items-center justify-between text-xs font-extrabold text-[#0D47A1] mb-1.5 px-1">
                    <span>শিক্ষার্থীর আইডি</span>
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                      ঐচ্ছিক
                    </span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder="যেমন: 04348 (খালি রাখলে সবার আসবে)"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="w-full bg-[#E3F2FD]/25 hover:bg-[#E3F2FD]/40 focus:bg-white text-[#1E293B] placeholder-slate-400 border border-[#90CAF9] rounded-2xl py-3 pl-4 pr-9 text-sm font-medium focus:outline-none focus:border-[#2196F3] focus:ring-4 focus:ring-[#2196F3]/15 transition-all"
                    />
                    {searchInput && (
                      <button
                        type="button"
                        onClick={() => setSearchInput("")}
                        title="মুছুন"
                        className="absolute right-3 text-slate-400 hover:text-rose-500 text-xs font-bold p-1 cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* শিক্ষাবর্ষ (৩ কলাম) */}
                <div className="lg:col-span-3">
                  <label className="block text-xs font-extrabold text-[#0D47A1] mb-1.5 px-1">
                    শিক্ষাবর্ষ
                  </label>
                  <select
                    value={targetYear}
                    onChange={(e) => setTargetYear(e.target.value)}
                    className="w-full bg-[#E3F2FD]/25 hover:bg-[#E3F2FD]/40 focus:bg-white text-[#1E293B] border border-[#90CAF9] rounded-2xl py-3 px-3.5 text-sm font-semibold focus:outline-none focus:border-[#2196F3] focus:ring-4 focus:ring-[#2196F3]/15 transition-all cursor-pointer"
                  >
                    {sessionYears.map((year) => (
                      <option
                        key={year}
                        value={year}
                        className="bg-white text-[#1E293B]"
                      >
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* পরীক্ষার নাম (৩ কলাম) */}
                <div className="lg:col-span-3">
                  <label className="block text-xs font-extrabold text-[#0D47A1] mb-1.5 px-1">
                    পরীক্ষার নাম
                  </label>
                  <select
                    value={examType}
                    onChange={(e) => setExamType(e.target.value)}
                    className="w-full bg-[#E3F2FD]/25 hover:bg-[#E3F2FD]/40 focus:bg-white text-[#1E293B] border border-[#90CAF9] rounded-2xl py-3 px-3.5 text-sm font-semibold focus:outline-none focus:border-[#2196F3] focus:ring-4 focus:ring-[#2196F3]/15 transition-all cursor-pointer"
                  >
                    <option
                      value="১ম সাময়িক পরীক্ষা"
                      className="bg-white text-[#1E293B]"
                    >
                      ১ম সাময়িক পরীক্ষা
                    </option>
                    <option
                      value="২য় সাময়িক পরীক্ষা"
                      className="bg-white text-[#1E293B]"
                    >
                      ২য় সাময়িক পরীক্ষা
                    </option>
                    <option
                      value="বার্ষিক পরীক্ষা"
                      className="bg-white text-[#1E293B]"
                    >
                      ৩য় সাময়িক পরীক্ষা
                    </option>
                  </select>
                </div>

                {/* খুঁজুন বাটন (২ কলাম) */}
                <div className="lg:col-span-2">
                  <button
                    type="submit"
                    className="btn-primary w-full py-3 px-6 rounded-2xl text-sm font-extrabold bg-gradient-to-r from-[#0D47A1] to-[#2196F3] hover:from-[#0D47A1] hover:to-[#0D47A1] text-white shadow-md shadow-[#2196F3]/25 flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <Search className="w-4 h-4 stroke-[2.5]" />
                    <span>খুঁজুন</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ----------------- ২. লোডিং, এরর ও রেজাল্ট শিট প্রিভিউ ----------------- */}
      {loadingResults || loading ? (
        <div className="print:hidden w-full max-w-[210mm] mx-auto bg-white rounded-3xl p-3 sm:p-4 border border-[#90CAF9]/70 shadow-sm space-y-4 animate-pulse">
          <div className="flex items-center justify-between border-b border-[#E3F2FD] pb-4">
            <div className="w-16 h-16 rounded-2xl bg-[#E3F2FD]" />
            <div className="space-y-2 flex-1 max-w-xs mx-auto text-center">
              <div className="h-5 bg-[#E3F2FD] rounded-full w-32 mx-auto" />
              <div className="h-3.5 bg-slate-100 rounded-full w-48 mx-auto" />
            </div>
            <div className="w-24 h-16 rounded-xl bg-[#E3F2FD]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-4 bg-slate-100 rounded-lg" />
            <div className="h-4 bg-slate-100 rounded-lg" />
            <div className="h-4 bg-slate-100 rounded-lg" />
            <div className="h-4 bg-slate-100 rounded-lg" />
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-9 bg-[#E3F2FD]/70 rounded-xl w-full" />
            <div className="h-8 bg-slate-50 rounded-lg w-full" />
            <div className="h-8 bg-slate-50 rounded-lg w-full" />
            <div className="h-8 bg-slate-50 rounded-lg w-full" />
          </div>
          <p className="text-center text-xs font-bold text-[#0D47A1] pt-2">
            রেজাল্ট শিট প্রস্তুত হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...
          </p>
        </div>
      ) : resultsError ? (
        <div className="print:hidden text-center py-6 bg-white rounded-3xl p-3 sm:p-4 max-w-xl mx-auto shadow-sm border border-rose-200 text-rose-700 font-bold text-sm sm:text-base flex flex-col items-center gap-3">
          <span className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-2xl">
            ⚠️
          </span>
          <span>{resultsError}</span>
        </div>
      ) : resultSheets.length > 0 ? (
        <>
          {/* স্মার্ট অ্যাকশন বার (শেয়ার / লিংক কপি ও প্রিন্ট) */}
          <div className="print:hidden w-full max-w-[210mm] mx-auto mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#063226] via-[#04241b] to-[#021812] px-3.5 sm:px-4 py-3 rounded-2xl border border-emerald-600/30 shadow-lg text-emerald-50">
            <div className="flex items-center justify-between sm:justify-start gap-2.5 flex-wrap">
              {/* শিট মোড টগল (টার্ম বনাম সিটি) */}
              <div className="inline-flex p-1 bg-[#031d16] rounded-xl border border-emerald-700/60 gap-1">
                <button
                  type="button"
                  onClick={() => handleSwitchMode("term")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${activeResultMode === "term"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow border border-emerald-400/50"
                      : "text-emerald-300 hover:text-white hover:bg-emerald-800/40"
                    }`}
                >
                  <span>📑</span>
                  <span>টার্ম শিট</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchMode("ct")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${activeResultMode === "ct"
                      ? "bg-gradient-to-r from-amber-400 to-amber-500 text-emerald-950 font-extrabold shadow border border-amber-300"
                      : "text-emerald-300 hover:text-white hover:bg-emerald-800/40"
                    }`}
                >
                  <span>📝</span>
                  <span>সিটি (CT) শিট</span>
                </button>
              </div>

              {/* মোট শিট কাউন্টার ব্যাজ */}
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-emerald-900/70 text-emerald-200 border border-emerald-600/40 px-3 py-1.5 rounded-xl">
                <span>মোট শিট:</span>
                <span className="text-amber-300 font-extrabold">
                  {toBengaliDigits(resultSheets.length)} টি
                </span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleCopyShareLink}
                aria-label="Copy shareable result link"
                className={`px-3.5 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 border cursor-pointer ${copiedLink
                    ? "bg-emerald-600 text-white border-emerald-400/60 shadow-md shadow-emerald-900/40"
                    : "bg-[#083c2e] hover:bg-emerald-800/80 text-amber-300 border-amber-400/40 active:scale-95"
                  }`}
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>কপি হয়েছে!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 stroke-[2.2]" />
                    <span>লিংক কপি</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-3.5 sm:px-4 py-2 rounded-xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-emerald-950 transition-all duration-200 flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
              >
                <span>🖨️</span>
                <span>প্রিন্ট করুন</span>
              </button>
            </div>
          </div>

          {/* ----------------- প্রিন্ট এরিয়া কন্টেইনার ----------------- */}
          <div
            ref={printRef}
            className="print-area-container flex flex-col items-center gap-4 sm:gap-5 print:block print:gap-0"
          >
            {resultSheets.map((resData, index) => {
              const currentStudentId =
                resData.studentId ||
                resData.student?.studentId ||
                resData.student?.id ||
                resData.student;

              const matchedStudent =
                students.find(
                  (s) =>
                    (s.studentId ?? s.id)?.toString().trim() ===
                    String(currentStudentId).trim(),
                ) || {};

              const student = {
                ...resData.student,
                ...matchedStudent,
              };

              const studentClass =
                student.class ||
                matchedStudent.divisionAcademy?.class ||
                matchedStudent.divisionHifz?.class ||
                matchedStudent.divisionPreHifz?.class ||
                resData.student?.class ||
                "প্রযোজ্য নয়";

              const studentName =
                student.studentNameBangla ||
                student.studentNameEnglish ||
                student.name ||
                resData.student?.name ||
                "প্রযোজ্য নয়";

              const studentRoll =
                student.roll && student.roll !== "N/A"
                  ? student.roll
                  : student.officeUse?.rollNumber ||
                  resData.student?.roll ||
                  "প্রযোজ্য নয়";

              const studentFatherName =
                student.fatherNameBangla ||
                student.guardianName ||
                resData.student?.fatherNameBangla ||
                "প্রযোজ্য নয়";

              const studentThana =
                student.currentAddress?.thana ||
                resData.student?.currentAddress?.thana ||
                "চুনারুঘাট";

              const studentDistrict =
                student.currentAddress?.district ||
                resData.student?.currentAddress?.district ||
                "হবিগঞ্জ";

              const studentPhoto =
                student.studentImage ||
                student.profilePhoto ||
                resData.student?.studentImage ||
                null;

              const results = deduplicateSubjects(resData.results || []);

              /* ================= CT RESULT SHEET ================= */
              if (activeResultMode === "ct") {
                const ctSummary = calculateCTSummary(results, activeExamType);
                const ctStudentMerit =
                  clientCTMeritMap.get(String(currentStudentId)) || "-";

                return (
                  <div
                    key={`ct-${student.studentId || currentStudentId || index}`}
                    className="page-break relative bg-white box-border flex flex-col justify-between text-black w-full max-w-[210mm] min-h-0 p-3 sm:p-4 print:p-0 print:w-[210mm] print:max-w-[210mm] print:min-h-[297mm] print:h-[297mm] shadow-xl ring-1 ring-slate-200 print:shadow-none print:ring-0 rounded-sm my-1 overflow-hidden font-bornomala"
                  >
                    {/* কার্ডের গোল্ডেন ট্রিপল আউটার বর্ডার */}
                    <div className="w-full h-full flex-1 border-[3px] border-[#C5A059] p-1 box-border relative flex flex-col">
                      <div className="w-full h-full flex-1 border border-[#C5A059] p-2 sm:p-2.5 print:p-2 flex flex-col justify-between box-border relative overflow-hidden">
                        {/* ব্যাকগ্রাউন্ড ওয়াটারমার্ক */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-[0.05]">
                          <div className="w-[220px] h-[220px] sm:w-[380px] sm:h-[380px] print:w-[380px] print:h-[380px] rounded-full overflow-hidden flex items-center justify-center">
                            <Image
                              src={siteConfig.assets.logo}
                              alt="Watermark Logo"
                              width={420}
                              height={420}
                              priority
                              className="w-full h-full object-cover scale-[1.05] transform-gpu"
                            />
                          </div>
                        </div>

                        {/* মূল কন্টেন্ট */}
                        <div className="relative z-10 flex-1 flex flex-col justify-between">
                          <div className="flex-1 flex flex-col">
                            <div>
                              <PrintInstitutionalHeader
                                bannerSrc="/banner_routine.png"
                                logoWrapperClassName="w-14 h-14 sm:w-20 sm:h-20 md:w-28 md:h-28 print:!w-28 print:!h-28 rounded-full overflow-hidden flex-shrink-0 bg-transparent relative flex items-center justify-center -mr-1 sm:-mr-2 print:-mr-2"
                                logoWidth={200}
                                logoHeight={200}
                                logoClassName="w-full h-full object-cover scale-[1.08] transform-gpu"
                                bannerWidth={1000}
                                bannerHeight={400}
                                bannerClassName="w-full h-auto max-h-18 sm:max-h-24 md:max-h-32 object-contain sm:object-fill mx-auto print:max-h-32 print:object-fill"
                              />

                              {/* ডাবল গোল্ডেন লাইন সেপারেটর */}
                              <div className="border-t-2 border-b border-[#C5A059] my-1.5 py-0.5"></div>

                              {/* রেজাল্ট ব্যাজ ও হেডলাইন */}
                              <div className="flex flex-col sm:flex-row print:flex-row justify-between items-center gap-2 my-1.5 px-0.5">
                                {/* বাম পাশে শিক্ষার্থীর ছবি */}
                                <div className="w-20 h-24 sm:w-16 sm:h-18 print:w-16 print:h-18 border-2 border-[#C5A059]/70 rounded-lg flex items-center justify-center bg-[#fcf8ed] overflow-hidden text-[10px] sm:text-[9px] print:text-[9px] text-gray-500 font-bold shadow-xs shrink-0">
                                  {studentPhoto ? (
                                    <Image
                                      src={studentPhoto}
                                      alt="Student"
                                      width={56}
                                      height={64}
                                      priority
                                      unoptimized
                                      className="object-cover w-full h-full"
                                    />
                                  ) : (
                                    "ছবি নেই"
                                  )}
                                </div>

                                {/* মাঝখানে ক্যাপসুল টাইটেল */}
                                <div className="text-center">
                                  <div className="bg-[#043e30] text-amber-300 px-5 py-1 rounded-full inline-block font-bold text-xs tracking-wide shadow-sm border border-[#C5A059]/40">
                                    ক্লাস টেস্ট (CT) ফলাফল বিবরণী
                                  </div>
                                  <p className="text-xs sm:text-[11px] print:text-[11px] font-bold text-gray-800 mt-1">
                                    {formatExamDisplayLabel(activeExamType)} -{" "}
                                    {toBengaliDigits(
                                      (resData.year || "")
                                        .split(/[-–/]/)[0]
                                        .trim(),
                                    )}
                                  </p>
                                  <p className="text-xs sm:text-[11px] print:text-[11px] font-bold text-gray-800">
                                    শ্রেণি: {studentClass}
                                  </p>
                                </div>

                                {/* ডান পাশে সিটি গ্রেডিং স্কেল বিবরণী */}
                                <div className="w-full sm:w-auto print:w-auto flex justify-center sm:justify-end print:justify-end overflow-x-auto print:overflow-visible">
                                  <table className="border-collapse border border-slate-600 text-[9.5px] sm:text-[7px] print:text-[7px] leading-tight text-center bg-white shadow-xs">
                                    <thead>
                                      <tr className="bg-[#043e30] text-amber-300 font-bold">
                                        <th className="border border-slate-500 px-1 py-0.5 whitespace-nowrap">
                                          নম্বর (২০)
                                        </th>
                                        <th className="border border-slate-500 px-0.5 py-0.5 whitespace-nowrap">
                                          গ্রেড
                                        </th>
                                        <th className="border border-slate-500 px-1 py-0.5 whitespace-nowrap">
                                          মান
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td className="border border-slate-400 px-1 py-0">
                                          ১৬-২০ (৮০-১০০%)
                                        </td>
                                        <td className="border border-slate-400 px-0.5 py-0 font-bold">
                                          A+
                                        </td>
                                        <td className="border border-slate-400 px-1 py-0">
                                          মুমতাজ
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="border border-slate-400 px-1 py-0">
                                          ১৪-১৫.৯ (৭০-৭৯%)
                                        </td>
                                        <td className="border border-slate-400 px-0.5 py-0 font-bold">
                                          A
                                        </td>
                                        <td className="border border-slate-400 px-1 py-0">
                                          জায়্যিদ জিদ্দান
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="border border-slate-400 px-1 py-0">
                                          ১২-১৩.৯ (৬০-৬৯%)
                                        </td>
                                        <td className="border border-slate-400 px-0.5 py-0 font-bold">
                                          A-
                                        </td>
                                        <td className="border border-slate-400 px-1 py-0">
                                          জায়্যিদ
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="border border-slate-400 px-1 py-0">
                                          ১০-১১.৯ (৫০-৫৯%)
                                        </td>
                                        <td className="border border-slate-400 px-0.5 py-0 font-bold">
                                          B
                                        </td>
                                        <td className="border border-slate-400 px-1 py-0">
                                          মাকবুল
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="border border-slate-400 px-1 py-0">
                                          ৮-৯.৯ (৪০-৪৯%)
                                        </td>
                                        <td className="border border-slate-400 px-0.5 py-0 font-bold">
                                          C
                                        </td>
                                        <td className="border border-slate-400 px-1 py-0">
                                          উত্তীর্ণ
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="border border-slate-400 px-1 py-0">
                                          ০-৭.৯ (&lt;৪০%)
                                        </td>
                                        <td className="border border-slate-400 px-0.5 py-0 font-bold text-red-600">
                                          F
                                        </td>
                                        <td className="border border-slate-400 px-1 py-0 text-red-600">
                                          রাসেব
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>

                              {/* পরীক্ষার্থীর ডট ডট তথ্যাবলী */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-x-4 gap-y-1.5 sm:gap-y-1 print:gap-y-1 text-xs sm:text-[11px] print:text-[11px] my-2 px-0.5">
                                <div className="flex items-end">
                                  <span className="font-bold w-24 sm:w-20 print:w-20 shrink-0 text-gray-700">
                                    পরীক্ষার্থীর নাম:
                                  </span>
                                  <span className="font-bold border-b border-dashed border-gray-400 flex-1 truncate">
                                    {studentName}
                                  </span>
                                </div>
                                <div className="flex items-end">
                                  <span className="font-bold w-24 sm:w-18 print:w-18 shrink-0 text-gray-700">
                                    আইডি:
                                  </span>
                                  <span className="font-bold border-b border-dashed border-gray-400 flex-1">
                                    {toBengaliDigits(student.studentId)}
                                  </span>
                                </div>
                                <div className="flex items-end">
                                  <span className="font-bold w-24 sm:w-20 print:w-20 shrink-0 text-gray-700">
                                    পিতার নাম:
                                  </span>
                                  <span className="border-b border-dashed border-gray-400 flex-1 truncate">
                                    {studentFatherName}
                                  </span>
                                </div>
                                <div className="flex items-end">
                                  <span className="font-bold w-24 sm:w-18 print:w-18 shrink-0 text-gray-700">
                                    রোল নং:
                                  </span>
                                  <span className="border-b border-dashed border-gray-400 flex-1">
                                    {studentRoll !== "প্রযোজ্য নয়"
                                      ? toBengaliDigits(studentRoll)
                                      : "প্রযোজ্য নয়"}
                                  </span>
                                </div>
                                <div className="flex items-end">
                                  <span className="font-bold w-24 sm:w-20 print:w-20 shrink-0 text-gray-700">
                                    উপজেলা:
                                  </span>
                                  <span className="border-b border-dashed border-gray-400 flex-1">
                                    {studentThana}
                                  </span>
                                </div>
                                <div className="flex items-end">
                                  <span className="font-bold w-24 sm:w-18 print:w-18 shrink-0 text-gray-700">
                                    জেলা:
                                  </span>
                                  <span className="border-b border-dashed border-gray-400 flex-1">
                                    {studentDistrict}
                                  </span>
                                </div>
                                <div className="flex items-end">
                                  <span className="font-bold w-24 sm:w-20 print:w-20 shrink-0 text-gray-700">
                                    শ্রেণি:
                                  </span>
                                  <span className="border-b border-dashed border-gray-400 flex-1 truncate">
                                    {studentClass}
                                  </span>
                                </div>
                                <div className="flex items-end">
                                  <span className="font-bold w-24 sm:w-18 print:w-18 shrink-0 text-gray-700">
                                    সিটি মেধাস্থান:
                                  </span>
                                  <span className="border-b border-dashed border-gray-400 flex-1 font-bold text-[#043e30]">
                                    {ctStudentMerit && ctStudentMerit !== "-"
                                      ? toBengaliDigits(ctStudentMerit)
                                      : "-"}
                                  </span>
                                </div>
                              </div>

                              {/* টেবিল হেডার টাইটেল */}
                              <div className="text-center font-bold text-xs my-1.5 text-[#043e30] tracking-wide">
                                ক্লাস টেস্ট (CT) নম্বর বিবরণী
                              </div>
                            </div>

                            {/* সিটি নম্বর টেবিল */}
                            <div className="my-1 flex-shrink-0 w-full overflow-x-auto print:overflow-visible">
                              <table className="w-full min-w-[440px] sm:min-w-0 print:min-w-0 border-collapse border border-[#C5A059] text-center text-xs">
                                <thead>
                                  <tr className="bg-[#fcf8ed] font-bold text-gray-800 text-xs">
                                    <th className="border border-[#C5A059] p-1.5 w-12">
                                      ক্রমিক
                                    </th>
                                    <th className="border border-[#C5A059] p-1.5 text-left px-3">
                                      বিষয়
                                    </th>
                                    <th className="border border-[#C5A059] p-1.5 w-24">
                                      সিটি পূর্ণমান
                                    </th>
                                    <th className="border border-[#C5A059] p-1.5 w-28 font-bold">
                                      প্রাপ্ত নম্বর
                                    </th>
                                    <th className="border border-[#C5A059] p-1.5 w-32">
                                      গ্রেড / মন্তব্য
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {results.length === 0 ? (
                                    <tr>
                                      <td
                                        colSpan={5}
                                        className="p-3 text-center border border-[#C5A059]"
                                      >
                                        কোনো সিটি নম্বর পাওয়া যায়নি
                                      </td>
                                    </tr>
                                  ) : (
                                    results.map((item, idx) => {
                                      const ctData = getCTSubjectData(
                                        item,
                                        activeExamType,
                                      );
                                      return (
                                        <tr
                                          key={String(
                                            item.subjectCode ||
                                            item.subjectId ||
                                            item.subjectName ||
                                            formatSubjectName(item.subject) ||
                                            item.subject ||
                                            idx,
                                          ).trim()}
                                          className="border-b border-[#C5A059] odd:bg-white even:bg-[#fcf8ed]/45"
                                        >
                                          <td className="border border-[#C5A059] p-1.5">
                                            {toBengaliDigits(idx + 1)}
                                          </td>
                                          <td className="border border-[#C5A059] p-1.5 text-left px-3 font-semibold">
                                            {formatSubjectName(item.subject)}
                                          </td>
                                          <td className="border border-[#C5A059] p-1.5">
                                            {toBengaliDigits(ctData.fullMark)}
                                          </td>
                                          <td className="border border-[#C5A059] p-1.5 font-bold">
                                            {ctData.isAbsent ? (
                                              <span className="text-red-600 font-bold">
                                                অনুঃ
                                              </span>
                                            ) : typeof ctData.obtained ===
                                              "number" ? (
                                              toBengaliDigits(ctData.obtained)
                                            ) : (
                                              ctData.obtained
                                            )}
                                          </td>
                                          <td
                                            className={`border border-[#C5A059] p-1.5 font-bold ${ctData.grade === "F" ||
                                                ctData.isAbsent
                                                ? "text-red-600"
                                                : "text-[#043e30]"
                                              }`}
                                          >
                                            {ctData.remark}
                                          </td>
                                        </tr>
                                      );
                                    })
                                  )}
                                </tbody>
                              </table>
                            </div>

                            {/* সিটি সামারি সেকশন */}
                            <div className="mt-1.5 border border-[#C5A059] bg-[#fcf8ed] p-1.5 sm:p-2 print:p-1.5 rounded-sm flex-shrink-0">
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 print:grid-cols-6 gap-2 text-center text-xs font-bold text-gray-800 items-center">
                                <div className="bg-white/70 sm:bg-transparent print:bg-transparent rounded p-1 sm:p-0 print:p-0">
                                  <span className="block text-[10px] text-gray-600 font-normal">
                                    মোট পূর্ণমান
                                  </span>
                                  {ctSummary.totalFullMarks}
                                </div>
                                <div className="bg-white/70 sm:bg-transparent print:bg-transparent rounded p-1 sm:p-0 print:p-0">
                                  <span className="block text-[10px] text-gray-600 font-normal">
                                    মোট প্রাপ্ত নম্বর
                                  </span>
                                  {ctSummary.totalObtained}
                                </div>
                                <div className="bg-white/70 sm:bg-transparent print:bg-transparent rounded p-1 sm:p-0 print:p-0">
                                  <span className="block text-[10px] text-gray-600 font-normal">
                                    শতকরা হার
                                  </span>
                                  {ctSummary.percentage}
                                </div>
                                <div className="bg-white/70 sm:bg-transparent print:bg-transparent rounded p-1 sm:p-0 print:p-0">
                                  <span className="block text-[10px] text-gray-600 font-normal">
                                    গড় নম্বর
                                  </span>
                                  {ctSummary.average}
                                </div>
                                <div className="bg-[#043e30]/10 rounded-sm py-1 sm:py-0.5 print:py-0.5 border border-[#043e30]/20">
                                  <span className="block text-[10px] text-[#043e30] font-bold">
                                    সিটি মেধাস্থান
                                  </span>
                                  <span className="text-[#043e30] font-black">
                                    {ctStudentMerit && ctStudentMerit !== "-"
                                      ? toBengaliDigits(ctStudentMerit)
                                      : "-"}
                                  </span>
                                </div>
                                <div className="bg-white/70 sm:bg-transparent print:bg-transparent rounded p-1 sm:p-0 print:p-0">
                                  <span className="block text-[10px] text-gray-600 font-normal">
                                    মন্তব্য
                                  </span>
                                  <span
                                    className={`whitespace-nowrap ${ctSummary.grade === "F" ||
                                        ctSummary.grade === "অনুঃ"
                                        ? "text-red-600"
                                        : "text-[#043e30]"
                                      }`}
                                  >
                                    {ctSummary.remark || ctSummary.status || "-"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* ফুটার লেআউট */}
                          <div className="mt-3 md:mt-4 print:mt-auto flex-shrink-0 pt-1.5 relative z-10">
                            <PrintSignatures
                              principalTopClass="-top-2"
                              className="flex justify-between items-end my-1 px-1 sm:px-3 print:px-3 flex-shrink-0 gap-2"
                            />
                            <PrintSocialFooter />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              /* ================= TERM / ANNUAL MARKSHEET ================= */
              const summary = calculateSummary(results, activeExamType);
              const studentMerit =
                resData.meritPosition && resData.meritPosition !== "-"
                  ? resData.meritPosition
                  : clientMeritMap.get(String(currentStudentId)) || "-";

              return (
                <div
                  key={student.studentId || currentStudentId || index}
                  className="page-break relative bg-white box-border flex flex-col justify-between text-black w-full max-w-[210mm] min-h-0 p-3 sm:p-4 print:p-0 print:w-[210mm] print:max-w-[210mm] print:min-h-[297mm] print:h-[297mm] shadow-xl ring-1 ring-slate-200 print:shadow-none print:ring-0 rounded-sm my-1 overflow-hidden"
                >
                  {/* কার্ডের গোল্ডেন ট্রিপল আউটার বর্ডার */}
                  <div className="w-full h-full flex-1 border-[3px] border-[#C5A059] p-1 box-border relative flex flex-col">
                    <div className="w-full h-full flex-1 border border-[#C5A059] p-2 sm:p-2.5 print:p-2 flex flex-col justify-between box-border relative overflow-hidden">
                      {/* ব্যাকগ্রাউন্ড ওয়াটারমার্ক */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-[0.05]">
                        <div className="w-[220px] h-[220px] sm:w-[380px] sm:h-[380px] print:w-[380px] print:h-[380px] rounded-full overflow-hidden flex items-center justify-center">
                          <Image
                            src={siteConfig.assets.logo}
                            alt="Watermark Logo"
                            width={420}
                            height={420}
                            priority
                            className="w-full h-full object-cover scale-[1.05] transform-gpu"
                          />
                        </div>
                      </div>

                      {/* মূল কন্টেন্ট */}
                      <div className="relative z-10 flex-1 flex flex-col justify-between">
                        <div className="flex-1 flex flex-col">
                          <div>
                            <PrintInstitutionalHeader
                              bannerSrc="/banner_routine.png"
                              logoWrapperClassName="w-14 h-14 sm:w-20 sm:h-20 md:w-28 md:h-28 print:!w-28 print:!h-28 rounded-full overflow-hidden flex-shrink-0 bg-transparent relative flex items-center justify-center -mr-1 sm:-mr-2 print:-mr-2"
                              logoWidth={200}
                              logoHeight={200}
                              logoClassName="w-full h-full object-cover scale-[1.08] transform-gpu"
                              bannerWidth={1000}
                              bannerHeight={400}
                              bannerClassName="w-full h-auto max-h-18 sm:max-h-24 md:max-h-32 object-contain sm:object-fill mx-auto print:max-h-32 print:object-fill"
                            />

                            {/* ডাবল গোল্ডেন লাইন সেপারেটর */}
                            <div className="border-t-2 border-b border-[#C5A059] my-1.5 py-0.5"></div>

                            {/* রেজাল্ট ব্যাজ ও হেডলাইন */}
                            <div className="flex flex-col sm:flex-row print:flex-row justify-between items-center gap-2 my-1.5 px-0.5">
                              {/* বাম পাশে শিক্ষার্থীর ছবি */}
                              <div className="w-20 h-24 sm:w-16 sm:h-18 print:w-16 print:h-18 border-2 border-[#C5A059]/70 rounded-lg flex items-center justify-center bg-[#fcf8ed] overflow-hidden text-[10px] sm:text-[9px] print:text-[9px] text-gray-500 font-bold shadow-xs shrink-0">
                                {studentPhoto ? (
                                  <Image
                                    src={studentPhoto}
                                    alt="Student"
                                    width={56}
                                    height={64}
                                    priority
                                    className="object-cover w-full h-full"
                                  />
                                ) : (
                                  "ছবি নেই"
                                )}
                              </div>

                              {/* মাঝখানে ক্যাপসুল টাইটেল */}
                              <div className="text-center">
                                <div className="bg-[#043e30] text-white px-5 py-1 rounded-full inline-block font-bold text-xs tracking-wide shadow-sm border border-[#C5A059]/40">
                                  মার্কসীট
                                </div>
                                <p className="text-xs sm:text-[11px] print:text-[11px] font-bold text-gray-800 mt-1">
                                  {formatExamDisplayLabel(activeExamType)} -{" "}
                                  {toBengaliDigits(
                                    (resData.year || "").split(/[-–/]/)[0].trim(),
                                  )}
                                </p>
                                <p className="text-xs sm:text-[11px] print:text-[11px] font-bold text-gray-800">
                                  শ্রেণি: {studentClass}
                                </p>
                              </div>

                              {/* ডান পাশে গ্রেডিং সিস্টেম বিবরণী */}
                              <div className="w-full sm:w-auto print:w-auto flex justify-center sm:justify-end print:justify-end overflow-x-auto print:overflow-visible">
                                <table className="border-collapse border border-slate-600 text-[9.5px] sm:text-[7px] print:text-[7px] leading-tight text-center bg-white shadow-xs">
                                  <thead>
                                    <tr className="bg-[#043e30] text-amber-300 font-bold">
                                      <th className="border border-slate-500 px-1 py-0.5 whitespace-nowrap">
                                        নম্বর
                                      </th>
                                      <th className="border border-slate-500 px-0.5 py-0.5 whitespace-nowrap">
                                        গ্রেড
                                      </th>
                                      <th className="border border-slate-500 px-1 py-0.5 whitespace-nowrap">
                                        পয়েন্ট
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className="border border-slate-400 px-1 py-0">
                                        ৮০-১০০
                                      </td>
                                      <td className="border border-slate-400 px-0.5 py-0 font-bold">
                                        A+
                                      </td>
                                      <td className="border border-slate-400 px-1 py-0">
                                        ৫.০০
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border border-slate-400 px-1 py-0">
                                        ৭০-৭৯
                                      </td>
                                      <td className="border border-slate-400 px-0.5 py-0 font-bold">
                                        A
                                      </td>
                                      <td className="border border-slate-400 px-1 py-0">
                                        ৪.০০
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border border-slate-400 px-1 py-0">
                                        ৬০-৬৯
                                      </td>
                                      <td className="border border-slate-400 px-0.5 py-0 font-bold">
                                        A-
                                      </td>
                                      <td className="border border-slate-400 px-1 py-0">
                                        ৩.০০
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border border-slate-400 px-1 py-0">
                                        ৫০-৫৯
                                      </td>
                                      <td className="border border-slate-400 px-0.5 py-0 font-bold">
                                        B
                                      </td>
                                      <td className="border border-slate-400 px-1 py-0">
                                        ২.০০
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border border-slate-400 px-1 py-0">
                                        ৪০-৪৯
                                      </td>
                                      <td className="border border-slate-400 px-0.5 py-0 font-bold">
                                        C
                                      </td>
                                      <td className="border border-slate-400 px-1 py-0">
                                        ১.০০
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border border-slate-400 px-1 py-0">
                                        ০-৩৯
                                      </td>
                                      <td className="border border-slate-400 px-0.5 py-0 font-bold text-red-600">
                                        F
                                      </td>
                                      <td className="border border-slate-400 px-1 py-0">
                                        ০.০০
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {/* পরীক্ষার্থীর ডট ডট তথ্যাবলী */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-x-4 gap-y-1.5 sm:gap-y-1 print:gap-y-1 text-xs sm:text-[11px] print:text-[11px] my-2 px-0.5">
                              <div className="flex items-end">
                                <span className="font-bold w-24 sm:w-20 print:w-20 shrink-0 text-gray-700">
                                  পরীক্ষার্থীর নাম:
                                </span>
                                <span className="font-bold border-b border-dashed border-gray-400 flex-1 truncate">
                                  {studentName}
                                </span>
                              </div>

                              <div className="flex items-end">
                                <span className="font-bold w-24 sm:w-16 print:w-16 shrink-0 text-gray-700">
                                  আইডি:
                                </span>
                                <span className="font-bold border-b border-dashed border-gray-400 flex-1">
                                  {toBengaliDigits(student.studentId)}
                                </span>
                              </div>

                              <div className="flex items-end">
                                <span className="font-bold w-24 sm:w-20 print:w-20 shrink-0 text-gray-700">
                                  পিতার নাম:
                                </span>
                                <span className="border-b border-dashed border-gray-400 flex-1 truncate">
                                  {studentFatherName}
                                </span>
                              </div>

                              <div className="flex items-end">
                                <span className="font-bold w-24 sm:w-16 print:w-16 shrink-0 text-gray-700">
                                  রোল নং:
                                </span>
                                <span className="border-b border-dashed border-gray-400 flex-1">
                                  {studentRoll !== "প্রযোজ্য নয়"
                                    ? toBengaliDigits(studentRoll)
                                    : "প্রযোজ্য নয়"}
                                </span>
                              </div>

                              <div className="flex items-end">
                                <span className="font-bold w-24 sm:w-20 print:w-20 shrink-0 text-gray-700">
                                  উপজেলা:
                                </span>
                                <span className="border-b border-dashed border-gray-400 flex-1">
                                  {studentThana}
                                </span>
                              </div>

                              <div className="flex items-end">
                                <span className="font-bold w-24 sm:w-16 print:w-16 shrink-0 text-gray-700">
                                  জেলা:
                                </span>
                                <span className="border-b border-dashed border-gray-400 flex-1">
                                  {studentDistrict}
                                </span>
                              </div>

                              <div className="flex items-end">
                                <span className="font-bold w-24 sm:w-20 print:w-20 shrink-0 text-gray-700">
                                  শ্রেণি:
                                </span>
                                <span className="border-b border-dashed border-gray-400 flex-1 truncate">
                                  {studentClass}
                                </span>
                              </div>

                              <div className="flex items-end">
                                <span className="font-bold w-24 sm:w-16 print:w-16 shrink-0 text-gray-700">
                                  মেধাস্থান:
                                </span>
                                <span className="border-b border-dashed border-gray-400 flex-1 font-bold text-[#043e30]">
                                  {studentMerit && studentMerit !== "-"
                                    ? toBengaliDigits(studentMerit)
                                    : "-"}
                                </span>
                              </div>
                            </div>

                            {/* টেবিল হেডার টাইটেল */}
                            <div className="text-center font-bold text-xs my-1.5 text-[#043e30] tracking-wide">
                              বিষয়ভিত্তিক নম্বর বিবরণী
                            </div>
                          </div>

                          {/* নম্বর টেবিল */}
                          <div className="my-1 flex-shrink-0 w-full overflow-x-auto print:overflow-visible">
                            <table
                              className={`w-full ${
                                isAnnualExamType(activeExamType)
                                  ? "min-w-[540px]"
                                  : "min-w-[340px]"
                              } sm:min-w-0 print:min-w-0 border-collapse border border-[#C5A059] text-center text-xs print:text-[11px]`}
                            >
                              <thead>
                                <tr className="bg-[#fcf8ed] font-bold text-gray-800 text-[11px] sm:text-xs">
                                  <th className="border border-[#C5A059] p-1.5 text-left px-2.5">
                                    বিষয়
                                  </th>

                                  {isAnnualExamType(activeExamType) && (
                                    <>
                                      <th className="border border-[#C5A059] p-1 w-14 whitespace-nowrap">
                                        ১ম সাময়িক
                                      </th>
                                      <th className="border border-[#C5A059] p-1 w-14 whitespace-nowrap">
                                        ২য় সাময়িক
                                      </th>
                                      <th className="border border-[#C5A059] p-1 w-14 whitespace-nowrap">
                                        {formatExamDisplayLabel(activeExamType, {
                                          short: true,
                                        })}
                                      </th>
                                      <th className="border border-[#C5A059] p-1 w-16 font-bold whitespace-nowrap">
                                        মোট মার্ক
                                      </th>
                                    </>
                                  )}

                                  <th className="border border-[#C5A059] p-1.5 w-16 font-bold whitespace-nowrap">
                                    {isAnnualExamType(activeExamType)
                                      ? "প্রাপ্ত মার্ক"
                                      : "প্রাপ্ত নম্বর"}
                                  </th>
                                  <th className="border border-[#C5A059] p-1.5 w-14 whitespace-nowrap">
                                    গ্রেড
                                  </th>
                                  <th className="border border-[#C5A059] p-1.5 w-14 whitespace-nowrap">
                                    গ্রেড পয়েন্ট
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {results.length === 0 ? (
                                  <tr>
                                    <td
                                      colSpan={
                                        isAnnualExamType(activeExamType) ? 8 : 4
                                      }
                                      className="p-3 text-center border border-[#C5A059]"
                                    >
                                      কোনো নম্বর পাওয়া যায়নি
                                    </td>
                                  </tr>
                                ) : (
                                  results.map((item, idx) => {
                                    const t1 = parseExamData(
                                      item.term1 || item["১ম সাময়িক পরীক্ষা"],
                                    );
                                    const t2 = parseExamData(
                                      item.term2 || item["২য় সাময়িক পরীক্ষা"],
                                    );
                                    const ann = parseExamData(
                                      item.annual || item["বার্ষিক পরীক্ষা"],
                                    );
                                    const subjectTotalFullMark =
                                      getSubjectTotalFullMarks(
                                        item,
                                        activeExamType,
                                      );

                                    const finalMark = getMarkForExamType(
                                      item,
                                      activeExamType,
                                    );

                                    let gradeInfo;
                                    if (isAnnualExamType(activeExamType)) {
                                      gradeInfo =
                                        getFinalSubjectGradeForAnnual(item);
                                    } else {
                                      const normalizedMark =
                                        getNormalizedMarkForGrade(
                                          item,
                                          activeExamType,
                                        );
                                      gradeInfo =
                                        calculateSubjectGrade(normalizedMark);
                                    }

                                    const formatVal = (v) => {
                                      if (v === "অনুঃ") return "অনুঃ";
                                      if (
                                        v === "-" ||
                                        v === undefined ||
                                        v === null
                                      )
                                        return "-";
                                      if (
                                        typeof v === "number" ||
                                        (!isNaN(parseFloat(v)) && isFinite(v))
                                      ) {
                                        return toBengaliDigits(v);
                                      }
                                      return v;
                                    };

                                    return (
                                      <tr
                                        key={String(
                                          item.subjectCode ||
                                          item.subjectId ||
                                          item.subjectName ||
                                          formatSubjectName(item.subject) ||
                                          item.subject ||
                                          idx,
                                        ).trim()}
                                        className="border-b border-[#C5A059] odd:bg-white even:bg-[#fcf8ed]/45"
                                      >
                                        <td className="border border-[#C5A059] p-1.5 text-left px-2.5 font-semibold">
                                          {formatSubjectName(item.subject)}
                                        </td>

                                        {isAnnualExamType(activeExamType) && (
                                          <>
                                            <td className="border border-[#C5A059] p-1">
                                              {formatVal(t1)}
                                            </td>
                                            <td className="border border-[#C5A059] p-1">
                                              {formatVal(t2)}
                                            </td>
                                            <td className="border border-[#C5A059] p-1">
                                              {formatVal(ann)}
                                            </td>
                                            <td className="border border-[#C5A059] p-1 font-semibold">
                                              {toBengaliDigits(
                                                subjectTotalFullMark,
                                              )}
                                            </td>
                                          </>
                                        )}

                                        <td className="border border-[#C5A059] p-1.5 font-bold">
                                          {formatVal(finalMark)}
                                        </td>
                                        <td
                                          className={`border border-[#C5A059] p-1.5 font-bold ${gradeInfo.grade === "F" ||
                                              gradeInfo.grade === "অনুঃ"
                                              ? "text-red-600"
                                              : ""
                                            }`}
                                        >
                                          {gradeInfo.grade}
                                        </td>
                                        <td className="border border-[#C5A059] p-1.5">
                                          {gradeInfo.grade === "অনুঃ"
                                            ? "০.০০"
                                            : toBengaliDigits(gradeInfo.gpa)}
                                        </td>
                                      </tr>
                                    );
                                  })
                                )}
                              </tbody>
                            </table>
                          </div>

                          {/* সামারি সেকশন */}
                          <div className="mt-1.5 border border-[#C5A059] bg-[#fcf8ed] px-1.5 py-1.5 rounded-sm flex-shrink-0">
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 print:grid-cols-7 gap-2 md:gap-1 print:gap-1 text-center text-xs md:text-[11px] print:text-[11px] font-bold text-gray-800 items-center">
                              <div className="bg-white/70 md:bg-transparent print:bg-transparent rounded p-1 md:p-0 print:p-0">
                                <span className="block text-[10px] md:text-[9.5px] print:text-[9.5px] text-gray-600 font-normal whitespace-nowrap">
                                  মোট নম্বর
                                </span>
                                {summary.totalFullMarks}
                              </div>
                              <div className="bg-white/70 md:bg-transparent print:bg-transparent rounded p-1 md:p-0 print:p-0">
                                <span className="block text-[10px] md:text-[9.5px] print:text-[9.5px] text-gray-600 font-normal whitespace-nowrap">
                                  প্রাপ্ত নম্বর
                                </span>
                                {summary.totalObtained}
                              </div>
                              <div className="bg-white/70 md:bg-transparent print:bg-transparent rounded p-1 md:p-0 print:p-0">
                                <span className="block text-[10px] md:text-[9.5px] print:text-[9.5px] text-gray-600 font-normal whitespace-nowrap">
                                  গড় নম্বর
                                </span>
                                {summary.average}
                              </div>
                              <div className="bg-white/70 md:bg-transparent print:bg-transparent rounded p-1 md:p-0 print:p-0">
                                <span className="block text-[10px] md:text-[9.5px] print:text-[9.5px] text-gray-600 font-normal whitespace-nowrap">
                                  ফাইনাল গ্রেড
                                </span>
                                {summary.grade}
                              </div>
                              <div className="bg-white/70 md:bg-transparent print:bg-transparent rounded p-1 md:p-0 print:p-0">
                                <span className="block text-[10px] md:text-[9.5px] print:text-[9.5px] text-gray-600 font-normal whitespace-nowrap">
                                  ফাইনাল জিপিএ
                                </span>
                                {summary.gpa}
                              </div>

                              <div className="bg-[#043e30]/10 rounded-sm py-1 md:py-0.5 print:py-0.5 px-1 border border-[#043e30]/20">
                                <span className="block text-[10px] md:text-[9.5px] print:text-[9.5px] text-[#043e30] font-bold whitespace-nowrap">
                                  মেধাস্থান
                                </span>
                                <span className="text-[#043e30] font-black">
                                  {studentMerit && studentMerit !== "-"
                                    ? toBengaliDigits(studentMerit)
                                    : "-"}
                                </span>
                              </div>
                              <div className="col-span-2 sm:col-span-1 md:col-span-1 print:col-span-1 bg-white/70 md:bg-transparent print:bg-transparent rounded p-1 md:p-0 print:p-0">
                                <span className="block text-[10px] md:text-[9.5px] print:text-[9.5px] text-gray-600 font-normal whitespace-nowrap">
                                  মন্তব্য
                                </span>
                                <span className="whitespace-nowrap text-[11px] md:text-[10.5px] print:text-[10.5px]">
                                  {summary.remark ||
                                    getGradeRemark(summary.grade) ||
                                    "-"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* ফুটার লেআউট */}
                        <div className="mt-3 md:mt-4 print:mt-auto flex-shrink-0 pt-1.5 relative z-10">
                          <PrintSignatures
                            principalTopClass="-top-2"
                            className="flex justify-between items-end my-1 px-1 sm:px-3 print:px-3 flex-shrink-0 gap-2"
                          />
                          <PrintSocialFooter />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : searchTerm ? (
        <div className="print:hidden text-center py-6 bg-white rounded-3xl p-3 sm:p-4 max-w-xl mx-auto shadow-sm border border-[#90CAF9]/70 text-[#0D47A1] font-bold text-sm sm:text-base flex flex-col items-center gap-3">
          <span className="w-12 h-12 rounded-2xl bg-[#E3F2FD] border border-[#90CAF9] flex items-center justify-center text-2xl">
            🔍
          </span>
          <span>
            কোনো ফলাফল পাওয়া যায়নি। সঠিক আইডি বা পরীক্ষা নির্বাচন করে আবার
            অনুসন্ধান করুন।
          </span>
        </div>
      ) : null}
    </div>
  );
}

export default function ResultSheetGenerator() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-100 dark:bg-[#09101d] text-gray-800 dark:text-gray-200 p-3 sm:p-4 md:p-6 flex items-center justify-center">
          <div className="text-center py-12 bg-white dark:bg-[#0f172a] rounded-lg p-6 max-w-7xl mx-auto text-teal-600 font-bold">
            রেজাল্ট প্যানেল লোড হচ্ছে...
          </div>
        </div>
      }
    >
      <ResultSheetGeneratorContent />
    </Suspense>
  );
}
