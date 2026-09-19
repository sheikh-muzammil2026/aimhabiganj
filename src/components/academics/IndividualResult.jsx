"use client";

import { Globe, Mail, Phone, Search } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect, useMemo } from "react";
import { BsWhatsapp, BsYoutube } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";

const toBengaliDigits = (num) => {
  if (num === null || num === undefined) return "";
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(num).replace(/[0-9]/g, (digit) => bengaliDigits[Number(digit)]);
};

export default function ResultSheetGenerator() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [students, setStudents] = useState([]);

  // রেজাল্ট শিটের জন্য ডাটা ও স্টেট
  const [resultSheets, setResultSheets] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const [resultsError, setResultsError] = useState(null);

  // ফিল্টারিং স্টেট: Class, Year, Exam Type, Student ID (Search)
  const [selectedClass, setSelectedClass] = useState("all");
  const [targetYear, setTargetYear] = useState("২০২৬");
  const [examType, setExamType] = useState("বার্ষিক পরীক্ষা");
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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

  // ১. Backend থেকে স্টুডেন্ট ফেচ (Class ও Student ID সার্চ ভিত্তিক)
  const fetchStudents = async (term = searchTerm, cls = selectedClass) => {
    const trimmedTerm = (term || "").trim();
    const hasClass = cls && cls !== "all";

    if (!trimmedTerm && !hasClass) {
      setSelectedIds([]);
      setStudents([]);
      setResultSheets([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
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
      if (targetYear) {
        params.append("sessionYear", targetYear);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_API}/api/students?${params.toString()}`,
      );
      const result = await response.json();

      if (result.success) {
        const fetchedStudents = (result.data || []).sort(
          (a, b) =>
            (parseInt(a.roll, 10) || Infinity) -
            (parseInt(b.roll, 10) || Infinity),
        );
        if (fetchedStudents.length > 0) {
          setStudents(fetchedStudents);
          const matchedIds = fetchedStudents.map((s) => s.studentId);
          setSelectedIds(matchedIds);
        } else {
          if (trimmedTerm) {
            setStudents([]);
            setSelectedIds([trimmedTerm]);
          } else {
            setStudents([]);
            setSelectedIds([]);
            setError("এই শ্রেণীতে কোনো শিক্ষার্থী পাওয়া যায়নি।");
          }
        }
      } else {
        setError(result.message || "শিক্ষার্থীদের তথ্য লোড করা যায়নি।");
      }
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।");
    } finally {
      setLoading(false);
    }
  };

  // সার্চ হ্যান্ডলার
  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    if (!trimmed && (!selectedClass || selectedClass === "all")) {
      setError(
        "অনুগ্রহ করে শিক্ষার্থীর আইডি লিখুন অথবা একটি শ্রেণী নির্বাচন করুন।",
      );
      return;
    }
    setError(null);
    setSearchTerm(trimmed);
    fetchStudents(trimmed, selectedClass);
  };

  // ২. রেজাল্ট ফেচিং
  useEffect(() => {
    const fetchStudentResults = async () => {
      if (selectedIds.length === 0) {
        setResultSheets([]);
        return;
      }
      try {
        setLoadingResults(true);
        setResultsError(null);

        let unpublishedMsg = null;

        const fetchPromises = selectedIds.map(async (studentId) => {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_API}/api/results/student/${studentId}?year=${encodeURIComponent(
              targetYear,
            )}&examType=${encodeURIComponent(examType)}`,
            {
              headers: {
                "x-user-email": user?.email || "",
                "x-user-role": user?.role || "",
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
        const validResults = fetchedResults.filter((item) => item !== null);
        setResultSheets(validResults);

        if (validResults.length === 0 && unpublishedMsg) {
          setResultsError(unpublishedMsg);
        }
      } catch (err) {
        console.error("Error fetching result sheets:", err);
        setResultsError("রেজাল্ট লোড করতে সমস্যা হয়েছে।");
      } finally {
        setLoadingResults(false);
      }
    };

    const timer = setTimeout(() => {
      fetchStudentResults();
    }, 0);
    return () => clearTimeout(timer);
  }, [selectedIds, targetYear, examType, user?.email, user?.role]);

  // বিষয়ভিত্তিক গ্রেড এবং গ্রেড পয়েন্ট নির্ধারণ
  const calculateSubjectGrade = (mark) => {
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
  const getGradeFromPoint = (point) => {
    const num = parseFloat(point) || 0;
    if (num >= 5.0) return "A+";
    if (num >= 4.0) return "A";
    if (num >= 3.0) return "A-";
    if (num >= 2.0) return "B";
    if (num >= 1.0) return "C";
    return "F";
  };

  // সামগ্রিক জিপিএ থেকে আন্তর্জাতিক গ্রেড বাউন্ডারি নির্ধারণ
  const getOverallGradeFromGPA = (gpaVal) => {
    return getGradeFromPoint(gpaVal);
  };

  // অবজেক্টের CT ও Exam যোগ করে মোট নম্বর বের করার হেলপার
  const parseExamData = (examObj) => {
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
  const getMarkForExamType = (item, currentExamType) => {
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
  const getFinalSubjectGradeForAnnual = (item) => {
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

    // কোনো একটি টার্মে F থাকলে বা পয়েন্ট ০ হলে বিষয়ে ফেল (< 40)
    if (g1.point === 0 || g2.point === 0 || gAnn.point === 0) {
      return { grade: "F", gpa: "০.০০", point: 0.0 };
    }

    // ৩টি টার্মের গ্রেড পয়েন্টের গড়
    const avgPoint = (g1.point + g2.point + gAnn.point) / 3;
    const finalGrade = getGradeFromPoint(avgPoint);

    return {
      grade: finalGrade,
      gpa: toBengaliDigits(avgPoint.toFixed(2)),
      point: avgPoint,
    };
  };

  // বার্ষিক পরীক্ষায় শতকরা বা ১০০-এর স্কেলে মার্ক নরমালাইজেশন
  const getNormalizedMarkForGrade = (item, currentExamType) => {
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
  const isSubjectAbsent = (item, currentExamType) => {
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

  // আন্তর্জাতিক গ্রেডিং সিস্টেম ও উপস্থিতি ভিত্তিক সামারি ক্যালকুলেশন
  const calculateSummary = (resultsList = [], currentExamType) => {
    if (!resultsList || resultsList.length === 0) {
      return {
        totalObtained: "০",
        average: "০.০০",
        grade: "-",
        gpa: "০.০০",
        status: "অনুপস্থিত",
      };
    }

    const totalSubjects = resultsList.length;
    let absentCount = 0;
    let totalObtained = 0;
    let validCount = 0;
    let hasFailedCompulsory = false;
    let totalGradePoints = 0;
    let totalNormalizedMarks = 0;

    resultsList.forEach((item) => {
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

    // ১. সকল বিষয়ে অনুপস্থিত থাকলে -> Status = "অনুপস্থিত"
    if (absentCount === totalSubjects) {
      return {
        totalObtained: "অনুঃ",
        average: "-",
        grade: "অনুঃ",
        gpa: "০.০০",
        status: "অনুপস্থিত",
      };
    }

    // ২. কিছু বিষয়ে অনুপস্থিত থাকলে (সবগুলোতে নয়) -> Status = "অসম্পূর্ণ"
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
      };
    }

    // ৩. সকল বিষয়ে উপস্থিত থাকলে -> গ্রেড ও জিপিএ সাধারণ নিয়মে হিসাব করা হবে
    const avgMarks =
      validCount > 0
        ? (
            (currentExamType === "বার্ষিক পরীক্ষা"
              ? totalNormalizedMarks
              : totalObtained) / validCount
          ).toFixed(2)
        : "0.00";

    // কোনো বিষয়ে ফেল থাকলে (< 40) সামগ্রিক গ্রেড বাধ্যতামূলকভাবে 'F' এবং জিপিএ ০.০০
    if (hasFailedCompulsory) {
      return {
        totalObtained: toBengaliDigits(totalObtained),
        average: toBengaliDigits(avgMarks),
        grade: "F",
        gpa: "০.০০",
        status: "অকৃতকার্য",
      };
    }

    // সকল বিষয়ে পাস করলে জিপিএ ও গ্রেড নির্ধারণ
    const rawGPA = Math.min(5.0, totalGradePoints / totalSubjects);
    const calculatedGPA = rawGPA.toFixed(2);
    const overallGrade = getOverallGradeFromGPA(rawGPA);

    return {
      totalObtained: toBengaliDigits(totalObtained),
      average: toBengaliDigits(avgMarks),
      grade: overallGrade,
      gpa: toBengaliDigits(calculatedGPA),
      status: "উত্তীর্ণ",
    };
  };

  // একাধিক শিক্ষার্থীর রেজাল্ট একসাথে লোড হলে মোট নম্বরের (Total Marks) ভিত্তিতে মেধাস্থান হিসাব
  const clientMeritMap = useMemo(() => {
    const map = new Map();
    if (!resultSheets || resultSheets.length === 0) return map;

    const passed = [];
    resultSheets.forEach((sheet) => {
      const resultsList = sheet.results || [];
      const summary = calculateSummary(resultsList, examType);
      const isPassed =
        summary.status === "উত্তীর্ণ" &&
        summary.grade !== "F" &&
        summary.grade !== "অনুঃ" &&
        summary.grade !== "অসম্পূর্ণ";

      const totalMarks =
        resultsList.reduce((sum, item) => {
          const m = getMarkForExamType(item, examType);
          return typeof m === "number" ? sum + m : sum;
        }, 0) || 0;

      const sid = String(sheet.studentId || sheet.student?.studentId || "");
      const rollNum =
        parseInt(sheet.student?.roll || sheet.student?.officeUse?.rollNumber, 10) ||
        999999;
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
  }, [resultSheets, examType]);

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

          {/* ১. হেডার ও প্রিন্ট বাটন (গোল্ডেন একসেন্ট সহ) */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-emerald-800/60">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 bg-amber-950/60 border border-amber-500/30 px-3.5 py-1 rounded-full inline-block mb-2 shadow-inner">
                ✦ রেজাল্ট ম্যানেজমেন্ট প্যানেল ✦
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-100 flex items-center gap-2">
                রেজাল্ট শিট জেনারেটর
              </h1>
            </div>

            {/* প্রিন্ট বাটন (রয়্যাল গোল্ডেন স্টাইল) */}
            <button
              onClick={handlePrint}
              disabled={selectedIds.length === 0}
              className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg shrink-0 ${
                selectedIds.length === 0
                  ? "bg-emerald-950/80 text-emerald-700 border border-emerald-900/60 cursor-not-allowed"
                  : "bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-emerald-950 shadow-amber-500/20 active:scale-95 cursor-pointer font-black"
              }`}
            >
              <span className="text-lg">🖨️</span>
              <span>রেজাল্ট শিট প্রিন্ট করুন</span>
            </button>
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

          .signature-controller,
          .signature-principal {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            image-rendering: -webkit-optimize-contrast !important;
            image-rendering: crisp-edges !important;
          }
        }
      `}</style>

      {loadingResults || loading ? (
        <div className="print:hidden text-center py-12 bg-white dark:bg-[#0f172a] rounded-lg p-4 max-w-7xl mx-auto text-teal-600 font-bold">
          রেজাল্ট লোড হচ্ছে...
        </div>
      ) : resultsError ? (
        <div className="print:hidden text-center py-12 text-red-500 font-bold">
          {resultsError}
        </div>
      ) : (
        <div className="print-area-container flex flex-col items-center gap-8">
          {resultSheets.map((resData, index) => {
            // ১. রেজাল্ট ডাটা থেকে স্টুডেন্ট আইডি বের করা
            const currentStudentId =
              resData.studentId ||
              resData.student?.studentId ||
              resData.student;

            // ২. 'students' স্টেট থেকে আসল স্টুডেন্টের সব ইনফরমেশন খুঁজে বের করা
            const matchedStudent =
              students.find((s) => s.studentId === currentStudentId) || {};

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

            const results = resData.results || [];
            const summary = calculateSummary(results, examType);
            const studentMerit =
              resData.meritPosition && resData.meritPosition !== "-"
                ? resData.meritPosition
                : clientMeritMap.get(String(currentStudentId)) || "-";

            return (
              <div
                key={student.studentId || index}
                className="page-break relative bg-white box-border flex flex-col justify-between text-black w-full max-w-[210mm] min-h-[297mm] shadow-xl rounded-sm my-4"
              >
                {/* কার্ডের গোল্ডেন ট্রিপল আউটার বর্ডার */}
                <div className="w-full h-full border-[3px] border-[#C5A059] p-1 box-border relative">
                  <div className="w-full h-full border border-[#C5A059] p-2 flex flex-col justify-between box-border relative">
                    {/* ব্যাকগ্রাউন্ড ওয়াটারমার্ক */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-[0.05]">
                      <div className="w-[420px] h-[420px] rounded-full overflow-hidden flex items-center justify-center">
                        <Image
                          src="/aimlogo1.png"
                          alt="Watermark Logo"
                          width={420}
                          height={420}
                          className="w-full h-full object-cover scale-[1.05] transform-gpu"
                        />
                      </div>
                    </div>

                    {/* মূল কন্টেন্ট */}
                    <div className="relative z-10 flex-1 flex flex-col justify-between">
                      <div className="flex-1 flex flex-col">
                        {/* হেডার: লোগো ও মাদরাসার নাম */}
                        <div>
                          <div className="flex justify-between items-center relative gap-2 flex-shrink-0 w-full overflow-hidden">
                            {/* মাদ্রাসার লোগো */}
                            <div className="w-20 h-20 md:w-45 md:h-45 print:!w-36 print:!h-36 rounded-full overflow-hidden flex-shrink-0 bg-transparent relative flex items-center justify-center -mr-3">
                              <Image
                                src={"/aimlogo1.png"}
                                alt="Institution Logo"
                                width={200}
                                height={200}
                                quality={100}
                                priority
                                className="w-full h-full object-cover scale-[1.08] transform-gpu"
                              />
                            </div>

                            {/* লোগো ও ছবির মাঝখানে ব্যানার */}
                            <div className="flex-1 text-center min-w-0">
                              <div className="flex-grow text-center">
                                <Image
                                  src={"/banner_routine.png"}
                                  alt="Institution Banner"
                                  width={1000}
                                  height={400}
                                  quality={100}
                                  priority
                                  className="w-full h-auto max-h-45 object-fill mx-auto print:max-h-45"
                                />
                              </div>
                            </div>
                          </div>

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
                                {examType} -{" "}
                                {toBengaliDigits(
                                  (resData.year || "").split(/[-–/]/)[0].trim(),
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

                                {examType === "বার্ষিক পরীক্ষা" && (
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
                                  {examType === "বার্ষিক পরীক্ষা"
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
                                      examType === "বার্ষিক পরীক্ষা" ? 7 : 4
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
                                    examType,
                                  );

                                  let gradeInfo;
                                  if (examType === "বার্ষিক পরীক্ষা") {
                                    gradeInfo =
                                      getFinalSubjectGradeForAnnual(item);
                                  } else {
                                    const normalizedMark =
                                      getNormalizedMarkForGrade(item, examType);
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
                                      key={idx}
                                      className="border-b border-[#C5A059]"
                                    >
                                      <td className="border border-[#C5A059] p-1.5 text-left px-2.5 font-semibold">
                                        {item.subject}
                                      </td>

                                      {examType === "বার্ষিক পরীক্ষা" && (
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
                                        className={`border border-[#C5A059] p-1.5 font-bold ${
                                          gradeInfo.grade === "F" ||
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
                          <div className="grid grid-cols-5 gap-2 text-center text-xs font-bold text-gray-800">
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
                          </div>
                        </div>
                      </div>

                      {/* ফুটার লেআউট (স্বাক্ষর এরিয়া এবং সোশ্যাল ও কন্টাক্ট ইনফো) */}
                      <div className="mt-auto flex-shrink-0 pt-2 relative z-10">
                        <div className="flex justify-between items-end mb-2 px-4">
                          {/* পরীক্ষা নিয়ন্ত্রক এর স্বাক্ষর */}
                          <div className="text-center flex flex-col items-center relative">
                            <div className="relative w-36 h-10">
                              <Image
                                src={"/anarul.png"}
                                alt="Controller Signature"
                                width={200}
                                height={60}
                                unoptimized
                                className="signature-controller absolute -top-2 right-8 h-12 w-20 object-contain mix-blend-multiply contrast-[800%] brightness-[60%] grayscale -rotate-90"
                              />
                            </div>
                            <div className="w-28 border-b border-gray-800 mb-0.5"></div>
                            <span className="text-[9.5px] font-bold text-gray-800">
                              পরীক্ষা নিয়ন্ত্রকের স্বাক্ষর
                            </span>
                          </div>

                          {/* প্রিন্সিপাল এর স্বাক্ষর */}
                          <div className="text-center flex flex-col items-center relative">
                            <div className="relative w-36 h-10">
                              <Image
                                src={"/principle's_signature.jpg"}
                                alt="Principal Signature"
                                width={100}
                                height={40}
                                unoptimized
                                className="signature-principal absolute -top-2 right-8 h-12 w-20 object-contain mix-blend-multiply contrast-[800%] brightness-[85%] grayscale -rotate-45"
                              />
                            </div>
                            <div className="w-28 border-b border-gray-800 mb-0.5"></div>
                            <span className="text-[9.5px] font-bold text-gray-800">
                              প্রিন্সিপালের স্বাক্ষর
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
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
