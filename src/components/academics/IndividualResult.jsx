"use client";

import { Globe, Mail, Phone, Search } from "lucide-react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import React, { useState, useEffect } from "react";
import { BsWhatsapp, BsYoutube } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";

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

  // ফিল্টারিং স্টেট: Year, Exam Type, Student ID (Search)
  const [targetYear, setTargetYear] = useState("২০২৬");
  const [examType, setExamType] = useState("বার্ষিক পরীক্ষা");
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // সার্চ বাটন প্রেসের পর কাজের জন্য স্টেট

  const sessionYears = ["২০২৬", "২০২৫", "২০২৪", "২০২৩", "২০২২"];

  // ১. Backend থেকে স্টুডেন্ট ফেচ (Student ID সার্চ ভিত্তিক)
  const fetchStudents = async () => {
    if (!searchTerm) return;
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        status: "Approved",
        search: searchTerm,
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_API}/api/students?${params.toString()}`,
      );
      const result = await response.json();

      if (result.success) {
        const fetchedStudents = result.data || [];
        if (fetchedStudents.length > 0) {
          setStudents(fetchedStudents);
          const matchedIds = fetchedStudents.map((s) => s.studentId);
          setSelectedIds(matchedIds);
        } else {
          // সরাসরি সার্চ করা আইডিকে ধরে নেওয়ার চেষ্টা
          setSelectedIds([searchTerm]);
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

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents();
    }, 0);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // সার্চ হ্যান্ডলার
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setSearchTerm(searchInput.trim());
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
            )}`,
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
  }, [selectedIds, targetYear, user?.email, user?.role]);

  // বিষয়ভিত্তিক গ্রেড এবং গ্রেড পয়েন্ট নির্ধারণ (International Grading System)
  const calculateSubjectGrade = (mark) => {
    if (mark === "ABS" || mark === "A" || mark === "Abs") {
      return { grade: "ABS", gpa: "0.00", point: 0.0 };
    }
    const num = typeof mark === "number" ? mark : parseFloat(mark);
    if (isNaN(num)) return { grade: "-", gpa: "0.00", point: 0.0 };
    if (num >= 80) return { grade: "A+", gpa: "5.00", point: 5.0 };
    if (num >= 70) return { grade: "A", gpa: "4.00", point: 4.0 };
    if (num >= 60) return { grade: "A-", gpa: "3.50", point: 3.5 };
    if (num >= 50) return { grade: "B", gpa: "3.00", point: 3.0 };
    if (num >= 40) return { grade: "C", gpa: "2.00", point: 2.0 };
    if (num >= 33) return { grade: "D", gpa: "1.00", point: 1.0 };
    return { grade: "F", gpa: "0.00", point: 0.0 };
  };

  // GPA পয়েন্ট অনুযায়ী লেটার গ্রেড বের করার নিয়ম
  const getGradeFromPoint = (point) => {
    const num = parseFloat(point) || 0;
    if (num >= 5.0) return "A+";
    if (num >= 4.0) return "A";
    if (num >= 3.5) return "A-";
    if (num >= 3.0) return "B";
    if (num >= 2.0) return "C";
    if (num >= 1.0) return "D";
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

    if (
      isAbsent ||
      ct === "A" ||
      exam === "A" ||
      ct === "ABS" ||
      exam === "ABS" ||
      ct === "Abs" ||
      exam === "Abs"
    ) {
      return "ABS";
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
      if (ann === "ABS" || t1 === "ABS" || t2 === "ABS") return "ABS";

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

    if (t1 === "ABS" || t2 === "ABS" || ann === "ABS") {
      return { grade: "ABS", gpa: "0.00", point: 0.0 };
    }
    if (t1 === "-" && t2 === "-" && ann === "-") {
      return { grade: "-", gpa: "0.00", point: 0.0 };
    }

    const g1 = calculateSubjectGrade(t1);
    const g2 = calculateSubjectGrade(t2);
    const gAnn = calculateSubjectGrade(ann);

    // কোনো একটি টার্মে F থাকলে বা পয়েন্ট ০ হলে বিষয়ে ফেল
    if (g1.point === 0 || g2.point === 0 || gAnn.point === 0) {
      return { grade: "F", gpa: "0.00", point: 0.0 };
    }

    // ৩টি টার্মের গ্রেড পয়েন্টের গড়
    const avgPoint = (g1.point + g2.point + gAnn.point) / 3;
    const finalGrade = getGradeFromPoint(avgPoint);

    return {
      grade: finalGrade,
      gpa: avgPoint.toFixed(2),
      point: avgPoint,
    };
  };

  // বার্ষিক পরীক্ষায় শতকরা বা ১০০-এর স্কেলে মার্ক নরমালাইজেশন
  const getNormalizedMarkForGrade = (item, currentExamType) => {
    const mark = getMarkForExamType(item, currentExamType);
    if (mark === "ABS" || mark === "-") return mark;
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
      examStr === "A" ||
      examStr === "ABS"
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
        totalObtained: 0,
        average: "0.00",
        grade: "-",
        gpa: "0.00",
        status: "Absent",
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

    // ১. সকল বিষয়ে অনুপস্থিত থাকলে -> Status = "Absent"
    if (absentCount === totalSubjects) {
      return {
        totalObtained: 0,
        average: "0.00",
        grade: "ABS",
        gpa: "0.00",
        status: "Absent",
      };
    }

    // ২. কিছু বিষয়ে অনুপস্থিত থাকলে (সবগুলোতে নয়) -> Status = "Incomplete"
    if (absentCount > 0) {
      return {
        totalObtained,
        average:
          validCount > 0
            ? (
                (currentExamType === "বার্ষিক পরীক্ষা"
                  ? totalNormalizedMarks
                  : totalObtained) / validCount
              ).toFixed(2)
            : "0.00",
        grade: "INC",
        gpa: "0.00",
        status: "Incomplete",
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

    // কোনো আবশ্যিক বিষয়ে ফেল থাকলে সামগ্রিক গ্রেড বাধ্যতামূলকভাবে 'F' এবং জিপিএ 0.00
    if (hasFailedCompulsory) {
      return {
        totalObtained,
        average: avgMarks,
        grade: "F",
        gpa: "0.00",
        status: "Failed",
      };
    }

    // সকল বিষয়ে পাস করলে জিপিএ ও গ্রেড নির্ধারণ
    const calculatedGPA = (totalGradePoints / totalSubjects).toFixed(2);
    const overallGrade = getOverallGradeFromGPA(calculatedGPA);

    return {
      totalObtained,
      average: avgMarks,
      grade: overallGrade,
      gpa: calculatedGPA,
      status: "Passed",
    };
  };

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
                রেজাল্ট শিট জেনারেটর ড্যাশবোর্ড
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
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                  selectedIds.length === 0
                    ? "bg-emerald-900/50 text-emerald-700"
                    : "bg-emerald-950/40 text-emerald-950"
                }`}
              >
                {selectedIds.length}
              </span>
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
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* ১. শিক্ষার্থী আইডি */}
              <div className="md:col-span-5 bg-[#083c2e]/60 p-3.5 rounded-2xl border border-emerald-700/40 focus-within:border-amber-400/60 focus-within:ring-1 focus-within:ring-amber-400/50 transition-all">
                <label className="block text-[11px] font-extrabold text-emerald-300 uppercase tracking-wider mb-1.5">
                  ১. শিক্ষার্থীর আইডি
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Student ID দিয়ে খুঁজুন..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full bg-[#031d16] text-emerald-100 placeholder-emerald-600/70 border border-emerald-800/80 rounded-xl py-2 px-3.5 text-sm focus:outline-none focus:border-amber-400 transition-all"
                  />
                </div>
              </div>

              {/* ২. শিক্ষাবর্ষ */}
              <div className="md:col-span-3 bg-[#083c2e]/60 p-3.5 rounded-2xl border border-emerald-700/40 focus-within:border-amber-400/60 transition-all">
                <label className="block text-[11px] font-extrabold text-emerald-300 uppercase tracking-wider mb-1.5">
                  ২. শিক্ষাবর্ষ
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

              {/* ৩. পরীক্ষার নাম */}
              <div className="md:col-span-4 bg-[#083c2e]/60 p-3.5 rounded-2xl border border-emerald-700/40 focus-within:border-amber-400/60 transition-all">
                <label className="block text-[11px] font-extrabold text-emerald-300 uppercase tracking-wider mb-1.5">
                  ৩. পরীক্ষার নাম
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

            {/* ৩. খুঁজুন বাটন (ইসলামিক ডিপ গ্রিন ও গোল্ডেন হোভার) */}
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

            const results = resData.results || [];
            const summary = calculateSummary(results, examType);

            return (
              <div
                key={student.studentId || index}
                className="page-break relative bg-white box-border flex flex-col justify-between text-black w-full max-w-[210mm] min-h-[297mm] shadow-xl rounded-sm my-4"
              >
                {/* কার্ডের গোল্ডেন ট্রিপল আউটার বর্ডার */}
                <div className="w-full h-full border-[3px] border-[#C5A059] p-1 box-border relative">
                  <div className="w-full h-full border border-[#C5A059] p-2 flex flex-col justify-between box-border relative">
                    {/* ব্যাকগ্রাউন্ড ওয়াটারমার্ক */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.06]">
                      <div className="w-[500px] h-[500px] rounded-full overflow-hidden flex items-center justify-center">
                        <Image
                          src="/aimlogo1.png"
                          alt="Watermark Logo"
                          width={500}
                          height={500}
                          className="w-full h-full object-cover scale-[1.05] transform-gpu"
                        />
                      </div>
                    </div>

                    {/* মূল কন্টেন্ট */}
                    <div className="relative z-10 flex-1 flex flex-col justify-between overflow-hidden">
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
                          {/* বাম পাশে QR Code */}
                          <div className="p-1 border border-gray-300 rounded bg-white shadow-sm">
                            <QRCodeSVG
                              value={`STUDENT-RESULT:${student.studentId}`}
                              size={52}
                            />
                          </div>

                          {/* মাঝখানে ক্যাপসুল টাইটেল */}
                          <div className="text-center">
                            <div className="bg-[#043e30] text-white px-5 py-1 rounded-full inline-block font-bold text-xs tracking-wide shadow-sm">
                              মার্কসীট
                            </div>
                            <p className="text-[11px] font-bold text-gray-800 mt-1">
                              {examType} -{" "}
                              {(resData.year || "").split(/[-–/]/)[0].trim()}
                            </p>
                            <p className="text-[11px] font-bold text-gray-800">
                              শ্রেণি: {student.class || "N/A"}
                            </p>
                          </div>

                          {/* ডান পাশে ছবি বা N/A বক্স */}
                          <div className="w-14 h-16 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden text-[10px] text-gray-400 font-bold">
                            {student?.studentImage ? (
                              <Image
                                src={student?.studentImage}
                                alt="Student"
                                width={56}
                                height={64}
                                priority
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              "N/A"
                            )}
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
                              {student.name}
                            </span>
                          </div>

                          {/* ২. আইডি */}
                          <div className="flex items-end">
                            <span className="font-bold w-16 shrink-0">
                              আইডি:
                            </span>
                            <span className="font-bold border-b border-dashed border-gray-400 flex-1">
                              {student.studentId}
                            </span>
                          </div>

                          {/* ৩. পিতার নাম */}
                          <div className="flex items-end">
                            <span className="font-bold w-20 shrink-0">
                              পিতার নাম:
                            </span>
                            <span className="border-b border-dashed border-gray-400 flex-1 truncate">
                              {student.fatherNameBangla || "N/A"}
                            </span>
                          </div>

                          {/* ৪. রোল নং */}
                          <div className="flex items-end">
                            <span className="font-bold w-16 shrink-0">
                              রোল নং:
                            </span>
                            <span className="border-b border-dashed border-gray-400 flex-1">
                              {student.roll || "N/A"}
                            </span>
                          </div>

                          {/* ৫. উপজেলা */}
                          <div className="flex items-end">
                            <span className="font-bold w-20 shrink-0">
                              উপজেলা:
                            </span>
                            <span className="border-b border-dashed border-gray-400 flex-1">
                              {student.currentAddress?.thana || "চুনারুঘাট"}
                            </span>
                          </div>

                          {/* ৬. জেলা */}
                          <div className="flex items-end">
                            <span className="font-bold w-16 shrink-0">
                              জেলা:
                            </span>
                            <span className="border-b border-dashed border-gray-400 flex-1">
                              {student.currentAddress?.district || "হবিগঞ্জ"}
                            </span>
                          </div>
                        </div>
                        {/* টেবিল হেডার টাইটেল */}
                        <div className="text-center font-bold text-xs my-1 text-gray-800">
                          বিষয়ভিত্তিক নম্বর বিবরণী
                        </div>
                      </div>

                      {/* নম্বর টেবিল */}
                      <div className="my-1 flex-1">
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
                                  ? "মোট মার্কস"
                                  : "প্রাপ্ত মার্কস"}
                              </th>
                              <th className="border border-[#C5A059] p-1.5 w-16">
                                গ্রেড
                              </th>
                              <th className="border border-[#C5A059] p-1.5 w-14">
                                জিপি (GP)
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
                                          {t1}
                                        </td>
                                        <td className="border border-[#C5A059] p-1.5">
                                          {t2}
                                        </td>
                                        <td className="border border-[#C5A059] p-1.5">
                                          {ann}
                                        </td>
                                      </>
                                    )}

                                    <td className="border border-[#C5A059] p-1.5 font-bold">
                                      {finalMark}
                                    </td>
                                    <td className="border border-[#C5A059] p-1.5 font-bold">
                                      {gradeInfo.grade}
                                    </td>
                                    <td className="border border-[#C5A059] p-1.5">
                                      {gradeInfo.gpa}
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* সামারি সেকশন */}
                      <div className="mt-2 border border-[#C5A059] bg-[#fcf8ed] p-2 rounded-sm">
                        <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold text-gray-800">
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
                        </div>
                      </div>

                      <div className="flex justify-between items-end my-1 px-4 flex-shrink-0">
                        {/* পরীক্ষা নিয়ন্ত্রক এর স্বাক্ষর */}
                        <div className="text-center flex flex-col items-center print:mt-auto relative">
                          <div className="relative w-36 h-10">
                            <Image
                              src={"/anarul.png"}
                              alt="Controller Signature"
                              width={200}
                              height={60}
                              unoptimized
                              className="absolute -top-2 right-8 h-12 w-20 object-contain mix-blend-multiply contrast-[800%] brightness-[60%] grayscale -rotate-90"
                            />
                          </div>
                          <div className="w-28 border-b border-gray-800 mb-0.5"></div>
                          <span className="text-[9.5px] font-bold text-gray-800">
                            পরীক্ষা নিয়ন্ত্রকের স্বাক্ষর
                          </span>
                        </div>

                        {/* প্রিন্সিপাল এর স্বাক্ষর */}
                        <div className="text-center flex flex-col items-center">
                          <div className="relative w-36 h-10 print:mt-auto">
                            <Image
                              src={"/principle's_signature.jpg"}
                              alt="Principal Signature"
                              width={100}
                              height={40}
                              unoptimized
                              className="absolute -top-2 right-8 h-12 w-20 object-contain mix-blend-multiply contrast-[800%] brightness-[80%] grayscale -rotate-45"
                            />
                          </div>
                          <div className="w-28 border-b border-gray-800 mb-0.5"></div>
                          <span className="text-[9.5px] font-bold text-gray-800">
                            প্রিন্সিপালের স্বাক্ষর
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="relative z-10 mt-auto pt-1 border-t border-gray-300 flex-shrink-0">
                      <div className="flex flex-wrap justify-center items-center gap-x-1 gap-y-0.5 text-[8.5px] font-semibold text-gray-800">
                        <span className="flex items-center gap-0.5">
                          <Phone className="w-2.5 h-2.5 text-gray-700" />
                          01316-209201
                        </span>

                        <span className="flex items-center gap-0.5">
                          <BsWhatsapp className="w-2.5 h-2.5 text-green-600" />
                          01748-886161
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
            );
          })}
        </div>
      )}
    </div>
  );
}
