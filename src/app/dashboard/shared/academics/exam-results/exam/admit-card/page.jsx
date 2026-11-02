"use client";

import Pagination from "@/components/dashboard/Pagination";
import StudentFilterBar from "@/components/dashboard/students/StudentFilterBar";
import AutoScaledText from "@/components/shared/AutoScaledText";
import PrintInstitutionalHeader from "@/components/shared/print/PrintInstitutionalHeader";
import PrintSignatures from "@/components/shared/print/PrintSignatures";
import PrintSocialFooter from "@/components/shared/print/PrintSocialFooter";
import {
  getStudentClassDetails,
  RECENT_SESSION_YEARS,
} from "@/lib/studentUtils";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useReactToPrint } from "react-to-print";

const ADMIT_CARD_PAGE_STYLE = `
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

    .print-area-container {
      width: 100% !important;
      gap: 0 !important;
    }

    .page-break {
      width: 148mm !important;
      height: 209mm !important;
      margin: 0 auto !important;
      padding: 6mm !important;
      box-sizing: border-box !important;
      page-break-after: always !important;
      break-after: page !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
      overflow: hidden !important;
    }
  }
`;

export default function AdmitCardGenerator() {
  const printAreaRef = useRef(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  // এডমিট কার্ডের জন্য ডায়নামিক ডাটা ও স্টেটসমূহ
  const [admitCards, setAdmitCards] = useState([]);
  const [loadingAdmitCards, setLoadingAdmitCards] = useState(false);
  const [admitCardsError, setAdmitCardsError] = useState(null);

  // পরীক্ষার তথ্য স্টেটসমূহ (Admit Card Customization)
  const [examName, setExamName] = useState("");
  const [examList, setExamList] = useState([]);
  const [examTime, setExamTime] = useState("");

  // ফিল্টারিং স্টেটসমূহ
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSession, setSelectedSession] = useState("all");
  const [selectedDivision, setSelectedDivision] = useState("all");
  const [selectedAcademyType, setSelectedAcademyType] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedFeeCategory, setSelectedFeeCategory] = useState("all");

  // পেজিনেশন স্টেটসমূহ
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [limit] = useState(10);

  // ১. Backend থেকে পরীক্ষার তালিকা ফেচ করা
  const fetchExams = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_API}/api/admit-cards/exams`,
      );
      const result = await response.json();
      if (result.success && result.data && result.data.length > 0) {
        setExamList(result.data);
        setExamName(result.data[0]);
      }
    } catch (err) {
      console.error("Error fetching exams list:", err);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchExams();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchExams]);

  // ২. Backend থেকে স্টুডেন্ট ডাটা ফেচ করা
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        status: "Approved",
        activity: "active",
        page: currentPage,
        limit: limit,
      });
      if (searchTerm) params.append("search", searchTerm);
      if (selectedSession !== "all")
        params.append("sessionYear", selectedSession);
      if (selectedDivision !== "all")
        params.append("division", selectedDivision);
      if (selectedAcademyType !== "all")
        params.append("academyType", selectedAcademyType);
      if (selectedClass !== "all") params.append("class", selectedClass);
      if (selectedType !== "all") params.append("type", selectedType);
      if (selectedFeeCategory !== "all")
        params.append("feeCategory", selectedFeeCategory);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_API}/api/students?${params.toString()}`,
      );
      const result = await response.json();

      if (result.success) {
        const sorted = (result.data || []).sort(
          (a, b) =>
            (parseInt(a.roll, 10) || Infinity) -
            (parseInt(b.roll, 10) || Infinity),
        );
        setStudents(sorted);
        setTotalPages(result.totalPages || 1);
        setTotalStudents(result.total || result.totalCount || 0);
      } else {
        setError(result.message || "শিক্ষার্থীদের তথ্য লোড করা যায়নি।");
      }
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।");
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    limit,
    searchTerm,
    selectedSession,
    selectedDivision,
    selectedAcademyType,
    selectedClass,
    selectedType,
    selectedFeeCategory,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchStudents]);

  // ২. সিলেক্টেড স্টুডেন্ট ও পরীক্ষার তথ্যের ভিত্তিতে ব্যাকএন্ড থেকে এডমিট কার্ডের ডাটা ফেচ করা
  useEffect(() => {
    const fetchAdmitCards = async () => {
      if (selectedIds.length === 0) {
        setAdmitCards([]);
        return;
      }
      try {
        setLoadingAdmitCards(true);
        setAdmitCardsError(null);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_API}/api/admit-cards?studentIds=${selectedIds.join(",")}&examName=${encodeURIComponent(examName)}`,
        );
        const result = await response.json();
        if (result.success) {
          const sorted = (result.data || []).sort(
            (a, b) =>
              (parseInt(a.roll, 10) || Infinity) -
              (parseInt(b.roll, 10) || Infinity),
          );
          setAdmitCards(sorted);
        } else {
          setAdmitCardsError(
            result.message || "এডমিট কার্ডের তথ্য লোড করা যায়নি।",
          );
        }
      } catch (err) {
        console.error("Error fetching admit cards:", err);
        setAdmitCardsError("সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।");
      } finally {
        setLoadingAdmitCards(false);
      }
    };

    fetchAdmitCards();
  }, [selectedIds, examName]);

  // ডায়নামিক ফিল্টারিং লজিক (ব্যাকএন্ড দ্বারা নিয়ন্ত্রিত)
  const filteredStudents = students;

  const sessionYears = RECENT_SESSION_YEARS;

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const currentPageIds = filteredStudents.map((s) => s._id);
      setSelectedIds((prev) => {
        const nextIds = [...prev];
        currentPageIds.forEach((id) => {
          if (!nextIds.includes(id)) nextIds.push(id);
        });
        return nextIds;
      });
    } else {
      const currentPageIds = filteredStudents.map((s) => s._id);
      setSelectedIds((prev) =>
        prev.filter((id) => !currentPageIds.includes(id)),
      );
    }
  };

  const handleSelectStudent = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const reactToPrintFn = useReactToPrint({
    contentRef: printAreaRef,
    documentTitle: `Admit-Card-${examName || "Exam"}`,
    pageStyle: ADMIT_CARD_PAGE_STYLE,
    onBeforePrint: () => {
      setIsPrinting(true);
      return Promise.resolve();
    },
    onAfterPrint: () => {
      setIsPrinting(false);
    },
    onPrintError: () => {
      setIsPrinting(false);
    },
  });

  const handlePrint = () => {
    if (!printAreaRef.current) return;
    setIsPrinting(true);
    reactToPrintFn();
  };

  const studentsToPrint = students.filter((s) => selectedIds.includes(s._id));

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#09101d] text-gray-800 dark:text-gray-200 p-3 sm:p-4 md:p-6">
      {/* প্রিন্ট সিএসএস ফিক্স */}

      {/* ----------------- ১. এডমিন কন্ট্রোল প্যানেল (প্রিন্টে হাইড থাকবে) ----------------- */}
      <div className="print:hidden max-w-7xl mx-auto bg-white dark:bg-[#0f172a] p-4 sm:p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-md mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-[#043e30] dark:text-emerald-400 mb-4 sm:mb-6 border-b dark:border-slate-850 pb-2">
          এডমিট কার্ড জেনারেটর ড্যাশবোর্ড
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* পরীক্ষা কনফিগারেশন সেকশন (ড্রপডাউন সহ) */}
        <div className="bg-sky-50 dark:bg-emerald-950/20 p-3 rounded-md mb-4 border border-sky-200 dark:border-emerald-900/30 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-750 text-gray-700 dark:text-gray-300 mb-1">
              পরীক্ষার নাম সিলেক্ট করুন
            </label>
            <select
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              className="w-full border border-gray-300 dark:border-slate-750 rounded-md p-2 text-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-250 focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="প্রথম সাময়িক পরীক্ষা">
                প্রথম সাময়িক পরীক্ষা
              </option>
              <option value="দ্বিতীয় সাময়িক পরীক্ষা">
                দ্বিতীয় সাময়িক পরীক্ষা
              </option>
              <option value="বার্ষিক পরীক্ষা">বার্ষিক পরীক্ষা</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-750 text-gray-700 dark:text-gray-300 mb-1">
              পরীক্ষার সময়
            </label>
            <input
              type="text"
              value={examTime}
              onChange={(e) => setExamTime(e.target.value)}
              className="w-full border border-gray-300 dark:border-slate-750 rounded-md p-2 text-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              placeholder="যেমন: সকাল ৯:০০ টা হইতে দুপুর ১২:০০ টা পর্যন্ত"
            />
          </div>
        </div>

        {/* ফিল্টারিং অপশনসমূহ */}
        <StudentFilterBar
          variant="labeled"
          sessionLabel="শিক্ষাবর্ষ / সেশন"
          divisionLabel="বিভাগ (Division)"
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedSession={selectedSession}
          onSessionChange={setSelectedSession}
          sessionYears={sessionYears}
          selectedDivision={selectedDivision}
          onDivisionChange={setSelectedDivision}
          selectedAcademyType={selectedAcademyType}
          onAcademyTypeChange={setSelectedAcademyType}
          selectedClass={selectedClass}
          onClassChange={setSelectedClass}
          onResetPage={() => setCurrentPage(1)}
        />

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t dark:border-slate-800 pt-4 mb-4">
          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-semibold text-center sm:text-left">
            মোট স্টুডেন্ট: {totalStudents} জন | সিলেক্ট করা হয়েছে:{" "}
            {selectedIds.length} জন
          </span>
          <button
            onClick={handlePrint}
            disabled={selectedIds.length === 0 || isPrinting}
            className={`w-full sm:w-auto px-4 sm:px-6 py-2.5 rounded-md font-bold text-sm sm:text-base text-white transition flex items-center justify-center gap-2 ${
              selectedIds.length === 0 || isPrinting
                ? "bg-gray-400 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700 shadow-lg"
            }`}
          >
            {isPrinting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block"></span>
                <span>প্রিন্ট প্রস্তুত হচ্ছে...</span>
              </>
            ) : (
              <>🖨️ সিলেক্টেড এডমিট কার্ড প্রিন্ট করুন ({selectedIds.length})</>
            )}
          </button>
        </div>

        {/* ----------------- স্টুডেন্ট লিস্ট টেবিল ----------------- */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-[#0f172a]">
          <div className="overflow-x-auto max-h-72">
            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
              <thead className="bg-gray-100 dark:bg-slate-900 sticky top-0 border-b border-gray-200 dark:border-slate-850">
                <tr>
                  <th className="p-3">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={
                        filteredStudents.length > 0 &&
                        filteredStudents.every((s) =>
                          selectedIds.includes(s._id),
                        )
                      }
                    />
                  </th>
                  <th className="p-3 text-slate-700 dark:text-slate-200">
                    ছবি
                  </th>
                  <th className="p-3 text-slate-700 dark:text-slate-200">
                    আইডি / রোল
                  </th>
                  <th className="p-3 text-slate-700 dark:text-slate-200">
                    নাম
                  </th>
                  <th className="p-3 text-slate-700 dark:text-slate-200">
                    বিভাগ ও শ্রেণি
                  </th>
                  <th className="p-3 text-slate-700 dark:text-slate-200">
                    মোবাইল
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center p-4 text-slate-500 dark:text-slate-400"
                    >
                      ডাটা লোড হচ্ছে...
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center p-4 text-slate-500 dark:text-slate-400"
                    >
                      কোনো শিক্ষার্থী পাওয়া যায়নি!
                    </td>
                  </tr>
                ) : (
                  filteredStudents?.map((student) => {
                    const details = getStudentClassDetails(student);
                    return (
                      <tr
                        key={student._id}
                        className="border-b border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-900/60"
                      >
                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(student._id)}
                            onChange={() => handleSelectStudent(student._id)}
                          />
                        </td>
                        <td className="p-3">
                          {student?.studentImage &&
                          typeof student.studentImage === "string" &&
                          student.studentImage.trim() !== "" ? (
                            <div className="w-8 h-8 rounded-full overflow-hidden relative border dark:border-slate-700">
                              <Image
                                src={student.studentImage}
                                alt={student.studentNameEnglish || "Student"}
                                fill
                                className="object-cover"
                                sizes="32px"
                              />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-slate-500">
                              {(
                                student?.studentNameBangla ||
                                student?.studentNameEnglish ||
                                "S"
                              )
                                .trim()
                                .charAt(0) || "S"}
                            </div>
                          )}
                        </td>
                        <td className="p-3 font-medium text-gray-700 dark:text-gray-300">
                          {student.studentId || student.roll || "N/A"}
                        </td>
                        <td className="p-3 font-medium text-gray-800 dark:text-gray-200">
                          {student.studentNameBangla ||
                            student.studentNameEnglish}
                        </td>
                        <td className="p-3">
                          {details.divisionName} - {details.className}
                        </td>
                        <td className="p-3">
                          {student.fatherMobile ||
                            student.guardianMobile ||
                            "N/A"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ৫. পেজিনেশন কন্ট্রোলস */}
        <Pagination
          variant="simple"
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalStudents}
          onPageChange={setCurrentPage}
          nextButtonClassName="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* ----------------- ২. এডমিট কার্ড ভিউ (প্রিন্টের সময় শো করবে) ----------------- */}
      {selectedIds.length === 0 ? (
        <div className="print:hidden text-center py-8 sm:py-12 bg-white dark:bg-[#0f172a] rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-800 p-4 max-w-7xl mx-auto">
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-450 font-medium">
            প্রিন্ট প্রিভিউ দেখতে টেবিল থেকে শিক্ষার্থী নির্বাচন (Checkbox
            Select) করুন।
          </p>
        </div>
      ) : loadingAdmitCards ? (
        <div className="print:hidden text-center py-8 sm:py-12 bg-white dark:bg-[#0f172a] rounded-lg border dark:border-slate-800 p-4 max-w-7xl mx-auto flex flex-col items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium">
            এডমিট কার্ডের তথ্য লোড করা হচ্ছে...
          </p>
        </div>
      ) : admitCardsError ? (
        <div className="print:hidden text-center py-8 sm:py-12 bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-lg p-4 max-w-7xl mx-auto">
          <p className="text-sm sm:text-base font-semibold">
            ত্রুটি: {admitCardsError}
          </p>
        </div>
      ) : admitCards.length === 0 ? (
        <div className="print:hidden text-center py-8 sm:py-12 bg-white dark:bg-[#0f172a] rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-800 p-4 max-w-7xl mx-auto">
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium">
            কোনো এডমিট কার্ডের তথ্য পাওয়া যায়নি।
          </p>
        </div>
      ) : (
        <div
          ref={printAreaRef}
          className="print-area-container flex flex-col items-center gap-8"
        >
          {admitCards.map((card) => {
            // রুটিন ৫টির বেশি হলে ২ কলামে ভাগ করার জন্য হেলপার লজিক
            const routine = card.routine || [];
            const isMultiColumn = routine.length > 5;
            const midIndex = Math.ceil(routine.length / 2);
            const routineColumns = isMultiColumn
              ? [routine.slice(0, midIndex), routine.slice(midIndex)]
              : [routine];

            return (
              <div
                key={card._id || card.studentId}
                className="page-break relative bg-white box-border flex flex-col justify-between"
              >
                <div className="w-full h-full border-[4px] border-double border-[#C5A059] p-3 flex flex-col justify-between box-border">
                  {/* ওয়াটারমার্ক (Watermark) */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.08]">
                    <Image
                      src="/aimlogo1.png"
                      alt="Watermark Logo"
                      width={260}
                      height={260}
                      className="object-contain"
                    />
                  </div>

                  {/* মেইন কন্টেন্ট এলাকা */}
                  <div className="relative z-10 flex-1 flex flex-col justify-between overflow-hidden">
                    {/* ১. হেডার সেকশন: Logo + Banner + Student Photo */}
                    <PrintInstitutionalHeader />

                    <div className="flex justify-between items-center border-t-4 border-double border-[#C5A059] pt-1">
                      {/* ১. বামে QR Code */}
                      <div className="w-16 h-20 border border-[#C5A059] rounded-lg bg-white p-1 shadow-sm flex-shrink-0 flex items-center justify-center mt-1">
                        <QRCodeSVG
                          value={`${process.env.NEXT_PUBLIC_BASE_URI}/dashboard/academics/admit-card?id=${card._id || ""}`}
                          size={56}
                          level="L"
                        />
                      </div>

                      {/* ২. মাঝখানে টাইটেল ও তথ্য */}
                      <div className="text-center my-0.5 flex-1 px-2">
                        <div className="inline-block bg-emerald-800 text-white px-4 py-0.5 rounded-full border-2 border-emerald-600 shadow-sm mb-1">
                          <h2 className="text-xs font-bold tracking-wider leading-tight uppercase">
                            এডমিট কার্ড
                          </h2>
                        </div>
                        <p className="text-[11px] font-semibold text-gray-700 leading-tight">
                          {card.examName || "পরীক্ষা"} -{" "}
                          {(card.sessionYear || "২০২৬")
                            .split(/[-–/]/)[0]
                            .trim()}{" "}
                          শিক্ষাবর্ষ
                        </p>
                        <p className="text-[11px] font-bold text-gray-900 mt-0.5">
                          শ্রেণি: {card.className || "N/A"}
                        </p>
                      </div>

                      {/* ৩. ডানে স্টুডেন্ট ফটো */}
                      <div className="w-16 h-20 border border-[#C5A059] rounded-lg bg-white p-0.5 shadow-sm relative overflow-hidden flex-shrink-0 flex items-center justify-center mt-1">
                        {card?.studentImage &&
                        typeof card.studentImage === "string" &&
                        card.studentImage.trim() !== "" ? (
                          <Image
                            src={card.studentImage}
                            alt={card.studentNameEnglish || "Student Photo"}
                            fill
                            className="object-cover rounded"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center text-center p-0.5">
                            <span className="text-[9px] font-semibold text-[#8B6B23]">
                              N/A
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ৩. শিক্ষার্থীর তথ্যাবলী (২ কলামে গ্রিড লেআউট) */}
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 my-1 text-[11px] font-semibold px-1 flex-shrink-0">
                      {/* বাম কলাম */}
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <span className="w-22 text-gray-800 flex-shrink-0">
                            পরীক্ষার্থীর নাম:
                          </span>
                          <div className="flex-1 border-b border-dotted border-gray-400 pb-0.5 overflow-hidden">
                            <AutoScaledText
                              text={
                                card.studentNameBangla ||
                                card.studentNameEnglish ||
                                "N/A"
                              }
                              fill="#111827"
                            />
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="w-22 text-gray-800 flex-shrink-0">
                            পিতার নাম:
                          </span>
                          <div className="flex-1 border-b border-dotted border-gray-400 pb-0.5 overflow-hidden">
                            <AutoScaledText
                              text={
                                card.fatherNameBangla ||
                                card.fatherNameEnglish ||
                                "N/A"
                              }
                              fill="#111827"
                            />
                          </div>
                        </div>
                        <div className="flex items-baseline">
                          <span className="w-22 text-gray-800 flex-shrink-0">
                            উপজেলা/থানা:
                          </span>
                          <span className="font-bold text-gray-900 flex-1 border-b border-dotted border-gray-400 pb-0.5 truncate">
                            {card.upazila || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="w-22 text-gray-800 flex-shrink-0">
                            জেলা:
                          </span>
                          <span className="font-bold text-gray-900 flex-1 border-b border-dotted border-gray-400 pb-0.5 truncate">
                            {card.district || "N/A"}
                          </span>
                        </div>
                      </div>

                      {/* ডান কলাম */}
                      <div className="space-y-1">
                        <div className="flex items-baseline">
                          <span className="w-14 text-gray-800 flex-shrink-0">
                            আইডি:
                          </span>
                          <span className="font-bold text-gray-900 flex-1 border-b border-dotted border-gray-400 pb-0.5 truncate">
                            {card.studentId || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="w-14 text-gray-800 flex-shrink-0">
                            রোল নং:
                          </span>
                          <span className="font-bold text-gray-900 flex-1 border-b border-dotted border-gray-400 pb-0.5 truncate">
                            {card.roll || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="w-14 text-gray-800 flex-shrink-0">
                            হল নং:
                          </span>
                          <span className="font-bold text-gray-900 flex-1 border-b border-dotted border-gray-400 pb-0.5 truncate">
                            {card.hallNo || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="w-14 text-gray-800 flex-shrink-0">
                            সিট নং:
                          </span>
                          <span className="font-bold text-gray-900 flex-1 border-b border-dotted border-gray-400 pb-0.5 truncate">
                            {card.seatNo || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ৫. পরীক্ষার রুটিন (Dynamic 1 or 2 Columns Table) */}
                    <div className="my-1 flex-shrink-0">
                      <h3 className="text-center text-[11px] font-bold text-gray-900 mb-0.5">
                        পরীক্ষার রুটিন
                      </h3>

                      <div
                        className={`grid ${isMultiColumn ? "grid-cols-2 gap-2" : "grid-cols-1"} w-full`}
                      >
                        {routineColumns.map((colRoutine, colIdx) => (
                          <table
                            key={colIdx}
                            className="w-full border-collapse border border-[#C5A059] text-[10px] bg-[#FDFBF7]/60"
                          >
                            <thead>
                              <tr className="bg-[#C5A059]/10 text-gray-900">
                                <th className="border border-[#C5A059] px-1 py-0.5 text-left font-bold w-1/3">
                                  তারিখ
                                </th>
                                <th className="border border-[#C5A059] px-1 py-0.5 text-left font-bold w-1/3">
                                  বার
                                </th>
                                <th className="border border-[#C5A059] px-1 py-0.5 text-left font-bold w-1/3">
                                  বিষয়
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {colRoutine.length === 0 ? (
                                <tr>
                                  <td
                                    colSpan="3"
                                    className="border border-[#c59f59c4] px-1 py-0.5 text-center text-gray-500 font-medium"
                                  >
                                    রুটিন পাওয়া যায়নি
                                  </td>
                                </tr>
                              ) : (
                                colRoutine.map((row, idx) => (
                                  <tr
                                    key={idx}
                                    className="hover:bg-[#F5EEDC]/50"
                                  >
                                    <td className="border border-[#C5A059] px-1 py-0.5 text-gray-800">
                                      {row.date || "N/A"}
                                    </td>
                                    <td className="border border-[#C5A059] px-1 py-0.5 text-gray-800">
                                      {row.day || "N/A"}
                                    </td>
                                    <td className="border border-[#C5A059] px-1 py-0.5 text-gray-800 font-medium truncate max-w-[80px]">
                                      {row.subject || "N/A"}
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        ))}
                      </div>

                      <p className="text-center text-[10px] mt-0.5 font-medium">
                        বি: দ্র:{" "}
                        <span className="text-red-500">
                          {card.examTime || "N/A"}
                        </span>
                      </p>
                    </div>

                    {/* ৬. দৃষ্টি আকর্ষণ ও বিশেষ নির্দেশাবলী */}
                    <div className="my-1 text-[9.5px] text-gray-800 space-y-0.5 flex-shrink-0">
                      <p className="font-bold text-[10.5px] text-gray-900">
                        দৃষ্টি আকর্ষণ:
                      </p>
                      <ul className="list-disc list-inside space-y-0.5 font-medium pl-1">
                        {!card.instructions ||
                        card.instructions.length === 0 ? (
                          <li className="text-gray-500">
                            কোনো নির্দেশাবলী পাওয়া যায়নি
                          </li>
                        ) : (
                          card.instructions.map((inst, index) => (
                            <li key={index} className="leading-tight">
                              {inst}
                            </li>
                          ))
                        )}
                      </ul>
                    </div>

                    {/* ৪. স্বাক্ষর সেকশন */}
                    <PrintSignatures />
                  </div>

                  {/* ৭. ফুটারে কন্টাক্ট ইনফো ও সোর্স ক্রেডিট */}
                  <PrintSocialFooter
                    className="relative z-10 mt-auto pt-1 border-t border-gray-300 flex-shrink-0"
                    englishDigits
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
