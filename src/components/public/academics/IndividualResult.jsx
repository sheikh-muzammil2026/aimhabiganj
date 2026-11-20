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
import { authClient } from "@/lib/auth-client";
import { formatSubjectName } from "@/lib/subjectFormatter";
import { toBengaliDigits, toEnglishDigits } from "@/lib/studentUtils";
import PrintInstitutionalHeader from "@/components/shared/print/PrintInstitutionalHeader";
import PrintSignatures from "@/components/shared/print/PrintSignatures";
import PrintSocialFooter from "@/components/shared/print/PrintSocialFooter";
import siteConfig from "@/config/siteConfig";

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
  } else if (currentExamType === "বার্ষিক পরীক্ষা") {
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
  if (currentExamType === "বার্ষিক পরীক্ষা") {
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
  } else if (currentExamType === "বার্ষিক পরীক্ষা") {
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
      totalObtained: "০",
      average: "০.০০",
      grade: "-",
      gpa: "০.০০",
      status: "অনুপস্থিত",
      remark: "",
    };
  }

  const totalSubjects = uniqueResults.length;
  let absentCount = 0;
  let totalObtained = 0;
  let validCount = 0;
  let hasFailedCompulsory = false;
  let totalGradePoints = 0;
  let totalNormalizedMarks = 0;

  uniqueResults.forEach((item) => {
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
      if (currentExamType === "বার্ষিক পরীক্ষা") {
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
      totalObtained: toBengaliDigits(totalObtained),
      average:
        validCount > 0
          ? toBengaliDigits(
              (
                (currentExamType === "বার্ষিক পরীক্ষা"
                  ? totalNormalizedMarks
                  : totalObtained) / validCount
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
      ? (
          (currentExamType === "বার্ষিক পরীক্ষা"
            ? totalNormalizedMarks
            : totalObtained) / validCount
        ).toFixed(2)
      : "0.00";

  if (hasFailedCompulsory) {
    return {
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

  // ফিল্টারিং স্টেট (শুধুমাত্র লোকাল ইনপুট স্টেট; সার্চ বাটনে ক্লিক না করা পর্যন্ত ফেচ বা ফিল্টার হবে না)
  const [selectedClass, setSelectedClass] = useState("all");
  const [targetYear, setTargetYear] = useState("২০২৬");
  const [examType, setExamType] = useState("২য় সাময়িক পরীক্ষা");
  const [resultMode, setResultMode] = useState(() => {
    const initialType =
      searchParams.get("type") || searchParams.get("mode") || "";
    return initialType.toLowerCase() === "ct" ? "ct" : "term";
  });
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // প্রদর্শিত রেজাল্ট শিটের জন্য কমিটেড স্টেট (যাতে ড্রপডাউন পরিবর্তনের সাথে সাথে লাইভ রি-ক্যালকুলেশন না হয়)
  const [activeExamType, setActiveExamType] = useState("২য় সাময়িক পরীক্ষা");
  const [activeYear, setActiveYear] = useState("২০২৬");
  const [activeClass, setActiveClass] = useState("all");
  const [activeResultMode, setActiveResultMode] = useState(() => {
    const initialType =
      searchParams.get("type") || searchParams.get("mode") || "";
    return initialType.toLowerCase() === "ct" ? "ct" : "term";
  });
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
        } else if (syncUrl) {
          // ফলাফল প্রদর্শিত হলে URL-এ কুয়েরি প্যারামিটার সিঙ্ক্রোনাইজ করা (পেজ রিলোড ছাড়া)
          const nextParams = new URLSearchParams(searchParams.toString());
          nextParams.delete("studentId");
          nextParams.delete("id");
          nextParams.delete("search");
          nextParams.delete("examType");
          nextParams.delete("session");

          const resolvedRoll =
            trimmedTerm ||
            String(
              uniqueFinalResults[0]?.studentId ||
              uniqueFinalResults[0]?.student?.studentId ||
              "",
            ).trim();

          if (resolvedRoll) {
            nextParams.set("roll", resolvedRoll);
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

          if (mode === "ct") {
            nextParams.set("type", "ct");
          } else {
            nextParams.delete("type");
            nextParams.delete("mode");
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

  // সরাসরি শেয়ারেবল URL (/results?roll=...&exam=...&year=...) থেকে ভিজিট করলে স্বয়ংক্রিয়ভাবে ফলাফল লোড করা
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
    const urlType = (
      searchParams.get("type") ||
      searchParams.get("mode") ||
      ""
    ).trim().toLowerCase();

    if (!urlRoll && (!urlClass || urlClass === "all")) {
      return;
    }

    const effectiveYear = urlYear || "২০২৬";
    const effectiveExam = urlExam || "২য় সাময়িক পরীক্ষা";
    const effectiveClass = urlClass || "all";
    const effectiveMode = urlType === "ct" ? "ct" : "term";
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
    setResultMode(effectiveMode);
    setActiveResultMode(effectiveMode);

    executeSearch({
      term: urlRoll,
      cls: effectiveClass,
      yr: effectiveYear,
      exam: effectiveExam,
      mode: effectiveMode,
      syncUrl: true,
    });
  }, [searchParams, executeSearch]);

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

  // টার্ম ও সিটি ফলাফলের মাঝে তাৎক্ষণিক মোড পরিবর্তন (পেজ রিলোড বা রি-ফেচ ছাড়াই)
  const handleSwitchMode = (newMode) => {
    setResultMode(newMode);
    setActiveResultMode(newMode);
    if (typeof window !== "undefined") {
      const nextParams = new URLSearchParams(searchParams.toString());
      if (newMode === "ct") {
        nextParams.set("type", "ct");
      } else {
        nextParams.delete("type");
        nextParams.delete("mode");
      }
      const nextQueryStr = nextParams.toString();
      router.replace(`${pathname}${nextQueryStr ? `?${nextQueryStr}` : ""}`, {
        scroll: false,
      });
    }
  };

  // শেয়ারেবল ফলাফল লিংক তৈরি ও ক্লিপবোর্ডে কপি করা
  const handleCopyShareLink = async () => {
    if (typeof window === "undefined") return;
    try {
      const shareParams = new URLSearchParams();
      const primarySheet = resultSheets[0];
      const displayedId = String(
        searchTerm ||
        primarySheet?.studentId ||
        primarySheet?.student?.studentId ||
        searchInput.trim() ||
        "",
      ).trim();

      if (displayedId) {
        shareParams.set("roll", displayedId);
      }
      if (activeClass && activeClass !== "all") {
        shareParams.set("class", activeClass);
      }
      if (activeYear) {
        shareParams.set("year", activeYear);
      }
      if (activeExamType) {
        shareParams.set("exam", activeExamType);
      }
      if (activeResultMode === "ct") {
        shareParams.set("type", "ct");
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#09101d] text-gray-800 dark:text-gray-200 p-3 sm:p-4 md:p-6">
      <div className="print:hidden max-w-7xl mx-auto mb-8 font-sans">
        {/* ড্যাশবোর্ড মেইন কার্ড - ইসলামিক ডিপ গ্রিন ও ফাইনাল গোল্ডেন বর্ডার */}
        <div className="bg-gradient-to-br from-[#063226] via-[#04241b] to-[#021812] rounded-3xl p-6 sm:p-8 border border-emerald-600/30 shadow-2xl shadow-emerald-950/40 text-emerald-50 relative overflow-hidden">
          {/* ব্যাকগ্রাউন্ড গোল্ডেন ও এমারেল্ড গ্লো */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* ১. হেডার ও প্রিন্ট / শেয়ার বাটন (গোল্ডেন একসেন্ট সহ) */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-emerald-800/60">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 bg-amber-950/60 border border-amber-500/30 px-3.5 py-1 rounded-full inline-block mb-2 shadow-inner">
                ✦ রেজাল্ট ম্যানেজমেন্ট প্যানেল ✦
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-100 flex items-center gap-2">
                রেজাল্ট শিট জেনারেটর
              </h1>
            </div>

          </div>

          {/* এরর নোটিফিকেশন */}
          {error && (
            <div className="mb-6 p-4 bg-rose-950/50 border border-rose-800/80 text-rose-200 rounded-2xl text-sm font-medium flex items-center gap-3 backdrop-blur-md animate-fade-in">
              <span className="p-1.5 bg-rose-900/50 rounded-lg text-rose-300 text-base">
                ⚠️
              </span>
              <span>{error}</span>
            </div>
          )}

          {/* রেজাল্ট টাইপ নির্বাচক (টার্ম পরীক্ষা বনাম ক্লাস টেস্ট CT) */}
          <div className="mb-6 pb-5 border-b border-emerald-800/50">
            <label className="block text-[11px] font-extrabold text-amber-300 uppercase tracking-wider mb-2">
              ১. ফলাফলের ধরন নির্বাচন করুন (Select Result Type)
            </label>
            <div className="inline-flex p-1.5 bg-[#031d16] rounded-2xl border border-emerald-700/60 gap-1.5 shadow-inner flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setResultMode("term");
                  setActiveResultMode("term");
                }}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  resultMode === "term"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/60 border border-emerald-400/50"
                    : "text-emerald-300 hover:text-white hover:bg-emerald-800/40"
                }`}
              >
                <span>📑</span>
                <span>সাময়িক পরীক্ষা (Term Exam)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setResultMode("ct");
                  setActiveResultMode("ct");
                }}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  resultMode === "ct"
                    ? "bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-emerald-950 shadow-lg shadow-amber-950/60 border border-amber-300"
                    : "text-emerald-300 hover:text-white hover:bg-emerald-800/40"
                }`}
              >
                <span>📝</span>
                <span>ক্লাস টেস্ট (CT Result)</span>
              </button>
            </div>
          </div>

          {/* ২. ফিল্টার ও সার্চ সিস্টেম */}
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* ২. শিক্ষার্থী আইডি */}
              <div className="bg-[#083c2e]/60 p-3.5 rounded-2xl border border-emerald-700/40 focus-within:border-amber-400/60 focus-within:ring-1 focus-within:ring-amber-400/50 transition-all">
                <label className="block text-[11px] font-extrabold text-emerald-300 uppercase tracking-wider mb-1.5">
                  ২. শিক্ষার্থীর আইডি
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="শিক্ষার্থীর আইডি (ঐচ্ছিক)..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full bg-[#031d16] text-emerald-100 placeholder-emerald-600/70 border border-emerald-800/80 rounded-xl py-2 px-3.5 text-sm focus:outline-none focus:border-amber-400 transition-all"
                  />
                </div>
              </div>

              {/* ৩. শিক্ষাবর্ষ */}
              <div className="bg-[#083c2e]/60 p-3.5 rounded-2xl border border-emerald-700/40 focus-within:border-amber-400/60 transition-all">
                <label className="block text-[11px] font-extrabold text-emerald-300 uppercase tracking-wider mb-1.5">
                  ৩. শিক্ষাবর্ষ
                </label>
                <select
                  value={targetYear}
                  onChange={(e) => setTargetYear(e.target.value)}
                  className="w-full bg-[#031d16] text-emerald-100 border border-emerald-800/80 rounded-xl py-2 px-3 text-sm font-medium focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  {sessionYears.map((year) => (
                    <option
                      key={year}
                      value={year}
                      className="bg-[#04241b] text-emerald-100"
                    >
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* ৪. পরীক্ষার নাম */}
              <div className="bg-[#083c2e]/60 p-3.5 rounded-2xl border border-emerald-700/40 focus-within:border-amber-400/60 transition-all">
                <label className="block text-[11px] font-extrabold text-emerald-300 uppercase tracking-wider mb-1.5">
                  ৪. পরীক্ষার নাম
                </label>
                <select
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                  className="w-full bg-[#031d16] text-emerald-100 border border-emerald-800/80 rounded-xl py-2 px-3 text-sm font-medium focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option
                    value="১ম সাময়িক পরীক্ষা"
                    className="bg-[#04241b] text-emerald-100"
                  >
                    ১ম সাময়িক পরীক্ষা
                  </option>
                  <option
                    value="২য় সাময়িক পরীক্ষা"
                    className="bg-[#04241b] text-emerald-100"
                  >
                    ২য় সাময়িক পরীক্ষা
                  </option>
                  <option
                    value="বার্ষিক পরীক্ষা"
                    className="bg-[#04241b] text-emerald-100"
                  >
                    বার্ষিক পরীক্ষা
                  </option>
                </select>
              </div>
              {/* ৫. খুঁজুন বাটন (ইসলামিক ডিপ গ্রিন ও গোল্ডেন হোভার) */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold px-8 py-3.5 rounded-2xl text-sm transition-all duration-200 flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-900/50 border border-emerald-400/30 active:scale-95 cursor-pointer"
                >
                  <Search className="w-4 h-4 stroke-[2.5]" />
                  <span>খুঁজুন</span>
                </button>
              </div>
            </div>


          </form>
        </div>
      </div>

      {/* ----------------- ২. রেজাল্ট শিট প্রিভিউ (প্রিন্ট লেআউট) ----------------- */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0mm !important;
          }

          html,
          body {
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body * {
            visibility: hidden;
          }

          .print-area-container,
          .print-area-container * {
            visibility: visible;
          }

          .print-area-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .page-break {
            width: 210mm !important;
            min-height: 297mm !important;
            height: 297mm !important;
            max-height: 297mm !important;
            margin: 0 auto !important;
            padding: 7mm 9mm !important;
            box-sizing: border-box !important;
            page-break-after: always !important;
            break-after: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            overflow: hidden !important;
          }
        }
      `}</style>

      {loadingResults || loading ? (
        <div className="print:hidden text-center py-12 bg-white dark:bg-[#0f172a] rounded-lg p-4 max-w-7xl mx-auto text-teal-600 font-bold">
          রেজাল্ট লোড হচ্ছে...
        </div>
      ) : resultsError ? (
        <div className="print:hidden text-center py-12 bg-white dark:bg-[#0f172a] rounded-2xl p-8 max-w-2xl mx-auto shadow-sm border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 font-bold text-base flex flex-col items-center gap-3">
          <span className="text-3xl">⚠️</span>
          <span>{resultsError}</span>
        </div>
      ) : resultSheets.length > 0 ? (
        <>
          {/* প্রদর্শিত ফলাফল শিটের উপরে শেয়ার / লিংক কপি ও প্রিন্ট অ্যাকশন বার */}
          <div className="print:hidden w-full max-w-[210mm] mx-auto mb-3 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-[#063226] via-[#04241b] to-[#021812] px-4 py-3 rounded-2xl border border-emerald-600/30 shadow-lg text-emerald-50">
            {/* শিট মোড টগল (টার্ম বনাম সিটি) */}
            <div className="inline-flex p-1 bg-[#031d16] rounded-xl border border-emerald-700/60 gap-1">
              <button
                type="button"
                onClick={() => handleSwitchMode("term")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  activeResultMode === "term"
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
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  activeResultMode === "ct"
                    ? "bg-gradient-to-r from-amber-400 to-amber-500 text-emerald-950 font-extrabold shadow border border-amber-300"
                    : "text-emerald-300 hover:text-white hover:bg-emerald-800/40"
                }`}
              >
                <span>📝</span>
                <span>সিটি (CT) শিট</span>
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleCopyShareLink}
                aria-label="Copy shareable result link"
                className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 border cursor-pointer ${copiedLink
                  ? "bg-emerald-600 text-white border-emerald-400/60 shadow-md shadow-emerald-900/40"
                  : "bg-[#083c2e] hover:bg-emerald-800/80 text-amber-300 border-amber-400/40 active:scale-95"
                  }`}
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Copied! (কপি হয়েছে)</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 stroke-[2.2]" />
                    <span>Copy Link / শেয়ার</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-emerald-950 transition-all duration-200 flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
              >
                <span>🖨️</span>
                <span>প্রিন্ট</span>
              </button>
            </div>
          </div>

          <div className="print-area-container flex flex-col items-center gap-8">
            {resultSheets.map((resData, index) => {
              // ১. রেজাল্ট ডাটা থেকে স্টুডেন্ট আইডি বের করা
              const currentStudentId =
                resData.studentId ||
                resData.student?.studentId ||
                resData.student?.id ||
                resData.student;

              // ২. 'students' স্টেট থেকে আসল স্টুডেন্টের সব ইনফরমেশন খুঁজে বের করা
              const matchedStudent =
                students.find(
                  (s) =>
                    (s.studentId ?? s.id)?.toString().trim() ===
                    String(currentStudentId).trim(),
                ) || {};

              // ৩. ফলব্যাক বা ব্যাকআপ অবজেক্ট তৈরি
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

              if (activeResultMode === "ct") {
                const ctSummary = calculateCTSummary(results, activeExamType);
                const ctStudentMerit =
                  clientCTMeritMap.get(String(currentStudentId)) || "-";

                return (
                  <div
                    key={`ct-${student.studentId || currentStudentId || index}`}
                    className="page-break relative bg-white box-border flex flex-col justify-between text-black w-full max-w-[210mm] min-h-[297mm] shadow-xl rounded-sm my-4 font-bornomala"
                  >
                    {/* কার্ডের গোল্ডেন ট্রিপল আউটার বর্ডার */}
                    <div className="w-full h-full border-[3px] border-[#C5A059] p-1 box-border relative">
                      <div className="w-full h-full border border-[#C5A059] p-2 flex flex-col justify-between box-border relative">
                        {/* ব্যাকগ্রাউন্ড ওয়াটারমার্ক */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-[0.05]">
                          <div className="w-[420px] h-[420px] rounded-full overflow-hidden flex items-center justify-center">
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
                            {/* হেডার: লোগো ও মাদরাসার নাম */}
                            <div>
                              <PrintInstitutionalHeader
                                bannerSrc="/banner_routine.png"
                                logoWrapperClassName="w-20 h-20 md:w-45 md:h-45 print:!w-36 print:!h-36 rounded-full overflow-hidden flex-shrink-0 bg-transparent relative flex items-center justify-center -mr-3"
                                logoWidth={200}
                                logoHeight={200}
                                logoClassName="w-full h-full object-cover scale-[1.08] transform-gpu"
                                bannerWidth={1000}
                                bannerHeight={400}
                                bannerClassName="w-full h-auto max-h-45 object-fill mx-auto print:max-h-45"
                              />

                              {/* ডাবল গোল্ডেন লাইন সেপারেটর */}
                              <div className="border-t-2 border-b border-[#C5A059] my-2 py-0.5"></div>

                              {/* রেজাল্ট ব্যাজ ও হেডলাইন */}
                              <div className="flex justify-between items-center my-2 px-1">
                                {/* বাম পাশে শিক্ষার্থীর ছবি */}
                                <div className="w-16 h-18 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden text-[9px] text-gray-400 font-bold shadow-xs">
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
                                  <div className="bg-[#043e30] text-amber-300 px-5 py-1 rounded-full inline-block font-bold text-xs tracking-wide shadow-sm">
                                    ক্লাস টেস্ট (CT) ফলাফল বিবরণী
                                  </div>
                                  <p className="text-[11px] font-bold text-gray-800 mt-1">
                                    {activeExamType} -{" "}
                                    {toBengaliDigits(
                                      (resData.year || "")
                                        .split(/[-–/]/)[0]
                                        .trim(),
                                    )}
                                  </p>
                                  <p className="text-[11px] font-bold text-gray-800">
                                    শ্রেণি: {studentClass}
                                  </p>
                                </div>

                                {/* ডান পাশে সিটি গ্রেডিং স্কেল বিবরণী */}
                                <div className="flex justify-end">
                                  <table className="border-collapse border border-slate-600 text-[6.5px] sm:text-[7px] leading-tight text-center bg-white shadow-xs">
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
                              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] my-3 px-1">
                                <div className="flex items-end">
                                  <span className="font-bold w-20 shrink-0">
                                    পরীক্ষার্থীর নাম:
                                  </span>
                                  <span className="font-bold border-b border-dashed border-gray-400 flex-1 truncate">
                                    {studentName}
                                  </span>
                                </div>
                                <div className="flex items-end">
                                  <span className="font-bold w-16 shrink-0">
                                    আইডি:
                                  </span>
                                  <span className="font-bold border-b border-dashed border-gray-400 flex-1">
                                    {toBengaliDigits(student.studentId)}
                                  </span>
                                </div>
                                <div className="flex items-end">
                                  <span className="font-bold w-20 shrink-0">
                                    পিতার নাম:
                                  </span>
                                  <span className="border-b border-dashed border-gray-400 flex-1 truncate">
                                    {studentFatherName}
                                  </span>
                                </div>
                                <div className="flex items-end">
                                  <span className="font-bold w-16 shrink-0">
                                    রোল নং:
                                  </span>
                                  <span className="border-b border-dashed border-gray-400 flex-1">
                                    {studentRoll !== "প্রযোজ্য নয়"
                                      ? toBengaliDigits(studentRoll)
                                      : "প্রযোজ্য নয়"}
                                  </span>
                                </div>
                                <div className="flex items-end">
                                  <span className="font-bold w-20 shrink-0">
                                    উপজেলা:
                                  </span>
                                  <span className="border-b border-dashed border-gray-400 flex-1">
                                    {studentThana}
                                  </span>
                                </div>
                                <div className="flex items-end">
                                  <span className="font-bold w-16 shrink-0">
                                    জেলা:
                                  </span>
                                  <span className="border-b border-dashed border-gray-400 flex-1">
                                    {studentDistrict}
                                  </span>
                                </div>
                                <div className="flex items-end">
                                  <span className="font-bold w-20 shrink-0">
                                    শ্রেণি:
                                  </span>
                                  <span className="border-b border-dashed border-gray-400 flex-1 truncate">
                                    {studentClass}
                                  </span>
                                </div>
                                <div className="flex items-end">
                                  <span className="font-bold w-16 shrink-0">
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
                              <div className="text-center font-bold text-xs my-1 text-gray-800">
                                ক্লাস টেস্ট (CT) নম্বর বিবরণী
                              </div>
                            </div>

                            {/* সিটি নম্বর টেবিল */}
                            <div className="my-1 flex-shrink-0">
                              <table className="w-full border-collapse border border-[#C5A059] text-center text-xs">
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
                                          className="border-b border-[#C5A059]"
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
                                            className={`border border-[#C5A059] p-1.5 font-bold ${
                                              ctData.grade === "F" ||
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
                            <div className="mt-1 border border-[#C5A059] bg-[#fcf8ed] p-2 rounded-sm flex-shrink-0">
                              <div className="grid grid-cols-6 gap-2 text-center text-xs font-bold text-gray-800">
                                <div>
                                  <span className="block text-[10px] text-gray-600 font-normal">
                                    মোট পূর্ণমান
                                  </span>
                                  {ctSummary.totalFullMarks}
                                </div>
                                <div>
                                  <span className="block text-[10px] text-gray-600 font-normal">
                                    মোট প্রাপ্ত নম্বর
                                  </span>
                                  {ctSummary.totalObtained}
                                </div>
                                <div>
                                  <span className="block text-[10px] text-gray-600 font-normal">
                                    শতকরা হার
                                  </span>
                                  {ctSummary.percentage}
                                </div>
                                <div>
                                  <span className="block text-[10px] text-gray-600 font-normal">
                                    গড় নম্বর
                                  </span>
                                  {ctSummary.average}
                                </div>
                                <div className="bg-[#043e30]/10 rounded-sm py-0.5 border border-[#043e30]/20">
                                  <span className="block text-[10px] text-[#043e30] font-bold">
                                    সিটি মেধাস্থান
                                  </span>
                                  <span className="text-[#043e30] font-black">
                                    {ctStudentMerit && ctStudentMerit !== "-"
                                      ? toBengaliDigits(ctStudentMerit)
                                      : "-"}
                                  </span>
                                </div>
                                <div>
                                  <span className="block text-[10px] text-gray-600 font-normal">
                                    মন্তব্য
                                  </span>
                                  <span
                                    className={`whitespace-nowrap ${
                                      ctSummary.grade === "F" ||
                                      ctSummary.grade === "অনুঃ"
                                        ? "text-red-600"
                                        : "text-[#043e30]"
                                    }`}
                                  >
                                    {ctSummary.remark ||
                                      ctSummary.status ||
                                      "-"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* ফুটার লেআউট (স্বাক্ষর এরিয়া এবং সোশ্যাল ও কন্টাক্ট ইনফো) */}
                          <div className="mt-auto flex-shrink-0 pt-2 relative z-10">
                            <PrintSignatures principalTopClass="-top-2" />
                            <PrintSocialFooter />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              const summary = calculateSummary(results, activeExamType);
              const studentMerit =
                resData.meritPosition && resData.meritPosition !== "-"
                  ? resData.meritPosition
                  : clientMeritMap.get(String(currentStudentId)) || "-";

              return (
                <div
                  key={student.studentId || currentStudentId || index}
                  className="page-break relative bg-white box-border flex flex-col justify-between text-black w-full max-w-[210mm] min-h-[297mm] shadow-xl rounded-sm my-4"
                >
                  {/* কার্ডের গোল্ডেন ট্রিপল আউটার বর্ডার */}
                  <div className="w-full h-full border-[3px] border-[#C5A059] p-1 box-border relative">
                    <div className="w-full h-full border border-[#C5A059] p-2 flex flex-col justify-between box-border relative">
                      {/* ব্যাকগ্রাউন্ড ওয়াটারমার্ক */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-[0.05]">
                        <div className="w-[420px] h-[420px] rounded-full overflow-hidden flex items-center justify-center">
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
                          {/* হেডার: লোগো ও মাদরাসার নাম */}
                          <div>
                            <PrintInstitutionalHeader
                              bannerSrc="/banner_routine.png"
                              logoWrapperClassName="w-20 h-20 md:w-45 md:h-45 print:!w-36 print:!h-36 rounded-full overflow-hidden flex-shrink-0 bg-transparent relative flex items-center justify-center -mr-3"
                              logoWidth={200}
                              logoHeight={200}
                              logoClassName="w-full h-full object-cover scale-[1.08] transform-gpu"
                              bannerWidth={1000}
                              bannerHeight={400}
                              bannerClassName="w-full h-auto max-h-45 object-fill mx-auto print:max-h-45"
                            />

                            {/* ডাবল গোল্ডেন লাইন সেপারেটর */}
                            <div className="border-t-2 border-b border-[#C5A059] my-2 py-0.5"></div>

                            {/* রেজাল্ট ব্যাজ ও হেডলাইন */}
                            <div className="flex justify-between items-center my-2 px-1">
                              {/* বাম পাশে শিক্ষার্থীর ছবি (QR কোডের স্থানে) */}
                              <div className="w-16 h-18 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden text-[9px] text-gray-400 font-bold shadow-xs">
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
                                <div className="bg-[#043e30] text-white px-5 py-1 rounded-full inline-block font-bold text-xs tracking-wide shadow-sm">
                                  মার্কসীট
                                </div>
                                <p className="text-[11px] font-bold text-gray-800 mt-1">
                                  {activeExamType} -{" "}
                                  {toBengaliDigits(
                                    (resData.year || "")
                                      .split(/[-–/]/)[0]
                                      .trim(),
                                  )}
                                </p>
                                <p className="text-[11px] font-bold text-gray-800">
                                  শ্রেণি: {studentClass}
                                </p>
                              </div>

                              {/* ডান পাশে গ্রেডিং সিস্টেম বিবরণী (শিক্ষার্থীর ছবির স্থানে) */}
                              <div className="flex justify-end">
                                <table className="border-collapse border border-slate-600 text-[6.5px] sm:text-[7px] leading-tight text-center bg-white shadow-xs">
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
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] my-3 px-1">
                              {/* ১ম পরীক্ষার্থীর নাম */}
                              <div className="flex items-end">
                                <span className="font-bold w-20 shrink-0">
                                  পরীক্ষার্থীর নাম:
                                </span>
                                <span className="font-bold border-b border-dashed border-gray-400 flex-1 truncate">
                                  {studentName}
                                </span>
                              </div>

                              {/* ২. আইডি */}
                              <div className="flex items-end">
                                <span className="font-bold w-16 shrink-0">
                                  আইডি:
                                </span>
                                <span className="font-bold border-b border-dashed border-gray-400 flex-1">
                                  {toBengaliDigits(student.studentId)}
                                </span>
                              </div>

                              {/* ৩. পিতার নাম */}
                              <div className="flex items-end">
                                <span className="font-bold w-20 shrink-0">
                                  পিতার নাম:
                                </span>
                                <span className="border-b border-dashed border-gray-400 flex-1 truncate">
                                  {studentFatherName}
                                </span>
                              </div>

                              {/* ৪. রোল নং */}
                              <div className="flex items-end">
                                <span className="font-bold w-16 shrink-0">
                                  রোল নং:
                                </span>
                                <span className="border-b border-dashed border-gray-400 flex-1">
                                  {studentRoll !== "প্রযোজ্য নয়"
                                    ? toBengaliDigits(studentRoll)
                                    : "প্রযোজ্য নয়"}
                                </span>
                              </div>

                              {/* ৫. উপজেলা */}
                              <div className="flex items-end">
                                <span className="font-bold w-20 shrink-0">
                                  উপজেলা:
                                </span>
                                <span className="border-b border-dashed border-gray-400 flex-1">
                                  {studentThana}
                                </span>
                              </div>

                              {/* ৬. জেলা */}
                              <div className="flex items-end">
                                <span className="font-bold w-16 shrink-0">
                                  জেলা:
                                </span>
                                <span className="border-b border-dashed border-gray-400 flex-1">
                                  {studentDistrict}
                                </span>
                              </div>

                              {/* ৭. শ্রেণি */}
                              <div className="flex items-end">
                                <span className="font-bold w-20 shrink-0">
                                  শ্রেণি:
                                </span>
                                <span className="border-b border-dashed border-gray-400 flex-1 truncate">
                                  {studentClass}
                                </span>
                              </div>

                              {/* ৮. মেধাস্থান */}
                              <div className="flex items-end">
                                <span className="font-bold w-16 shrink-0">
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
                            <div className="text-center font-bold text-xs my-1 text-gray-800">
                              বিষয়ভিত্তিক নম্বর বিবরণী
                            </div>
                          </div>

                          {/* নম্বর টেবিল */}
                          <div className="my-1 flex-shrink-0">
                            <table className="w-full border-collapse border border-[#C5A059] text-center text-xs">
                              <thead>
                                <tr className="bg-[#fcf8ed] font-bold text-gray-800 text-xs">
                                  <th className="border border-[#C5A059] p-1.5 text-left px-2.5">
                                    বিষয়
                                  </th>

                                  {activeExamType === "বার্ষিক পরীক্ষা" && (
                                    <>
                                      <th className="border border-[#C5A059] p-1.5 w-16">
                                        ১ম সাময়িক
                                      </th>
                                      <th className="border border-[#C5A059] p-1.5 w-16">
                                        ২য় সাময়িক
                                      </th>
                                      <th className="border border-[#C5A059] p-1.5 w-16">
                                        বার্ষিক
                                      </th>
                                    </>
                                  )}

                                  <th className="border border-[#C5A059] p-1.5 w-20 font-bold">
                                    {activeExamType === "বার্ষিক পরীক্ষা"
                                      ? "মোট নম্বর"
                                      : "প্রাপ্ত নম্বর"}
                                  </th>
                                  <th className="border border-[#C5A059] p-1.5 w-16">
                                    গ্রেড
                                  </th>
                                  <th className="border border-[#C5A059] p-1.5 w-14">
                                    গ্রেড পয়েন্ট
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {results.length === 0 ? (
                                  <tr>
                                    <td
                                      colSpan={
                                        activeExamType === "বার্ষিক পরীক্ষা"
                                          ? 7
                                          : 4
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

                                    const finalMark = getMarkForExamType(
                                      item,
                                      activeExamType,
                                    );

                                    let gradeInfo;
                                    if (activeExamType === "বার্ষিক পরীক্ষা") {
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
                                        className="border-b border-[#C5A059]"
                                      >
                                        <td className="border border-[#C5A059] p-1.5 text-left px-2.5 font-semibold">
                                          {formatSubjectName(item.subject)}
                                        </td>

                                        {activeExamType ===
                                          "বার্ষিক পরীক্ষা" && (
                                            <>
                                              <td className="border border-[#C5A059] p-1.5">
                                                {formatVal(t1)}
                                              </td>
                                              <td className="border border-[#C5A059] p-1.5">
                                                {formatVal(t2)}
                                              </td>
                                              <td className="border border-[#C5A059] p-1.5">
                                                {formatVal(ann)}
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
                          <div className="mt-1 border border-[#C5A059] bg-[#fcf8ed] p-2 rounded-sm flex-shrink-0">
                            <div className="grid grid-cols-6 gap-2 text-center text-xs font-bold text-gray-800">
                              <div>
                                <span className="block text-[10px] text-gray-600 font-normal">
                                  মোট নম্বর
                                </span>
                                {summary.totalObtained}
                              </div>
                              <div>
                                <span className="block text-[10px] text-gray-600 font-normal">
                                  গড় নম্বর
                                </span>
                                {summary.average}
                              </div>
                              <div>
                                <span className="block text-[10px] text-gray-600 font-normal">
                                  ফাইনাল গ্রেড
                                </span>
                                {summary.grade}
                              </div>
                              <div>
                                <span className="block text-[10px] text-gray-600 font-normal">
                                  ফাইনাল জিপিএ
                                </span>
                                {summary.gpa}
                              </div>

                              <div className="bg-[#043e30]/10 rounded-sm py-0.5 border border-[#043e30]/20">
                                <span className="block text-[10px] text-[#043e30] font-bold">
                                  মেধাস্থান
                                </span>
                                <span className="text-[#043e30] font-black">
                                  {studentMerit && studentMerit !== "-"
                                    ? toBengaliDigits(studentMerit)
                                    : "-"}
                                </span>
                              </div>
                              <div>
                                <span className="block text-[10px] text-gray-600 font-normal">
                                  মন্তব্য
                                </span>
                                <span className="whitespace-nowrap">
                                  {summary.remark ||
                                    getGradeRemark(summary.grade) ||
                                    "-"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* ফুটার লেআউট (স্বাক্ষর এরিয়া এবং সোশ্যাল ও কন্টাক্ট ইনফো) */}
                        <div className="mt-auto flex-shrink-0 pt-2 relative z-10">
                          {/* ৪. স্বাক্ষর সেকশন */}
                          <PrintSignatures principalTopClass="-top-2" />

                          {/* সোশ্যাল ও কন্টাক্ট ইনফো */}
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
        <div className="print:hidden text-center py-12 bg-white dark:bg-[#0f172a] rounded-2xl p-8 max-w-2xl mx-auto shadow-sm border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 font-bold text-base flex flex-col items-center gap-3">
          <span className="text-3xl">🔍</span>
          <span>
            কোনো ফলাফল পাওয়া যায়নি (No result found)। সঠিক আইডি প্রদান করে
            আবার অনুসন্ধান করুন।
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
