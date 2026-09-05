"use client";

import { Globe, Mail, Phone, Search } from "lucide-react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import React, { useState, useEffect } from "react";
import { BsWhatsapp, BsYoutube } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";

export default function ResultSheetGenerator() {
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

  const sessionYears = [
    "২০২৬",
    "২০২৫",
    "২০২৪",
    "২০২৩",
    "২০২২",
  ];

  // ১. Backend থেকে স্টুডেন্ট ফেচ (Student ID সার্চ ভিত্তিক)
  useEffect(() => {
    fetchStudents();
  }, [searchTerm]);

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

        const fetchPromises = selectedIds.map(async (studentId) => {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_API}/api/results/student/${studentId}?year=${encodeURIComponent(
              targetYear,
            )}`,
          );
          const data = await res.json();
          return data.success ? data : null;
        });

        const fetchedResults = await Promise.all(fetchPromises);
        setResultSheets(fetchedResults.filter((item) => item !== null));
      } catch (err) {
        console.error("Error fetching result sheets:", err);
        setResultsError("রেজাল্ট লোড করতে সমস্যা হয়েছে।");
      } finally {
        setLoadingResults(false);
      }
    };

    fetchStudentResults();
  }, [selectedIds, targetYear]);

  // গ্রেড ক্যালকুলেশন ফাংশন (Incomplete/ABS সাপোর্টসহ)
  const calculateGrade = (mark) => {
    if (mark === "ABS") return { grade: "INC", gpa: "0.00" };
    const num = Number(mark) || 0;
    if (num >= 80) return { grade: "A+", gpa: "5.00" };
    if (num >= 70) return { grade: "A", gpa: "4.00" };
    if (num >= 60) return { grade: "A-", gpa: "3.50" };
    if (num >= 50) return { grade: "B", gpa: "3.00" };
    if (num >= 40) return { grade: "C", gpa: "2.00" };
    if (num >= 33) return { grade: "D", gpa: "1.00" };
    return { grade: "F", gpa: "0.00" };
  };

  // অবজেক্টের CT ও Exam যোগ করে মোট নম্বর বের করার হেলপার
  const parseExamData = (examObj) => {
    if (!examObj || Object.keys(examObj).length === 0) return "-";

    const { ct, exam } = examObj;

    if (ct === "A" || exam === "A" || ct === "ABS" || exam === "ABS") {
      return "ABS";
    }

    const ctNum = typeof ct === "number" ? ct : parseFloat(ct) || 0;
    const examNum = typeof exam === "number" ? exam : parseFloat(exam) || 0;

    if (ct === undefined && exam === undefined) return "-";

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
      if (t1 === "ABS" || t2 === "ABS" || ann === "ABS") return "ABS";

      const num1 = typeof t1 === "number" ? t1 : 0;
      const num2 = typeof t2 === "number" ? t2 : 0;
      const numAnn = typeof ann === "number" ? ann : 0;

      if (t1 === "-" && t2 === "-" && ann === "-") return "-";
      return num1 + num2 + numAnn;
    }
    return "-";
  };

  // ওভারঅল সামারি ক্যালকুলেশন (INC ও অসম্পূর্ণ স্টেটাসসহ)
  const calculateSummary = (resultsList = [], currentExamType) => {
    let totalObtained = 0;
    let validCount = 0;
    let hasABS = false;

    resultsList.forEach((item) => {
      const mark = getMarkForExamType(item, currentExamType);
      if (mark === "ABS") {
        hasABS = true;
      } else if (typeof mark === "number") {
        totalObtained += mark;
        validCount++;
      }
    });

    if (hasABS) {
      return {
        totalObtained,
        average: "0.00",
        grade: "INC",
        gpa: "0.00",
        status: "অসম্পূর্ণ",
      };
    }

    const avg =
      validCount > 0 ? (totalObtained / validCount).toFixed(2) : "0.00";
    const overallGrade = calculateGrade(avg);

    return {
      totalObtained,
      average: avg,
      grade: overallGrade.grade,
      gpa: overallGrade.gpa,
      status: overallGrade.grade === "F" ? "অকৃতকার্য" : "উত্তীর্ণ",
    };
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#09101d] text-gray-800 dark:text-gray-200 p-3 sm:p-4 md:p-6">
      {/* ----------------- ১. কন্ট্রোল ড্যাশবোর্ড (প্রিন্টে হাইড থাকবে) ----------------- */}
      <div className="print:hidden max-w-7xl mx-auto bg-white dark:bg-[#0f172a] p-4 sm:p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-md mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-[#043e30] dark:text-emerald-400 mb-4 sm:mb-6 border-b dark:border-slate-800 pb-2">
          রেজাল্ট শিট জেনারেটর ড্যাশবোর্ড
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
        >
          {/* ১. শিক্ষার্থীর আইডি */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              শিক্ষার্থীর আইডি
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Student ID দিয়ে খুঁজুন..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-md py-2 pl-3 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              />
            </div>
          </div>

          {/* ২. শিক্ষাবর্ষ ফিল্টার */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              শিক্ষাবর্ষ
            </label>
            <select
              value={targetYear}
              onChange={(e) => setTargetYear(e.target.value)}
              className="w-full border border-gray-300 dark:border-slate-700 rounded-md p-2 text-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {sessionYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* ৩. পরীক্ষার নাম ও খুঁজুন বাটন */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              পরীক্ষার নাম
            </label>
            <div className="flex items-center gap-2">
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className="w-full border border-gray-300 dark:border-slate-700 rounded-md p-2 text-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="১ম সাময়িক পরীক্ষা">১ম সাময়িক পরীক্ষা</option>
                <option value="২য় সাময়িক পরীক্ষা">২য় সাময়িক পরীক্ষা</option>
                <option value="বার্ষিক পরীক্ষা">বার্ষিক পরীক্ষা</option>
              </select>

              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-4 py-2 rounded-md text-sm transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
              >
                <Search className="w-4 h-4" />
                <span>খুঁজুন</span>
              </button>
            </div>
          </div>
        </form>

        {/* প্রিন্ট কন্ট্রোল */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t dark:border-slate-800 pt-4 mb-2">
          <button
            onClick={handlePrint}
            disabled={selectedIds.length === 0}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-md font-bold text-white transition ${
              selectedIds.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700 shadow-lg"
            }`}
          >
            🖨️ রেজাল্ট শিট প্রিন্ট করুন ({selectedIds.length})
          </button>
        </div>
      </div>

      {/* ----------------- ২. রেজাল্ট শিট প্রিভিউ (প্রিন্ট লেআউট) ----------------- */}
      <style jsx global>{`
        @media print {
          @page {
            size: A5 portrait;
            margin: 0mm !important;
          }

          html,
          body {
            width: 100% !important;
            height: 100% !important;
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
            width: 100%;
          }

          .page-break {
            width: 148mm !important;
            height: 209mm !important;
            margin: 0 auto !important;
            padding: 5mm !important;
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
                className="page-break relative bg-white box-border flex flex-col justify-between text-black"
              >
                {/* কার্ডের গোল্ডেন ট্রিপল আউটার বর্ডার */}
                <div className="w-full h-full border-[3px] border-[#C5A059] p-1 box-border relative">
                  <div className="w-full h-full border border-[#C5A059] p-2 flex flex-col justify-between box-border relative">
                    {/* ব্যাকগ্রাউন্ড ওয়াটারমার্ক */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.06]">
                      <div className="w-[280px] h-[280px] rounded-full overflow-hidden flex items-center justify-center">
                        <Image
                          src="/aimlogo1.png"
                          alt="Watermark Logo"
                          width={280}
                          height={280}
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
                          <div className="w-22 h-22 rounded-full overflow-hidden flex-shrink-0 relative flex items-center justify-center">
                            <Image
                              src={"/aimlogo1.png"}
                              alt="Institution Logo"
                              width={120}
                              height={120}
                              quality={100}
                              priority
                              className="w-full h-full object-cover scale-[1.05] transform-gpu"
                            />
                          </div>

                          {/* লোগো ও ছবির মাঝখানে ব্যানার */}
                          <div className="flex-1 text-center min-w-0">
                            <div className="w-full text-center">
                              <Image
                                src={"/banner.png"}
                                alt="Institution Banner"
                                width={1200}
                                height={240}
                                quality={100}
                                priority
                                className="w-full h-auto max-h-24 object-contain mx-auto"
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
                              {examType} - {(resData.year || "").split(/[-–/]/)[0].trim()}
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
                        <table className="w-full border-collapse border border-[#C5A059] text-center text-[10px]">
                          <thead>
                            <tr className="bg-[#fcf8ed] font-bold text-gray-800">
                              <th className="border border-[#C5A059] p-1 text-left px-2">
                                বিষয়
                              </th>

                              {examType === "বার্ষিক পরীক্ষা" && (
                                <>
                                  <th className="border border-[#C5A059] p-1 w-14">
                                    ১ম সাময়িক
                                  </th>
                                  <th className="border border-[#C5A059] p-1 w-14">
                                    ২য় সাময়িক
                                  </th>
                                  <th className="border border-[#C5A059] p-1 w-14">
                                    বার্ষিক
                                  </th>
                                </>
                              )}

                              <th className="border border-[#C5A059] p-1 w-16 font-bold">
                                {examType === "বার্ষিক পরীক্ষা"
                                  ? "মোট মার্কস"
                                  : "প্রাপ্ত মার্কস"}
                              </th>
                              <th className="border border-[#C5A059] p-1 w-12">
                                গ্রেড
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {results.length === 0 ? (
                              <tr>
                                <td
                                  colSpan={
                                    examType === "বার্ষিক পরীক্ষা" ? 6 : 4
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
                                const gradeInfo = calculateGrade(finalMark);

                                return (
                                  <tr
                                    key={idx}
                                    className="border-b border-[#C5A059]"
                                  >
                                    <td className="border border-[#C5A059] p-1 text-left px-2 font-semibold">
                                      {item.subject}
                                    </td>

                                    {examType === "১ম সাময়িক পরীক্ষা" && (
                                      <td className="border border-[#C5A059] p-1">
                                        {t1}
                                      </td>
                                    )}

                                    {examType === "২য় সাময়িক পরীক্ষা" && (
                                      <td className="border border-[#C5A059] p-1">
                                        {t2}
                                      </td>
                                    )}

                                    {examType === "বার্ষিক পরীক্ষা" && (
                                      <>
                                        <td className="border border-[#C5A059] p-1">
                                          {t1}
                                        </td>
                                        <td className="border border-[#C5A059] p-1">
                                          {t2}
                                        </td>
                                        <td className="border border-[#C5A059] p-1">
                                          {ann}
                                        </td>
                                        <td className="border border-[#C5A059] p-1 font-bold">
                                          {finalMark}
                                        </td>
                                      </>
                                    )}

                                    <td
                                      className={`border border-[#C5A059] p-1 font-bold ${
                                        gradeInfo.grade === "INC"
                                          ? "text-amber-600"
                                          : gradeInfo.grade === "F"
                                            ? "text-red-600"
                                            : "text-emerald-800"
                                      }`}
                                    >
                                      {gradeInfo.grade}
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>

                        {/* ফলাফল সামারি লাইন */}
                        <div className="flex justify-between items-center text-[10px] font-bold mt-2 bg-amber-50 p-1.5 border border-[#C5A059] rounded">
                          <span>মোট নম্বর: {summary.totalObtained}</span>
                          <span>গড়: {summary.average}</span>
                          <span>
                            গ্রেড: {summary.grade} ({summary.gpa})
                          </span>
                          <span
                            className={
                              summary.status === "অসম্পূর্ণ"
                                ? "text-amber-600"
                                : summary.status === "অকৃতকার্য"
                                  ? "text-red-600"
                                  : "text-emerald-800"
                            }
                          >
                            ফলাফল: {summary.status}
                          </span>
                        </div>
                      </div>

                      {/* দৃষ্টি আকর্ষণ / বিশেষ নির্দেশনা */}
                      <div className="my-2 text-[10px] text-gray-800">
                        <p className="font-bold text-xs mb-0.5">
                          দৃষ্টি আকর্ষণ:
                        </p>
                        <ul className="list-disc list-inside space-y-0.5 text-[9.5px]">
                          <li>
                            ফলাফলে কোনো অসঙ্গতি পরিলক্ষিত হলে তা অফিস চলাকালীন
                            সময়ে সংশোধনযোগ্য।
                          </li>
                          <li>
                            প্রিন্টেড মার্কশিট সংরক্ষণে অবহেলা করা যাবে না।
                          </li>
                        </ul>
                      </div>

                      {/* সিগনেচার সেকশন */}
                      <div className="flex justify-between items-end text-[10px] mt-4 pt-2 ">
                        <div className="text-center">
                          <div className="text-center flex flex-col items-center print:mt-auto relative">
                            <div className="relative w-28 h-5">
                              <Image
                                src={"/anarul.png"}
                                alt="Controller Signature"
                                width={100}
                                height={40}
                                unoptimized
                                className="absolute -top-1 right-6 h-6 w-12 object-contain mix-blend-multiply contrast-[800%] brightness-[60%] grayscale -rotate-90"
                              />
                            </div>
                            <div className="w-28 border-b border-gray-800 mb-0.5"></div>
                            <span className="text-[9.5px] font-bold text-gray-800">
                              শ্রেণি শিক্ষকের স্বাক্ষর
                            </span>
                          </div>
                        </div>

                        <div className="text-center">
                          {/* প্রিন্সিপাল এর স্বাক্ষর */}
                          <div className="text-center flex flex-col items-center">
                            <div className="relative w-28 h-5 print:mt-auto relative">
                              <Image
                                src={"/principle's_signature.jpg"}
                                alt="Principal Signature"
                                width={100}
                                height={40}
                                unoptimized
                                className="absolute -top-1 right-6 h-6 w-12 object-contain mix-blend-multiply contrast-[800%] brightness-[80%] grayscale -rotate-45"
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
